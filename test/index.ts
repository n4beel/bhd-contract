import assert from "assert";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  BlockHackerToken__factory,
  HackerCouncilToken__factory,
} from "../typechain";
import { Staking__factory } from "../typechain/factories/Staking__factory";

const tokens = (n: string) => ethers.utils.parseUnits(n, "ether");

describe("Block Hacker Staking", function () {
  it("Staking should function properly", async function () {
    const [owner, customer] = await ethers.getSigners();

    const hkr = await new BlockHackerToken__factory(owner).deploy();
    await hkr.deployed();

    const hcr = await new HackerCouncilToken__factory(owner).deploy();
    await hcr.deployed();

    const staking = await new Staking__factory(owner).deploy(
      hcr.address,
      hkr.address
    );
    await staking.deployed();

    // Transfer all reward tokens to decentral bank - 1 million - 1000000000000000000000000
    await hcr.transfer(staking.address, tokens("1000000"));

    // Transfer 100 mUSDT to customer - 100 - 100000000000000000000
    await hkr.connect(owner).transfer(customer.address, tokens("100"));

    let balanceBeforeStaking = await hkr.balanceOf(customer.address);
    console.log(
      "1. customer's hkr wallet before staking",
      balanceBeforeStaking.toString()
    );

    // Stake 100 mUSDT
    await hkr.connect(customer).approve(staking.address, tokens("100"));
    await staking.connect(customer).depositTokens(tokens("100"));

    // Check customer's staking balance
    let stakingBalanceBefore = await staking.stakingBalance(customer.address);
    console.log(
      "2. customer's staking balance after staking",
      stakingBalanceBefore.toString()
    );

    // Check if the customer has 0 mUSDT
    let balanceAfterStaking = await hkr.balanceOf(customer.address);
    console.log(
      "3. customer's hkr wallet after staking",
      balanceAfterStaking.toString()
    );

    // Check if the bank has 100 mUSDT
    let banksBalanceAfterStaking = await hkr.balanceOf(staking.address);
    console.log(
      "4. bank's hkr wallet after staking",
      banksBalanceAfterStaking.toString()
    );

    // Check of the customer is staking
    let isStaking = await staking.isStaking(customer.address);
    console.log("5. is customer staking", isStaking);

    // Check issue tokens function
    await staking.connect(owner).issueTokens();
    // await staking.connect(customer).issueTokens(); // should be rejected

    // Check customer's staking reward
    const rewards = await hcr.balanceOf(customer.address);
    console.log("6. customer`s staking reward", rewards.toString());

    await staking.connect(customer).unstakeTokens();

    // Check customer's staking balance
    let stakingBalanceAfter = await staking.stakingBalance(customer.address);
    console.log(
      "7. customer's staking balance after unstaking",
      stakingBalanceAfter.toString()
    );

    // Check if the customer has 100 mUSDT
    let balanceAfterUnstaking = await hkr.balanceOf(customer.address);
    console.log(
      "8. customer hkr wallet after unstaking",
      balanceAfterUnstaking.toString()
    );

    // Check if the bank has 0 mUSDT
    let banksBalanceAfterUntaking = await hkr.balanceOf(staking.address);
    console.log(
      "9. bank's hkr wallet after unstaking",
      banksBalanceAfterUntaking.toString()
    );
  });
});
