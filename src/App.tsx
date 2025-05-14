import React, { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { LandingPage } from './components/LandingPage'
import { useContract } from './hooks/useContract'

function App() {
  const { isConnected, address } = useAccount()
  const { refetchIsMember } = useContract()
  
  // Refetch member status when address changes
  useEffect(() => {
    if (address) {
      refetchIsMember()
    }
  }, [address, refetchIsMember])

  return (
    <Layout>
      {isConnected ? <Dashboard /> : <LandingPage />}
    </Layout>
  )
}

export default App
