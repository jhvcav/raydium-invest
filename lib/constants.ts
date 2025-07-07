
import { PublicKey } from "@solana/web3.js";

// Solana Configuration
export const NETWORK = process.env.NODE_ENV === 'production' ? 'mainnet-beta' : 'devnet';
export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 
  (NETWORK === 'mainnet-beta' 
    ? 'https://api.mainnet-beta.solana.com'
    : 'https://api.devnet.solana.com');

// Raydium Configuration
export const RAYDIUM_LIQUIDITY_POOL_PROGRAM_ID_V4 = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');
export const RAYDIUM_AMM_PROGRAM_ID = new PublicKey('5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1');
export const SERUM_PROGRAM_ID_V3 = new PublicKey('9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM');

// Token Mints (Mainnet)
export const TOKENS = {
  SOL: {
    mint: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    logoURI: 'https://i.pinimg.com/736x/5e/35/49/5e35491224b6f36f3c56fbc08258d9eb.jpg'
  },
  USDC: {
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://i.pinimg.com/originals/a4/50/74/a4507484a0d9312158db2c62d0efdea5.png'
  },
  USDT: {
    mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://i.pinimg.com/736x/a4/90/08/a49008ea0fb2ccac5c188f4f2f913057.jpg'
  },
  RAY: {
    mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    symbol: 'RAY',
    name: 'Raydium',
    decimals: 6,
    logoURI: 'https://lh5.googleusercontent.com/wjo7tbqark3oGHL22o0pkv5En3IkhUB5o58rg5U_cX17R-LYGUmhUvVVhPKcyk_-LyRn6h-ElbbovaBcJ8HqiA4P_Z2vIC8QHgZ1tMn-dc2OeG-Q014EM4dNuFc5jFM6hyo6YohD'
  },
  mSOL: {
    mint: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    symbol: 'mSOL',
    name: 'Marinade SOL',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png'
  }
} as const;

// Priority pools (SOL/USDC highlighted)
export const PRIORITY_POOLS = [
  'SOL-USDC',
  'SOL-USDT',
  'RAY-SOL',
  'mSOL-SOL'
];

// API Configuration
export const RAYDIUM_API_V3_BASE = 'https://api-v3.raydium.io';

// UI Constants
export const SLIPPAGE_OPTIONS = [0.1, 0.5, 1.0];
export const WITHDRAW_PRESET_PERCENTAGES = [25, 50, 75, 100];

// Theme Colors
export const THEME_COLORS = {
  primary: '#9D4EDD',
  primaryDark: '#7B2CBF',
  background: '#120E1F',
  surface: '#1E1933',
  surfaceLight: '#2A2240',
  text: '#F0EFFF',
  textSecondary: '#A39DBC',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  accent: '#E879F9'
} as const;

// Animation durations
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500
} as const;

// Refresh intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  pools: 30000, // 30 seconds
  positions: 15000, // 15 seconds
  prices: 10000, // 10 seconds
  transactions: 5000 // 5 seconds
} as const;
