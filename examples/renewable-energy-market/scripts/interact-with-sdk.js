/**
 * Interaction Script with FHEVM SDK Integration
 *
 * This script demonstrates how to use the FHEVM SDK in a Node.js environment
 * to interact with the Private Renewable Energy Market contract
 */

const { ethers } = require('ethers');
const { createFhevmClient, encrypt32 } = require('@fhevm/sdk');
require('dotenv').config();

// Contract ABI (simplified for demo)
const CONTRACT_ABI = require('../artifacts/contracts/PrivateRenewableEnergyMarket.sol/PrivateRenewableEnergyMarket.json').abi;

// Configuration
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org';

async function main() {
  console.log('='.repeat(60));
  console.log('Private Energy Market - SDK Integration Demo');
  console.log('='.repeat(60));

  // Step 1: Setup Ethereum provider and signer
  console.log('\n📡 Connecting to Sepolia...');
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const address = await signer.getAddress();
  console.log(`✓ Connected with address: ${address}`);

  // Step 2: Initialize FHEVM SDK client
  console.log('\n🔐 Initializing FHEVM SDK...');
  const fhevmClient = await createFhevmClient({
    network: 'sepolia',
    contractAddress: CONTRACT_ADDRESS,
    rpcUrl: RPC_URL,
  });
  console.log('✓ FHEVM SDK initialized successfully');

  // Step 3: Connect to contract
  console.log('\n📄 Connecting to contract...');
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  console.log(`✓ Contract connected at: ${CONTRACT_ADDRESS}`);

  // Step 4: Get current trading period
  console.log('\n📊 Fetching trading period info...');
  const currentPeriod = await contract.getCurrentTradingPeriod();
  const periodInfo = await contract.tradingPeriods(currentPeriod);
  console.log(`✓ Current Period: ${currentPeriod}`);
  console.log(`  - Active: ${periodInfo.isActive}`);
  console.log(`  - Start Time: ${new Date(Number(periodInfo.startTime) * 1000).toISOString()}`);
  console.log(`  - End Time: ${new Date(Number(periodInfo.endTime) * 1000).toISOString()}`);

  if (!periodInfo.isActive) {
    console.log('\n⚠️  Trading period is not active. Cannot submit offers/demands.');
    return;
  }

  // Example 1: Submit Energy Offer using SDK
  console.log('\n' + '='.repeat(60));
  console.log('Example 1: Submit Confidential Energy Offer');
  console.log('='.repeat(60));

  const offerAmount = 1000; // 1000 kWh
  const offerPrice = 50;    // 50 units per kWh
  const energyType = 1;     // Solar

  console.log(`\n📝 Offer Details (plaintext):`);
  console.log(`  - Amount: ${offerAmount} kWh`);
  console.log(`  - Price: ${offerPrice} units/kWh`);
  console.log(`  - Type: Solar (${energyType})`);

  console.log('\n🔒 Encrypting offer data using FHEVM SDK...');
  const encryptedAmount = await encrypt32(fhevmClient, offerAmount);
  const encryptedPrice = await encrypt32(fhevmClient, offerPrice);
  console.log('✓ Encryption complete');
  console.log(`  - Encrypted Amount: ${encryptedAmount.length} bytes`);
  console.log(`  - Encrypted Price: ${encryptedPrice.length} bytes`);

  console.log('\n📤 Submitting encrypted offer to blockchain...');
  const offerTx = await contract.submitEnergyOffer(
    encryptedAmount,
    encryptedPrice,
    energyType
  );
  console.log(`  Transaction Hash: ${offerTx.hash}`);

  console.log('⏳ Waiting for confirmation...');
  const offerReceipt = await offerTx.wait();
  console.log(`✓ Offer submitted successfully!`);
  console.log(`  Block: ${offerReceipt.blockNumber}`);
  console.log(`  Gas Used: ${offerReceipt.gasUsed.toString()}`);

  // Example 2: Submit Energy Demand using SDK
  console.log('\n' + '='.repeat(60));
  console.log('Example 2: Submit Confidential Energy Demand');
  console.log('='.repeat(60));

  const demandAmount = 500;   // 500 kWh
  const maxPrice = 60;        // Maximum 60 units per kWh
  const preferredType = 1;    // Prefer Solar

  console.log(`\n📝 Demand Details (plaintext):`);
  console.log(`  - Amount: ${demandAmount} kWh`);
  console.log(`  - Max Price: ${maxPrice} units/kWh`);
  console.log(`  - Preferred Type: Solar (${preferredType})`);

  console.log('\n🔒 Encrypting demand data using FHEVM SDK...');
  const encryptedDemandAmount = await encrypt32(fhevmClient, demandAmount);
  const encryptedMaxPrice = await encrypt32(fhevmClient, maxPrice);
  console.log('✓ Encryption complete');
  console.log(`  - Encrypted Amount: ${encryptedDemandAmount.length} bytes`);
  console.log(`  - Encrypted Max Price: ${encryptedMaxPrice.length} bytes`);

  console.log('\n📤 Submitting encrypted demand to blockchain...');
  const demandTx = await contract.submitEnergyDemand(
    encryptedDemandAmount,
    encryptedMaxPrice,
    preferredType
  );
  console.log(`  Transaction Hash: ${demandTx.hash}`);

  console.log('⏳ Waiting for confirmation...');
  const demandReceipt = await demandTx.wait();
  console.log(`✓ Demand submitted successfully!`);
  console.log(`  Block: ${demandReceipt.blockNumber}`);
  console.log(`  Gas Used: ${demandReceipt.gasUsed.toString()}`);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  console.log('\n✓ SDK Integration Successful!');
  console.log('\nKey Points:');
  console.log('  1. ✓ FHEVM SDK initialized for Node.js environment');
  console.log('  2. ✓ Values encrypted using SDK encrypt32() function');
  console.log('  3. ✓ Encrypted data submitted to smart contract');
  console.log('  4. ✓ Privacy maintained - no plaintext on-chain');
  console.log('\nBenefits of SDK:');
  console.log('  • Consistent API across frameworks (Node.js, React, Vue)');
  console.log('  • Automatic error handling');
  console.log('  • Type safety with TypeScript');
  console.log('  • Production-ready patterns');
  console.log('\n' + '='.repeat(60));
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
