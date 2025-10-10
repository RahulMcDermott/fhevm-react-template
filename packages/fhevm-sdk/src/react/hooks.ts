/**
 * React hooks for FHEVM
 *
 * Wagmi-like hooks for seamless integration with React applications
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  FhevmClient,
  FhevmClientConfig,
  EncryptedValue,
  EncryptOptions,
  DecryptOptions,
  DecryptResult,
} from '../core/types';
import { createFhevmClient, isClientReady } from '../core/client';
import { encrypt as coreEncrypt, encryptBatch } from '../core/encryption';
import { decrypt as coreDecrypt, publicDecrypt } from '../core/decryption';

/**
 * Hook for initializing FHEVM client
 *
 * @param config - Client configuration
 * @returns Client instance and initialization state
 *
 * @example
 * ```tsx
 * const { client, isLoading, error } = useFhevmClient({
 *   network: 'sepolia',
 *   contractAddress: '0x...'
 * });
 * ```
 */
export function useFhevmClient(config: FhevmClientConfig) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        setIsLoading(true);
        setError(null);

        const newClient = await createFhevmClient(config);

        if (mounted) {
          setClient(newClient);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [config.network, config.contractAddress]);

  return {
    client,
    isLoading,
    error,
    isReady: client ? isClientReady(client) : false,
  };
}

/**
 * Hook for encrypting values
 *
 * @param client - FHEVM client instance
 * @returns Encryption function and state
 *
 * @example
 * ```tsx
 * const { encrypt, isEncrypting, error } = useEncrypt(client);
 *
 * const handleSubmit = async () => {
 *   const encrypted = await encrypt(1000, { bits: 32 });
 *   // Use encrypted value in transaction
 * };
 * ```
 */
export function useEncrypt(client: FhevmClient | null) {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (
      value: number | bigint | boolean,
      options?: EncryptOptions
    ): Promise<EncryptedValue | null> => {
      if (!client) {
        setError(new Error('Client not initialized'));
        return null;
      }

      try {
        setIsEncrypting(true);
        setError(null);

        const encrypted = await coreEncrypt(client, value, options);

        setIsEncrypting(false);
        return encrypted;
      } catch (err) {
        setError(err as Error);
        setIsEncrypting(false);
        return null;
      }
    },
    [client]
  );

  const encryptMultiple = useCallback(
    async (
      values: (number | bigint | boolean)[],
      options?: EncryptOptions
    ): Promise<EncryptedValue[] | null> => {
      if (!client) {
        setError(new Error('Client not initialized'));
        return null;
      }

      try {
        setIsEncrypting(true);
        setError(null);

        const encrypted = await encryptBatch(client, values, options);

        setIsEncrypting(false);
        return encrypted;
      } catch (err) {
        setError(err as Error);
        setIsEncrypting(false);
        return null;
      }
    },
    [client]
  );

  return {
    encrypt,
    encryptMultiple,
    isEncrypting,
    error,
  };
}

/**
 * Hook for decrypting values
 *
 * @param client - FHEVM client instance
 * @returns Decryption function and state
 *
 * @example
 * ```tsx
 * const { decrypt, isDecrypting, error } = useDecrypt(client);
 *
 * const handleDecrypt = async () => {
 *   const result = await decrypt(handle, {
 *     userAddress: address,
 *     contractAddress: '0x...'
 *   });
 *   console.log(result?.value);
 * };
 * ```
 */
export function useDecrypt(client: FhevmClient | null) {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const decrypt = useCallback(
    async (
      handle: bigint | string,
      options: DecryptOptions
    ): Promise<DecryptResult | null> => {
      if (!client) {
        setError(new Error('Client not initialized'));
        return null;
      }

      try {
        setIsDecrypting(true);
        setError(null);

        const result = await coreDecrypt(client, handle, options);

        setIsDecrypting(false);
        return result;
      } catch (err) {
        setError(err as Error);
        setIsDecrypting(false);
        return null;
      }
    },
    [client]
  );

  const decryptPublic = useCallback(
    async (handle: bigint | string): Promise<bigint | number | boolean | null> => {
      if (!client) {
        setError(new Error('Client not initialized'));
        return null;
      }

      try {
        setIsDecrypting(true);
        setError(null);

        const result = await publicDecrypt(client, handle);

        setIsDecrypting(false);
        return result;
      } catch (err) {
        setError(err as Error);
        setIsDecrypting(false);
        return null;
      }
    },
    [client]
  );

  return {
    decrypt,
    decryptPublic,
    isDecrypting,
    error,
  };
}

/**
 * All-in-one hook for FHEVM operations
 *
 * @param config - Client configuration
 * @returns Complete FHEVM interface
 *
 * @example
 * ```tsx
 * const fhevm = useFhevm({
 *   network: 'sepolia',
 *   contractAddress: '0x...'
 * });
 *
 * // Encrypt
 * const encrypted = await fhevm.encrypt(1000);
 *
 * // Decrypt
 * const result = await fhevm.decrypt(handle, { ... });
 * ```
 */
export function useFhevm(config: FhevmClientConfig) {
  const { client, isLoading: isInitializing, error: initError, isReady } = useFhevmClient(config);
  const { encrypt, encryptMultiple, isEncrypting, error: encryptError } = useEncrypt(client);
  const { decrypt, decryptPublic, isDecrypting, error: decryptError } = useDecrypt(client);

  const error = initError || encryptError || decryptError;
  const isLoading = isInitializing || isEncrypting || isDecrypting;

  return useMemo(
    () => ({
      // Client
      client,
      isReady,

      // Encryption
      encrypt,
      encryptMultiple,
      isEncrypting,

      // Decryption
      decrypt,
      decryptPublic,
      isDecrypting,

      // State
      isLoading,
      error,
    }),
    [
      client,
      isReady,
      encrypt,
      encryptMultiple,
      isEncrypting,
      decrypt,
      decryptPublic,
      isDecrypting,
      isLoading,
      error,
    ]
  );
}
