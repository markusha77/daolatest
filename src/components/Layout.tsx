import React, { ReactNode } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useContract } from '../hooks/useContract'

interface LayoutProps {
  children: ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { address, isConnected } = useAccount()
  const { isMember, isOwner } = useContract()
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">DAO Voting App</h1>
          <div className="flex items-center space-x-4">
            {isConnected && (
              <div className="text-sm text-gray-600 mr-2">
                {isOwner && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs mr-2">Owner</span>}
                {isMember && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Member</span>}
              </div>
            )}
            <ConnectButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>DAO Voting App - Built with React, Wagmi, and Solidity</p>
          <p className="mt-1">Contract Address: {import.meta.env.VITE_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3'}</p>
        </div>
      </footer>
    </div>
  )
}
