/**
 * Decryption utilities for FHEVM
 */

import type {
  FhevmClient,
  EncryptedHandle,
  DecryptOptions,
  DecryptResult,
  DecryptionError,
} from './types';
import { isClientReady } from './client';

/**
 * Decrypt an encrypted value using user permission (EIP-712)
 *
 * @param client - FHEVM client instance
 * @param handle - Encrypted handle from contract
 * @param options - Decryption options
 * @returns Decrypted result
 *
 * @example
 * ```typescript
 * const result = await decrypt(client, encryptedHandle, {
 *   userAddress: '0x...',
 *   contractAddress: '0x...'
 * });
 * console.log(result.value); // Decrypted value
 * ```
 */
export async function decrypt(
  client: FhevmClient,
  handle: EncryptedHandle,
  options: DecryptOptions
): Promise<DecryptResult> {
  if (!isClientReady(client)) {
    throw new Error('Client not initialized') as DecryptionError;
  }

  try {
    // Generate EIP-712 signature if not provided
    const signature = options.signature || await generateDecryptSignature(
      client,
      handle,
      options.userAddress,
      options.contractAddress
    );

    // Perform decryption via gateway
    const decryptedValue = await client.instance.reencrypt(
      handle,
      options.userAddress,
      options.contractAddress,
      signature
    );

    // Determine bit size from handle (simplified logic)
    const bits = getBitSizeFromHandle(handle);

    return {
      value: decryptedValue,
      handle,
      bits,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Decryption failed: ${message}`) as DecryptionError;
  }
}

/**
 * Public decrypt (no permission required)
 *
 * @param client - FHEVM client instance
 * @param handle - Encrypted handle from contract
 * @returns Decrypted value
 *
 * @example
 * ```typescript
 * const value = await publicDecrypt(client, publicHandle);
 * ```
 */
export async function publicDecrypt(
  client: FhevmClient,
  handle: EncryptedHandle
): Promise<bigint | number | boolean> {
  if (!isClientReady(client)) {
    throw new Error('Client not initialized') as DecryptionError;
  }

  try {
    // Public decryption doesn't require signature
    const decryptedValue = await client.instance.publicDecrypt(handle);
    return decryptedValue;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Public decryption failed: ${message}`) as DecryptionError;
  }
}

/**
 * Generate EIP-712 signature for decryption
 *
 * @param client - FHEVM client instance
 * @param handle - Encrypted handle
 * @param userAddress - User address requesting decryption
 * @param contractAddress - Contract containing the encrypted value
 * @returns EIP-712 signature
 */
export async function generateDecryptSignature(
  client: FhevmClient,
  handle: EncryptedHandle,
  userAddress: string,
  contractAddress: string
): Promise<string> {
  // EIP-712 domain
  const domain = {
    name: 'Authorization token',
    version: '1',
    chainId: client.config.chainId,
    verifyingContract: contractAddress,
  };

  // EIP-712 types
  const types = {
    Reencrypt: [
      { name: 'publicKey', type: 'bytes' },
      { name: 'ciphertext', type: 'bytes' },
    ],
  };

  // Get reencryption keys
  const { publicKey, privateKey } = await client.getReencryptionKey();

  // Message
  const message = {
    publicKey: publicKey,
    ciphertext: handle.toString(),
  };

  // Sign with provider (assumes ethers provider available)
  if (!client.config.provider) {
    throw new Error('Provider required for signature generation');
  }

  // This is simplified - actual implementation depends on provider type
  const signature = await (client.config.provider as any).send('eth_signTypedData_v4', [
    userAddress,
    JSON.stringify({
      domain,
      types,
      message,
    }),
  ]);

  return signature;
}

/**
 * Batch decrypt multiple encrypted values
 *
 * @param client - FHEVM client instance
 * @param handles - Array of encrypted handles
 * @param options - Decryption options
 * @returns Array of decrypted results
 *
 * @example
 * ```typescript
 * const results = await decryptBatch(client, [handle1, handle2], {
 *   userAddress: '0x...',
 *   contractAddress: '0x...'
 * });
 * ```
 */
export async function decryptBatch(
  client: FhevmClient,
  handles: EncryptedHandle[],
  options: DecryptOptions
): Promise<DecryptResult[]> {
  return Promise.all(handles.map((handle) => decrypt(client, handle, options)));
}

/**
 * Helper: Determine bit size from handle
 * (Simplified implementation - actual logic depends on handle format)
 */
function getBitSizeFromHandle(handle: EncryptedHandle): number {
  const handleStr = handle.toString();
  const length = handleStr.length;

  // Simplified heuristic
  if (length <= 10) return 8;
  if (length <= 15) return 16;
  if (length <= 20) return 32;
  if (length <= 30) return 64;
  if (length <= 50) return 128;
  return 256;
}
