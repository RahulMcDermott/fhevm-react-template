/**
 * API Type Definitions
 * Types for API requests and responses
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface EncryptRequest {
  value: number | bigint | boolean;
  bits?: 8 | 16 | 32 | 64 | 128 | 256;
  contractAddress?: string;
}

export interface DecryptRequest {
  encryptedHandle: string;
  userAddress: string;
  contractAddress: string;
  signature?: string;
}

export interface ComputeRequest {
  operation: 'add' | 'subtract' | 'multiply' | 'compare';
  operands: string[];
  bits?: number;
}

export interface KeyGenerationRequest {
  type: 'client' | 'server';
  options?: Record<string, any>;
}
