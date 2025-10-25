# Deploy TicTacToeGame Contract to Base Sepolia Testnet

## Prerequisites
1. Get Base Sepolia ETH from faucet: https://www.alchemy.com/faucets/base-sepolia
2. Install Remix IDE extension or use https://remix.ethereum.org

## Deployment Steps

### Using Remix IDE
1. Go to https://remix.ethereum.org
2. Create a new file: `TicTacToeGame.sol`
3. Copy the contract code from `contracts/TicTacToeGame.sol`
4. Compile the contract (Solidity 0.8.20+)
5. Connect MetaMask to Base Sepolia testnet:
   - Network Name: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - Chain ID: 84532
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.basescan.org
6. Deploy using MetaMask
7. Copy the deployed contract address
8. Add the contract address to your `.env` file as `VITE_CONTRACT_ADDRESS`

## Contract Details
- Game Fee: $0.10 USD worth of ETH (dynamic pricing via frontend)
- Network: Base Sepolia Testnet
- Chain ID: 84532
- The contract accepts any payment >= minPayment (default: 0.00001 ETH ≈ $0.02)
- Frontend calculates the exact ETH amount based on current ETH/USD price from CoinGecko
- Access Control: Only contract owner can update minPayment or withdraw funds

## Security Features
- `onlyOwner` modifier protects administrative functions
- Dynamic pricing allows frontend to calculate USD-equivalent ETH amounts
- Minimum payment threshold prevents spam/dust transactions

## After Deployment
Update the contract address in `client/src/lib/web3.ts` with your deployed contract address.
