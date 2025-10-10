'use client';

import { FhevmProvider } from '@fhevm/sdk/react';
import { ReactNode } from 'react';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FhevmProvider
      config={{
        network: 'sepolia',
        contractAddress: CONTRACT_ADDRESS,
      }}
    >
      {children}
    </FhevmProvider>
  );
}
