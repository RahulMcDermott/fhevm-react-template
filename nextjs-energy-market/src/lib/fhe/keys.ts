/**
 * Key Management Utilities
 * Handles FHE key generation and management
 */

import type { KeyPair } from '@/types/fhe';

/**
 * Generate a new key pair
 */
export function generateKeyPair(): KeyPair {
  // This is a simplified implementation
  // In production, you would use the actual FHE key generation

  const timestamp = Date.now();
  const publicKey = `pk_${timestamp}_${Math.random().toString(36).substring(7)}`;

  return {
    publicKey,
    generated: timestamp,
  };
}

/**
 * Store public key in local storage
 */
export function storePublicKey(publicKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('fhe_public_key', publicKey);
    localStorage.setItem('fhe_key_timestamp', Date.now().toString());
  }
}

/**
 * Retrieve public key from local storage
 */
export function getStoredPublicKey(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('fhe_public_key');
  }
  return null;
}

/**
 * Clear stored keys
 */
export function clearStoredKeys(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('fhe_public_key');
    localStorage.removeItem('fhe_key_timestamp');
  }
}

/**
 * Check if stored key is valid (not expired)
 */
export function isKeyValid(maxAge: number = 24 * 60 * 60 * 1000): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const timestamp = localStorage.getItem('fhe_key_timestamp');
  if (!timestamp) {
    return false;
  }

  const age = Date.now() - parseInt(timestamp, 10);
  return age < maxAge;
}

/**
 * Get or generate public key
 */
export function getOrGenerateKey(): KeyPair {
  const stored = getStoredPublicKey();

  if (stored && isKeyValid()) {
    const timestamp = localStorage.getItem('fhe_key_timestamp');
    return {
      publicKey: stored,
      generated: timestamp ? parseInt(timestamp, 10) : Date.now(),
    };
  }

  const newKey = generateKeyPair();
  storePublicKey(newKey.publicKey);
  return newKey;
}
