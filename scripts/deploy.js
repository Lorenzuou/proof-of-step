const hre = require("hardhat");

async function main() {
  // Deploy the CompetitionFactory contract
  const CompetitionFactory = await hre.ethers.getContractFactory("CompetitionFactory");
  const competitionFactory = await CompetitionFactory.deploy();
  await competitionFactory.deployed();

  console.log("CompetitionFactory deployed to:", competitionFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });