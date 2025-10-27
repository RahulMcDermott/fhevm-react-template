# Quick Reference Guide - Next.js FHE Application

## 🚀 Quick Start

```bash
cd examples/nextjs-energy-market
npm install
cp .env.example .env.local
# Edit .env.local with CONTRACT_ADDRESS
npm run dev
```

## 📂 Key Directories

```
src/
├── app/          # Pages & API routes
├── components/   # React components
├── lib/          # Utilities & FHE
├── hooks/        # Custom hooks
└── types/        # TypeScript types
```

## 🔧 Essential Hooks

### useFHE
```tsx
const { isReady, error, initialize } = useFHE({
  network: 'sepolia',
  contractAddress: '0x...'
});
```

### useEncryption
```tsx
const { encrypt, isEncrypting } = useEncryption();
const result = await encrypt(1000, { bits: 32 });
```

### useComputation
```tsx
const { add, isComputing } = useComputation();
const sum = await add(encrypted1, encrypted2);
```

## 🎨 UI Components

```tsx
// Button
<Button variant="primary" size="md" isLoading={false}>
  Click Me
</Button>

// Input
<Input
  label="Amount"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// Card
<Card title="Title" subtitle="Description">
  Content
</Card>
```

## 🌐 API Endpoints

```typescript
// Encrypt
POST /api/fhe/encrypt
{ value: 1000, bits: 32 }

// Decrypt
POST /api/fhe/decrypt
{ encryptedHandle: "0x...", userAddress: "0x...", contractAddress: "0x..." }

// Compute
POST /api/fhe/compute
{ operation: "add", operands: ["0x...", "0x..."], bits: 32 }

// Keys
POST /api/keys
{ type: "client" }
```

## 📚 Common Patterns

### Encryption Flow
```tsx
const { encrypt } = useEncryption();
const result = await encrypt(value, { bits: 32 });
if (result) {
  console.log(result.encrypted);
}
```

### Computation Flow
```tsx
const { compute } = useComputation();
const result = await compute('add', [op1, op2], 32);
if (result) {
  console.log(result.result);
}
```

### Context Usage
```tsx
const { isReady } = useFHEContext();
if (!isReady) return <Loading />;
```

## 🔐 Security Checklist

- ✅ Validate all inputs
- ✅ Check client ready before operations
- ✅ Handle errors gracefully
- ✅ Use appropriate bit sizes
- ✅ Implement rate limiting
- ✅ Never expose private keys

## 🎯 Component Imports

```tsx
// Hooks
import { useFHE } from '@/hooks/useFHE';
import { useEncryption } from '@/hooks/useEncryption';
import { useComputation } from '@/hooks/useComputation';

// Components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

// FHE Components
import { FHEProvider, useFHEContext } from '@/components/fhe/FHEProvider';
import { EncryptionDemo } from '@/components/fhe/EncryptionDemo';
import { ComputationDemo } from '@/components/fhe/ComputationDemo';

// Examples
import { BankingExample } from '@/components/examples/BankingExample';
import { MedicalExample } from '@/components/examples/MedicalExample';

// Types
import type { EncryptionOptions, EncryptionResult } from '@/types/fhe';
import type { ApiResponse } from '@/types/api';
```

## 🛠️ Utility Functions

```tsx
// Client FHE
import { initializeFHEClient, encryptValue, decryptValue } from '@/lib/fhe/client';

// Server FHE
import { serverEncrypt, serverPublicDecrypt } from '@/lib/fhe/server';

// Keys
import { generateKeyPair, getOrGenerateKey } from '@/lib/fhe/keys';

// Security
import { isValidAddress, sanitizeInput, validateNumericInput } from '@/lib/utils/security';

// Validation
import { validateBitSize, validateOperation, validateOperands } from '@/lib/utils/validation';
```

## 📝 Environment Variables

```env
# Required
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Optional
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_RPC_URL=https://...
NEXT_PUBLIC_CHAIN_ID=11155111
```

## 🐛 Troubleshooting

### Client Not Ready
```tsx
const { isReady, error, initialize } = useFHEContext();
if (error) {
  console.error('FHE Error:', error.message);
  // Try reinitializing
  await initialize();
}
```

### Encryption Fails
```tsx
// Check client is ready
if (!isReady) {
  alert('FHE client not ready');
  return;
}

// Validate input
if (!validateNumericInput(value)) {
  alert('Invalid value');
  return;
}
```

### API Errors
```tsx
try {
  const response = await fetch('/api/fhe/encrypt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value, bits })
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
} catch (error) {
  console.error('API Error:', error);
}
```

## 📊 Type Definitions

```typescript
// Encryption Options
interface EncryptionOptions {
  bits?: 8 | 16 | 32 | 64 | 128 | 256;
  userAddress?: string;
  contractAddress?: string;
}

// Encryption Result
interface EncryptionResult {
  encrypted: string;
  handle?: string;
  timestamp: number;
}

// API Response
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}
```

## 🎓 Best Practices

1. **Always validate inputs** before encryption
2. **Check client ready** before operations
3. **Handle errors** with user feedback
4. **Use appropriate bit sizes** for data
5. **Cache encrypted values** when possible
6. **Implement loading states** for UX
7. **Add retry logic** for network ops
8. **Test thoroughly** before deployment

## 📚 Additional Resources

- **Main README**: `README.md`
- **Advanced Guide**: `ADVANCED_README.md`
- **Implementation**: `IMPLEMENTATION_GUIDE.md`
- **Features**: `FEATURES_SUMMARY.md`

## 🔗 Useful Links

- Next.js Docs: https://nextjs.org/docs
- FHEVM SDK: Main repository
- Zama Docs: https://docs.zama.ai/fhevm
- TypeScript: https://www.typescriptlang.org/docs

---

**Quick Tip**: Press `Ctrl+P` in VS Code and type file names to quickly navigate!

**Need Help?** Check `ADVANCED_README.md` for detailed documentation.
