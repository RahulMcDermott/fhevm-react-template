# FHEVM Universal SDK - Project Information

Complete reference guide for the FHEVM Universal SDK project.

---

## Project Overview

### Core Concept

**Confidential Renewable Energy Trading using Fully Homomorphic Encryption (FHE)**

This project demonstrates a complete privacy-preserving marketplace where:

- Energy producers submit **encrypted offers** (amounts and prices)
- Energy consumers submit **encrypted demands** (requirements and budgets)
- Smart contracts perform **encrypted computations** to match supply and demand
- **Privacy is maintained** throughout the entire process
- Settlement occurs with **complete confidentiality**

### Technology Stack

- **FHEVM**: Zama's Fully Homomorphic Encryption for Ethereum
- **Smart Contracts**: Solidity 0.8.24 with FHE operations
- **SDK**: Universal framework-agnostic TypeScript library
- **Frontend**: Next.js 14 with React Server Components
- **Blockchain**: Ethereum Sepolia Testnet
- **Deployment**: Vercel for frontend, Hardhat for contracts

---

## Live Deployments

### Application

**Live Demo**: [https://fhe-renewable-energy-market.vercel.app/](https://fhe-renewable-energy-market.vercel.app/)

**Features**:
- Interactive energy trading interface
- Real-time encryption/decryption using FHEVM SDK
- MetaMask wallet integration
- Trading period management
- Privacy-preserving operations
- Responsive design with Tailwind CSS

### Repositories

**SDK Repository**: [https://github.com/RahulMcDermott/fhevm-react-template](https://github.com/RahulMcDermott/fhevm-react-template)

**Contract Repository**: [https://github.com/RahulMcDermott/FHERenewableEnergyMarket](https://github.com/RahulMcDermott/FHERenewableEnergyMarket)

### Smart Contract

**Network**: Sepolia Testnet
**Chain ID**: 11155111
**Contract Repository**: [FHE Renewable Energy Market](https://github.com/RahulMcDermott/FHERenewableEnergyMarket)

---

## Demo Video

### Accessing the Demo

**File**: `demo.mp4` (located in repository root)

**Important**: The video file must be **downloaded to view** - it cannot be played directly in the browser.

**To watch**:
1. Navigate to the repository root
2. Download `demo.mp4`
3. Open with your video player

**Content**:
- SDK installation and setup (< 2 minutes)
- Framework integration examples
- Live application walkthrough
- Encryption/decryption demonstration
- Contract deployment to Sepolia
- Trading simulation
- Architecture and design decisions

---

## Project Structure

### Monorepo Organization

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # Universal SDK package
│
├── examples/
│   ├── nextjs-energy-market/   # Next.js application (LIVE)
│   └── renewable-energy-market/ # Smart contracts
│
├── docs/                       # Documentation
├── demo.mp4                    # Demo video
└── README.md                   # Main documentation
```

### SDK Package

**Location**: `packages/fhevm-sdk/`

**Structure**:
- `src/core/` - Framework-agnostic core
- `src/react/` - React hooks and provider
- `src/vue/` - Vue composables
- `src/index.ts` - Main exports

**Features**:
- Framework agnostic (works with any JavaScript framework)
- Wagmi-like API (familiar to web3 developers)
- Full TypeScript support
- Comprehensive error handling
- Production-ready patterns

### Next.js Application

**Location**: `examples/nextjs-energy-market/`

**Live URL**: [https://fhe-renewable-energy-market.vercel.app/](https://fhe-renewable-energy-market.vercel.app/)

**Features**:
- Next.js 14 with App Router
- FHEVM SDK integration
- Interactive UI with Tailwind CSS
- Real-time encryption/decryption
- Wallet integration
- Trading management

**Key Files**:
- `src/app/providers.tsx` - SDK Provider setup
- `src/components/EnergyOfferForm.tsx` - Encryption demo
- `src/components/EnergyDemandForm.tsx` - More encryption
- `src/components/SDKStatus.tsx` - SDK status indicator

### Smart Contract Example

**Location**: `examples/renewable-energy-market/`

**Repository**: [https://github.com/RahulMcDermott/FHERenewableEnergyMarket](https://github.com/RahulMcDermott/FHERenewableEnergyMarket)

**Features**:
- Production-ready smart contracts
- 45+ comprehensive tests
- SDK-integrated scripts
- Automated deployment
- Etherscan verification

**Key Files**:
- `contracts/PrivateRenewableEnergyMarket.sol` - Main contract
- `scripts/deploy.js` - Deployment
- `scripts/interact-with-sdk.js` - SDK integration demo
- `test/*.test.js` - Comprehensive tests

---

## Getting Started

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
MetaMask or compatible wallet
```

### Try the Live Demo

Visit: [https://fhe-renewable-energy-market.vercel.app/](https://fhe-renewable-energy-market.vercel.app/)

1. Connect your MetaMask wallet
2. Switch to Sepolia network
3. Submit an energy offer or demand
4. Watch the SDK encrypt your data
5. See privacy-preserving operations in action

### Run Locally

#### Next.js Application

```bash
cd examples/nextjs-energy-market
npm install
npm run dev
# Open http://localhost:3000
```

#### Smart Contracts

```bash
cd examples/renewable-energy-market
npm install
npm run compile
npm test
npm run deploy
```

---

## Key Features

### SDK Features

✅ **Framework Agnostic** - Works with React, Vue, Next.js, Node.js
✅ **Wagmi-like API** - Familiar patterns for web3 developers
✅ **TypeScript First** - Full type safety
✅ **< 10 Lines Setup** - Minimal boilerplate
✅ **Production Ready** - Error handling, retry logic, testing
✅ **Well Documented** - Comprehensive guides and examples

### Application Features

✅ **Privacy-First** - All sensitive data encrypted with FHE
✅ **Real-time Trading** - Interactive marketplace interface
✅ **Multiple Energy Types** - Solar, Wind, Hydro, Biomass
✅ **Wallet Integration** - Seamless MetaMask connection
✅ **Trading Periods** - Time-bound trading windows
✅ **Carbon Credits** - Environmental impact tracking

---

## Documentation

### Main Documentation

- **README.md** - Complete SDK documentation
- **CONTRIBUTING.md** - Contribution guidelines
- **SETUP.md** - Setup and installation guide
- **SUBMISSION.md** - Competition submission details
- **DELIVERABLES.md** - Deliverables checklist

### Technical Documentation

- **docs/ARCHITECTURE.md** - System architecture
- **examples/*/README.md** - Example-specific guides

### Code Examples

All examples demonstrate SDK integration:

**React/Next.js**:
```tsx
import { useFhevm } from '@fhevm/sdk/react';

const fhevm = useFhevm({ network: 'sepolia', contractAddress: '0x...' });
const encrypted = await fhevm.encrypt(1000);
```

**Vue**:
```vue
<script setup>
import { useFhevm } from '@fhevm/sdk/vue';
const fhevm = useFhevm({ network: 'sepolia', contractAddress: '0x...' });
</script>
```

**Node.js**:
```javascript
const { createFhevmClient, encrypt } = require('@fhevm/sdk');
const client = await createFhevmClient({ network: 'sepolia', ... });
const encrypted = await encrypt(client, 1000);
```

---

## Community & Support

### GitHub

- **SDK Repository**: [fhevm-react-template](https://github.com/RahulMcDermott/fhevm-react-template)
- **Contract Repository**: [FHERenewableEnergyMarket](https://github.com/RahulMcDermott/FHERenewableEnergyMarket)
- **Issues**: [Report bugs or request features](https://github.com/RahulMcDermott/fhevm-react-template/issues)
- **Discussions**: [Ask questions](https://github.com/RahulMcDermott/fhevm-react-template/discussions)

### Zama Community

- **Documentation**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **Discord**: Join the Zama community
- **Twitter**: [@zama_fhe](https://twitter.com/zama_fhe)

### Get Help

1. Check the [documentation](README.md)
2. Try the [live demo](https://fhe-renewable-energy-market.vercel.app/)
3. Review [example code](examples/)
4. Search [GitHub issues](https://github.com/RahulMcDermott/fhevm-react-template/issues)
5. Open a [new issue](https://github.com/RahulMcDermott/fhevm-react-template/issues/new)

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

**Quick Links**:
- [Contribution Guide](CONTRIBUTING.md)
- [GitHub Repository](https://github.com/RahulMcDermott/fhevm-react-template)
- [Open Issues](https://github.com/RahulMcDermott/fhevm-react-template/issues)

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Quick Reference

### Important URLs

| Resource | URL |
|----------|-----|
| Live Demo | https://fhe-renewable-energy-market.vercel.app/ |
| SDK Repository | https://github.com/RahulMcDermott/fhevm-react-template |
| Contract Repository | https://github.com/RahulMcDermott/FHERenewableEnergyMarket |
| Issues | https://github.com/RahulMcDermott/fhevm-react-template/issues |
| Discussions | https://github.com/RahulMcDermott/fhevm-react-template/discussions |
| Zama Docs | https://docs.zama.ai/fhevm |

### Commands

| Task | Command |
|------|---------|
| Install all | `npm run install:all` |
| Build SDK | `npm run build:sdk` |
| Test all | `npm run test:all` |
| Run Next.js | `cd examples/nextjs-energy-market && npm run dev` |
| Deploy contract | `cd examples/renewable-energy-market && npm run deploy` |

---

**Built with privacy, powered by FHEVM, deployed on Vercel.**

**Try it live**: [https://fhe-renewable-energy-market.vercel.app/](https://fhe-renewable-energy-market.vercel.app/)
