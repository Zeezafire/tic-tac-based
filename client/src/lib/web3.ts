import { createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// Replace with your deployed contract address after deployment
export const GAME_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000' as const

export const GAME_CONTRACT_ABI = [
  {
    inputs: [],
    name: 'GAME_FEE',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'startGame',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'player', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amountPaid', type: 'uint256' },
    ],
    name: 'GameStarted',
    type: 'event',
  },
] as const

export const config = getDefaultConfig({
  appName: 'Tic-Tac-Toe Game',
  projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID', // Get from https://cloud.walletconnect.com
  chains: [baseSepolia],
  ssr: false,
})
