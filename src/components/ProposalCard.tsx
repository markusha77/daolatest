import React from 'react'
import { Proposal } from '../config/contract'

interface ProposalCardProps {
  proposal: Proposal
  onVote: (proposalId: number, voteYes: boolean) => Promise<void>
  onExecute: (proposalId: number) => Promise<void>
}

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onVote, onExecute }) => {
  const totalVotes = proposal.yesVotes + proposal.noVotes
  const forPercentage = totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 0
  
  const deadlineDate = new Date(proposal.deadline)
  const isExpired = deadlineDate <= new Date()
  
  let status: 'active' | 'passed' | 'rejected' | 'executed'
  
  if (proposal.executed) {
    status = 'executed'
  } else if (isExpired) {
    status = proposal.yesVotes > proposal.noVotes ? 'passed' : 'rejected'
  } else {
    status = 'active'
  }

  const statusColors = {
    active: 'bg-blue-100 text-blue-800',
    passed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    executed: 'bg-purple-100 text-purple-800',
  }

  const handleVoteYes = () => onVote(proposal.id, true)
  const handleVoteNo = () => onVote(proposal.id, false)
  const handleExecute = () => onExecute(proposal.id)

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium">{proposal.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      
      <p className="mt-2 text-gray-600">{proposal.description}</p>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>For: {proposal.yesVotes}</span>
          <span>Against: {proposal.noVotes}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${forPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {isExpired 
            ? `Ended: ${deadlineDate.toLocaleDateString()}`
            : `Ends: ${deadlineDate.toLocaleDateString()}`
          }
        </span>
        
        {status === 'active' && !proposal.hasVoted && (
          <div className="space-x-2">
            <button 
              onClick={handleVoteYes}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-200"
            >
              Vote For
            </button>
            <button 
              onClick={handleVoteNo}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200"
            >
              Vote Against
            </button>
          </div>
        )}
        
        {status === 'active' && proposal.hasVoted && (
          <span className="text-sm text-gray-500 italic">You have voted</span>
        )}
        
        {status === 'passed' && !proposal.executed && (
          <button 
            onClick={handleExecute}
            className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200"
          >
            Execute Proposal
          </button>
        )}
      </div>
    </div>
  )
}
