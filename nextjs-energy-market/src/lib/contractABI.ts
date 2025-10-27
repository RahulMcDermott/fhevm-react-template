// Simplified ABI for the Private Renewable Energy Market contract
// In production, import the full ABI from compiled artifacts

export const contractABI = [
  // Energy Offer Submission
  {
    name: 'submitEnergyOffer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_encryptedAmount', type: 'bytes' },
      { name: '_encryptedPricePerKwh', type: 'bytes' },
      { name: '_energyType', type: 'uint8' },
    ],
    outputs: [],
  },

  // Energy Demand Submission
  {
    name: 'submitEnergyDemand',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_encryptedAmount', type: 'bytes' },
      { name: '_encryptedMaxPrice', type: 'bytes' },
      { name: '_energyType', type: 'uint8' },
    ],
    outputs: [],
  },

  // Get current trading period
  {
    name: 'getCurrentTradingPeriod',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },

  // Get trading period info
  {
    name: 'tradingPeriods',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'startTime', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
      { name: 'isActive', type: 'bool' },
      { name: 'settled', type: 'bool' },
    ],
  },

  // Events
  {
    name: 'EnergyOfferSubmitted',
    type: 'event',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'tradingPeriodId', type: 'uint256' },
      { indexed: true, name: 'producer', type: 'address' },
      { indexed: false, name: 'energyType', type: 'uint8' },
    ],
  },

  {
    name: 'EnergyDemandSubmitted',
    type: 'event',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'tradingPeriodId', type: 'uint256' },
      { indexed: true, name: 'consumer', type: 'address' },
      { indexed: false, name: 'energyType', type: 'uint8' },
    ],
  },
];
