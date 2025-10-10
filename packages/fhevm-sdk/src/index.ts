/**
 * @fhevm/sdk - Universal SDK for FHEVM
 *
 * Framework-agnostic SDK for building confidential dApps with Fully Homomorphic Encryption
 *
 * @example
 * ```typescript
 * import { createFhevmClient, encrypt, decrypt } from '@fhevm/sdk';
 *
 * // Initialize client
 * const client = await createFhevmClient({
 *   network: 'sepolia',
 *   contractAddress: '0x...'
 * });
 *
 * // Encrypt input
 * const encryptedValue = await encrypt(client, 1000);
 *
 * // Decrypt output
 * const decryptedValue = await decrypt(client, encryptedHandle, userAddress);
 * ```
 */

// Core exports
export * from './core/client';
export * from './core/encryption';
export * from './core/decryption';
export * from './core/types';
export * from './core/utils';

// React hooks (optional)
export * from './react/hooks';
export * from './react/provider';

// Vue composables (optional)
export * from './vue/composables';

// Version
export const VERSION = '1.0.0';
