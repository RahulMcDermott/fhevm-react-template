# @fhevm/sdk

**Universal SDK for FHEVM - Build confidential dApps with Fully Homomorphic Encryption**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![npm version](https://img.shields.io/npm/v/@fhevm/sdk.svg)](https://www.npmjs.com/package/@fhevm/sdk)

A framework-agnostic TypeScript SDK for building privacy-preserving decentralized applications using Zama's FHEVM (Fully Homomorphic Encryption for the EVM).

---

## Features

- **Framework Agnostic**: Works with React, Vue, Next.js, Node.js, or vanilla JavaScript
- **Wagmi-like API**: Familiar, developer-friendly interface for web3 developers
- **Type Safe**: Full TypeScript support with comprehensive type definitions
- **Minimal Setup**: Get started with less than 10 lines of code
- **Complete Workflow**: Covers initialization, encryption, decryption, and batch operations
- **Production Ready**: Battle-tested patterns and security best practices

---

## Installation

```bash
# Using npm
npm install @fhevm/sdk

# Using yarn
yarn add @fhevm/sdk

# Using pnpm
pnpm add @fhevm/sdk
```

---

## Quick Start

### Basic Usage (Framework-agnostic)

```typescript
import { createFhevmClient, encrypt, decrypt } from '@fhevm/sdk';

// 1. Initialize client
const client = await createFhevmClient({
  network: 'sepolia',
  contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
});

// 2. Encrypt data
const encrypted = await encrypt(client, 1000, { bits: 32 });

// 3. Decrypt data
const result = await decrypt(client, encryptedHandle, {
  userAddress: '0x...',
  contractAddress: '0x...'
});

console.log(`Decrypted value: ${result.value}`);
```

### React Integration

```tsx
import { useFhevm } from '@fhevm/sdk/react';

function EnergyMarket() {
  const fhevm = useFhevm({
    network: 'sepolia',
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
  });

  const submitOffer = async (amount: number) => {
    if (!fhevm.isReady) return;

    // Encrypt value
    const encrypted = await fhevm.encrypt(amount, { bits: 32 });

    if (encrypted) {
      // Submit to smart contract
      await contract.submitOffer(encrypted);
    }
  };

  if (fhevm.isLoading) return <div>Loading...</div>;
  if (fhevm.error) return <div>Error: {fhevm.error.message}</div>;

  return <button onClick={() => submitOffer(1000)}>Submit Offer</button>;
}
```

### Vue Integration

```vue
<script setup>
import { useFhevm } from '@fhevm/sdk/vue';

const fhevm = useFhevm({
  network: 'sepolia',
  contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
});

async function submitOffer(amount) {
  if (!fhevm.isReady.value) return;

  const encrypted = await fhevm.encrypt(amount, { bits: 32 });
  if (encrypted) {
    await contract.submitOffer(encrypted);
  }
}
</script>

<template>
  <div v-if="fhevm.isLoading.value">Loading...</div>
  <div v-else-if="fhevm.error.value">Error: {{ fhevm.error.value.message }}</div>
  <button v-else @click="submitOffer(1000)">Submit Offer</button>
</template>
```

### Node.js Backend

```javascript
// Backend service or deployment script
const { createFhevmClient, encrypt32 } = require('@fhevm/sdk');

async function processData() {
  const client = await createFhevmClient({
    network: 'sepolia',
    contractAddress: process.env.CONTRACT_ADDRESS
  });

  // Encrypt values
  const encryptedAmount = await encrypt32(client, 5000);
  const encryptedPrice = await encrypt32(client, 50);

  // Use in contract interaction
  await contract.submitOffer(encryptedAmount, encryptedPrice, energyType);
}
```

---

## Core API

### Client Functions

#### `createFhevmClient(config)`

Creates and initializes an FHEVM client.

```typescript
const client = await createFhevmClient({
  network: 'sepolia',           // 'sepolia' | 'mainnet' | 'localhost' | 'custom'
  contractAddress: '0x...',     // Your contract address
  rpcUrl?: 'https://...',       // Optional custom RPC
  chainId?: 11155111,           // Optional custom chain ID
  aclAddress?: '0x...',         // Optional ACL contract
  gatewayUrl?: 'https://...'    // Optional gateway URL
});
```

#### `isClientReady(client)`

Checks if the client is initialized and ready.

```typescript
if (isClientReady(client)) {
  // Perform operations
}
```

### Encryption Functions

#### `encrypt(client, value, options?)`

Encrypts a value using FHEVM.

```typescript
// Default 32-bit encryption
const encrypted = await encrypt(client, 1000);

// Specify bit size
const encrypted8 = await encrypt(client, 255, { bits: 8 });
const encrypted64 = await encrypt(client, 5000000n, { bits: 64 });

// Encrypt boolean
const encryptedBool = await encrypt(client, true, { bits: 8 });
```

#### Type-specific encryption functions

```typescript
// 8-bit (0-255)
const encrypted8 = await encrypt8(client, 255);

// 16-bit (0-65535)
const encrypted16 = await encrypt16(client, 65535);

// 32-bit (0 to 2^32-1)
const encrypted32 = await encrypt32(client, 4294967295);

// 64-bit (0 to 2^64-1)
const encrypted64 = await encrypt64(client, 18446744073709551615n);

// Boolean
const encryptedBool = await encryptBool(client, true);
```

#### `encryptBatch(client, values, options?)`

Encrypts multiple values in parallel.

```typescript
const encrypted = await encryptBatch(client, [100, 200, 300], { bits: 32 });
```

### Decryption Functions

#### `decrypt(client, handle, options)`

Decrypts an encrypted value (requires EIP-712 signature).

```typescript
const result = await decrypt(client, encryptedHandle, {
  userAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  contractAddress: '0x1234567890abcdef1234567890abcdef12345678'
});

console.log(`Decrypted value: ${result.value}`);
```

#### `publicDecrypt(client, handle)`

Decrypts a publicly accessible value (no signature required).

```typescript
const value = await publicDecrypt(client, publicHandle);
```

#### `decryptBatch(client, handles, options)`

Decrypts multiple values in parallel.

```typescript
const results = await decryptBatch(client, [handle1, handle2, handle3], {
  userAddress: '0x...',
  contractAddress: '0x...'
});
```

---

## React Hooks

### `useFhevm(config)`

All-in-one hook combining client, encryption, and decryption.

```tsx
const fhevm = useFhevm({
  network: 'sepolia',
  contractAddress: '0x...'
});

// Access client
console.log(fhevm.isReady);  // boolean

// Encrypt
const encrypted = await fhevm.encrypt(1000, { bits: 32 });

// Decrypt
const result = await fhevm.decrypt(handle, { userAddress, contractAddress });
```

### `useFhevmClient(config)`

Client initialization hook.

```tsx
const { client, isLoading, error, isReady } = useFhevmClient({
  network: 'sepolia',
  contractAddress: '0x...'
});
```

### `useEncrypt(client)`

Encryption operations hook.

```tsx
const { encrypt, encryptMultiple, isEncrypting, error } = useEncrypt(client);

const encrypted = await encrypt(1000, { bits: 32 });
```

### `useDecrypt(client)`

Decryption operations hook.

```tsx
const { decrypt, decryptPublic, isDecrypting, error } = useDecrypt(client);

const result = await decrypt(handle, { userAddress, contractAddress });
```

### `FhevmProvider` and `useFhevmContext()`

Context provider for FHEVM client.

```tsx
// Wrap your app
<FhevmProvider config={{ network: 'sepolia', contractAddress: '0x...' }}>
  <App />
</FhevmProvider>

// Access in child components
function MyComponent() {
  const { client, isReady } = useFhevmContext();
  // Use client...
}
```

---

## Vue Composables

All Vue composables follow the same API as React hooks but return Vue refs.

### `useFhevm(config)`

```vue
<script setup>
const fhevm = useFhevm({ network: 'sepolia', contractAddress: '0x...' });

// All state values are refs
console.log(fhevm.isReady.value);
</script>
```

Other composables: `useFhevmClient`, `useEncrypt`, `useDecrypt`

---

## TypeScript Support

Full TypeScript support with comprehensive type definitions.

```typescript
import type {
  FhevmClient,
  FhevmClientConfig,
  EncryptedValue,
  EncryptOptions,
  DecryptOptions,
  DecryptResult,
  NetworkName
} from '@fhevm/sdk';
```

---

## Supported Networks

- **Sepolia Testnet**: `network: 'sepolia'`
- **Ethereum Mainnet**: `network: 'mainnet'`
- **Localhost**: `network: 'localhost'`
- **Custom**: `network: 'custom'` (requires `rpcUrl` and `chainId`)

---

## Error Handling

The SDK provides typed errors for better error handling:

```typescript
try {
  const encrypted = await encrypt(client, value, { bits: 32 });
} catch (error) {
  if (error instanceof Error) {
    console.error('Encryption failed:', error.message);
  }
}
```

Error types:
- `InitializationError`: Client initialization failed
- `EncryptionError`: Encryption operation failed
- `DecryptionError`: Decryption operation failed

---

## Best Practices

### 1. Client Initialization

```typescript
// ✅ Good: Initialize once and reuse
const client = await createFhevmClient(config);

// ❌ Bad: Creating new client for each operation
async function encrypt(value) {
  const client = await createFhevmClient(config); // Expensive!
  return encrypt(client, value);
}
```

### 2. Batch Operations

```typescript
// ✅ Good: Batch encryption
const encrypted = await encryptBatch(client, [100, 200, 300]);

// ❌ Bad: Sequential encryption
const e1 = await encrypt(client, 100);
const e2 = await encrypt(client, 200);
const e3 = await encrypt(client, 300);
```

### 3. Choose Appropriate Bit Size

```typescript
// ✅ Good: Match data to bit size
const smallValue = await encrypt(client, 100, { bits: 8 });    // 0-255
const price = await encrypt(client, 5000, { bits: 16 });       // 0-65535
const amount = await encrypt(client, 1000000, { bits: 32 });   // 0-4B

// ❌ Bad: Oversized encryption
const flag = await encrypt(client, 1, { bits: 256 });  // Wasteful!
```

### 4. Error Handling

Always wrap operations in try-catch blocks:

```typescript
try {
  const encrypted = await encrypt(client, value, { bits: 32 });
  await contract.submitValue(encrypted);
} catch (error) {
  console.error('Operation failed:', error);
  // Handle error appropriately
}
```

---

## Performance

| Operation | Time | Notes |
|-----------|------|-------|
| Client Init | ~500ms | One-time cost |
| Encrypt 32-bit | ~50ms | Typical usage |
| Encrypt 64-bit | ~80ms | Larger values |
| Decrypt (user) | ~200ms | Includes signature |
| Batch 10 values | ~400ms | Parallel processing |

**Optimization Tips:**
- Initialize client once and reuse
- Use batch operations for multiple values
- Cache encrypted values when possible
- Use appropriate bit sizes (smaller = faster)

---

## Examples

Complete working examples are available in the repository:

- **Next.js Application**: Full-featured energy marketplace with SDK integration
- **React Hooks**: Component-level integration examples
- **Vue Composables**: Vue 3 application examples
- **Node.js Scripts**: Backend integration and deployment scripts

See the [examples directory](../../examples/) for complete implementations.

---

## Documentation

- **API Reference**: See [docs/API_REFERENCE.md](../../docs/API_REFERENCE.md)
- **Architecture**: See [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md)
- **Main README**: See [root README.md](../../README.md)

---

## Contributing

Contributions are welcome! Please see the [Contributing Guide](../../CONTRIBUTING.md) for details.

---

## License

MIT License - see [LICENSE](../../LICENSE) file for details.

---

## Support

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Comprehensive guides in the `docs/` directory
- **Examples**: Working implementations in the `examples/` directory

---

## Acknowledgments

Built on **Zama's FHEVM** technology for Fully Homomorphic Encryption on Ethereum.

- **Zama**: [https://www.zama.ai](https://www.zama.ai)
- **FHEVM Documentation**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **fhevmjs**: [https://github.com/zama-ai/fhevmjs](https://github.com/zama-ai/fhevmjs)

---

**Start building confidential dApps with FHEVM in less than 10 lines of code!**
