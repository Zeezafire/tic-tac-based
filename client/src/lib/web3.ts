import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// Deployed contract address on Base Mainnet
export const GAME_CONTRACT_ADDRESS = '0x621d9D991b3971bE088d2FC8b6A585eF142411F3' as const

export const GAME_CONTRACT_ABI = [
  {
    inputs: [],
    name: 'minPayment',
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
    inputs: [{ internalType: 'uint256', name: 'newMinPayment', type: 'uint256' }],
    name: 'updateMinPayment',
    outputs: [],
    stateMutability: 'nonpayable',
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

// Fetch current ETH price in USD from CoinGecko API
export async function getEthPriceUSD(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    const data = await response.json();
    return data.ethereum.usd;
  } catch (error) {
    console.error('Failed to fetch ETH price:', error);
    // Fallback price if API fails (approximate)
    return 2000;
  }
}

// Calculate ETH amount for $0.10 USD
export async function calculateEthForUSD(usdAmount: number = 0.1): Promise<string> {
  const ethPriceUSD = await getEthPriceUSD();
  const ethAmount = usdAmount / ethPriceUSD;
  return ethAmount.toFixed(18); // Return with full precision
}

export const config = getDefaultConfig({
  appName: 'Tic-Tac-Toe Game',
  projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID', // Get from https://cloud.walletconnect.com
  chains: [base],
  ssr: false,
})
