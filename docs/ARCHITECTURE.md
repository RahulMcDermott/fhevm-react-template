# System Architecture

## Private Renewable Energy Market - Technical Architecture

This document provides a comprehensive overview of the system architecture, component interactions, and technical design decisions.

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Smart Contract Architecture](#smart-contract-architecture)
3. [Privacy Layer](#privacy-layer)
4. [Data Flow](#data-flow)
5. [Security Architecture](#security-architecture)
6. [Gas Optimization Strategy](#gas-optimization-strategy)
7. [Deployment Architecture](#deployment-architecture)

---

## High-Level Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Layer                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Energy Producers              Energy Consumers                 │
│  ├─ Solar Farms               ├─ Residential Users              │
│  ├─ Wind Operators            ├─ Commercial Buildings           │
│  ├─ Hydro Plants              ├─ Industrial Facilities          │
│  └─ Biomass Facilities        └─ Data Centers                   │
│                                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Application Layer                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Web Interface                 API Layer                         │
│  ├─ Offer Submission          ├─ ethers.js Integration          │
│  ├─ Demand Submission         ├─ FHEVM Client                   │
│  ├─ Trading Dashboard         ├─ Transaction Management         │
│  └─ Analytics                 └─ Event Monitoring               │
│                                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Privacy Layer (FHEVM)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Encryption Services           Computation Services              │
│  ├─ euint32 Encryption        ├─ Encrypted Addition             │
│  ├─ euint64 Encryption        ├─ Encrypted Comparison           │
│  ├─ ebool Encryption          ├─ Encrypted Multiplication       │
│  └─ Key Management            └─ Encrypted Conditional Logic    │
│                                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Smart Contract Layer                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PrivateRenewableEnergyMarket.sol                               │
│  ├─ Trading Period Management                                   │
│  ├─ Confidential Offer Management                               │
│  ├─ Confidential Demand Management                              │
│  ├─ Encrypted Settlement Logic                                  │
│  ├─ Carbon Credit System                                        │
│  └─ Emergency Controls                                          │
│                                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Blockchain Layer                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Ethereum Network              Storage                           │
│  ├─ Sepolia Testnet           ├─ On-chain State                │
│  ├─ Mainnet (Future)          ├─ Event Logs                     │
│  ├─ Transaction Pool          └─ Encrypted Data                 │
│  └─ Block Validation                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Smart Contract Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────────┐
│         PrivateRenewableEnergyMarket Contract                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    State Variables                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Trading Period State                                            │
│  ├─ currentTradingPeriod (uint256)                              │
│  ├─ tradingPeriods (mapping)                                    │
│  └─ TradingPeriod struct                                        │
│      ├─ startTime (uint256)                                     │
│      ├─ endTime (uint256)                                       │
│      ├─ isActive (bool)                                         │
│      └─ settled (bool)                                          │
│                                                                  │
│  Energy Offer State                                              │
│  ├─ energyOffers (mapping: period → producer → EnergyOffer)    │
│  └─ EnergyOffer struct                                          │
│      ├─ encryptedAmount (euint32)                              │
│      ├─ encryptedPricePerKwh (euint32)                         │
│      ├─ energyType (uint8)                                     │
│      └─ exists (bool)                                           │
│                                                                  │
│  Energy Demand State                                             │
│  ├─ energyDemands (mapping: period → consumer → EnergyDemand)  │
│  └─ EnergyDemand struct                                         │
│      ├─ encryptedAmount (euint32)                              │
│      ├─ encryptedMaxPrice (euint32)                            │
│      ├─ energyType (uint8)                                     │
│      └─ exists (bool)                                           │
│                                                                  │
│  Carbon Credit State                                             │
│  ├─ carbonCredits (mapping: address → uint256)                 │
│  └─ totalCarbonCredits (uint256)                                │
│                                                                  │
│  Access Control                                                  │
│  ├─ owner (address)                                             │
│  ├─ pauser (address)                                            │
│  └─ Role-based permissions                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Core Functions                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Trading Period Management                                       │
│  ├─ startTradingPeriod(duration) → uint256                     │
│  │   ├─ Validate caller (onlyOwner)                            │
│  │   ├─ Create new trading period                              │
│  │   ├─ Set timestamps                                         │
│  │   └─ Emit TradingPeriodStarted event                        │
│  │                                                              │
│  ├─ endTradingPeriod() → void                                  │
│  │   ├─ Validate period active                                 │
│  │   ├─ Check end time reached                                 │
│  │   ├─ Deactivate period                                      │
│  │   └─ Emit TradingPeriodEnded event                          │
│  │                                                              │
│  └─ processTradingPeriod() → void                              │
│      ├─ Validate period ended                                   │
│      ├─ Perform encrypted matching                              │
│      ├─ Calculate carbon credits                                │
│      ├─ Mark as settled                                         │
│      └─ Emit TradingPeriodProcessed event                       │
│                                                                  │
│  Energy Offer Management                                         │
│  ├─ submitEnergyOffer(euint32, euint32, uint8) → void          │
│  │   ├─ Validate trading period active                         │
│  │   ├─ Validate energy type (1-4)                             │
│  │   ├─ Store encrypted offer                                  │
│  │   └─ Emit EnergyOfferSubmitted event                        │
│  │                                                              │
│  └─ getEncryptedOffer(period, producer) → (euint32, euint32)   │
│      ├─ Validate offer exists                                   │
│      └─ Return encrypted values                                 │
│                                                                  │
│  Energy Demand Management                                        │
│  ├─ submitEnergyDemand(euint32, euint32, uint8) → void         │
│  │   ├─ Validate trading period active                         │
│  │   ├─ Validate energy type                                   │
│  │   ├─ Store encrypted demand                                 │
│  │   └─ Emit EnergyDemandSubmitted event                       │
│  │                                                              │
│  └─ getEncryptedDemand(period, consumer) → (euint32, euint32)  │
│      ├─ Validate demand exists                                  │
│      └─ Return encrypted values                                 │
│                                                                  │
│  Emergency Controls                                              │
│  ├─ pauseTrading() → void                                       │
│  │   ├─ Validate caller (onlyPauser)                           │
│  │   ├─ Deactivate current period                              │
│  │   └─ Emit TradingPaused event                               │
│  │                                                              │
│  └─ resumeTrading() → void                                      │
│      ├─ Validate caller (onlyOwner)                             │
│      ├─ Reactivate period                                       │
│      └─ Emit TradingResumed event                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Privacy Layer

### FHE Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FHEVM Privacy Stack                           │
└─────────────────────────────────────────────────────────────────┘

Client Side                         Smart Contract Side
┌──────────────┐                   ┌──────────────────┐
│              │                   │                  │
│  Plaintext   │                   │  Encrypted State │
│  Values      │                   │                  │
│  ├─ 1000 kWh │                   │  euint32 values  │
│  └─ 50 units │                   │  stored on-chain │
│              │                   │                  │
└──────┬───────┘                   └────────▲─────────┘
       │                                    │
       │ 1. Encrypt                         │
       │    using FHEVM                     │
       │    client library                  │
       ▼                                    │
┌──────────────┐                           │
│              │                           │
│  Encrypted   │     2. Submit via         │
│  Input       │        Transaction        │
│              ├───────────────────────────┘
│  euint32(X)  │
│              │
└──────────────┘

                    3. On-chain Processing
                    ┌────────────────────┐
                    │                    │
                    │ Encrypted Compute  │
                    │ ├─ Add: E(a)+E(b) │
                    │ ├─ Mul: E(a)*E(b) │
                    │ ├─ Cmp: E(a)<E(b) │
                    │ └─ All on E(x)     │
                    │   (never decrypt!) │
                    │                    │
                    └────────┬───────────┘
                             │
                             ▼
                    ┌────────────────────┐
                    │                    │
                    │ Result Storage     │
                    │ (still encrypted)  │
                    │                    │
                    └────────────────────┘
```

### Encryption Types and Usage

| Type | Size | Use Case | Example |
|------|------|----------|---------|
| `euint32` | 32-bit | Energy amounts, prices | 1000 kWh, 50 units/kWh |
| `euint64` | 64-bit | Large calculations, totals | Total energy traded |
| `ebool` | 1-bit | Matching results, flags | Offer matched: true/false |

### Privacy Guarantees

1. **Input Privacy**: Offers and demands never stored in plaintext
2. **Computation Privacy**: All matching done on encrypted values
3. **Output Privacy**: Results remain encrypted unless explicitly decrypted by authorized party
4. **Network Privacy**: Even miners/validators cannot see actual values

---

## Data Flow

### Complete Trading Cycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    Step 1: Trading Period Start                  │
└─────────────────────────────────────────────────────────────────┘

Owner → startTradingPeriod(86400)
        │
        ├─ Create TradingPeriod struct
        ├─ Set startTime = block.timestamp
        ├─ Set endTime = startTime + 86400
        ├─ Set isActive = true
        └─ Emit event ✓

┌─────────────────────────────────────────────────────────────────┐
│                Step 2: Offers & Demands Submission               │
└─────────────────────────────────────────────────────────────────┘

Producer1 → submitEnergyOffer(E(1000), E(50), 1)
            │
            ├─ Validate: period.isActive == true ✓
            ├─ Validate: energyType in [1,4] ✓
            ├─ Store: offers[period][producer1] = {
            │           encryptedAmount: E(1000),
            │           encryptedPrice: E(50),
            │           energyType: 1,
            │           exists: true
            │         }
            └─ Emit EnergyOfferSubmitted ✓

Consumer1 → submitEnergyDemand(E(500), E(60), 1)
            │
            ├─ Validate: period.isActive == true ✓
            ├─ Validate: energyType in [1,4] ✓
            ├─ Store: demands[period][consumer1] = {
            │           encryptedAmount: E(500),
            │           encryptedMaxPrice: E(60),
            │           energyType: 1,
            │           exists: true
            │         }
            └─ Emit EnergyDemandSubmitted ✓

┌─────────────────────────────────────────────────────────────────┐
│                  Step 3: Trading Period End                      │
└─────────────────────────────────────────────────────────────────┘

Owner → endTradingPeriod()
        │
        ├─ Validate: block.timestamp >= period.endTime ✓
        ├─ Set: period.isActive = false
        └─ Emit TradingPeriodEnded ✓

┌─────────────────────────────────────────────────────────────────┐
│                  Step 4: Settlement Processing                   │
└─────────────────────────────────────────────────────────────────┘

Owner → processTradingPeriod()
        │
        ├─ Validate: period.isActive == false ✓
        ├─ Validate: period.settled == false ✓
        │
        ├─ For each (producer, consumer) pair:
        │   │
        │   ├─ Load: offerPrice = E(50)
        │   ├─ Load: demandMaxPrice = E(60)
        │   ├─ Compare: priceMatch = (offerPrice <= demandMaxPrice)
        │   │          = E(50) <= E(60) = E(true)  [FHE compare]
        │   │
        │   ├─ Load: offerAmount = E(1000)
        │   ├─ Load: demandAmount = E(500)
        │   ├─ Calculate: matchAmount = min(offerAmount, demandAmount)
        │   │             = min(E(1000), E(500)) = E(500)  [FHE min]
        │   │
        │   ├─ If priceMatch == true:
        │   │   ├─ Trade E(500) kWh
        │   │   ├─ Calculate carbon: E(500) * carbonFactor
        │   │   └─ Emit TradeExecuted(E(500), E(price))
        │   │
        │   └─ Continue to next pair...
        │
        ├─ Set: period.settled = true
        └─ Emit TradingPeriodProcessed ✓
```

---

## Security Architecture

### Multi-Layer Security Model

```
┌─────────────────────────────────────────────────────────────────┐
│                    Layer 1: Access Control                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Role-Based Permissions                                          │
│  ├─ Owner: Start/end periods, process settlement                │
│  ├─ Pauser: Emergency pause functionality                       │
│  ├─ Producers: Submit offers only                               │
│  └─ Consumers: Submit demands only                              │
│                                                                  │
│  Modifiers                                                       │
│  ├─ onlyOwner: Critical operations                              │
│  ├─ onlyPauser: Emergency controls                              │
│  └─ State checks: Active period validation                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Layer 2: Input Validation                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Parameter Validation                                            │
│  ├─ Energy type: must be 1-4                                    │
│  ├─ Amounts: must be > 0                                        │
│  ├─ Prices: must be > 0                                         │
│  └─ Addresses: must be non-zero                                 │
│                                                                  │
│  State Validation                                                │
│  ├─ Trading period must be active                               │
│  ├─ Trading period must exist                                   │
│  ├─ Settlement not already done                                 │
│  └─ Time boundaries respected                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Layer 3: DoS Protection                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Gas Limits                                                      │
│  ├─ Bounded loops (no unbounded iteration)                      │
│  ├─ Batch processing limits                                     │
│  └─ Maximum transaction gas protection                          │
│                                                                  │
│  Rate Limiting                                                   │
│  ├─ One offer per producer per period                           │
│  ├─ One demand per consumer per period                          │
│  └─ Configurable rate limits (environment)                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Layer 4: Privacy Protection                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Data Encryption                                                 │
│  ├─ All sensitive values encrypted (FHE)                        │
│  ├─ No plaintext storage                                        │
│  └─ Encrypted computation only                                  │
│                                                                  │
│  Access Control                                                  │
│  ├─ Only authorized parties decrypt                             │
│  ├─ Event encryption for privacy                                │
│  └─ View function access control                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Layer 5: Emergency Controls                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Circuit Breaker                                                 │
│  ├─ pauseTrading(): Immediate halt                              │
│  ├─ resumeTrading(): Controlled restart                         │
│  └─ Pauser role separation                                      │
│                                                                  │
│  Recovery Mechanisms                                             │
│  ├─ Time-locked operations                                      │
│  ├─ State rollback capability                                   │
│  └─ Manual intervention points                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Gas Optimization Strategy

### Storage Optimization

```solidity
// ✅ Optimized: Struct packing (10 bytes in one 32-byte slot)
struct EnergyOffer {
    uint32 amount;       // 4 bytes
    uint32 price;        // 4 bytes
    uint8 energyType;    // 1 byte
    bool exists;         // 1 byte
    // Total: 10 bytes → 1 storage slot
}

// ❌ Not optimized: Each field uses full 32 bytes
struct EnergyOffer {
    uint256 amount;      // 32 bytes
    uint256 price;       // 32 bytes
    uint256 energyType;  // 32 bytes
    bool exists;         // 32 bytes
    // Total: 128 bytes → 4 storage slots (4x cost!)
}
```

### Computation Optimization

```solidity
// ✅ Optimized: Cache array length
function processOffers() internal {
    uint256 length = offerArray.length;  // SLOAD once
    for (uint256 i = 0; i < length; i++) {
        // Process...
    }
}

// ❌ Not optimized: SLOAD on every iteration
function processOffers() internal {
    for (uint256 i = 0; i < offerArray.length; i++) {  // SLOAD every loop!
        // Process...
    }
}
```

### Memory vs Storage

```solidity
// ✅ Optimized: Use memory for temporary data
function calculate() public view returns (uint256) {
    uint256[] memory temp = new uint256[](10);
    // Work with temp (cheap memory operations)
    return temp[0];
}

// ❌ Not optimized: Use storage unnecessarily
uint256[] tempStorage;  // State variable
function calculate() public returns (uint256) {
    // Work with tempStorage (expensive storage operations)
    delete tempStorage;  // Even more gas!
    return 0;
}
```

---

## Deployment Architecture

### Multi-Network Strategy

```
Development          Testing             Production
    ↓                   ↓                    ↓
┌─────────┐      ┌──────────┐         ┌──────────┐
│ Hardhat │  →   │ Sepolia  │   →     │ Mainnet  │
│ Network │      │ Testnet  │         │ Ethereum │
└─────────┘      └──────────┘         └──────────┘
    │                 │                     │
    │                 │                     │
Local Testing    Integration          Production
Fast iteration   Real network         Real value
Free gas         Test ETH             Actual ETH
No latency       12-15s blocks        12-15s blocks
```

### Deployment Pipeline

```
1. Local Development
   ├─ Write contract code
   ├─ Unit testing (npm test)
   ├─ Gas optimization
   └─ Coverage check

2. Local Deployment
   ├─ Start Hardhat node
   ├─ Deploy locally (npm run deploy:local)
   ├─ Integration testing
   └─ Simulation (npm run simulate)

3. Testnet Deployment
   ├─ Configure .env (Sepolia RPC, private key)
   ├─ Deploy to Sepolia (npm run deploy)
   ├─ Verify on Etherscan (npm run verify)
   └─ Integration testing on testnet

4. Mainnet Deployment
   ├─ External security audit
   ├─ Final testing on Sepolia
   ├─ Deploy to mainnet
   ├─ Verify on Etherscan
   └─ Monitor and maintain
```

---

## Performance Considerations

### Transaction Throughput

- **Offers per period**: 100+ without gas issues
- **Demands per period**: 100+ without gas issues
- **Settlement time**: Linear O(n*m) where n=offers, m=demands
- **Optimization**: Batch processing for large-scale operations

### Gas Costs

| Operation | Estimated Gas | Notes |
|-----------|--------------|-------|
| Deploy | 2,800,000 | One-time cost |
| Start Period | 150,000 | Per period |
| Submit Offer | 250,000 | FHE encryption overhead |
| Submit Demand | 250,000 | FHE encryption overhead |
| Settlement | Variable | Depends on matches |

### Scalability

- **Horizontal**: Multiple trading periods can run sequentially
- **Vertical**: Batch processing for high-volume scenarios
- **Future**: Layer 2 scaling solutions (Optimism, Arbitrum)

---

## Monitoring and Observability

### Event Emissions

All critical operations emit events for monitoring:

```solidity
event TradingPeriodStarted(uint256 periodId, uint256 startTime, uint256 endTime);
event EnergyOfferSubmitted(uint256 periodId, address producer, uint8 energyType);
event EnergyDemandSubmitted(uint256 periodId, address consumer, uint8 energyType);
event TradingPeriodProcessed(uint256 periodId, uint256 timestamp);
event TradingPaused(uint256 periodId);
event TradingResumed(uint256 periodId);
```

### Off-Chain Monitoring

- **Etherscan**: Contract verification and transaction history
- **Event listeners**: Real-time monitoring via ethers.js
- **Analytics**: Gas usage, trading volume, carbon credits
- **Alerts**: Emergency pause detection, unusual activity

---

**Architecture designed for privacy, optimized for efficiency, built for scale.**
