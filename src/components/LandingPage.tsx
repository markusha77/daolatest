import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export const LandingPage: React.FC = () => {
  return (
    <div className="text-center py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to DAO Voting</h2>
      <p className="text-lg text-gray-600 mb-8">Connect your wallet to participate in governance</p>
      
      <div className="flex justify-center mb-8">
        <ConnectButton />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">What you can do:</h3>
        <ul className="text-left space-y-2">
          <li className="flex items-start">
            <span className="mr-2 text-indigo-600">•</span>
            <span>Create and vote on proposals</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-indigo-600">•</span>
            <span>Manage DAO membership</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-indigo-600">•</span>
            <span>Track proposal history and results</span>
          </li>
        </ul>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h4 className="font-medium mb-2">How it works</h4>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
            <li>Connect your wallet to the application</li>
            <li>Browse active proposals or create your own</li>
            <li>Cast your vote on proposals</li>
            <li>Once voting period ends, proposals can be executed</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
