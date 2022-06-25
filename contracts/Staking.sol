// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./BlockHackerToken.sol";
import "./HackerCouncilToken.sol"; // Reward

contract Staking {
    address public owner;
    BlockHackerToken public HKR;
    HackerCouncilToken public HCR;

    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(HackerCouncilToken _HCR, BlockHackerToken _HKR) {
        owner = msg.sender;
        HCR = _HCR;
        HKR = _HKR;
    }

    function depositTokens(uint256 _amount) public {
        require(_amount > 0, "amount cannot be 0");

        HKR.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "0 balance");

        HKR.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }

    // issue rewards
    function issueTokens() public {
        require(msg.sender == owner, "not owner");

        for (uint256 i = 0; i < stakers.length; i++) {
            address account = stakers[i];
            uint256 balance = stakingBalance[account];

            if (!isStaking[stakers[i]]) continue;

            if (balance > 0) {
                HCR.transfer(account, balance / 10);
            }
        }
    }
}
