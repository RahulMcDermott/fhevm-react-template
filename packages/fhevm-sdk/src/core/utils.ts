/**
 * Utility functions for FHEVM SDK
 */

import type { EncryptedValue, EncryptedHandle } from './types';

/**
 * Convert encrypted value to hex string
 *
 * @param encrypted - Encrypted value
 * @returns Hex string representation
 */
export function toHexString(encrypted: EncryptedValue): string {
  return '0x' + Array.from(encrypted)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hex string to Uint8Array
 *
 * @param hex - Hex string (with or without 0x prefix)
 * @returns Uint8Array
 */
export function fromHexString(hex: string): Uint8Array {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }

  return bytes;
}

/**
 * Format encrypted handle for display
 *
 * @param handle - Encrypted handle
 * @returns Formatted string
 */
export function formatHandle(handle: EncryptedHandle): string {
  const handleStr = handle.toString();
  if (handleStr.length <= 10) return handleStr;

  return `${handleStr.substring(0, 6)}...${handleStr.substring(handleStr.length - 4)}`;
}

/**
 * Validate Ethereum address
 *
 * @param address - Address to validate
 * @returns True if valid
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate network name
 *
 * @param network - Network name to validate
 * @returns True if valid
 */
export function isValidNetwork(network: string): boolean {
  return ['sepolia', 'mainnet', 'localhost', 'custom'].includes(network);
}

/**
 * Get block explorer URL for address
 *
 * @param network - Network name
 * @param address - Contract or wallet address
 * @returns Block explorer URL
 */
export function getExplorerUrl(network: string, address: string): string {
  const explorers: Record<string, string> = {
    sepolia: 'https://sepolia.etherscan.io',
    mainnet: 'https://etherscan.io',
    localhost: 'http://localhost:8545',
  };

  const baseUrl = explorers[network] || explorers.sepolia;
  return `${baseUrl}/address/${address}`;
}

/**
 * Get transaction explorer URL
 *
 * @param network - Network name
 * @param txHash - Transaction hash
 * @returns Block explorer URL
 */
export function getTransactionUrl(network: string, txHash: string): string {
  const explorers: Record<string, string> = {
    sepolia: 'https://sepolia.etherscan.io',
    mainnet: 'https://etherscan.io',
    localhost: 'http://localhost:8545',
  };

  const baseUrl = explorers[network] || explorers.sepolia;
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Format wei to ether
 *
 * @param wei - Wei amount
 * @param decimals - Decimal places
 * @returns Formatted ether string
 */
export function formatEther(wei: bigint, decimals: number = 4): string {
  const ether = Number(wei) / 1e18;
  return ether.toFixed(decimals);
}

/**
 * Parse ether to wei
 *
 * @param ether - Ether amount
 * @returns Wei amount
 */
export function parseEther(ether: string | number): bigint {
  const value = typeof ether === 'string' ? parseFloat(ether) : ether;
  return BigInt(Math.floor(value * 1e18));
}

/**
 * Delay execution
 *
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 *
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param baseDelay - Base delay in milliseconds
 * @returns Promise with function result
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (i < maxRetries) {
        const delayMs = baseDelay * Math.pow(2, i);
        await delay(delayMs);
      }
    }
  }

  throw lastError;
}
