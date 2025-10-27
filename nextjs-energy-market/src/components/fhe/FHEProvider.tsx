/**
 * FHE Provider Component
 * Context provider for FHE operations
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useFHE } from '@/hooks/useFHE';
import type { FHEClientState } from '@/types/fhe';

interface FHEContextValue extends FHEClientState {
  initialize: () => Promise<void>;
  reinitialize: () => Promise<void>;
  getClient: () => any;
}

const FHEContext = createContext<FHEContextValue | null>(null);

export interface FHEProviderProps {
  children: ReactNode;
  network: string;
  contractAddress: string;
  rpcUrl?: string;
  autoInit?: boolean;
}

export function FHEProvider({
  children,
  network,
  contractAddress,
  rpcUrl,
  autoInit = true,
}: FHEProviderProps) {
  const fhe = useFHE({
    network,
    contractAddress,
    rpcUrl,
    autoInit,
  });

  return <FHEContext.Provider value={fhe}>{children}</FHEContext.Provider>;
}

export function useFHEContext() {
  const context = useContext(FHEContext);

  if (!context) {
    throw new Error('useFHEContext must be used within FHEProvider');
  }

  return context;
}
