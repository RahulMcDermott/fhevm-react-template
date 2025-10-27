/**
 * useFHE Hook
 * Main hook for FHE operations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { initializeFHEClient, getFHEClient, isClientReady } from '@/lib/fhe/client';
import type { FHEClientState } from '@/types/fhe';

interface UseFHEOptions {
  network: string;
  contractAddress: string;
  rpcUrl?: string;
  autoInit?: boolean;
}

export function useFHE(options: UseFHEOptions) {
  const [state, setState] = useState<FHEClientState>({
    isReady: false,
    isLoading: false,
    error: null,
  });

  const initialize = useCallback(async () => {
    if (isClientReady()) {
      setState({
        isReady: true,
        isLoading: false,
        error: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await initializeFHEClient({
        network: options.network,
        contractAddress: options.contractAddress,
        rpcUrl: options.rpcUrl,
      });

      setState({
        isReady: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        isReady: false,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Failed to initialize FHE client'),
      });
    }
  }, [options.network, options.contractAddress, options.rpcUrl]);

  const getClient = useCallback(() => {
    try {
      return getFHEClient();
    } catch (error) {
      console.error('Error getting FHE client:', error);
      return null;
    }
  }, []);

  const reinitialize = useCallback(async () => {
    setState({
      isReady: false,
      isLoading: true,
      error: null,
    });
    await initialize();
  }, [initialize]);

  useEffect(() => {
    if (options.autoInit !== false) {
      initialize();
    }
  }, [initialize, options.autoInit]);

  return {
    ...state,
    initialize,
    reinitialize,
    getClient,
  };
}
