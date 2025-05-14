import React, { useState, useEffect } from 'react'
import { useContract } from '../hooks/useContract'
import { Loader } from './Loader'
import { useAccount } from 'wagmi'

interface Member {
  address: string
  isMember: boolean
}

export const MemberManagement: React.FC = () => {
  const [newMemberAddress, setNewMemberAddress] = useState('')
  const [removeMemberAddress, setRemoveMemberAddress] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const { addMember, removeMember, isOwner, checkIsMember } = useContract()
  const { address } = useAccount()
  
  // For demo purposes, we'll use a list of sample addresses to check
  // In a real app, you'd need a way to get all member addresses from the contract
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true)
      
      // In a real app, you would get this list from an event log or other source
      // For demo, we'll use the connected address and some sample addresses
      const sampleAddresses = [
        address,
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
        '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'
      ].filter(Boolean) as string[]
      
      // Check each address
      const memberPromises = sampleAddresses.map(async (addr) => {
        const isMember = await checkIsMember(addr)
        return { address: addr, isMember }
      })
      
      const memberResults = await Promise.all(memberPromises)
      setMembers(memberResults)
      setLoading(false)
    }
    
    if (address) {
      fetchMembers()
    }
  }, [address, checkIsMember])

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMemberAddress || !newMemberAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('Please enter a valid Ethereum address')
      return
    }
    
    setLoading(true)
    try {
      await addMember(newMemberAddress)
      setNewMemberAddress('')
      
      // Update the members list
      const isMember = await checkIsMember(newMemberAddress)
      setMembers(prev => [
        ...prev.filter(m => m.address !== newMemberAddress),
        { address: newMemberAddress, isMember }
      ])
      
      alert('Member added successfully!')
    } catch (error) {
      console.error('Error adding member:', error)
      alert('Failed to add member. See console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!removeMemberAddress || !removeMemberAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('Please enter a valid Ethereum address')
      return
    }
    
    setLoading(true)
    try {
      await removeMember(removeMemberAddress)
      setRemoveMemberAddress('')
      
      // Update the members list
      const isMember = await checkIsMember(removeMemberAddress)
      setMembers(prev => 
        prev.map(m => m.address === removeMemberAddress ? { ...m, isMember } : m)
      )
      
      alert('Member removed successfully!')
    } catch (error) {
      console.error('Error removing member:', error)
      alert('Failed to remove member. See console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickRemove = async (memberAddress: string) => {
    setLoading(true)
    try {
      await removeMember(memberAddress)
      
      // Update the members list
      const isMember = await checkIsMember(memberAddress)
      setMembers(prev => 
        prev.map(m => m.address === memberAddress ? { ...m, isMember } : m)
      )
      
      alert('Member removed successfully!')
    } catch (error) {
      console.error('Error removing member:', error)
      alert('Failed to remove member. See console for details.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOwner) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Member Management</h2>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700">
            Only the DAO owner can manage members. This section is restricted.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <Loader />
  }

  const currentMembers = members.filter(m => m.isMember)

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Current Members</h2>
        
        {currentMembers.length === 0 ? (
          <p className="text-gray-500">No members found</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {currentMembers.map((member, index) => (
              <li key={index} className="py-4 flex justify-between">
                <div>
                  <p className="font-medium">{member.address}</p>
                  <p className="text-sm text-gray-500">
                    {member.address === address ? '(You)' : ''}
                  </p>
                </div>
                {member.address !== address && (
                  <button 
                    onClick={() => handleQuickRemove(member.address)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Add Member</h3>
          
          <form onSubmit={handleAddMember}>
            <div className="mb-4">
              <label htmlFor="newMemberAddress" className="block text-sm font-medium text-gray-700">
                Wallet Address
              </label>
              <input
                type="text"
                id="newMemberAddress"
                value={newMemberAddress}
                onChange={(e) => setNewMemberAddress(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0x..."
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Member
            </button>
          </form>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Remove Member</h3>
          
          <form onSubmit={handleRemoveMember}>
            <div className="mb-4">
              <label htmlFor="removeMemberAddress" className="block text-sm font-medium text-gray-700">
                Wallet Address
              </label>
              <input
                type="text"
                id="removeMemberAddress"
                value={removeMemberAddress}
                onChange={(e) => setRemoveMemberAddress(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0x..."
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Remove Member
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
