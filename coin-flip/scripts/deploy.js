// scripts/deploy.js

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Use the correct contract name here
  const ContractFactory = await ethers.getContractFactory("CoinFlip");
  const contract = await ContractFactory.deploy();
  await contract.deployed();

  console.log("Contract deployed to:", contract.address);

  // Save the contract address and ABI
  const fs = require('fs');
  fs.writeFileSync(
    './contract-info.json',
    JSON.stringify({
      address: contract.address,
      abi: JSON.parse(contract.interface.format('json'))
    })
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
