/**
 * Validation Utilities
 * Helper functions for data validation
 */

import type { EncryptionBits } from '@/types/fhe';

/**
 * Validate encryption bit size
 */
export function validateBitSize(bits: number): bits is EncryptionBits {
  return [8, 16, 32, 64, 128, 256].includes(bits);
}

/**
 * Validate value fits in bit size
 */
export function validateValueForBits(value: number | bigint, bits: EncryptionBits): boolean {
  const numValue = typeof value === 'bigint' ? value : BigInt(value);

  const maxValue = 2n ** BigInt(bits) - 1n;

  return numValue >= 0n && numValue <= maxValue;
}

/**
 * Validate operation type
 */
export function validateOperation(operation: string): operation is 'add' | 'subtract' | 'multiply' | 'compare' {
  return ['add', 'subtract', 'multiply', 'compare'].includes(operation);
}

/**
 * Validate array of operands
 */
export function validateOperands(operands: any[]): operands is string[] {
  if (!Array.isArray(operands) || operands.length < 2) {
    return false;
  }

  return operands.every((op) => typeof op === 'string' && op.length > 0);
}

/**
 * Validate configuration object
 */
export function validateFHEConfig(config: any): boolean {
  if (!config || typeof config !== 'object') {
    return false;
  }

  if (!config.network || typeof config.network !== 'string') {
    return false;
  }

  if (!config.contractAddress || typeof config.contractAddress !== 'string') {
    return false;
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(config.contractAddress)) {
    return false;
  }

  return true;
}

/**
 * Validate API response
 */
export function validateApiResponse<T>(response: any): response is { success: boolean; data?: T; error?: string } {
  if (!response || typeof response !== 'object') {
    return false;
  }

  if (typeof response.success !== 'boolean') {
    return false;
  }

  if (response.error && typeof response.error !== 'string') {
    return false;
  }

  return true;
}

/**
 * Parse and validate integer input
 */
export function parseInteger(value: any, options: { min?: number; max?: number } = {}): number | null {
  const num = parseInt(value, 10);

  if (isNaN(num)) {
    return null;
  }

  if (options.min !== undefined && num < options.min) {
    return null;
  }

  if (options.max !== undefined && num > options.max) {
    return null;
  }

  return num;
}
