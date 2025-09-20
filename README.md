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

## API Documentation

### Users API (`/api/users`)

#### GET `/api/users`
Get all users or filter by farcasterId.

**Query Parameters:**
- `farcasterId` (optional): Filter by specific user

**Response:**
```json
[
  {
    "farcasterId": "user123",
    "walletAddress": "0x...",
    "role": "rider",
    "rating": 4.8
  }
]
```

#### POST `/api/users`
Create a new user.

**Request Body:**
```json
{
  "farcasterId": "user123",
  "walletAddress": "0x...",
  "role": "rider"
}
```

#### PUT `/api/users`
Update user information.

**Request Body:**
```json
{
  "farcasterId": "user123",
  "rating": 4.9
}
```

### Rides API (`/api/rides`)

#### GET `/api/rides`
Get rides with optional filtering.

**Query Parameters:**
- `status`: Filter by ride status (requested, accepted, in_progress, completed, cancelled)
- `requesterId`: Filter by rider
- `driverId`: Filter by driver

#### POST `/api/rides`
Create a new ride request.

**Request Body:**
```json
{
  "requesterId": "user123",
  "pickupLocation": "Times Square, New York",
  "dropoffLocation": "Central Park, New York"
}
```

#### PATCH `/api/rides`
Update ride status (accept, start, complete, cancel).

**Request Body:**
```json
{
  "rideId": "ride_123",
  "driverId": "driver456",
  "action": "accept"
}
```

### Drivers API (`/api/drivers`)

#### GET `/api/drivers`
Get driver profiles.

**Query Parameters:**
- `userId`: Filter by specific driver
- `status`: Filter by verification status

#### POST `/api/drivers`
Create driver profile.

**Request Body:**
```json
{
  "userId": "driver123",
  "vehicleDetails": "2020 Toyota Camry",
  "licenseNumber": "DL123456"
}
```

#### PATCH `/api/drivers`
Update driver profile (verify, activate, deactivate).

**Request Body:**
```json
{
  "userId": "driver123",
  "action": "verify"
}
```

### Governance API (`/api/governance`)

#### GET `/api/governance`
Get governance proposals.

**Query Parameters:**
- `status`: Filter by proposal status
- `proposerId`: Filter by proposer

#### POST `/api/governance`
Create new proposal.

**Request Body:**
```json
{
  "proposerId": "user123",
  "newRate": 0.12,
  "description": "Reduce commission rate to 12%"
}
```

#### PATCH `/api/governance`
Vote on proposal.

**Request Body:**
```json
{
  "proposalId": "prop_123",
  "voterId": "user456",
  "action": "support"
}
```

### Maps API (`/api/maps`)

#### GET `/api/maps?action=geocode`
Geocode an address to coordinates.

**Query Parameters:**
- `address`: Address to geocode

#### GET `/api/maps?action=route`
Get route information between two locations.

**Query Parameters:**
- `pickup`: Pickup location
- `destination`: Dropoff location

#### GET `/api/maps?action=nearby`
Find nearby drivers.

**Query Parameters:**
- `lat`: Latitude
- `lng`: Longitude
- `radius`: Search radius in km

### Payments API (`/api/payments`)

#### POST `/api/payments`
Process ride payment.

**Request Body:**
```json
{
  "rideId": "ride_123",
  "amount": 15.50,
  "fromAddress": "0x...",
  "toAddress": "0x..."
}
```

#### GET `/api/payments`
Check payment status.

**Query Parameters:**
- `transactionHash`: Transaction hash to check

### NFT API (`/api/nft`)

#### POST `/api/nft`
Mint driver NFT.

**Request Body:**
```json
{
  "userId": "driver123",
  "driverProfile": {
    "vehicleDetails": "2020 Toyota Camry",
    "licenseNumber": "DL123456",
    "verificationStatus": "verified"
  }
}
```

#### GET `/api/nft`
Get NFT metadata.

**Query Parameters:**
- `tokenId`: NFT token ID

### WebSocket API (`/api/ws`)

#### GET `/api/ws`
Get real-time updates.

**Query Parameters:**
- `action`: Type of update (ride-updates, driver-location, governance-updates)
- `userId`: User ID for updates

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Base Mini App Configuration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# Database Configuration (if using external database)
DATABASE_URL=your_database_url_here

# JWT Secret for API authentication
JWT_SECRET=your_jwt_secret_here

# Farcaster Configuration
NEXT_PUBLIC_FARCASTER_CLIENT_ID=your_farcaster_client_id_here
FARCASTER_CLIENT_SECRET=your_farcaster_client_secret_here

# Mapping Service Configuration
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
OPENSTREETMAP_API_KEY=your_openstreetmap_key_here

# NFT Contract Configuration
NEXT_PUBLIC_DRIVER_NFT_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
DRIVER_NFT_PRIVATE_KEY=your_nft_contract_private_key_here

# Payment Configuration
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890

# WebSocket Configuration
NEXT_PUBLIC_WS_URL=wss://your-websocket-server.com

# Environment
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
```

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
