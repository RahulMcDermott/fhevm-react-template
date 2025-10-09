const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(60));
  console.log("Private Renewable Energy Market - Deployment Script");
  console.log("=".repeat(60));

  // Get network information
  const network = await hre.ethers.provider.getNetwork();
  console.log(`\nDeploying to network: ${network.name} (Chain ID: ${network.chainId})`);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  // Check deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${hre.ethers.formatEther(balance)} ETH`);

  if (balance === 0n) {
    throw new Error("Deployer account has no funds!");
  }

  console.log("\n" + "-".repeat(60));
  console.log("Starting contract deployment...");
  console.log("-".repeat(60));

  // Deploy the contract
  const PrivateRenewableEnergyMarket = await hre.ethers.getContractFactory(
    "PrivateRenewableEnergyMarket"
  );

  console.log("\nDeploying PrivateRenewableEnergyMarket contract...");
  const contract = await PrivateRenewableEnergyMarket.deploy();

  console.log("Waiting for deployment confirmation...");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.log("\n" + "=".repeat(60));
  console.log("✅ DEPLOYMENT SUCCESSFUL");
  console.log("=".repeat(60));
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Deployer Address: ${deployer.address}`);
  console.log(`Network: ${network.name}`);
  console.log(`Chain ID: ${network.chainId}`);
  console.log("=".repeat(60));

  // Save deployment information
  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId),
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
    contractName: "PrivateRenewableEnergyMarket",
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info to JSON file
  const deploymentFile = path.join(
    deploymentsDir,
    `deployment-${network.name}-${Date.now()}.json`
  );
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n📄 Deployment info saved to: ${deploymentFile}`);

  // Save latest deployment address
  const latestFile = path.join(deploymentsDir, `latest-${network.name}.json`);
  fs.writeFileSync(latestFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`📄 Latest deployment saved to: ${latestFile}`);

  // Generate Etherscan URL if on Sepolia
  if (network.name === "sepolia" || network.chainId === 11155111n) {
    console.log("\n" + "-".repeat(60));
    console.log("📊 Etherscan Links:");
    console.log("-".repeat(60));
    console.log(`Contract: https://sepolia.etherscan.io/address/${contractAddress}`);
    console.log(`Deployer: https://sepolia.etherscan.io/address/${deployer.address}`);
    console.log("-".repeat(60));
    console.log("\n⚠️  Remember to verify your contract:");
    console.log(`   npm run verify`);
    console.log(`   or`);
    console.log(`   npx hardhat verify --network sepolia ${contractAddress}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("Next Steps:");
  console.log("=".repeat(60));
  console.log("1. Update .env file with CONTRACT_ADDRESS");
  console.log("2. Verify contract on Etherscan (if on Sepolia):");
  console.log("   npm run verify");
  console.log("3. Interact with the contract:");
  console.log("   npm run interact");
  console.log("4. Run simulations:");
  console.log("   npm run simulate");
  console.log("=".repeat(60));

  return contractAddress;
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
