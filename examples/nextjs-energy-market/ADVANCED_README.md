# Next.js FHE Application - Complete Example

A comprehensive Next.js application demonstrating **Fully Homomorphic Encryption (FHE)** integration with the FHEVM SDK.

## Overview

This example showcases a complete implementation of FHE capabilities in a modern Next.js application, including:

- **Client-side encryption** using React hooks
- **Server-side API routes** for FHE operations
- **Interactive demos** for various use cases
- **Production-ready architecture** with TypeScript
- **Comprehensive utilities** for security and validation

## Architecture

### Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   └── api/                    # API routes
│       ├── fhe/
│       │   ├── route.ts        # Main FHE API
│       │   ├── encrypt/route.ts # Encryption endpoint
│       │   ├── decrypt/route.ts # Decryption endpoint
│       │   └── compute/route.ts # Computation endpoint
│       └── keys/route.ts       # Key management API
│
├── components/                 # React components
│   ├── ui/                     # Base UI components
│   │   ├── Button.tsx          # Button component
│   │   ├── Input.tsx           # Input component
│   │   └── Card.tsx            # Card component
│   ├── fhe/                    # FHE functionality
│   │   ├── FHEProvider.tsx     # Context provider
│   │   ├── EncryptionDemo.tsx  # Encryption demo
│   │   ├── ComputationDemo.tsx # Computation demo
│   │   └── KeyManager.tsx      # Key management
│   └── examples/               # Use case examples
│       ├── BankingExample.tsx  # Banking use case
│       └── MedicalExample.tsx  # Medical use case
│
├── lib/                        # Utility libraries
│   ├── fhe/                    # FHE integration
│   │   ├── client.ts           # Client-side FHE
│   │   ├── server.ts           # Server-side FHE
│   │   ├── keys.ts             # Key management
│   │   └── types.ts            # Type definitions
│   └── utils/                  # Utilities
│       ├── security.ts         # Security helpers
│       └── validation.ts       # Validation helpers
│
├── hooks/                      # Custom React hooks
│   ├── useFHE.ts               # Main FHE hook
│   ├── useEncryption.ts        # Encryption hook
│   └── useComputation.ts       # Computation hook
│
└── types/                      # TypeScript types
    ├── fhe.ts                  # FHE types
    └── api.ts                  # API types
```

## Features

### 1. Client-Side Encryption
- Interactive encryption demos
- Multiple bit size support (8, 16, 32, 64, 128, 256)
- Batch encryption capabilities
- Real-time feedback and error handling

### 2. Server-Side API Routes
- RESTful API for FHE operations
- Rate limiting and security
- Input validation and sanitization
- Comprehensive error handling

### 3. Homomorphic Computation
- Add, subtract, multiply operations
- Comparison operations
- Encrypted value manipulation
- Result encryption maintained

### 4. Use Case Examples
- **Banking**: Confidential financial transactions
- **Medical**: Secure health data management
- Easily extensible for more use cases

### 5. Key Management
- Automatic key generation
- Local storage integration
- Key expiration handling
- Security best practices

## Getting Started

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Installation

```bash
# Navigate to this directory
cd examples/nextjs-energy-market

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Configuration

Edit `.env.local`:

```env
# Required
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Optional
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_RPC_URL=https://...
NEXT_PUBLIC_CHAIN_ID=11155111
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

## API Documentation

### Encryption Endpoint

**POST** `/api/fhe/encrypt`

Encrypt a value using FHE.

```typescript
// Request
{
  "value": 1000,
  "bits": 32
}

// Response
{
  "success": true,
  "data": {
    "encrypted": "0x...",
    "originalValue": 1000,
    "bits": 32
  },
  "timestamp": 1234567890
}
```

### Decryption Endpoint

**POST** `/api/fhe/decrypt`

Decrypt an encrypted value (public decryption).

```typescript
// Request
{
  "encryptedHandle": "0x...",
  "userAddress": "0x...",
  "contractAddress": "0x..."
}

// Response
{
  "success": true,
  "data": {
    "value": 1000,
    "handle": "0x..."
  },
  "timestamp": 1234567890
}
```

### Computation Endpoint

**POST** `/api/fhe/compute`

Perform homomorphic computation on encrypted values.

```typescript
// Request
{
  "operation": "add",
  "operands": ["0x...", "0x..."],
  "bits": 32
}

// Response
{
  "success": true,
  "data": {
    "result": "0x...",
    "operation": "add",
    "operands": 2,
    "bits": 32
  },
  "timestamp": 1234567890
}
```

### Key Management Endpoint

**POST** `/api/keys`

Generate a new FHE key pair.

```typescript
// Request
{
  "type": "client"
}

// Response
{
  "success": true,
  "data": {
    "publicKey": "pk_...",
    "generated": 1234567890,
    "type": "client"
  },
  "timestamp": 1234567890
}
```

## Usage Examples

### Using Hooks in Components

```tsx
import { useEncryption } from '@/hooks/useEncryption';

function MyComponent() {
  const { encrypt, isEncrypting, error } = useEncryption();

  const handleEncrypt = async () => {
    const result = await encrypt(1000, { bits: 32 });
    if (result) {
      console.log('Encrypted:', result.encrypted);
    }
  };

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
    </button>
  );
}
```

### Using FHE Context

```tsx
import { useFHEContext } from '@/components/fhe/FHEProvider';

function MyComponent() {
  const { isReady, error, initialize } = useFHEContext();

  if (!isReady) {
    return <div>Initializing FHE...</div>;
  }

  return <div>FHE Ready!</div>;
}
```

### Direct API Calls

```typescript
// Encrypt via API
const response = await fetch('/api/fhe/encrypt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ value: 1000, bits: 32 }),
});

const data = await response.json();
console.log('Encrypted:', data.data.encrypted);
```

## Security Features

### Input Validation
- All inputs sanitized and validated
- Type checking with TypeScript
- Range validation for values and bit sizes

### Rate Limiting
- API endpoints rate-limited
- 20 requests per minute per IP
- Configurable limits

### Error Handling
- Comprehensive error messages
- Safe error exposure
- Logging for debugging

### Key Security
- Keys stored securely in localStorage
- Automatic key expiration
- No private key exposure in client

## Performance Optimization

### Client-Side
- React component memoization
- Efficient state management
- Lazy loading where applicable

### Server-Side
- API response caching
- Rate limiting to prevent abuse
- Optimized database queries (if applicable)

### Network
- Compressed responses
- Minimal payload sizes
- Efficient data serialization

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run type checking
npm run type-check
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Configure environment variables in Vercel dashboard
```

### Docker

```bash
# Build image
docker build -t nextjs-fhe-app .

# Run container
docker run -p 3000:3000 nextjs-fhe-app
```

### Environment Variables for Production

Ensure these are set in your production environment:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_RPC_URL=https://...
NODE_ENV=production
```

## Troubleshooting

### FHE Client Not Initializing

**Problem**: Client shows loading state indefinitely

**Solution**:
1. Check contract address in `.env.local`
2. Verify network connectivity
3. Check browser console for errors

### Encryption Fails

**Problem**: Encryption returns null or errors

**Solution**:
1. Ensure FHE client is initialized (`isReady === true`)
2. Validate input values are within bit size range
3. Check network connection to blockchain

### API Endpoints Return 500 Errors

**Problem**: Server-side errors

**Solution**:
1. Check server logs
2. Verify environment variables are set
3. Ensure contract is deployed and accessible

## Best Practices

1. **Always validate inputs** before encryption
2. **Check client ready state** before operations
3. **Handle errors gracefully** with user feedback
4. **Use appropriate bit sizes** for your data
5. **Implement rate limiting** in production
6. **Secure API endpoints** with authentication
7. **Cache encrypted values** when appropriate
8. **Monitor performance** and optimize as needed

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- **Documentation**: See main README
- **Issues**: Open GitHub issues
- **Discussions**: Join community discussions

## Acknowledgments

- Built with Next.js 14
- Powered by FHEVM SDK
- Uses Zama's FHE technology

---

**Built with privacy, designed for developers, powered by FHE.**
