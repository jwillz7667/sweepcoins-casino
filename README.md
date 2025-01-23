# SweepCoins Casino

A modern, secure, and feature-rich online casino platform built with Supabase and React.

## Features

### 🎮 Games
- Multiple game types: Slots, Table Games, Live Casino, and Instant Games
- Popular providers: Pragmatic Play, Evolution Gaming, Playtech
- In-house instant games: Mines, Plinko
- Real-time game sessions and bet tracking

### 💰 Payment System
- Cryptocurrency integration with MetaMask
- Multiple transaction types support
- Secure balance management
- Transaction history tracking

### 🎁 Bonus System
- Welcome bonuses
- Reload bonuses
- Weekly cashback
- VIP rewards
- Loyalty program
- Referral system

### 👑 VIP Program
- 5-tier VIP system (Bronze to Diamond)
- Progressive rewards
- Weekly bonuses
- Cashback rates
- Point-based progression

### 🎯 Features
- Real-time jackpots
- Game favorites
- User profiles
- KYC verification
- Comprehensive transaction history
- Secure authentication

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL with RLS (Row Level Security)
- **Payments**: Web3/MetaMask Integration

## Database Schema

### Core Tables
- `profiles`: User profiles and balances
- `games`: Game catalog and configurations
- `game_sessions`: Active and historical game sessions
- `bets`: Bet records and outcomes
- `transactions`: Financial transaction records
- `crypto_transactions`: Cryptocurrency transaction records

### Feature Tables
- `jackpots`: Progressive jackpot management
- `user_favorites`: User's favorite games
- `bonuses`: User bonus records
- `vip_levels`: VIP tier configurations
- `user_vip_progress`: User VIP progression

## Security Features

- Row Level Security (RLS) policies for all tables
- Secure password hashing
- Protected API endpoints
- Transaction-level consistency
- Audit logging
- KYC verification system

## Getting Started

### Prerequisites
- Node.js 16+
- Supabase CLI
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sweepcoins-casino.git
cd sweepcoins-casino
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
```bash
supabase init
supabase start
```

4. Run database migrations:
```bash
supabase db reset
```

5. Create environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your Supabase credentials.

6. Start the development server:
```bash
npm run dev
```

### Database Setup

The database schema includes:
- Enum types for various statuses
- Tables with proper relationships
- Indexes for performance
- Triggers for automated updates
- RLS policies for security
- Stored procedures for complex operations

### Initial Data

The seed file provides:
- VIP level configurations
- Initial game catalog
- Jackpot configurations
- Admin user creation function

## Development

### Code Structure
```
src/
├── components/
│   ├── games/
│   ├── dashboard/
│   ├── ui/
│   └── wallet/
├── contexts/
│   ├── AuthContext
│   └── Web3Context
├── hooks/
├── pages/
└── utils/
```

### Key Files
- `supabase/migrations/`: Database migrations
- `supabase/seed.sql`: Initial data
- `src/App.tsx`: Main application component
- `src/contexts/`: Application contexts

## Deployment

1. Set up production Supabase project
2. Configure environment variables
3. Run migrations on production database
4. Deploy frontend to your hosting provider

## Security Considerations

- All database access is controlled through RLS policies
- User authentication is handled by Supabase Auth
- Cryptocurrency transactions are verified on-chain
- Sensitive data is encrypted
- Regular security audits recommended

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@sweepcoins.com or join our Discord community.
