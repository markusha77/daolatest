import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, sepolia } from 'wagmi/chains'
import { http } from 'wagmi'

// Export chains for use in other files
export const chains = [mainnet, sepolia]

// Get WalletConnect project ID from environment variables
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo'

// Configure chains & providers with RainbowKit
export const wagmiConfig = getDefaultConfig({
  appName: 'DAO Voting App',
  projectId,
  chains,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

export default wagmiConfig
