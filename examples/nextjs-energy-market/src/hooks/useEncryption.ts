/**
 * useEncryption Hook
 * Hook for encryption operations
 */

'use client';

import { useState, useCallback } from 'react';
import { encryptValue, batchEncrypt } from '@/lib/fhe/client';
import type { EncryptionOptions, EncryptionResult } from '@/types/fhe';

export function useEncryption() {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastResult, setLastResult] = useState<EncryptionResult | null>(null);

  const encrypt = useCallback(async (
    value: number | bigint | boolean,
    options: EncryptionOptions = {}
  ): Promise<EncryptionResult | null> => {
    setIsEncrypting(true);
    setError(null);

    try {
      const result = await encryptValue(value, options);
      setLastResult(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Encryption failed');
      setError(error);
      return null;
    } finally {
      setIsEncrypting(false);
    }
  }, []);

  const encryptMultiple = useCallback(async (
    values: (number | bigint | boolean)[],
    options: EncryptionOptions = {}
  ): Promise<EncryptionResult[] | null> => {
    setIsEncrypting(true);
    setError(null);

    try {
      const results = await batchEncrypt(values, options);
      return results;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Batch encryption failed');
      setError(error);
      return null;
    } finally {
      setIsEncrypting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLastResult(null);
  }, []);

  return {
    encrypt,
    encryptMultiple,
    isEncrypting,
    error,
    lastResult,
    reset,
  };
}
