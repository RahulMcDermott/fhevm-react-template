const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("=".repeat(60));
  console.log("Private Renewable Energy Market - Simulation Script");
  console.log("=".repeat(60));

  const network = await hre.ethers.provider.getNetwork();
  console.log(`\nNetwork: ${network.name} (Chain ID: ${network.chainId})`);

  if (network.name !== "localhost" && network.chainId !== 31337n) {
    console.log("\n⚠️  Warning: This simulation is designed for localhost network");
    console.log("Please run 'npm run node' first, then 'npm run simulate' in another terminal");
    return;
  }

  // Get signers - we'll use multiple accounts for simulation
  const [owner, producer1, producer2, consumer1, consumer2] = await hre.ethers.getSigners();

  console.log("\n" + "-".repeat(60));
  console.log("Simulation Accounts:");
  console.log("-".repeat(60));
  console.log(`Owner:     ${owner.address}`);
  console.log(`Producer1: ${producer1.address}`);
  console.log(`Producer2: ${producer2.address}`);
  console.log(`Consumer1: ${consumer1.address}`);
  console.log(`Consumer2: ${consumer2.address}`);
  console.log("-".repeat(60));

  // Deploy contract
  console.log("\n📦 Deploying PrivateRenewableEnergyMarket contract...");
  const PrivateRenewableEnergyMarket = await hre.ethers.getContractFactory(
    "PrivateRenewableEnergyMarket"
  );
  const contract = await PrivateRenewableEnergyMarket.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`✅ Contract deployed at: ${contractAddress}`);

  // Scenario 1: Start Trading Period
  console.log("\n" + "=".repeat(60));
  console.log("Scenario 1: Starting Trading Period");
  console.log("=".repeat(60));

  console.log("\n⏳ Starting new trading period...");
  let tx = await contract.connect(owner).startTradingPeriod();
  await tx.wait();
  console.log("✅ Trading period started");

  const periodInfo = await contract.getCurrentTradingPeriodInfo();
  console.log(`\nPeriod Number: ${periodInfo[0]}`);
  console.log(`Start Time: ${new Date(Number(periodInfo[1]) * 1000).toLocaleString()}`);
  console.log(`End Time: ${new Date(Number(periodInfo[2]) * 1000).toLocaleString()}`);
  console.log(`Is Active: ${periodInfo[3]}`);

  // Scenario 2: Producers Submit Energy Offers
  console.log("\n" + "=".repeat(60));
  console.log("Scenario 2: Producers Submit Energy Offers");
  console.log("=".repeat(60));

  const energyTypes = { 1: "Solar", 2: "Wind", 3: "Hydro", 4: "Geothermal" };

  // Producer 1 offers solar energy
  console.log("\n⚡ Producer 1 submitting Solar energy offer...");
  console.log("   Amount: 1000 kWh, Price: 50 wei/kWh");
  tx = await contract.connect(producer1).submitEnergyOffer(1000, 50, 1);
  let receipt = await tx.wait();
  let event = receipt.logs.find(
    (log) => log.fragment && log.fragment.name === "EnergyOfferSubmitted"
  );
  if (event) {
    console.log(`✅ Offer submitted - ID: ${event.args[1]}, Type: ${energyTypes[event.args[2]]}`);
  }

  await sleep(1000);

  // Producer 2 offers wind energy
  console.log("\n💨 Producer 2 submitting Wind energy offer...");
  console.log("   Amount: 1500 kWh, Price: 45 wei/kWh");
  tx = await contract.connect(producer2).submitEnergyOffer(1500, 45, 2);
  receipt = await tx.wait();
  event = receipt.logs.find(
    (log) => log.fragment && log.fragment.name === "EnergyOfferSubmitted"
  );
  if (event) {
    console.log(`✅ Offer submitted - ID: ${event.args[1]}, Type: ${energyTypes[event.args[2]]}`);
  }

  await sleep(1000);

  // Producer 1 offers additional hydro energy
  console.log("\n🌊 Producer 1 submitting Hydro energy offer...");
  console.log("   Amount: 800 kWh, Price: 55 wei/kWh");
  tx = await contract.connect(producer1).submitEnergyOffer(800, 55, 3);
  receipt = await tx.wait();
  event = receipt.logs.find(
    (log) => log.fragment && log.fragment.name === "EnergyOfferSubmitted"
  );
  if (event) {
    console.log(`✅ Offer submitted - ID: ${event.args[1]}, Type: ${energyTypes[event.args[2]]}`);
  }

  // Scenario 3: Consumers Submit Energy Demands
  console.log("\n" + "=".repeat(60));
  console.log("Scenario 3: Consumers Submit Energy Demands");
  console.log("=".repeat(60));

  await sleep(1000);

  // Consumer 1 submits demand
  console.log("\n🏭 Consumer 1 submitting energy demand...");
  console.log("   Amount: 1200 kWh, Max Price: 60 wei/kWh");
  tx = await contract.connect(consumer1).submitEnergyDemand(1200, 60);
  receipt = await tx.wait();
  event = receipt.logs.find(
    (log) => log.fragment && log.fragment.name === "EnergyDemandSubmitted"
  );
  if (event) {
    console.log(`✅ Demand submitted - ID: ${event.args[1]}`);
  }

  await sleep(1000);

  // Consumer 2 submits demand
  console.log("\n🏢 Consumer 2 submitting energy demand...");
  console.log("   Amount: 900 kWh, Max Price: 50 wei/kWh");
  tx = await contract.connect(consumer2).submitEnergyDemand(900, 50);
  receipt = await tx.wait();
  event = receipt.logs.find(
    (log) => log.fragment && log.fragment.name === "EnergyDemandSubmitted"
  );
  if (event) {
    console.log(`✅ Demand submitted - ID: ${event.args[1]}`);
  }

  // Scenario 4: View Offers and Demands Summary
  console.log("\n" + "=".repeat(60));
  console.log("Scenario 4: Trading Summary");
  console.log("=".repeat(60));

  const producer1Offers = await contract.getProducerOfferCount(producer1.address);
  const producer2Offers = await contract.getProducerOfferCount(producer2.address);
  const consumer1Demands = await contract.getConsumerDemandCount(consumer1.address);
  const consumer2Demands = await contract.getConsumerDemandCount(consumer2.address);

  console.log("\n📊 Current Trading Statistics:");
  console.log(`\nProducer 1 Offers: ${producer1Offers}`);
  console.log(`Producer 2 Offers: ${producer2Offers}`);
  console.log(`Consumer 1 Demands: ${consumer1Demands}`);
  console.log(`Consumer 2 Demands: ${consumer2Demands}`);

  const currentPeriod = await contract.currentTradingPeriod();
  console.log(`\nCurrent Trading Period: ${currentPeriod}`);
  console.log(`Next Offer ID: ${await contract.nextOfferId()}`);
  console.log(`Next Demand ID: ${await contract.nextDemandId()}`);

  // Scenario 5: Award Carbon Credits
  console.log("\n" + "=".repeat(60));
  console.log("Scenario 5: Award Carbon Credits");
  console.log("=".repeat(60));

  await sleep(1000);

  console.log("\n🌱 Awarding carbon credits to Producer 1...");
  console.log("   Energy: 1000 kWh Solar (500 gCO2/kWh saved)");
  tx = await contract.connect(owner).awardCarbonCredits(producer1.address, 1000, 1);
  receipt = await tx.wait();
  event = receipt.logs.find(
    (log) => log.fragment && log.fragment.name === "CarbonCreditsAwarded"
  );
  if (event) {
    console.log(`✅ Awarded ${event.args[1]} carbon credits`);
  }

  await sleep(1000);

  console.log("\n🌱 Awarding carbon credits to Producer 2...");
  console.log("   Energy: 1500 kWh Wind (450 gCO2/kWh saved)");
  tx = await contract.connect(owner).awardCarbonCredits(producer2.address, 1500, 2);
  receipt = await tx.wait();
  event = receipt.logs.find(
    (log) => log.fragment && log.fragment.name === "CarbonCreditsAwarded"
  );
  if (event) {
    console.log(`✅ Awarded ${event.args[1]} carbon credits`);
  }

  // Scenario 6: Pause and Resume Trading (Emergency Functions)
  console.log("\n" + "=".repeat(60));
  console.log("Scenario 6: Emergency Controls");
  console.log("=".repeat(60));

  await sleep(1000);

  console.log("\n⏸️  Pausing trading...");
  tx = await contract.connect(owner).pauseTrading();
  await tx.wait();
  console.log("✅ Trading paused");

  let isTradingActive = await contract.isTradingTimeActive();
  console.log(`Trading Active: ${isTradingActive}`);

  await sleep(1000);

  console.log("\n▶️  Resuming trading...");
  tx = await contract.connect(owner).resumeTrading();
  await tx.wait();
  console.log("✅ Trading resumed");

  isTradingActive = await contract.isTradingTimeActive();
  console.log(`Trading Active: ${isTradingActive}`);

  // Final Summary
  console.log("\n" + "=".repeat(60));
  console.log("Simulation Complete - Final Summary");
  console.log("=".repeat(60));

  console.log("\n📈 Contract Status:");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Owner: ${owner.address}`);
  console.log(`Current Trading Period: ${await contract.currentTradingPeriod()}`);
  console.log(`Total Offers Created: ${(await contract.nextOfferId()) - 1n}`);
  console.log(`Total Demands Created: ${(await contract.nextDemandId()) - 1n}`);

  console.log("\n✅ All simulation scenarios completed successfully!");
  console.log("=".repeat(60));

  console.log("\n💡 Next Steps:");
  console.log("-".repeat(60));
  console.log("1. Modify the simulation parameters in this script");
  console.log("2. Add more complex trading scenarios");
  console.log("3. Implement automated trading period progression");
  console.log("4. Test settlement and matching algorithms");
  console.log("5. Deploy to Sepolia testnet: npm run deploy");
  console.log("-".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Simulation failed:");
    console.error(error);
    process.exit(1);
  });
