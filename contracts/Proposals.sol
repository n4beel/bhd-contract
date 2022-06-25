// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./HackerCouncilToken.sol"; // Reward

struct Proposal {
    uint256 votes;
    address proposer;
}

contract Proposals {
    HackerCouncilToken private HCR;
    mapping(string => Proposal) private proposals;
    mapping(string => mapping(address => bool)) private voters;

    constructor(HackerCouncilToken _HCR) {
        HCR = _HCR;
    }

    event ProposalCreated(string indexed id);
    event Voted(string indexed id, address indexed user, uint256 votes);
    event BountyAwarded(
        string indexed id,
        address indexed proposer,
        uint256 bounty
    );

    function createProposal(string memory id) public {
        require(HCR.balanceOf(msg.sender) > 0, "Cannot propose");
        proposals[id] = Proposal(0, msg.sender);
        emit ProposalCreated(id);
    }

    function vote(string memory proposal) public {
        require(HCR.balanceOf(msg.sender) > 0, "Cannot vote");
        require(!voters[proposal][msg.sender], "Already voted");
        proposals[proposal].votes += 1;
        voters[proposal][msg.sender] = true;
        emit Voted(proposal, msg.sender, proposals[proposal].votes);
    }

    function getVotes(string memory id) public view returns (uint256) {
        return proposals[id].votes;
    }
}
