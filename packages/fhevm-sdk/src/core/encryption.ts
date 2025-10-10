/**
 * Encryption utilities for FHEVM
 */

import type {
  FhevmClient,
  EncryptedValue,
  EncryptOptions,
  EncryptionError,
} from './types';
import { isClientReady } from './client';

/**
 * Encrypt a value using FHEVM
 *
 * @param client - FHEVM client instance
 * @param value - Value to encrypt (number, bigint, or boolean)
 * @param options - Encryption options
 * @returns Encrypted value as Uint8Array
 *
 * @example
 * ```typescript
 * const encrypted = await encrypt(client, 1000, { bits: 32 });
 * ```
 */
export async function encrypt(
  client: FhevmClient,
  value: number | bigint | boolean,
  options: EncryptOptions = {}
): Promise<EncryptedValue> {
  if (!isClientReady(client)) {
    throw new Error('Client not initialized') as EncryptionError;
  }

  const bits = options.bits || 32;

  try {
    // Convert boolean to number
    const numValue = typeof value === 'boolean' ? (value ? 1n : 0n) : BigInt(value);

    // Validate value range
    const maxValue = BigInt(2) ** BigInt(bits) - 1n;
    if (numValue < 0n || numValue > maxValue) {
      throw new Error(
        `Value ${numValue} out of range for ${bits}-bit encryption (0 to ${maxValue})`
      );
    }

    // Perform encryption based on bit size
    let encrypted: Uint8Array;

    switch (bits) {
      case 8:
        encrypted = client.instance.encrypt8(Number(numValue));
        break;
      case 16:
        encrypted = client.instance.encrypt16(Number(numValue));
        break;
      case 32:
        encrypted = client.instance.encrypt32(Number(numValue));
        break;
      case 64:
        encrypted = client.instance.encrypt64(numValue);
        break;
      case 128:
        encrypted = client.instance.encrypt128(numValue);
        break;
      case 256:
        encrypted = client.instance.encrypt256(numValue);
        break;
      default:
        throw new Error(`Unsupported bit size: ${bits}`);
    }

    return encrypted;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Encryption failed: ${message}`) as EncryptionError;
  }
}

/**
 * Encrypt a 8-bit value
 *
 * @param client - FHEVM client instance
 * @param value - Value to encrypt (0-255)
 * @returns Encrypted value
 */
export async function encrypt8(
  client: FhevmClient,
  value: number
): Promise<EncryptedValue> {
  return encrypt(client, value, { bits: 8 });
}

/**
 * Encrypt a 16-bit value
 *
 * @param client - FHEVM client instance
 * @param value - Value to encrypt (0-65535)
 * @returns Encrypted value
 */
export async function encrypt16(
  client: FhevmClient,
  value: number
): Promise<EncryptedValue> {
  return encrypt(client, value, { bits: 16 });
}

/**
 * Encrypt a 32-bit value
 *
 * @param client - FHEVM client instance
 * @param value - Value to encrypt (0 to 2^32-1)
 * @returns Encrypted value
 */
export async function encrypt32(
  client: FhevmClient,
  value: number | bigint
): Promise<EncryptedValue> {
  return encrypt(client, value, { bits: 32 });
}

/**
 * Encrypt a 64-bit value
 *
 * @param client - FHEVM client instance
 * @param value - Value to encrypt (0 to 2^64-1)
 * @returns Encrypted value
 */
export async function encrypt64(
  client: FhevmClient,
  value: bigint
): Promise<EncryptedValue> {
  return encrypt(client, value, { bits: 64 });
}

/**
 * Encrypt a boolean value
 *
 * @param client - FHEVM client instance
 * @param value - Boolean value to encrypt
 * @returns Encrypted value
 */
export async function encryptBool(
  client: FhevmClient,
  value: boolean
): Promise<EncryptedValue> {
  return encrypt(client, value, { bits: 8 });
}

/**
 * Batch encrypt multiple values
 *
 * @param client - FHEVM client instance
 * @param values - Array of values to encrypt
 * @param options - Encryption options
 * @returns Array of encrypted values
 *
 * @example
 * ```typescript
 * const encrypted = await encryptBatch(client, [100, 200, 300], { bits: 32 });
 * ```
 */
export async function encryptBatch(
  client: FhevmClient,
  values: (number | bigint | boolean)[],
  options: EncryptOptions = {}
): Promise<EncryptedValue[]> {
  return Promise.all(values.map((value) => encrypt(client, value, options)));
}
