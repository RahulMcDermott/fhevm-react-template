const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(60));
  console.log("Contract Verification Script");
  console.log("=".repeat(60));

  // Get network information
  const network = await hre.ethers.provider.getNetwork();
  console.log(`\nNetwork: ${network.name} (Chain ID: ${network.chainId})`);

  // Check if on Sepolia
  if (network.name !== "sepolia" && network.chainId !== 11155111n) {
    console.log("\n⚠️  Contract verification is only available on Sepolia testnet");
    console.log("Current network is not Sepolia. Exiting...");
    return;
  }

  // Try to load contract address from environment or deployment file
  let contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    // Try to load from latest deployment file
    const latestFile = path.join(
      __dirname,
      "..",
      "deployments",
      `latest-${network.name}.json`
    );

    if (fs.existsSync(latestFile)) {
      const deploymentInfo = JSON.parse(fs.readFileSync(latestFile, "utf8"));
      contractAddress = deploymentInfo.contractAddress;
      console.log(`\n📄 Loaded contract address from: ${latestFile}`);
    }
  }

  if (!contractAddress) {
    console.error("\n❌ Error: Contract address not found!");
    console.log("\nPlease provide the contract address in one of these ways:");
    console.log("1. Set CONTRACT_ADDRESS in .env file");
    console.log("2. Deploy the contract first using: npm run deploy");
    console.log("3. Pass as argument: npm run verify -- <contract-address>");
    return;
  }

  // Allow passing contract address as command line argument
  if (process.argv.length > 2) {
    contractAddress = process.argv[2];
  }

  console.log(`\nContract Address: ${contractAddress}`);
  console.log("\n" + "-".repeat(60));
  console.log("Starting verification process...");
  console.log("-".repeat(60));

  try {
    // Verify the contract
    console.log("\nVerifying PrivateRenewableEnergyMarket...");
    console.log("This may take a few moments...\n");

    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // No constructor arguments for this contract
    });

    console.log("\n" + "=".repeat(60));
    console.log("✅ VERIFICATION SUCCESSFUL");
    console.log("=".repeat(60));
    console.log(`\nContract verified on Etherscan!`);
    console.log(`View at: https://sepolia.etherscan.io/address/${contractAddress}#code`);
    console.log("=".repeat(60));

    // Save verification status
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    const latestFile = path.join(deploymentsDir, `latest-${network.name}.json`);

    if (fs.existsSync(latestFile)) {
      const deploymentInfo = JSON.parse(fs.readFileSync(latestFile, "utf8"));
      deploymentInfo.verified = true;
      deploymentInfo.verifiedAt = new Date().toISOString();
      deploymentInfo.etherscanUrl = `https://sepolia.etherscan.io/address/${contractAddress}`;
      fs.writeFileSync(latestFile, JSON.stringify(deploymentInfo, null, 2));
      console.log(`\n📄 Verification status saved to: ${latestFile}`);
    }
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("\n✅ Contract is already verified on Etherscan!");
      console.log(`View at: https://sepolia.etherscan.io/address/${contractAddress}#code`);
    } else {
      console.error("\n❌ Verification failed:");
      console.error(error.message);

      console.log("\n" + "-".repeat(60));
      console.log("Troubleshooting:");
      console.log("-".repeat(60));
      console.log("1. Make sure ETHERSCAN_API_KEY is set in .env");
      console.log("2. Wait a few minutes after deployment before verifying");
      console.log("3. Ensure the contract address is correct");
      console.log("4. Check that the contract was compiled with the same settings");
      console.log("-".repeat(60));
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
