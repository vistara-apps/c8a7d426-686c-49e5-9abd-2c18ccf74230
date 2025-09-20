# RideShift - Decentralized Rideshare Mini App

A decentralized rideshare platform built for Farcaster, connecting riders and drivers with transparent, community-governed pricing.

## Features

### 🚗 Core Functionality
- **Ride Matching**: Connect riders with nearby drivers
- **In-Frame Booking**: Request and pay for rides directly in Farcaster
- **Real-time Updates**: Track ride status and driver location
- **Fair Pricing**: Transparent fare calculation with community-governed commission rates

### 👨‍💼 Driver Features
- **Quick Onboarding**: Streamlined verification using Farcaster identity
- **Driver NFT**: Mint driver credentials as NFTs for verification
- **Dashboard**: Track earnings, rides, and online status
- **Fair Commissions**: Community-governed commission structure

### 🗳️ Governance
- **Community Proposals**: Suggest changes to commission rates
- **Voting System**: Vote on platform improvements
- **Transparent Rates**: All commission changes are community-approved

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (Ethereum L2)
- **Identity**: Farcaster integration via MiniKit
- **Wallet**: Base Wallet integration
- **UI**: Tailwind CSS with custom design system
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites
- Node.js 18+ 
- Base Wallet installed
- Farcaster account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/rideshift-miniapp.git
cd rideshift-miniapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Add your OnchainKit API key to `.env.local`:
```
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main page
│   ├── providers.tsx      # MiniKit and OnchainKit providers
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── AppShell.tsx       # Main app container
│   ├── RideRequestForm.tsx # Ride booking interface
│   ├── DriverDashboard.tsx # Driver management
│   ├── OnboardingFlow.tsx  # Driver verification
│   └── GovernancePanel.tsx # Community governance
├── lib/                   # Utilities and types
│   ├── types.ts           # TypeScript definitions
│   ├── utils.ts           # Helper functions
│   └── constants.ts       # App constants
└── public/               # Static assets
    └── manifest.json     # Farcaster frame manifest
```

## Key Components

### RideRequestForm
- Location input with quick selection
- Fare estimation
- Real-time ride matching
- Payment integration

### DriverDashboard  
- Online/offline status toggle
- Available rides display
- Earnings tracking
- Ride acceptance interface

### OnboardingFlow
- Multi-step driver verification
- Vehicle information collection
- Driver NFT minting
- Identity verification via Farcaster

### GovernancePanel
- Commission rate proposals
- Community voting
- Proposal creation
- Governance statistics

## API Integration

### Farcaster Integration
- User identity via MiniKit
- Frame-native experience
- Social features and sharing

### Base Wallet
- Secure payment processing
- NFT minting for driver credentials
- Transaction management

### Mapping Services
- Location geocoding
- Route visualization
- Distance calculation

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Manual Deployment
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Documentation: [Base Mini Apps Docs](https://docs.base.org/mini-apps/)
- Community: [Farcaster Discord](https://discord.gg/farcaster)
- Issues: [GitHub Issues](https://github.com/your-username/rideshift-miniapp/issues)

## Roadmap

- [ ] Real-time GPS tracking
- [ ] Multi-city expansion
- [ ] Driver rating system
- [ ] Loyalty token rewards
- [ ] Fleet management tools
- [ ] Advanced governance features
