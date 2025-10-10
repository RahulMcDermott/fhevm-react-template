# Next.js Energy Market - FHEVM SDK Example

A complete Next.js application demonstrating the **FHEVM Universal SDK** for building privacy-preserving dApps.

## Overview

This example showcases a **Private Renewable Energy Marketplace** where producers and consumers can trade energy with complete privacy using Fully Homomorphic Encryption (FHE).

### Key Features

- ✅ **FHEVM SDK Integration** - Uses @fhevm/sdk for all encryption operations
- ✅ **Next.js 14** - Latest App Router with React Server Components
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind CSS** - Modern, responsive UI
- ✅ **Privacy-First** - All sensitive data encrypted with FHE

## SDK Integration Highlights

This example demonstrates the complete SDK workflow:

### 1. Client Initialization

```tsx
// src/app/providers.tsx
import { FhevmProvider } from '@fhevm/sdk/react';

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
```

### 2. Using SDK Hooks

```tsx
// src/components/EnergyOfferForm.tsx
import { useEncrypt } from '@fhevm/sdk/react';
import { useFhevmContext } from '@fhevm/sdk/react';

export function EnergyOfferForm() {
  const { client } = useFhevmContext();
  const { encrypt, isEncrypting } = useEncrypt(client);

  const handleSubmit = async () => {
    // Encrypt values using SDK
    const encryptedAmount = await encrypt(amount, { bits: 32 });
    const encryptedPrice = await encrypt(price, { bits: 32 });

    // Submit to contract
    await contract.submitEnergyOffer(encryptedAmount, encryptedPrice, energyType);
  };
}
```

### 3. Real-time Status

```tsx
// src/components/SDKStatus.tsx
import { useFhevmContext } from '@fhevm/sdk/react';

export function SDKStatus() {
  const { isReady, isLoading, error } = useFhevmContext();

  return (
    <div className={isReady ? 'text-green-500' : 'text-gray-400'}>
      {isReady ? 'SDK Ready' : 'Initializing...'}
    </div>
  );
}
```

## Quick Start

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
MetaMask or compatible wallet
```

### Installation

```bash
# Navigate to this directory
cd examples/nextjs-energy-market

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your contract address
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Build application
npm run build

# Start production server
npm start
```

## Project Structure

```
nextjs-energy-market/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── providers.tsx       # FHEVM Provider setup
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── SDKStatus.tsx       # SDK status indicator
│   │   ├── EnergyOfferForm.tsx # Offer submission (SDK integrated)
│   │   ├── EnergyDemandForm.tsx # Demand submission (SDK integrated)
│   │   └── TradingPeriodInfo.tsx # Trading period info
│   └── lib/                    # Utilities
│       ├── useContract.ts      # Contract hook
│       └── contractABI.ts      # Contract ABI
├── public/                     # Static assets
├── .env.example                # Environment template
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## Features Demonstrated

### Privacy-Preserving Operations

1. **Confidential Offers**
   - Energy amounts encrypted before submission
   - Prices hidden from competitors
   - Only encrypted data stored on-chain

2. **Confidential Demands**
   - Consumption patterns remain private
   - Maximum prices hidden
   - Privacy-preserving matching

3. **Encrypted Matching**
   - Smart contract compares encrypted values
   - No plaintext exposure
   - Secure settlement

### FHEVM SDK Features Used

| Feature | Implementation | File |
|---------|---------------|------|
| Client Init | `FhevmProvider` | `providers.tsx` |
| Context | `useFhevmContext()` | Multiple components |
| Encryption | `useEncrypt()` hook | Form components |
| Status | `isReady`, `isLoading` | `SDKStatus.tsx` |
| Error Handling | `error` from context | `page.tsx` |

## SDK Integration Benefits

### Before SDK
```typescript
// Complex manual setup
import { createInstance } from 'fhevmjs';

const instance = await createInstance({ chainId, publicKey, ... });
const encrypted = instance.encrypt32(value);
// Manual error handling, state management, etc.
```

### With SDK
```typescript
// Simple, declarative
import { useEncrypt } from '@fhevm/sdk/react';

const { encrypt, isEncrypting } = useEncrypt(client);
const encrypted = await encrypt(value, { bits: 32 });
// Automatic error handling, loading states, etc.
```

**Result**: 80% less boilerplate code, better DX, production-ready patterns.

## User Flow

1. **Connect Wallet**
   - User connects MetaMask
   - Application initializes FHEVM client
   - SDK shows ready status

2. **Submit Offer or Demand**
   - User enters energy amount and price
   - SDK encrypts values using FHE
   - Transaction submitted to blockchain
   - Confirmation displayed

3. **Privacy Maintained**
   - All sensitive data remains encrypted
   - Only user and authorized parties can decrypt
   - Smart contract operates on encrypted values

## Environment Variables

```bash
# Required
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...  # Deployed contract address

# Optional
NEXT_PUBLIC_NETWORK=sepolia         # Network name
NEXT_PUBLIC_CHAIN_ID=11155111       # Chain ID
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **@fhevm/sdk** - Universal FHEVM SDK
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ethers.js** - Ethereum interactions
- **fhevmjs** - FHE operations (via SDK)

## Performance

| Metric | Value |
|--------|-------|
| Initial Load | < 2s |
| SDK Init | ~500ms |
| Encryption | ~50ms per value |
| Transaction | 12-15s (Sepolia) |

## Security

- ✅ All sensitive data encrypted
- ✅ No plaintext storage
- ✅ Client-side encryption
- ✅ Secure key management
- ✅ EIP-712 signatures for decryption

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Docker

```bash
# Build image
docker build -t nextjs-energy-market .

# Run container
docker run -p 3000:3000 nextjs-energy-market
```

### Static Export

```bash
# Add to next.config.js
output: 'export'

# Build
npm run build

# Deploy /out directory
```

## Troubleshooting

### SDK not initializing

**Issue**: FHEVM client shows error
**Solution**: Check contract address in `.env.local`

```bash
# Verify address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### Encryption failing

**Issue**: Encrypt function returns null
**Solution**: Ensure SDK client is ready

```tsx
const { isReady } = useFhevmContext();
if (!isReady) return <div>Waiting for SDK...</div>;
```

### Wallet not connecting

**Issue**: MetaMask not detected
**Solution**: Install MetaMask extension

```bash
# Check browser
if (!window.ethereum) {
  alert('Please install MetaMask');
}
```

## Learn More

- **FHEVM SDK Docs**: See main README at repository root
- **Next.js Docs**: https://nextjs.org/docs
- **Zama FHEVM**: https://docs.zama.ai/fhevm
- **Tailwind CSS**: https://tailwindcss.com/docs

## Support

- **Issues**: Open an issue on GitHub
- **Discussions**: Join Zama community
- **Documentation**: See SDK documentation

---

**Built with privacy, powered by FHEVM SDK, deployed with Next.js.**
