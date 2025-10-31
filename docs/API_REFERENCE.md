# FHEVM SDK API Reference

Complete API documentation for the FHEVM Universal SDK.

---

## Table of Contents

- [Core Module](#core-module)
  - [Client Functions](#client-functions)
  - [Encryption Functions](#encryption-functions)
  - [Decryption Functions](#decryption-functions)
  - [Utility Functions](#utility-functions)
- [React Module](#react-module)
  - [Hooks](#hooks)
  - [Components](#components)
- [Vue Module](#vue-module)
  - [Composables](#composables)
- [Types](#types)

---

## Core Module

Import from `@fhevm/sdk`:

```typescript
import { createFhevmClient, encrypt, decrypt, ... } from '@fhevm/sdk';
```

### Client Functions

#### `createFhevmClient(config)`

Creates and initializes an FHEVM client instance.

**Parameters:**
- `config: FhevmClientConfig` - Client configuration object
  - `network: NetworkName` - Network name ('sepolia' | 'mainnet' | 'localhost' | 'custom')
  - `contractAddress: string` - Smart contract address
  - `rpcUrl?: string` - Optional custom RPC URL (required for 'custom' network)
  - `chainId?: number` - Optional custom chain ID
  - `aclAddress?: string` - Optional ACL contract address
  - `kmsVerifierAddress?: string` - Optional KMS verifier address
  - `gatewayUrl?: string` - Optional gateway URL for decryption
  - `provider?: any` - Optional Ethereum provider for signing

**Returns:** `Promise<FhevmClient>` - Initialized FHEVM client

**Example:**
```typescript
const client = await createFhevmClient({
  network: 'sepolia',
  contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  rpcUrl: 'https://rpc.sepolia.org'
});
```

**Throws:** `InitializationError` if client creation fails

---

#### `isClientReady(client)`

Checks if a client is initialized and ready for operations.

**Parameters:**
- `client: FhevmClient` - FHEVM client instance

**Returns:** `boolean` - `true` if client is ready

**Example:**
```typescript
if (isClientReady(client)) {
  // Perform operations
}
```

---

#### `getPublicKey(client)`

Retrieves the public key from the client for encryption operations.

**Parameters:**
- `client: FhevmClient` - FHEVM client instance

**Returns:** `Promise<string>` - Public key as hex string

**Example:**
```typescript
const publicKey = await getPublicKey(client);
console.log(`Public Key: ${publicKey}`);
```

**Throws:** Error if client is not initialized

---

#### `generateReencryptionKeys(client)`

Generates a keypair for reencryption (used in decryption).

**Parameters:**
- `client: FhevmClient` - FHEVM client instance

**Returns:** `Promise<{ publicKey: string; privateKey: string }>` - Keypair for reencryption

**Example:**
```typescript
const keys = await generateReencryptionKeys(client);
console.log(`Public: ${keys.publicKey}, Private: ${keys.privateKey}`);
```

---

### Encryption Functions

#### `encrypt(client, value, options?)`

Encrypts a value using FHEVM.

**Parameters:**
- `client: FhevmClient` - FHEVM client instance
- `value: number | bigint | boolean` - Value to encrypt
- `options?: EncryptOptions` - Encryption options
  - `bits?: 8 | 16 | 32 | 64 | 128 | 256` - Bit size (default: 32)

**Returns:** `Promise<EncryptedValue>` - Encrypted value as Uint8Array

**Example:**
```typescript
// Encrypt 32-bit value (default)
const encrypted = await encrypt(client, 1000);

// Encrypt 64-bit value
const encrypted64 = await encrypt(client, 5000000n, { bits: 64 });

// Encrypt boolean
const encryptedBool = await encrypt(client, true, { bits: 8 });
```

**Throws:** `EncryptionError` if encryption fails or value is out of range

---

#### `encrypt8(client, value)`

Encrypts an 8-bit value (0-255).

**Parameters:**
- `client: FhevmClient` - FHEVM client instance
- `value: number` - Value to encrypt (0-255)

**Returns:** `Promise<EncryptedValue>` - Encrypted value

**Example:**
```typescript
const encrypted = await encrypt8(client, 255);
```

---

#### `encrypt16(client, value)`

Encrypts a 16-bit value (0-65535).

**Parameters:**
- `client: FhevmClient` - FHEVM client instance
- `value: number` - Value to encrypt (0-65535)

**Returns:** `Promise<EncryptedValue>` - Encrypted value

**Example:**
```typescript
const encrypted = await encrypt16(client, 65535);
```

---

#### `encrypt32(client, value)`

Encrypts a 32-bit value (0 to 2^32-1).

**Parameters:**
- `client: FhevmClient` - FHEVM client instance
- `value: number | bigint` - Value to encrypt

**Returns:** `Promise<EncryptedValue>` - Encrypted value

**Example:**
```typescript
const encrypted = await encrypt32(client, 4294967295);
```

---

#### `encrypt64(client, value)`

Encrypts a 64-bit value (0 to 2^64-1).

**Parameters:**
- `client: FhevmClient` - FHEVM client instance
- `value: bigint` - Value to encrypt

**Returns:** `Promise<EncryptedValue>` - Encrypted value

**Example:**
```typescript
const encrypted = await encrypt64(client, 18446744073709551615n);
```

---

#### `encryptBool(client, value)`

Encrypts a boolean value.

**Parameters:**
- `client: FhevmClient` - FHEVM client instance
- `value: boolean` - Boolean value to encrypt

**Returns:** `Promise<EncryptedValue>` - Encrypted value

**Example:**
```typescript
const encrypted = await encryptBool(client, true);
```

---

#### `encryptBatch(client, values, options?)`

Encrypts multiple values in parallel.

**Parameters:**
- `client: FhevmClient` - FHEVM client instance
- `values: (number | bigint | boolean)[]` - Array of values to encrypt
- `options?: EncryptOptions` - Encryption options

**Returns:** `Promise<EncryptedValue[]>` - Array of encrypted values

**Example:**
```typescript
const encrypted = await encryptBatch(client, [100, 200, 300], { bits: 32 });
console.log(`Encrypted ${encrypted.length} values`);
```

---

### Decryption Functions

#### `decrypt(client, handle, options)`

Decrypts an encrypted value using user permission (requires EIP-712 signature).

**Parameters:**
- `client: FhevmClient` - FHEVM client instance
- `handle: EncryptedHandle` - Encrypted handle from smart contract
- `options: DecryptOptions` - Decryption options
  - `userAddress: string` - User's Ethereum address
  - `contractAddress: string` - Contract containing the encrypted value
  - `signature?: string` - Optional pre-generated EIP-712 signature

**Returns:** `Promise<DecryptResult>` - Decryption result
  - `value: bigint | number | boolean` - Decrypted value
  - `handle: EncryptedHandle` - Original handle
  - `bits: number` - Bit size of the value

**Example:**
```typescript
const result = await decrypt(client, encryptedHandle, {
  userAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  contractAddress: '0x1234567890abcdef1234567890abcdef12345678'
});
console.log(`Decrypted value: ${result.value}`);
```

**Throws:** `DecryptionError` if decryption fails

---

#### `publicDecrypt(client, handle)`

Decrypts a publicly accessible encrypted value (no signature required).

**Parameters:**
- `client: FhevmClient` - FHEVM client instance
- `handle: EncryptedHandle` - Encrypted handle from smart contract

**Returns:** `Promise<bigint | number | boolean>` - Decrypted value

**Example:**
```typescript
const value = await publicDecrypt(client, publicHandle);
console.log(`Public value: ${value}`);
```

**Throws:** `DecryptionError` if decryption fails

---

#### `generateDecryptSignature(client, handle, userAddress, contractAddress)`

Generates an EIP-712 signature for decryption authorization.

**Parameters:**
- `client: FhevmClient` - FHEVM client instance
- `handle: EncryptedHandle` - Encrypted handle
- `userAddress: string` - User's address
- `contractAddress: string` - Contract address

**Returns:** `Promise<string>` - EIP-712 signature

**Example:**
```typescript
const signature = await generateDecryptSignature(
  client,
  handle,
  userAddress,
  contractAddress
);
```

**Throws:** Error if provider is not configured or signing fails

---

#### `decryptBatch(client, handles, options)`

Decrypts multiple encrypted values in parallel.

**Parameters:**
- `client: FhevmClient` - FHEVM client instance
- `handles: EncryptedHandle[]` - Array of encrypted handles
- `options: DecryptOptions` - Decryption options

**Returns:** `Promise<DecryptResult[]>` - Array of decryption results

**Example:**
```typescript
const results = await decryptBatch(client, [handle1, handle2, handle3], {
  userAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  contractAddress: '0x1234567890abcdef1234567890abcdef12345678'
});
```

---

### Utility Functions

#### `toHexString(value)`

Converts a value to hexadecimal string.

**Parameters:**
- `value: Uint8Array | number | bigint` - Value to convert

**Returns:** `string` - Hex string with '0x' prefix

---

#### `fromHexString(hex)`

Converts a hexadecimal string to Uint8Array.

**Parameters:**
- `hex: string` - Hex string (with or without '0x' prefix)

**Returns:** `Uint8Array` - Byte array

---

#### `formatHandle(handle)`

Formats an encrypted handle for display.

**Parameters:**
- `handle: EncryptedHandle` - Handle to format

**Returns:** `string` - Formatted handle (shortened with ellipsis)

---

#### `isValidAddress(address)`

Validates an Ethereum address.

**Parameters:**
- `address: string` - Address to validate

**Returns:** `boolean` - `true` if valid Ethereum address

---

#### `getExplorerUrl(network, address)`

Gets the block explorer URL for an address.

**Parameters:**
- `network: NetworkName` - Network name
- `address: string` - Contract or account address

**Returns:** `string` - Block explorer URL

---

#### `retry(fn, options?)`

Retries a function with exponential backoff.

**Parameters:**
- `fn: () => Promise<T>` - Function to retry
- `options?: RetryOptions` - Retry options
  - `maxAttempts?: number` - Max retry attempts (default: 3)
  - `delayMs?: number` - Initial delay in ms (default: 1000)
  - `backoffMultiplier?: number` - Backoff multiplier (default: 2)

**Returns:** `Promise<T>` - Result of function

---

## React Module

Import from `@fhevm/sdk/react`:

```typescript
import { useFhevm, FhevmProvider, useFhevmContext, ... } from '@fhevm/sdk/react';
```

### Hooks

#### `useFhevmClient(config)`

React hook for initializing FHEVM client.

**Parameters:**
- `config: FhevmClientConfig` - Client configuration

**Returns:** Object with:
- `client: FhevmClient | null` - FHEVM client instance
- `isLoading: boolean` - Loading state
- `error: Error | null` - Error if initialization failed
- `isReady: boolean` - Whether client is ready

**Example:**
```tsx
function App() {
  const { client, isLoading, error, isReady } = useFhevmClient({
    network: 'sepolia',
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
  });

  if (isLoading) return <div>Initializing FHEVM...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!isReady) return <div>Client not ready</div>;

  return <div>FHEVM ready!</div>;
}
```

---

#### `useEncrypt(client)`

React hook for encrypting values.

**Parameters:**
- `client: FhevmClient | null` - FHEVM client instance

**Returns:** Object with:
- `encrypt: (value, options?) => Promise<EncryptedValue | null>` - Encryption function
- `encryptMultiple: (values, options?) => Promise<EncryptedValue[] | null>` - Batch encryption
- `isEncrypting: boolean` - Encryption in progress
- `error: Error | null` - Encryption error if any

**Example:**
```tsx
function EncryptForm() {
  const { client } = useFhevmContext();
  const { encrypt, isEncrypting, error } = useEncrypt(client);

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value, { bits: 32 });
    if (encrypted) {
      // Use encrypted value in transaction
      await contract.submitValue(encrypted);
    }
  };

  return (
    <button onClick={() => handleSubmit(1000)} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Submit'}
    </button>
  );
}
```

---

#### `useDecrypt(client)`

React hook for decrypting values.

**Parameters:**
- `client: FhevmClient | null` - FHEVM client instance

**Returns:** Object with:
- `decrypt: (handle, options) => Promise<DecryptResult | null>` - Decryption function
- `decryptPublic: (handle) => Promise<bigint | number | boolean | null>` - Public decryption
- `isDecrypting: boolean` - Decryption in progress
- `error: Error | null` - Decryption error if any

**Example:**
```tsx
function DecryptButton({ handle }: { handle: string }) {
  const { client } = useFhevmContext();
  const { decrypt, isDecrypting } = useDecrypt(client);
  const [value, setValue] = useState<bigint | null>(null);

  const handleDecrypt = async () => {
    const result = await decrypt(handle, {
      userAddress: address,
      contractAddress: CONTRACT_ADDRESS
    });
    if (result) {
      setValue(result.value);
    }
  };

  return (
    <div>
      <button onClick={handleDecrypt} disabled={isDecrypting}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt'}
      </button>
      {value !== null && <div>Value: {value.toString()}</div>}
    </div>
  );
}
```

---

#### `useFhevm(config)`

All-in-one React hook combining client, encryption, and decryption.

**Parameters:**
- `config: FhevmClientConfig` - Client configuration

**Returns:** Object with all client, encryption, and decryption functionality combined:
- `client: FhevmClient | null`
- `isReady: boolean`
- `encrypt: (value, options?) => Promise<EncryptedValue | null>`
- `encryptMultiple: (values, options?) => Promise<EncryptedValue[] | null>`
- `isEncrypting: boolean`
- `decrypt: (handle, options) => Promise<DecryptResult | null>`
- `decryptPublic: (handle) => Promise<bigint | number | boolean | null>`
- `isDecrypting: boolean`
- `isLoading: boolean`
- `error: Error | null`

**Example:**
```tsx
function EnergyMarket() {
  const fhevm = useFhevm({
    network: 'sepolia',
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
  });

  const submitOffer = async (amount: number, price: number) => {
    if (!fhevm.isReady) return;

    // Encrypt values
    const encryptedAmount = await fhevm.encrypt(amount, { bits: 32 });
    const encryptedPrice = await fhevm.encrypt(price, { bits: 32 });

    // Submit to contract
    if (encryptedAmount && encryptedPrice) {
      await contract.submitOffer(encryptedAmount, encryptedPrice);
    }
  };

  if (fhevm.isLoading) return <div>Loading...</div>;
  if (fhevm.error) return <div>Error: {fhevm.error.message}</div>;

  return <button onClick={() => submitOffer(1000, 50)}>Submit Offer</button>;
}
```

---

### Components

#### `<FhevmProvider>`

React Context Provider for FHEVM client.

**Props:**
- `config: FhevmClientConfig` - Client configuration
- `children: ReactNode` - Child components

**Example:**
```tsx
function App() {
  return (
    <FhevmProvider config={{
      network: 'sepolia',
      contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
    }}>
      <EnergyMarket />
      <TradingDashboard />
    </FhevmProvider>
  );
}
```

---

#### `useFhevmContext()`

Hook to access FHEVM context (must be used within `<FhevmProvider>`).

**Returns:** Object with:
- `client: FhevmClient | null`
- `isLoading: boolean`
- `error: Error | null`
- `isReady: boolean`

**Example:**
```tsx
function MyComponent() {
  const { client, isReady, error } = useFhevmContext();

  if (!isReady) return <div>FHEVM not ready</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Use client for operations
  return <div>Connected to FHEVM</div>;
}
```

**Throws:** Error if used outside `<FhevmProvider>`

---

## Vue Module

Import from `@fhevm/sdk/vue`:

```typescript
import { useFhevm, useFhevmClient, useEncrypt, useDecrypt } from '@fhevm/sdk/vue';
```

### Composables

All Vue composables follow the same API as React hooks but return Vue refs.

#### `useFhevmClient(config)`

Vue composable for initializing FHEVM client.

**Parameters:**
- `config: FhevmClientConfig` - Client configuration

**Returns:** Object with reactive refs:
- `client: Ref<FhevmClient | null>`
- `isLoading: Ref<boolean>`
- `error: Ref<Error | null>`
- `isReady: Ref<boolean>`

**Example:**
```vue
<script setup>
import { useFhevmClient } from '@fhevm/sdk/vue';

const { client, isLoading, error, isReady } = useFhevmClient({
  network: 'sepolia',
  contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
});
</script>

<template>
  <div v-if="isLoading">Initializing FHEVM...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else-if="isReady">FHEVM ready!</div>
</template>
```

---

#### `useEncrypt(client)`

Vue composable for encrypting values.

**Parameters:**
- `client: Ref<FhevmClient | null>` - FHEVM client ref

**Returns:** Object with:
- `encrypt: (value, options?) => Promise<EncryptedValue | null>` - Encryption function
- `encryptMultiple: (values, options?) => Promise<EncryptedValue[] | null>` - Batch encryption
- `isEncrypting: Ref<boolean>` - Encryption state
- `error: Ref<Error | null>` - Encryption error

**Example:**
```vue
<script setup>
import { useFhevmClient, useEncrypt } from '@fhevm/sdk/vue';

const { client } = useFhevmClient({ network: 'sepolia', contractAddress: '0x...' });
const { encrypt, isEncrypting } = useEncrypt(client);

async function submitOffer(amount) {
  const encrypted = await encrypt(amount, { bits: 32 });
  if (encrypted) {
    await contract.submitOffer(encrypted);
  }
}
</script>

<template>
  <button @click="submitOffer(1000)" :disabled="isEncrypting">
    {{ isEncrypting ? 'Encrypting...' : 'Submit' }}
  </button>
</template>
```

---

#### `useDecrypt(client)`

Vue composable for decrypting values.

**Parameters:**
- `client: Ref<FhevmClient | null>` - FHEVM client ref

**Returns:** Object with:
- `decrypt: (handle, options) => Promise<DecryptResult | null>` - Decryption function
- `decryptPublic: (handle) => Promise<bigint | number | boolean | null>` - Public decryption
- `isDecrypting: Ref<boolean>` - Decryption state
- `error: Ref<Error | null>` - Decryption error

---

#### `useFhevm(config)`

All-in-one Vue composable combining all FHEVM functionality.

**Parameters:**
- `config: FhevmClientConfig` - Client configuration

**Returns:** Object with all functionality (all reactive refs for state values)

**Example:**
```vue
<script setup>
import { useFhevm } from '@fhevm/sdk/vue';

const fhevm = useFhevm({
  network: 'sepolia',
  contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
});

async function submitOffer(amount, price) {
  if (!fhevm.isReady.value) return;

  const encryptedAmount = await fhevm.encrypt(amount, { bits: 32 });
  const encryptedPrice = await fhevm.encrypt(price, { bits: 32 });

  if (encryptedAmount && encryptedPrice) {
    await contract.submitOffer(encryptedAmount, encryptedPrice);
  }
}
</script>

<template>
  <div v-if="fhevm.isLoading.value">Loading...</div>
  <div v-else-if="fhevm.error.value">Error: {{ fhevm.error.value.message }}</div>
  <button v-else @click="submitOffer(1000, 50)">Submit Offer</button>
</template>
```

---

## Types

### Core Types

#### `NetworkName`

```typescript
type NetworkName = 'sepolia' | 'mainnet' | 'localhost' | 'custom';
```

#### `FhevmClientConfig`

```typescript
interface FhevmClientConfig {
  network: NetworkName;
  contractAddress: string;
  rpcUrl?: string;
  chainId?: number;
  aclAddress?: string;
  kmsVerifierAddress?: string;
  gatewayUrl?: string;
  provider?: any;
}
```

#### `FhevmClient`

```typescript
interface FhevmClient {
  config: FhevmClientConfig;
  instance: FhevmInstance;
  isInitialized: boolean;
  getPublicKey: () => Promise<string>;
  getReencryptionKey: () => Promise<{ publicKey: string; privateKey: string }>;
}
```

#### `EncryptedValue`

```typescript
type EncryptedValue = Uint8Array;
```

#### `EncryptedHandle`

```typescript
type EncryptedHandle = bigint | string;
```

#### `EncryptOptions`

```typescript
interface EncryptOptions {
  bits?: 8 | 16 | 32 | 64 | 128 | 256;
}
```

#### `DecryptOptions`

```typescript
interface DecryptOptions {
  userAddress: string;
  contractAddress: string;
  signature?: string;
}
```

#### `DecryptResult`

```typescript
interface DecryptResult {
  value: bigint | number | boolean;
  handle: EncryptedHandle;
  bits: number;
}
```

### Error Types

#### `InitializationError`

Thrown when client initialization fails.

#### `EncryptionError`

Thrown when encryption operation fails.

#### `DecryptionError`

Thrown when decryption operation fails.

---

## Best Practices

### 1. Client Initialization

```typescript
// ✅ Good: Initialize once and reuse
const client = await createFhevmClient(config);
// Use client for all operations

// ❌ Bad: Creating new client for each operation
async function encrypt(value) {
  const client = await createFhevmClient(config); // Expensive!
  return encrypt(client, value);
}
```

### 2. Error Handling

```typescript
// ✅ Good: Proper error handling
try {
  const encrypted = await encrypt(client, value, { bits: 32 });
  await contract.submitValue(encrypted);
} catch (error) {
  console.error('Operation failed:', error);
  // Handle error appropriately
}

// ❌ Bad: No error handling
const encrypted = await encrypt(client, value);
await contract.submitValue(encrypted);
```

### 3. Batch Operations

```typescript
// ✅ Good: Batch multiple encryptions
const encrypted = await encryptBatch(client, [100, 200, 300], { bits: 32 });

// ❌ Bad: Sequential encryptions
const e1 = await encrypt(client, 100);
const e2 = await encrypt(client, 200);
const e3 = await encrypt(client, 300);
```

### 4. Bit Size Selection

```typescript
// ✅ Good: Use appropriate bit size
const smallValue = await encrypt(client, 100, { bits: 8 });  // 0-255
const price = await encrypt(client, 5000, { bits: 16 });    // 0-65535
const amount = await encrypt(client, 1000000, { bits: 32 }); // 0-4B

// ❌ Bad: Oversized encryption
const flag = await encrypt(client, 1, { bits: 256 }); // Wasteful!
```

---

## Version

Current version: **1.0.0**

For updates and changelog, see the main [README.md](../README.md).

---

## Support

For issues, questions, or contributions, please visit:
- **GitHub Issues**: Report bugs and request features
- **Documentation**: See `docs/` directory
- **Examples**: Check `examples/` directory for working implementations

**Built with Zama's FHEVM technology.**
