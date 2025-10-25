# Blockchain Integration Setup Guide

Your Tic-Tac-Toe game now requires **$0.10 USD in ETH** to play each round on Base Sepolia testnet!

## Quick Start

### 1. Get Test ETH
Visit the Base Sepolia faucet to get free testnet ETH:
- **Alchemy Faucet**: https://www.alchemy.com/faucets/base-sepolia
- **Coinbase Faucet**: https://portal.cdp.coinbase.com/products/faucet

### 2. Add Base Sepolia to MetaMask
Click "Add Network" in MetaMask and use these details:
- **Network Name**: Base Sepolia
- **RPC URL**: https://sepolia.base.org
- **Chain ID**: 84532
- **Currency Symbol**: ETH
- **Block Explorer**: https://sepolia.basescan.org

### 3. Deploy the Smart Contract

#### Using Remix (Easiest Method)
1. Go to https://remix.ethereum.org
2. Create a new file called `TicTacToeGame.sol`
3. Copy the contract code from `contracts/TicTacToeGame.sol`
4. Click "Compile" (Solidity 0.8.20+)
5. Connect MetaMask to Base Sepolia
6. Click "Deploy"
7. **Copy the deployed contract address**

#### After Deployment
Update the contract address in `client/src/lib/web3.ts`:
```typescript
export const GAME_CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE' as const
```

### 4. Get a WalletConnect Project ID (Optional but Recommended)
1. Go to https://cloud.walletconnect.com
2. Create a free account
3. Create a new project
4. Copy your Project ID
5. Update it in `client/src/lib/web3.ts`:
```typescript
projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID',
```

## How It Works

### Dynamic Pricing
- The game charges **$0.10 USD** worth of ETH per game
- The frontend fetches real-time ETH prices from CoinGecko API
- At $2,000/ETH, you'll pay ~0.00005 ETH per game
- At $4,000/ETH, you'll pay ~0.000025 ETH per game

### Smart Contract
- **Owner-only controls**: Only you (the deployer) can:
  - Adjust the minimum payment threshold
  - Withdraw collected funds
- **Minimum payment**: 0.00001 ETH (prevents spam)
- **Payment validation**: Contract ensures sufficient payment before starting a game

### Game Flow
1. **Connect Wallet**: Click "Connect Wallet" button
2. **Start Game**: Click "Pay & Start Game ($0.10)"
3. **Confirm Transaction**: Approve in MetaMask
4. **Wait for Confirmation**: Transaction processes on blockchain
5. **Play**: Game board activates after confirmation!
6. **New Round**: Each new game requires another $0.10 payment

## Contract Functions (Owner Only)

### Update Minimum Payment
If ETH price changes dramatically, update the minimum:
```solidity
// In Remix or Etherscan
updateMinPayment(newAmount) // Amount in wei
```

### Withdraw Collected Funds
Withdraw ETH from the contract:
```solidity
// In Remix or Etherscan
withdraw() // Sends all ETH to owner address
```

## Troubleshooting

### "Contract Not Deployed" Error
- Make sure you deployed the contract on Base Sepolia
- Update the contract address in `client/src/lib/web3.ts`

### "Insufficient Payment" Error
- The contract's minPayment might be too high
- As owner, call `updateMinPayment(10000000000000)` to set it to 0.00001 ETH

### Transaction Fails
- Ensure you have enough Base Sepolia ETH (get from faucet)
- Check that you're connected to Base Sepolia network in MetaMask
- Try increasing gas limit in MetaMask

### Price Fetch Issues
- The app uses CoinGecko's free API to fetch ETH prices
- If unavailable, it falls back to $2,000/ETH estimate
- Price updates on page load

## Security Notes

✅ **Implemented**:
- Owner-only access control for admin functions
- Minimum payment threshold prevents dust transactions
- Dynamic USD pricing via off-chain oracle (CoinGecko)

⚠️ **For Production** (optional improvements):
- Add ownership transfer function
- Implement on-chain price oracle (Chainlink)
- Add emergency pause functionality
- Multi-sig wallet for fund management

## Network Details

- **Network**: Base Sepolia (Testnet)
- **Chain ID**: 84532
- **RPC**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Faucet**: https://www.alchemy.com/faucets/base-sepolia

## Support

If you encounter issues:
1. Check Base Sepolia block explorer for your transactions
2. Verify contract is deployed at the correct address
3. Ensure wallet has sufficient testnet ETH
4. Check browser console for detailed error messages

---

**Ready to play?** Connect your wallet and challenge the computer! 🎮
