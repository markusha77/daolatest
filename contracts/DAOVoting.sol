// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract DAOVoting {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 deadline;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    struct ProposalView {
        uint256 id;
        string title;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 deadline;
        bool executed;
    }

    address public owner;
    uint256 public proposalCount;
    uint256 public memberCount;
    uint256 public votingPeriod = 3 days;
    
    mapping(uint256 => Proposal) public proposals;
    mapping(address => bool) public members;

    event ProposalCreated(uint256 proposalId, string title, uint256 deadline);
    event VoteCast(uint256 proposalId, address voter, bool vote);
    event ProposalExecuted(uint256 proposalId);
    event MemberAdded(address member);
    event MemberRemoved(address member);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyMember() {
        require(members[msg.sender], "Only members can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
        members[msg.sender] = true;
        memberCount = 1;
    }

    function createProposal(string memory _title, string memory _description) external onlyMember {
        Proposal storage proposal = proposals[proposalCount];
        proposal.id = proposalCount;
        proposal.title = _title;
        proposal.description = _description;
        proposal.deadline = block.timestamp + votingPeriod;
        proposal.executed = false;
        proposal.yesVotes = 0;
        proposal.noVotes = 0;

        emit ProposalCreated(proposalCount, _title, proposal.deadline);
        proposalCount++;
    }

    function vote(uint256 _proposalId, bool _vote) external onlyMember {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp < proposal.deadline, "Voting period has ended");
        require(!proposal.hasVoted[msg.sender], "You have already voted");
        
        if (_vote) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }
        
        proposal.hasVoted[msg.sender] = true;
        
        emit VoteCast(_proposalId, msg.sender, _vote);
    }

    function executeProposal(uint256 _proposalId) external onlyMember {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp >= proposal.deadline, "Voting period not yet ended");
        require(!proposal.executed, "Proposal already executed");
        
        proposal.executed = true;
        
        emit ProposalExecuted(_proposalId);
    }

    function addMember(address _member) external onlyOwner {
        require(!members[_member], "Address is already a member");
        
        members[_member] = true;
        memberCount++;
        
        emit MemberAdded(_member);
    }

    function removeMember(address _member) external onlyOwner {
        require(members[_member], "Address is not a member");
        require(_member != owner, "Cannot remove owner");
        
        members[_member] = false;
        memberCount--;
        
        emit MemberRemoved(_member);
    }

    function getProposal(uint256 _proposalId) external view returns (ProposalView memory) {
        Proposal storage proposal = proposals[_proposalId];
        return ProposalView({
            id: proposal.id,
            title: proposal.title,
            description: proposal.description,
            yesVotes: proposal.yesVotes,
            noVotes: proposal.noVotes,
            deadline: proposal.deadline,
            executed: proposal.executed
        });
    }

    function hasVoted(uint256 _proposalId, address _voter) external view returns (bool) {
        return proposals[_proposalId].hasVoted[_voter];
    }

    function getProposalCount() external view returns (uint256) {
        return proposalCount;
    }

    function isMember(address _address) external view returns (bool) {
        return members[_address];
    }
}
