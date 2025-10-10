# Complete Setup Guide - FHEVM Universal SDK

Quick reference guide for getting started with the FHEVM SDK and examples.

---

## Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
MetaMask or compatible wallet
```

---

## Option 1: Next.js Example (Recommended for Frontend Developers)

### Setup

```bash
# Navigate to Next.js example
cd examples/nextjs-energy-market

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Edit .env.local
# NEXT_PUBLIC_CONTRACT_ADDRESS=0x...  (your deployed contract)
```

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### What You'll See

- ✅ Modern UI with Tailwind CSS
- ✅ FHEVM SDK initialized automatically
- ✅ Real-time encryption/decryption
- ✅ Energy offer and demand forms
- ✅ Trading period information
- ✅ SDK status indicator

### Key Files to Explore

```
src/app/providers.tsx          # SDK Provider setup
src/components/EnergyOfferForm.tsx   # SDK encryption in action
src/components/EnergyDemandForm.tsx  # Another SDK example
```

---

## Option 2: Smart Contract Example (For Full-Stack Developers)

### Setup

```bash
# Navigate to contract example
cd examples/renewable-energy-market

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Edit .env
# PRIVATE_KEY=your_wallet_private_key
# SEPOLIA_RPC_URL=https://rpc.sepolia.org
# CONTRACT_ADDRESS=  (leave empty for deployment)
```

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
# Local tests (45+ test cases)
npm test

# With gas reporting
npm run test:gas

# Generate coverage
npm run test:coverage
```

### Deploy to Sepolia

```bash
npm run deploy
```

### Interact with Contract (Using SDK)

```bash
# Run SDK-integrated interaction script
node scripts/interact-with-sdk.js
```

---

## Using the SDK in Your Own Project

### Installation

```bash
npm install @fhevm/sdk ethers@^6 fhevmjs
```

### React/Next.js Integration

```tsx
// app/providers.tsx
import { FhevmProvider } from '@fhevm/sdk/react';

export function Providers({ children }) {
  return (
    <FhevmProvider
      config={{
        network: 'sepolia',
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
      }}
    >
      {children}
    </FhevmProvider>
  );
}

// components/MyComponent.tsx
import { useEncrypt, useFhevmContext } from '@fhevm/sdk/react';

export function MyComponent() {
  const { client } = useFhevmContext();
  const { encrypt, isEncrypting } = useEncrypt(client);

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value, { bits: 32 });
    // Use encrypted value in your contract call
  };
}
```

### Vue Integration

```vue
<script setup>
import { useFhevm } from '@fhevm/sdk/vue';

const fhevm = useFhevm({
  network: 'sepolia',
  contractAddress: CONTRACT_ADDRESS
});

async function handleSubmit(value) {
  const encrypted = await fhevm.encrypt(value, { bits: 32 });
  // Use encrypted value
}
</script>
```

### Node.js Integration

```javascript
const { createFhevmClient, encrypt32 } = require('@fhevm/sdk');

async function main() {
  // Initialize SDK
  const client = await createFhevmClient({
    network: 'sepolia',
    contractAddress: CONTRACT_ADDRESS
  });

  // Encrypt value
  const encrypted = await encrypt32(client, 1000);

  // Use in contract interaction
  await contract.submitValue(encrypted);
}
```

---

## Common Issues & Solutions

### Issue: SDK not initializing

**Symptom**: `useFhevmContext()` returns `isLoading: true` indefinitely

**Solution**:
1. Check contract address is valid
2. Verify network is 'sepolia', 'mainnet', or 'localhost'
3. Check console for initialization errors

```tsx
const { error } = useFhevmContext();
console.log('SDK Error:', error);
```

### Issue: Encryption fails

**Symptom**: `encrypt()` returns null

**Solution**:
1. Ensure SDK client is ready
2. Check value is within valid range
3. Verify bit size is correct (8, 16, 32, 64, 128, 256)

```tsx
const { isReady } = useFhevmContext();
if (!isReady) {
  console.log('Wait for SDK to initialize');
  return;
}
```

### Issue: MetaMask not detected

**Symptom**: Cannot connect wallet

**Solution**:
1. Install MetaMask extension
2. Check `window.ethereum` exists
3. Request account connection

```javascript
if (!window.ethereum) {
  alert('Please install MetaMask');
  return;
}

await window.ethereum.request({ method: 'eth_requestAccounts' });
```

### Issue: Wrong network

**Symptom**: Transactions fail

**Solution**:
Switch to Sepolia network in MetaMask

```javascript
await window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0xaa36a7' }], // Sepolia
});
```

---

## Environment Variables Reference

### Next.js Example

```bash
# Required
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Optional
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_CHAIN_ID=11155111
```

### Contract Example

```bash
# Required
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Optional
ETHERSCAN_API_KEY=your_api_key
CONTRACT_ADDRESS=  # Auto-filled after deployment
PAUSER_ADDRESS=your_pauser_address
```

---

## Testing Checklist

Before deploying to production:

- [ ] All unit tests pass (`npm test`)
- [ ] Coverage above 80% (`npm run test:coverage`)
- [ ] Gas usage within budget (`npm run test:gas`)
- [ ] Linting passes (`npm run lint`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] Contract verified on Etherscan
- [ ] SDK integration tested in UI
- [ ] Error handling works correctly

---

## Deployment Checklist

### Smart Contract Deployment

- [ ] `.env` configured with PRIVATE_KEY
- [ ] RPC URL set correctly
- [ ] Sufficient test ETH in wallet
- [ ] Contract compiled successfully
- [ ] Tests passing
- [ ] Deployed to Sepolia
- [ ] Contract verified on Etherscan
- [ ] Address saved for frontend

### Frontend Deployment

- [ ] `.env.local` configured with CONTRACT_ADDRESS
- [ ] SDK Provider properly set up
- [ ] Production build successful (`npm run build`)
- [ ] Environment variables set on hosting platform
- [ ] Domain configured (if applicable)
- [ ] SSL certificate active
- [ ] MetaMask integration tested

---

## Quick Commands Reference

### Monorepo Root

```bash
npm run install:all      # Install all dependencies
npm run build:sdk        # Build SDK package
npm run test:all         # Test SDK + examples
npm run deploy:example   # Deploy contract example
```

### Next.js Example

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Lint code
```

### Contract Example

```bash
npm run compile          # Compile contracts
npm test                 # Run tests
npm run deploy           # Deploy to Sepolia
npm run verify           # Verify on Etherscan
npm run interact         # Interact with contract
```

---

## Learning Resources

### Documentation

- **Main README**: Complete SDK documentation
- **ARCHITECTURE.md**: System design and architecture
- **Next.js Example README**: Frontend integration guide
- **Contract Example README**: Smart contract guide

### Example Code

- **Next.js Forms**: `examples/nextjs-energy-market/src/components/Energy*Form.tsx`
- **SDK Provider**: `examples/nextjs-energy-market/src/app/providers.tsx`
- **Node.js Script**: `examples/renewable-energy-market/scripts/interact-with-sdk.js`
- **Smart Contract**: `examples/renewable-energy-market/contracts/PrivateRenewableEnergyMarket.sol`

### External Resources

- **Zama FHEVM**: https://docs.zama.ai/fhevm
- **Next.js Docs**: https://nextjs.org/docs
- **Hardhat Docs**: https://hardhat.org/docs
- **ethers.js**: https://docs.ethers.org/v6/

---

## Support

### Getting Help

1. **Check Documentation**: README.md has comprehensive guides
2. **Review Examples**: Both examples have detailed READMEs
3. **Check Issues**: Look for similar problems on GitHub
4. **Create Issue**: Open a new issue with details

### What to Include in Issues

- SDK version
- Framework (Next.js, Vue, Node.js)
- Error messages and stack traces
- Steps to reproduce
- Expected vs actual behavior
- Environment details

---

## Next Steps

### After Setup

1. **Explore the Next.js example** - See UI integration
2. **Review the contract example** - Understand smart contracts
3. **Read SDK documentation** - Learn all features
4. **Try modifying examples** - Build your understanding
5. **Start your own project** - Use SDK in your dApp

### Building Your Own dApp

1. Install SDK: `npm install @fhevm/sdk`
2. Initialize provider (React/Vue) or client (Node.js)
3. Use encryption hooks/functions
4. Integrate with your smart contracts
5. Test thoroughly
6. Deploy to production

---

**You're ready to build privacy-preserving dApps with FHEVM SDK!**
