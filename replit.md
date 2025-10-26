# Blockchain Tic-Tac-Toe Game

## Overview

A modern web-based Tic-Tac-Toe game with blockchain integration on Base Sepolia testnet. Players pay $0.10 USD worth of ETH per game, with dynamic pricing calculated from real-time ETH/USD rates via CoinGecko API. The application features a React frontend with Web3 wallet connectivity through RainbowKit, and a minimal Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, built using Vite for fast development and optimized production builds.

**Routing**: Wouter for lightweight client-side routing. The application is primarily a single-page game with minimal navigation needs.

**UI Component System**: Shadcn/ui components built on Radix UI primitives, providing accessible, customizable components with Tailwind CSS styling. Uses the "new-york" style variant with CSS variables for theming.

**State Management**: React hooks for local component state, TanStack Query (React Query) for server state management and caching.

**Design System**: Custom Tailwind configuration with design tokens for colors, spacing, and typography. Gaming-focused UI principles emphasizing clarity, generous tap targets, and immediate visual feedback. Follows a utility-first approach with consistent spacing units and responsive layouts.

**Web3 Integration**: 
- Wagmi for Ethereum interactions and wallet management
- RainbowKit for wallet connection UI
- Viem for Ethereum utilities and type-safe contract interactions
- Configured for Base Sepolia testnet (Chain ID: 84532)

**Audio System**: 
- Web Audio API for generating synthetic sound effects
- Custom React hook (useSounds) for sound management
- Sound effects: player move click, computer move click, win chime, lose tone, draw tone
- Ambient background: Custom drill beat MP3 ("Drill X0_mix")
  - Loaded from attached_assets/Drill X0_mix_1761502671826.mp3
  - Seamless looping playback using HTML Audio element with Web Audio API gain control
  - Fades in over 2 seconds when game starts at 15% volume
  - Fades out over 2 seconds when game ends or muted
  - Continues playing between rounds without restarting
- Mute toggle with localStorage persistence
- Non-overlapping sound effect playback to prevent audio lag

**Key Design Decisions**:
- No traditional authentication system - wallet connection serves as user identity
- Game state managed entirely client-side (no backend persistence)
- Real-time ETH price fetching from CoinGecko to calculate USD-equivalent payment amounts
- Component-based architecture with clear separation between game logic and Web3 interactions
- Synthetic audio generation (no external audio files) for lightweight, instant loading

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js.

**API Structure**: Minimal backend implementation with placeholder routes. Current architecture suggests backend is primarily for serving the frontend, with game logic and blockchain interactions handled client-side.

**Session Management**: Infrastructure includes connect-pg-simple for PostgreSQL session storage, though not actively implemented in current routes.

**Build System**: esbuild for fast backend compilation, producing ESM modules for production.

**Development Setup**: tsx for TypeScript execution in development with hot reload capabilities.

**Key Design Decisions**:
- Stateless backend approach - no game state persistence
- API endpoints prefixed with `/api` for clear separation from frontend routes
- In-memory storage pattern defined but not actively used (future extensibility)
- Vite middleware integration for unified development server

### Data Storage

**ORM**: Drizzle ORM configured for PostgreSQL with Neon serverless driver.

**Database Schema**: Minimal user table defined with:
- UUID primary keys (generated via `gen_random_uuid()`)
- Username/password fields (authentication infrastructure, not actively used)
- Zod schema validation through drizzle-zod

**Migration Strategy**: Drizzle Kit for schema migrations with output to `/migrations` directory.

**Current State**: Database infrastructure present but not utilized - wallet addresses serve as user identity without traditional user accounts.

**Key Design Decisions**:
- Schema prepared for future user management features
- Serverless-compatible database solution (Neon)
- Type-safe schema definitions shared between frontend and backend
- No active data persistence - game operates entirely client-side

### Smart Contract Architecture

**Contract**: TicTacToeGame.sol (Solidity 0.8.20+) deployed on Base Sepolia testnet.

**Key Functions**:
- `startGame()` - Payable function accepting ETH to initiate a game session
- `minPayment` - Configurable minimum payment threshold (default: 0.00001 ETH)
- `updateMinPayment()` - Owner-only function to adjust minimum payment
- Events: `GameStarted` emitted with player address, timestamp, and amount paid

**Access Control**: Basic owner-only modifiers for administrative functions.

**Integration Pattern**: Frontend calculates exact ETH amount based on $0.10 USD target price, ensuring payments meet contract's minimum threshold while achieving dollar-denominated pricing.

**Deployment**: Manual deployment via Remix IDE with contract address configured in `client/src/lib/web3.ts`.

## External Dependencies

### Blockchain Services

- **Base Sepolia Testnet**: Ethereum Layer 2 testnet for game transactions
  - RPC: https://sepolia.base.org
  - Explorer: https://sepolia.basescan.org
- **Faucets**: Alchemy and Coinbase faucets for testnet ETH
- **WalletConnect**: Optional Project ID for enhanced wallet connectivity

### APIs

- **CoinGecko API**: Real-time ETH/USD price data for dynamic payment calculation (free tier, no authentication required)

### Development Tools

- **Remix IDE**: Smart contract compilation and deployment
- **Replit Plugins**: Development banner and cartographer for Replit-specific features (development only)

### UI Libraries

- **Radix UI**: Comprehensive collection of accessible component primitives (accordion, dialog, dropdown, toast, etc.)
- **Lucide React**: Icon library for UI elements
- **Tailwind CSS**: Utility-first CSS framework with autoprefixer for cross-browser compatibility

### Web3 Stack

- **@rainbow-me/rainbowkit**: Wallet connection UI and management (v2.2.9)
- **wagmi**: React hooks for Ethereum interactions (v2+)
- **viem**: TypeScript Ethereum utilities

### Data & State Management

- **@tanstack/react-query**: Server state management (v5.60.5)
- **wouter**: Lightweight routing library
- **zod**: TypeScript-first schema validation
- **react-hook-form** + **@hookform/resolvers**: Form handling with validation

### Database

- **@neondatabase/serverless**: Serverless Postgres driver
- **drizzle-orm**: TypeScript ORM
- **drizzle-kit**: Database migration toolkit
- **drizzle-zod**: Zod schema generation from Drizzle schemas

### Build & Development

- **Vite**: Frontend build tool and dev server
- **esbuild**: Fast JavaScript bundler for backend
- **tsx**: TypeScript execution for development
- **TypeScript**: Type safety across full stack