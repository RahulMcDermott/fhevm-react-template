/**
 * Core type definitions for FHEVM SDK
 */

import type { BrowserProvider, Eip1193Provider } from 'ethers';

/**
 * Supported network configurations
 */
export type NetworkName = 'sepolia' | 'mainnet' | 'localhost' | 'custom';

/**
 * FHEVM Client configuration
 */
export interface FhevmClientConfig {
  /** Ethereum network name */
  network: NetworkName;

  /** Contract address to interact with */
  contractAddress: string;

  /** Optional custom RPC URL */
  rpcUrl?: string;

  /** Optional custom chain ID */
  chainId?: number;

  /** Optional provider (ethers BrowserProvider or window.ethereum) */
  provider?: BrowserProvider | Eip1193Provider;

  /** Optional ACL contract address */
  aclAddress?: string;

  /** Optional KMS verifier address */
  kmsVerifierAddress?: string;

  /** Optional gateway URL for decryption */
  gatewayUrl?: string;
}

/**
 * FHEVM Client instance
 */
export interface FhevmClient {
  /** Network configuration */
  config: FhevmClientConfig;

  /** Instance from fhevmjs */
  instance: any;

  /** Whether client is initialized */
  isInitialized: boolean;

  /** Get encryption public key */
  getPublicKey: () => Promise<string>;

  /** Get reencryption public key */
  getReencryptionKey: () => Promise<{ publicKey: string; privateKey: string }>;
}

/**
 * Encrypted value types
 */
export type EncryptedValue = Uint8Array;

/**
 * Encryption options
 */
export interface EncryptOptions {
  /** Bit size: 8, 16, 32, 64, 128, 256 */
  bits?: 8 | 16 | 32 | 64 | 128 | 256;

  /** Security parameter */
  securityZone?: number;
}

/**
 * Decryption options
 */
export interface DecryptOptions {
  /** User address for permission check */
  userAddress: string;

  /** Contract address containing the encrypted value */
  contractAddress: string;

  /** EIP-712 signature for authorization */
  signature?: string;
}

/**
 * Encrypted handle returned by contract
 */
export type EncryptedHandle = bigint | string;

/**
 * Decryption result
 */
export interface DecryptResult {
  /** Decrypted value */
  value: bigint | number | boolean;

  /** Original encrypted handle */
  handle: EncryptedHandle;

  /** Bit size */
  bits: number;
}

/**
 * Error types
 */
export class FhevmError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'FhevmError';
  }
}

export class EncryptionError extends FhevmError {
  constructor(message: string) {
    super(message, 'ENCRYPTION_ERROR');
    this.name = 'EncryptionError';
  }
}

export class DecryptionError extends FhevmError {
  constructor(message: string) {
    super(message, 'DECRYPTION_ERROR');
    this.name = 'DecryptionError';
  }
}

export class InitializationError extends FhevmError {
  constructor(message: string) {
    super(message, 'INITIALIZATION_ERROR');
    this.name = 'InitializationError';
  }
}
