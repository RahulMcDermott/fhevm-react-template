/**
 * React Context Provider for FHEVM
 *
 * Provides FHEVM client to entire React application tree
 */

import React, { createContext, useContext, ReactNode } from 'react';
import type { FhevmClient, FhevmClientConfig } from '../core/types';
import { useFhevmClient } from './hooks';

/**
 * FHEVM Context
 */
interface FhevmContextValue {
  client: FhevmClient | null;
  isLoading: boolean;
  error: Error | null;
  isReady: boolean;
}

const FhevmContext = createContext<FhevmContextValue | undefined>(undefined);

/**
 * FHEVM Provider Props
 */
interface FhevmProviderProps {
  config: FhevmClientConfig;
  children: ReactNode;
}

/**
 * FHEVM Provider Component
 *
 * Wraps your application to provide FHEVM client to all child components
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <FhevmProvider config={{
 *       network: 'sepolia',
 *       contractAddress: '0x...'
 *     }}>
 *       <YourApp />
 *     </FhevmProvider>
 *   );
 * }
 * ```
 */
export function FhevmProvider({ config, children }: FhevmProviderProps) {
  const value = useFhevmClient(config);

  return <FhevmContext.Provider value={value}>{children}</FhevmContext.Provider>;
}

/**
 * Hook to access FHEVM context
 *
 * Must be used within FhevmProvider
 *
 * @returns FHEVM context value
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { client, isReady } = useFhevmContext();
 *
 *   if (!isReady) return <div>Loading...</div>;
 *
 *   // Use client...
 * }
 * ```
 */
export function useFhevmContext(): FhevmContextValue {
  const context = useContext(FhevmContext);

  if (context === undefined) {
    throw new Error('useFhevmContext must be used within FhevmProvider');
  }

  return context;
}
