import { useState, useCallback } from 'react'
import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { daoVotingAbi, daoVotingAddress, formatProposal, Proposal } from '../config/contract'

export function useContract() {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  
  // Check if user is a member
  const { data: isMember, refetch: refetchIsMember } = useReadContract({
    address: daoVotingAddress as `0x${string}`,
    abi: daoVotingAbi,
    functionName: 'isMember',
    args: [address],
    enabled: !!address,
  })

  // Check if user is the owner
  const { data: owner } = useReadContract({
    address: daoVotingAddress as `0x${string}`,
    abi: daoVotingAbi,
    functionName: 'owner',
    enabled: !!address,
  })
  
  const isOwner = owner === address

  // Get proposal count
  const { data: proposalCount } = useReadContract({
    address: daoVotingAddress as `0x${string}`,
    abi: daoVotingAbi,
    functionName: 'getProposalCount',
  })

  // Get all proposals
  const getProposals = useCallback(async (): Promise<Proposal[]> => {
    if (!proposalCount) return []
    
    setIsLoading(true)
    try {
      const proposals: Proposal[] = []
      
      for (let i = 0; i < Number(proposalCount); i++) {
        const proposal = await getProposal(i)
        if (proposal) proposals.push(proposal)
      }
      
      return proposals
    } catch (error) {
      console.error('Error fetching proposals:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [proposalCount])

  // Get a single proposal
  const getProposal = useCallback(async (id: number): Promise<Proposal | null> => {
    try {
      const data = await fetch(`/api/proposals/${id}`).then(res => res.json())
      const proposal = formatProposal(data)
      
      // Check if user has voted on this proposal
      if (address) {
        const hasVoted = await fetch(`/api/proposals/${id}/voted/${address}`).then(res => res.json())
        proposal.hasVoted = hasVoted
      }
      
      return proposal
    } catch (error) {
      console.error(`Error fetching proposal ${id}:`, error)
      return null
    }
  }, [address])

  // Write contract functions
  const { writeContractAsync } = useWriteContract()

  // Create a new proposal
  const createProposal = useCallback(async (title: string, description: string) => {
    if (!address) return false
    
    setIsLoading(true)
    try {
      await writeContractAsync({
        address: daoVotingAddress as `0x${string}`,
        abi: daoVotingAbi,
        functionName: 'createProposal',
        args: [title, description],
      })
      return true
    } catch (error) {
      console.error('Error creating proposal:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [address, writeContractAsync])

  // Vote on a proposal
  const voteOnProposal = useCallback(async (proposalId: number, vote: boolean) => {
    if (!address) return false
    
    setIsLoading(true)
    try {
      await writeContractAsync({
        address: daoVotingAddress as `0x${string}`,
        abi: daoVotingAbi,
        functionName: 'vote',
        args: [BigInt(proposalId), vote],
      })
      return true
    } catch (error) {
      console.error('Error voting on proposal:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [address, writeContractAsync])

  // Execute a proposal
  const executeProposal = useCallback(async (proposalId: number) => {
    if (!address) return false
    
    setIsLoading(true)
    try {
      await writeContractAsync({
        address: daoVotingAddress as `0x${string}`,
        abi: daoVotingAbi,
        functionName: 'executeProposal',
        args: [BigInt(proposalId)],
      })
      return true
    } catch (error) {
      console.error('Error executing proposal:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [address, writeContractAsync])

  // Add a member
  const addMember = useCallback(async (memberAddress: string) => {
    if (!address) return false
    
    setIsLoading(true)
    try {
      await writeContractAsync({
        address: daoVotingAddress as `0x${string}`,
        abi: daoVotingAbi,
        functionName: 'addMember',
        args: [memberAddress],
      })
      return true
    } catch (error) {
      console.error('Error adding member:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [address, writeContractAsync])

  // Remove a member
  const removeMember = useCallback(async (memberAddress: string) => {
    if (!address) return false
    
    setIsLoading(true)
    try {
      await writeContractAsync({
        address: daoVotingAddress as `0x${string}`,
        abi: daoVotingAbi,
        functionName: 'removeMember',
        args: [memberAddress],
      })
      return true
    } catch (error) {
      console.error('Error removing member:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [address, writeContractAsync])

  return {
    isLoading,
    isMember: !!isMember,
    isOwner: !!isOwner,
    getProposals,
    getProposal,
    createProposal,
    voteOnProposal,
    executeProposal,
    addMember,
    removeMember,
    refetchIsMember,
  }
}
