// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import {
  BlockHackerToken__factory,
  HackerCouncilToken__factory,
} from "../typechain";
import { Proposals__factory } from "../typechain/factories/Proposals__factory";
import { Staking__factory } from "../typechain/factories/Staking__factory";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // const Greeter = await ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Hardhat!");

  // await greeter.deployed();

  const [owner, customer] = await ethers.getSigners();

  const hkr = await new BlockHackerToken__factory(owner).deploy();
  await hkr.deployed();
  console.log("Block Hacker Token deployed to:", hkr.address);

  const hcr = await new HackerCouncilToken__factory(owner).deploy();
  await hcr.deployed();
  console.log("Hacker Council Token deployed to:", hcr.address);

  const staking = await new Staking__factory(owner).deploy(
    hcr.address,
    hkr.address
  );
  await staking.deployed();
  console.log("Staking deployed to:", staking.address);

  const proposals = await new Proposals__factory(owner).deploy(hcr.address);
  await proposals.deployed();
  console.log("Proposals deployed to:", proposals.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
