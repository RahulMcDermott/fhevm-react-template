/**
 * useComputation Hook
 * Hook for homomorphic computation operations
 */

'use client';

import { useState, useCallback } from 'react';
import type { ComputationResult } from '@/types/fhe';

export function useComputation() {
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastResult, setLastResult] = useState<ComputationResult | null>(null);

  const compute = useCallback(async (
    operation: 'add' | 'subtract' | 'multiply' | 'compare',
    operands: string[],
    bits?: number
  ): Promise<ComputationResult | null> => {
    setIsComputing(true);
    setError(null);

    try {
      const response = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operation, operands, bits }),
      });

      if (!response.ok) {
        throw new Error('Computation request failed');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Computation failed');
      }

      const result: ComputationResult = {
        result: data.data.result,
        operation,
        timestamp: Date.now(),
      };

      setLastResult(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Computation failed');
      setError(error);
      return null;
    } finally {
      setIsComputing(false);
    }
  }, []);

  const add = useCallback(
    (operand1: string, operand2: string, bits?: number) => compute('add', [operand1, operand2], bits),
    [compute]
  );

  const subtract = useCallback(
    (operand1: string, operand2: string, bits?: number) => compute('subtract', [operand1, operand2], bits),
    [compute]
  );

  const multiply = useCallback(
    (operand1: string, operand2: string, bits?: number) => compute('multiply', [operand1, operand2], bits),
    [compute]
  );

  const compare = useCallback(
    (operand1: string, operand2: string, bits?: number) => compute('compare', [operand1, operand2], bits),
    [compute]
  );

  const reset = useCallback(() => {
    setError(null);
    setLastResult(null);
  }, []);

  return {
    compute,
    add,
    subtract,
    multiply,
    compare,
    isComputing,
    error,
    lastResult,
    reset,
  };
}
