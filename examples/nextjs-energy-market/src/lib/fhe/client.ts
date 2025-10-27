/**
 * Client-side FHE Operations
 * Handles encryption and decryption on the client
 */

import { createFhevmClient, encrypt, decrypt } from '@fhevm/sdk';
import type { EncryptionOptions, DecryptionOptions, EncryptionResult, DecryptionResult } from '@/types/fhe';

let clientInstance: any = null;

/**
 * Initialize FHE client
 */
export async function initializeFHEClient(config: {
  network: string;
  contractAddress: string;
  rpcUrl?: string;
}): Promise<any> {
  if (clientInstance) {
    return clientInstance;
  }

  try {
    clientInstance = await createFhevmClient({
      network: config.network as any,
      contractAddress: config.contractAddress,
      rpcUrl: config.rpcUrl,
    });

    return clientInstance;
  } catch (error) {
    console.error('Failed to initialize FHE client:', error);
    throw new Error('FHE client initialization failed');
  }
}

/**
 * Get current FHE client instance
 */
export function getFHEClient() {
  if (!clientInstance) {
    throw new Error('FHE client not initialized. Call initializeFHEClient first.');
  }
  return clientInstance;
}

/**
 * Encrypt a value using FHE
 */
export async function encryptValue(
  value: number | bigint | boolean,
  options: EncryptionOptions = {}
): Promise<EncryptionResult> {
  const client = getFHEClient();

  try {
    const encrypted = await encrypt(client, value, { bits: options.bits || 32 });

    return {
      encrypted: encrypted,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt value');
  }
}

/**
 * Decrypt an encrypted value
 */
export async function decryptValue(
  encryptedHandle: string,
  options: DecryptionOptions
): Promise<DecryptionResult> {
  const client = getFHEClient();

  try {
    const result = await decrypt(client, encryptedHandle, {
      userAddress: options.userAddress,
      contractAddress: options.contractAddress,
    });

    return {
      value: result.value,
      type: typeof result.value,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt value');
  }
}

/**
 * Batch encrypt multiple values
 */
export async function batchEncrypt(
  values: (number | bigint | boolean)[],
  options: EncryptionOptions = {}
): Promise<EncryptionResult[]> {
  const client = getFHEClient();

  try {
    const results = await Promise.all(
      values.map(async (value) => {
        const encrypted = await encrypt(client, value, { bits: options.bits || 32 });
        return {
          encrypted,
          timestamp: Date.now(),
        };
      })
    );

    return results;
  } catch (error) {
    console.error('Batch encryption failed:', error);
    throw new Error('Failed to batch encrypt values');
  }
}

/**
 * Check if client is ready
 */
export function isClientReady(): boolean {
  return clientInstance !== null;
}

/**
 * Reset client instance
 */
export function resetClient(): void {
  clientInstance = null;
}
