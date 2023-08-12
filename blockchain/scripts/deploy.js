const { ethers } = require("hardhat");

async function main() {
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so voteContract here is a factory for instances of our vote contract.
  */
  const newContract = await ethers.getContractFactory("BloodDonation");

  // here we deploy the contract
  const deployedContract = await newContract.deploy();


  // Wait for it to finish deploying
  await deployedContract.deployed();

  // print the address of the deployed contract
  console.log("Contract Address:", deployedContract.address);
 // console.log(msg.sender)
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });