/**
 * FHE Type Definitions
 * Core types for Fully Homomorphic Encryption operations
 */

export type EncryptionBits = 8 | 16 | 32 | 64 | 128 | 256;

export interface EncryptionOptions {
  bits?: EncryptionBits;
  userAddress?: string;
  contractAddress?: string;
}

export interface EncryptionResult {
  encrypted: string;
  handle?: string;
  timestamp: number;
}

export interface DecryptionOptions {
  userAddress: string;
  contractAddress: string;
  signature?: string;
}

export interface DecryptionResult {
  value: number | bigint | boolean;
  type: string;
  timestamp: number;
}

export interface ComputationRequest {
  operation: 'add' | 'subtract' | 'multiply' | 'compare';
  operands: string[];
  bits?: EncryptionBits;
}

export interface ComputationResult {
  result: string;
  operation: string;
  timestamp: number;
}

export interface FHEClientState {
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
  publicKey?: string;
}

export interface KeyPair {
  publicKey: string;
  privateKey?: string;
  generated: number;
}
