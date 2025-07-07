
import { Connection, PublicKey, clusterApiUrl, Commitment } from '@solana/web3.js';
import { RPC_ENDPOINT, NETWORK } from './constants';

// Create Solana connection
export const connection = new Connection(
  RPC_ENDPOINT,
  {
    commitment: 'confirmed' as Commitment,
    confirmTransactionInitialTimeout: 60000,
  }
);

// Utility functions
export function shortenAddress(address: string | PublicKey, chars = 4): string {
  const addressStr = typeof address === 'string' ? address : address.toString();
  return `${addressStr.slice(0, chars)}...${addressStr.slice(-chars)}`;
}

export function isValidPublicKey(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function formatLamports(lamports: number, decimals = 9): number {
  return lamports / Math.pow(10, decimals);
}

export function toLamports(amount: number, decimals = 9): number {
  return Math.floor(amount * Math.pow(10, decimals));
}

export function formatTokenAmount(amount: string | number, decimals: number, maxDecimals = 6): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  const formatted = (num / Math.pow(10, decimals));
  
  if (formatted < 0.000001) return '< 0.000001';
  if (formatted < 1) return formatted.toFixed(Math.min(6, maxDecimals));
  if (formatted < 1000) return formatted.toFixed(Math.min(2, maxDecimals));
  if (formatted < 1000000) return `${(formatted / 1000).toFixed(1)}K`;
  return `${(formatted / 1000000).toFixed(1)}M`;
}

export function formatUsdValue(value: number): string {
  if (value < 0.01) return '< $0.01';
  if (value < 1000) return `$${value.toFixed(2)}`;
  if (value < 1000000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${(value / 1000000).toFixed(1)}M`;
}

export function formatPercentage(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

// Transaction status helpers
export async function confirmTransaction(
  signature: string,
  maxRetries = 30,
  retryDelay = 1000
): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const status = await connection.getSignatureStatus(signature);
      
      if (status?.value?.confirmationStatus === 'confirmed' || 
          status?.value?.confirmationStatus === 'finalized') {
        return !status.value.err;
      }
      
      if (status?.value?.err) {
        return false;
      }
      
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    } catch (error) {
      console.error('Error confirming transaction:', error);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  return false;
}

// Network status
export async function getNetworkStatus() {
  try {
    const [version, epochInfo, latestBlockhash] = await Promise.all([
      connection.getVersion(),
      connection.getEpochInfo(),
      connection.getLatestBlockhash()
    ]);
    
    return {
      healthy: !!latestBlockhash.blockhash,
      version: version['solana-core'],
      epoch: epochInfo.epoch,
      slotHeight: epochInfo.absoluteSlot
    };
  } catch (error) {
    console.error('Error getting network status:', error);
    return null;
  }
}
