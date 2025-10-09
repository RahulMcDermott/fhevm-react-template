const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function loadContractAddress() {
  // Try to load from environment variable first
  let contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    // Try to load from latest deployment file
    const network = await hre.ethers.provider.getNetwork();
    const latestFile = path.join(
      __dirname,
      "..",
      "deployments",
      `latest-${network.name}.json`
    );

    if (fs.existsSync(latestFile)) {
      const deploymentInfo = JSON.parse(fs.readFileSync(latestFile, "utf8"));
      contractAddress = deploymentInfo.contractAddress;
      console.log(`📄 Loaded contract address from deployment file`);
    }
  }

  if (!contractAddress) {
    throw new Error(
      "Contract address not found! Please deploy first or set CONTRACT_ADDRESS in .env"
    );
  }

  return contractAddress;
}

async function getContract() {
  const contractAddress = await loadContractAddress();
  const contract = await hre.ethers.getContractAt(
    "PrivateRenewableEnergyMarket",
    contractAddress
  );
  return contract;
}

async function displayMenu() {
  console.log("\n" + "=".repeat(60));
  console.log("Private Renewable Energy Market - Interaction Menu");
  console.log("=".repeat(60));
  console.log("\n1. View Contract Information");
  console.log("2. Start Trading Period");
  console.log("3. Submit Energy Offer");
  console.log("4. Submit Energy Demand");
  console.log("5. View Trading Period Status");
  console.log("6. Process Trading (Owner Only)");
  console.log("7. Award Carbon Credits (Owner Only)");
  console.log("8. View My Offers");
  console.log("9. View My Demands");
  console.log("0. Exit");
  console.log("=".repeat(60));
}

async function viewContractInfo() {
  console.log("\n" + "-".repeat(60));
  console.log("Contract Information");
  console.log("-".repeat(60));

  const contract = await getContract();
  const [signer] = await hre.ethers.getSigners();

  const contractAddress = await contract.getAddress();
  const owner = await contract.owner();
  const currentPeriod = await contract.currentTradingPeriod();
  const nextOfferId = await contract.nextOfferId();
  const nextDemandId = await contract.nextDemandId();

  console.log(`\nContract Address: ${contractAddress}`);
  console.log(`Owner Address: ${owner}`);
  console.log(`Your Address: ${signer.address}`);
  console.log(`Are you owner? ${owner.toLowerCase() === signer.address.toLowerCase()}`);
  console.log(`\nCurrent Trading Period: ${currentPeriod}`);
  console.log(`Next Offer ID: ${nextOfferId}`);
  console.log(`Next Demand ID: ${nextDemandId}`);

  // Get current period info
  const periodInfo = await contract.getCurrentTradingPeriodInfo();
  console.log(`\nPeriod Start Time: ${new Date(Number(periodInfo[1]) * 1000).toLocaleString()}`);
  console.log(`Period End Time: ${new Date(Number(periodInfo[2]) * 1000).toLocaleString()}`);
  console.log(`Is Active: ${periodInfo[3]}`);
  console.log(`Results Revealed: ${periodInfo[4]}`);

  const isTradingActive = await contract.isTradingTimeActive();
  const isSettlementActive = await contract.isSettlementTimeActive();
  console.log(`\nTrading Active: ${isTradingActive}`);
  console.log(`Settlement Active: ${isSettlementActive}`);

  console.log("-".repeat(60));
}

async function startTradingPeriod() {
  console.log("\n" + "-".repeat(60));
  console.log("Starting New Trading Period");
  console.log("-".repeat(60));

  const contract = await getContract();

  try {
    console.log("\nSending transaction...");
    const tx = await contract.startTradingPeriod();
    console.log(`Transaction hash: ${tx.hash}`);

    console.log("Waiting for confirmation...");
    const receipt = await tx.wait();

    console.log(`\n✅ Trading period started!`);
    console.log(`Block number: ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);

    // Display event data
    const event = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "TradingPeriodStarted"
    );
    if (event) {
      console.log(`\nPeriod Number: ${event.args[0]}`);
      console.log(`Start Time: ${new Date(Number(event.args[1]) * 1000).toLocaleString()}`);
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  }

  console.log("-".repeat(60));
}

async function submitEnergyOffer() {
  console.log("\n" + "-".repeat(60));
  console.log("Submit Energy Offer");
  console.log("-".repeat(60));

  const contract = await getContract();

  // Example values - in real use, these would come from user input
  const amount = 1000; // kWh
  const pricePerKwh = 50; // wei per kWh
  const energyType = 1; // 1=Solar, 2=Wind, 3=Hydro, 4=Geothermal

  const energyTypes = { 1: "Solar", 2: "Wind", 3: "Hydro", 4: "Geothermal" };

  console.log(`\nSubmitting offer:`);
  console.log(`Amount: ${amount} kWh`);
  console.log(`Price: ${pricePerKwh} wei/kWh`);
  console.log(`Energy Type: ${energyTypes[energyType]}`);

  try {
    console.log("\nSending transaction...");
    const tx = await contract.submitEnergyOffer(amount, pricePerKwh, energyType);
    console.log(`Transaction hash: ${tx.hash}`);

    console.log("Waiting for confirmation...");
    const receipt = await tx.wait();

    console.log(`\n✅ Energy offer submitted!`);
    console.log(`Block number: ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);

    // Display event data
    const event = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "EnergyOfferSubmitted"
    );
    if (event) {
      console.log(`\nOffer ID: ${event.args[1]}`);
      console.log(`Energy Type: ${energyTypes[event.args[2]]}`);
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  }

  console.log("-".repeat(60));
}

async function submitEnergyDemand() {
  console.log("\n" + "-".repeat(60));
  console.log("Submit Energy Demand");
  console.log("-".repeat(60));

  const contract = await getContract();

  // Example values - in real use, these would come from user input
  const amount = 800; // kWh
  const maxPricePerKwh = 60; // wei per kWh

  console.log(`\nSubmitting demand:`);
  console.log(`Amount: ${amount} kWh`);
  console.log(`Max Price: ${maxPricePerKwh} wei/kWh`);

  try {
    console.log("\nSending transaction...");
    const tx = await contract.submitEnergyDemand(amount, maxPricePerKwh);
    console.log(`Transaction hash: ${tx.hash}`);

    console.log("Waiting for confirmation...");
    const receipt = await tx.wait();

    console.log(`\n✅ Energy demand submitted!`);
    console.log(`Block number: ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);

    // Display event data
    const event = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "EnergyDemandSubmitted"
    );
    if (event) {
      console.log(`\nDemand ID: ${event.args[1]}`);
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  }

  console.log("-".repeat(60));
}

async function viewTradingPeriodStatus() {
  console.log("\n" + "-".repeat(60));
  console.log("Trading Period Status");
  console.log("-".repeat(60));

  const contract = await getContract();
  const currentPeriod = await contract.currentTradingPeriod();

  console.log(`\nCurrent Period: ${currentPeriod}`);

  const periodInfo = await contract.getTradingPeriodHistory(currentPeriod);

  console.log(`\nStart Time: ${new Date(Number(periodInfo[0]) * 1000).toLocaleString()}`);
  console.log(`End Time: ${new Date(Number(periodInfo[1]) * 1000).toLocaleString()}`);
  console.log(`Is Active: ${periodInfo[2]}`);
  console.log(`Results Revealed: ${periodInfo[3]}`);
  console.log(`Total Trades: ${periodInfo[4]}`);
  console.log(`Total Volume: ${periodInfo[5]}`);

  const isTradingActive = await contract.isTradingTimeActive();
  const isSettlementActive = await contract.isSettlementTimeActive();

  console.log(`\nTrading Time Active: ${isTradingActive}`);
  console.log(`Settlement Time Active: ${isSettlementActive}`);

  console.log("-".repeat(60));
}

async function processTrading() {
  console.log("\n" + "-".repeat(60));
  console.log("Process Trading (Owner Only)");
  console.log("-".repeat(60));

  const contract = await getContract();

  try {
    console.log("\nSending transaction...");
    const tx = await contract.processTrading();
    console.log(`Transaction hash: ${tx.hash}`);

    console.log("Waiting for confirmation...");
    const receipt = await tx.wait();

    console.log(`\n✅ Trading processed!`);
    console.log(`Block number: ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  }

  console.log("-".repeat(60));
}

async function awardCarbonCredits() {
  console.log("\n" + "-".repeat(60));
  console.log("Award Carbon Credits (Owner Only)");
  console.log("-".repeat(60));

  const contract = await getContract();
  const [signer] = await hre.ethers.getSigners();

  // Example values
  const producer = signer.address;
  const energyAmount = 1000;
  const energyType = 1; // Solar

  console.log(`\nAwarding credits to: ${producer}`);
  console.log(`Energy Amount: ${energyAmount} kWh`);
  console.log(`Energy Type: Solar`);

  try {
    console.log("\nSending transaction...");
    const tx = await contract.awardCarbonCredits(producer, energyAmount, energyType);
    console.log(`Transaction hash: ${tx.hash}`);

    console.log("Waiting for confirmation...");
    const receipt = await tx.wait();

    console.log(`\n✅ Carbon credits awarded!`);
    console.log(`Block number: ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  }

  console.log("-".repeat(60));
}

async function viewMyOffers() {
  console.log("\n" + "-".repeat(60));
  console.log("My Energy Offers");
  console.log("-".repeat(60));

  const contract = await getContract();
  const [signer] = await hre.ethers.getSigners();

  const count = await contract.getProducerOfferCount(signer.address);
  console.log(`\nTotal Offers: ${count}`);

  console.log("-".repeat(60));
}

async function viewMyDemands() {
  console.log("\n" + "-".repeat(60));
  console.log("My Energy Demands");
  console.log("-".repeat(60));

  const contract = await getContract();
  const [signer] = await hre.ethers.getSigners();

  const count = await contract.getConsumerDemandCount(signer.address);
  console.log(`\nTotal Demands: ${count}`);

  console.log("-".repeat(60));
}

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("Private Renewable Energy Market - Interactive Tool");
  console.log("=".repeat(60));

  const network = await hre.ethers.provider.getNetwork();
  console.log(`\nNetwork: ${network.name} (Chain ID: ${network.chainId})`);

  const [signer] = await hre.ethers.getSigners();
  console.log(`Account: ${signer.address}`);

  // Quick demo mode - run all main functions
  console.log("\n🚀 Running Demo Interactions...\n");

  await viewContractInfo();
  await viewTradingPeriodStatus();
  await viewMyOffers();
  await viewMyDemands();

  console.log("\n" + "=".repeat(60));
  console.log("Demo Complete!");
  console.log("=".repeat(60));
  console.log("\nAvailable functions:");
  console.log("- startTradingPeriod()");
  console.log("- submitEnergyOffer()");
  console.log("- submitEnergyDemand()");
  console.log("- processTrading()");
  console.log("- awardCarbonCredits()");
  console.log("\nModify this script to call specific functions as needed.");
  console.log("=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });
