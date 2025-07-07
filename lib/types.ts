
import { PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";

export interface RaydiumPool {
  id: string;
  ammId: string;
  baseMint: string;
  quoteMint: string;
  baseSymbol: string;
  quoteSymbol: string;
  baseDecimals: number;
  quoteDecimals: number;
  lpMint: string;
  
  // Metrics
  tvl: number;
  volume24h: number;
  apy: number;
  apr: number;
  feeApr: number;
  farmApr: number;
  
  // Price info
  price: number;
  baseReserve: string;
  quoteReserve: string;
  
  // Pool type
  type: 'CPMM' | 'CLMM';
  
  // Farm info
  farmId?: string;
  farmRewards?: FarmReward[];
}

export interface FarmReward {
  mint: string;
  symbol: string;
  apr: number;
  perDay: number;
}

export interface UserPosition {
  poolId: string;
  poolName: string;
  tokenA: string;
  tokenB: string;
  lpTokenAmount: string;
  shareOfPool: number;
  value: number;
  rewards: {
    accumulated: number;
    daily: number;
    symbol: string;
  }[];
  depositedAt: Date;
}

export interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  publicKey: PublicKey | null;
  disconnect: () => Promise<void>;
  connect: () => Promise<void>;
  signTransaction: ((transaction: any) => Promise<any>) | undefined;
  signAllTransactions: ((transactions: any[]) => Promise<any[]>) | undefined;
}

export interface TokenBalance {
  mint: string;
  symbol: string;
  balance: number;
  decimals: number;
  uiAmount: number;
}

export interface DepositFormData {
  tokenAAmount: string;
  tokenBAmount: string;
  slippage: number;
}

export interface WithdrawFormData {
  percentage: number;
  slippage: number;
}

export interface TransactionHistory {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'HARVEST';
  poolName: string;
  tokenA: string;
  tokenB: string;
  amountA: string;
  amountB: string;
  signature: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  createdAt: Date;
}

export interface PriceData {
  [mint: string]: {
    price: number;
    change24h: number;
  };
}

export interface PoolMetrics {
  totalTvl: number;
  totalVolume24h: number;
  topApy: number;
  totalPools: number;
}
