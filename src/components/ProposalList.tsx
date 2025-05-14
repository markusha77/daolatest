import React, { useEffect, useState } from 'react'
import { ProposalCard } from './ProposalCard'
import { useContract } from '../hooks/useContract'
import { Loader } from './Loader'
import { Proposal } from '../config/contract'

export const ProposalList: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const { getAllProposals, voteOnProposal, executeProposal } = useContract()

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true)
      try {
        const allProposals = await getAllProposals()
        setProposals(allProposals)
      } catch (error) {
        console.error('Error fetching proposals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProposals()
  }, [getAllProposals])

  const handleVote = async (proposalId: number, voteYes: boolean) => {
    try {
      await voteOnProposal(proposalId, voteYes)
      // Refresh proposals after voting
      const allProposals = await getAllProposals()
      setProposals(allProposals)
    } catch (error) {
      console.error('Error voting:', error)
      alert('Failed to vote. See console for details.')
    }
  }

  const handleExecute = async (proposalId: number) => {
    try {
      await executeProposal(proposalId)
      // Refresh proposals after execution
      const allProposals = await getAllProposals()
      setProposals(allProposals)
    } catch (error) {
      console.error('Error executing proposal:', error)
      alert('Failed to execute proposal. See console for details.')
    }
  }

  if (loading) {
    return <Loader />
  }

  // Separate active and completed proposals
  const activeProposals = proposals.filter(p => !p.executed && new Date(p.deadline) > new Date())
  const completedProposals = proposals.filter(p => p.executed || new Date(p.deadline) <= new Date())

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Active Proposals</h2>
        
        {activeProposals.length === 0 ? (
          <p className="text-gray-500">No active proposals found</p>
        ) : (
          <div className="space-y-4">
            {activeProposals.map((proposal) => (
              <ProposalCard 
                key={proposal.id} 
                proposal={proposal} 
                onVote={handleVote}
                onExecute={handleExecute}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Completed Proposals</h2>
        
        {completedProposals.length === 0 ? (
          <p className="text-gray-500">No completed proposals found</p>
        ) : (
          <div className="space-y-4">
            {completedProposals.map((proposal) => (
              <ProposalCard 
                key={proposal.id} 
                proposal={proposal} 
                onVote={handleVote}
                onExecute={handleExecute}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
