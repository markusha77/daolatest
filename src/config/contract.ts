import { createPublicClient, http, parseAbi } from 'viem'
import { sepolia } from 'wagmi/chains'

// Contract ABI - this matches the deployed DAOVoting contract
export const daoVotingAbi = parseAbi([
  'function createProposal(string memory _title, string memory _description) external',
  'function vote(uint256 _proposalId, bool _vote) external',
  'function executeProposal(uint256 _proposalId) external',
  'function getProposal(uint256 _proposalId) external view returns ((uint256 id, string title, string description, uint256 yesVotes, uint256 noVotes, uint256 deadline, bool executed))',
  'function getProposalCount() external view returns (uint256)',
  'function addMember(address _member) external',
  'function removeMember(address _member) external',
  'function isMember(address _address) external view returns (bool)',
  'function hasVoted(uint256 _proposalId, address _voter) external view returns (bool)',
  'function owner() external view returns (address)',
  'function memberCount() external view returns (uint256)',
  'function members(address) external view returns (bool)'
])

// Contract address - this should be replaced with the actual deployed contract address
export const daoVotingAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3' // Local hardhat default first address

// Set up public client for read operations
export const publicClient = createPublicClient({
  chain: sepolia, // Use mainnet or sepolia based on your deployment
  transport: http(),
})

// Helper function to format proposal data from contract
export interface Proposal {
  id: number
  title: string
  description: string
  yesVotes: number
  noVotes: number
  deadline: string
  executed: boolean
  hasVoted?: boolean
}

export const formatProposal = (data: any): Proposal => {
  return {
    id: Number(data.id),
    title: data.title,
    description: data.description,
    yesVotes: Number(data.yesVotes),
    noVotes: Number(data.noVotes),
    deadline: new Date(Number(data.deadline) * 1000).toISOString(),
    executed: data.executed
  }
}
