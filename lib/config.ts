// Configuration management for the RideShift app

export const config = {
  // Base network configuration
  base: {
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
    chainId: 8453,
  },

  // OnchainKit configuration
  onchainKit: {
    apiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || '',
  },

  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret-key',
    expiresIn: '24h',
  },

  // Farcaster configuration
  farcaster: {
    clientId: process.env.NEXT_PUBLIC_FARCASTER_CLIENT_ID || '',
    clientSecret: process.env.FARCASTER_CLIENT_SECRET || '',
  },

  // Mapping services
  maps: {
    mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
    openStreetMapKey: process.env.OPENSTREETMAP_API_KEY || '',
  },

  // NFT contracts
  nft: {
    driverContractAddress: process.env.NEXT_PUBLIC_DRIVER_NFT_CONTRACT_ADDRESS || '',
    privateKey: process.env.DRIVER_NFT_PRIVATE_KEY || '',
  },

  // Payment contracts
  payment: {
    contractAddress: process.env.NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS || '',
  },

  // WebSocket configuration
  websocket: {
    url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
  },

  // App configuration
  app: {
    env: process.env.NODE_ENV || 'development',
    name: 'RideShift',
    version: '1.0.0',
  },

  // Commission rates
  commission: {
    default: 0.15,
    min: 0.05,
    max: 0.25,
  },

  // Ride configuration
  ride: {
    maxSearchRadius: 10, // km
    defaultPickupTime: 5, // minutes
    maxWaitTime: 15, // minutes
  },

  // API rate limits
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
};

// Validation function to ensure required config is present
export function validateConfig() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_ONCHAINKIT_API_KEY',
    'NEXT_PUBLIC_BASE_RPC_URL',
  ];

  const missing = requiredEnvVars.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  return true;
}

// Export individual config sections for convenience
export const {
  base,
  onchainKit,
  database,
  jwt,
  farcaster,
  maps,
  nft,
  payment,
  websocket,
  app,
  commission,
  ride,
  rateLimit,
} = config;

