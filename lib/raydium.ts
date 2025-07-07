
import { Raydium } from '@raydium-io/raydium-sdk-v2';
import { connection } from './solana';
import { RAYDIUM_API_V3_BASE, TOKENS } from './constants';
import { RaydiumPool, FarmReward, PriceData, PoolMetrics } from './types';

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Initialize Raydium SDK (will be done in components with wallet)
export function initializeRaydium(owner: any) {
  return Raydium.load({
    connection,
    owner,
    disableFeatureCheck: true
  });
}

// Fetch pools data from Raydium API V3
export async function fetchPools(): Promise<RaydiumPool[]> {
  const cacheKey = 'pools';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const [poolsResponse, farmsResponse] = await Promise.all([
      fetch(`${RAYDIUM_API_V3_BASE}/pools/info/list`),
      fetch(`${RAYDIUM_API_V3_BASE}/farms/info/list`)
    ]);

    if (!poolsResponse.ok || !farmsResponse.ok) {
      throw new Error('Failed to fetch pools or farms data');
    }

    const poolsData = await poolsResponse.json();
    const farmsData = await farmsResponse.json();

    // Create farms map for quick lookup
    const farmsMap = new Map();
    farmsData?.data?.forEach((farm: any) => {
      if (farm.poolId) {
        farmsMap.set(farm.poolId, farm);
      }
    });

    const pools: RaydiumPool[] = poolsData?.data?.map((pool: any) => {
      const farm = farmsMap.get(pool.id);
      const baseToken = TOKENS[pool.mintA?.symbol as keyof typeof TOKENS] || 
                       { symbol: pool.mintA?.symbol || 'Unknown', decimals: pool.mintA?.decimals || 9 };
      const quoteToken = TOKENS[pool.mintB?.symbol as keyof typeof TOKENS] || 
                        { symbol: pool.mintB?.symbol || 'Unknown', decimals: pool.mintB?.decimals || 9 };

      return {
        id: pool.id,
        ammId: pool.ammId || pool.id,
        baseMint: pool.mintA?.address || '',
        quoteMint: pool.mintB?.address || '',
        baseSymbol: baseToken.symbol,
        quoteSymbol: quoteToken.symbol,
        baseDecimals: baseToken.decimals,
        quoteDecimals: quoteToken.decimals,
        lpMint: pool.lpMint?.address || '',
        
        // Metrics
        tvl: parseFloat(pool.tvl || '0'),
        volume24h: parseFloat(pool.day?.volume || '0'),
        apy: parseFloat(pool.day?.apr || '0') + (farm ? parseFloat(farm.apr || '0') : 0),
        apr: parseFloat(pool.day?.apr || '0'),
        feeApr: parseFloat(pool.day?.feeApr || '0'),
        farmApr: farm ? parseFloat(farm.apr || '0') : 0,
        
        // Price info
        price: parseFloat(pool.price || '0'),
        baseReserve: pool.mintAmountA || '0',
        quoteReserve: pool.mintAmountB || '0',
        
        // Pool type
        type: pool.type === 'Concentrated' ? 'CLMM' : 'CPMM',
        
        // Farm info
        farmId: farm?.id,
        farmRewards: farm?.rewardInfos?.map((reward: any) => ({
          mint: reward.mint?.address || '',
          symbol: reward.mint?.symbol || 'Unknown',
          apr: parseFloat(reward.apr || '0'),
          perDay: parseFloat(reward.perDay || '0')
        })) || []
      };
    }).filter((pool: RaydiumPool) => 
      pool.tvl > 1000 && // Filter out low TVL pools
      pool.baseSymbol && 
      pool.quoteSymbol &&
      pool.baseSymbol !== 'Unknown' &&
      pool.quoteSymbol !== 'Unknown'
    ) || [];

    // Sort by APY descending
    pools.sort((a, b) => b.apy - a.apy);

    setCachedData(cacheKey, pools);
    return pools;
  } catch (error) {
    console.error('Error fetching pools:', error);
    return [];
  }
}

// Fetch specific pool by ID
export async function fetchPoolById(poolId: string): Promise<RaydiumPool | null> {
  try {
    const response = await fetch(`${RAYDIUM_API_V3_BASE}/pools/info/ids?ids=${poolId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch pool data');
    }

    const data = await response.json();
    if (!data?.data?.[0]) return null;

    const pool = data.data[0];
    const baseToken = TOKENS[pool.mintA?.symbol as keyof typeof TOKENS] || 
                     { symbol: pool.mintA?.symbol || 'Unknown', decimals: pool.mintA?.decimals || 9 };
    const quoteToken = TOKENS[pool.mintB?.symbol as keyof typeof TOKENS] || 
                      { symbol: pool.mintB?.symbol || 'Unknown', decimals: pool.mintB?.decimals || 9 };

    return {
      id: pool.id,
      ammId: pool.ammId || pool.id,
      baseMint: pool.mintA?.address || '',
      quoteMint: pool.mintB?.address || '',
      baseSymbol: baseToken.symbol,
      quoteSymbol: quoteToken.symbol,
      baseDecimals: baseToken.decimals,
      quoteDecimals: quoteToken.decimals,
      lpMint: pool.lpMint?.address || '',
      
      tvl: parseFloat(pool.tvl || '0'),
      volume24h: parseFloat(pool.day?.volume || '0'),
      apy: parseFloat(pool.day?.apr || '0'),
      apr: parseFloat(pool.day?.apr || '0'),
      feeApr: parseFloat(pool.day?.feeApr || '0'),
      farmApr: 0,
      
      price: parseFloat(pool.price || '0'),
      baseReserve: pool.mintAmountA || '0',
      quoteReserve: pool.mintAmountB || '0',
      
      type: pool.type === 'Concentrated' ? 'CLMM' : 'CPMM',
      farmId: undefined,
      farmRewards: []
    };
  } catch (error) {
    console.error('Error fetching pool by ID:', error);
    return null;
  }
}

// Fetch token prices
export async function fetchTokenPrices(): Promise<PriceData> {
  const cacheKey = 'prices';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const tokenMints = Object.values(TOKENS).map(token => token.mint).join(',');
    const response = await fetch(`${RAYDIUM_API_V3_BASE}/mint/price?mints=${tokenMints}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch token prices');
    }

    const data = await response.json();
    const prices: PriceData = {};

    Object.entries(data?.data || {}).forEach(([mint, priceInfo]: [string, any]) => {
      prices[mint] = {
        price: parseFloat(priceInfo?.price || '0'),
        change24h: parseFloat(priceInfo?.change24h || '0')
      };
    });

    setCachedData(cacheKey, prices);
    return prices;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {};
  }
}

// Calculate pool metrics
export function calculatePoolMetrics(pools: RaydiumPool[]): PoolMetrics {
  const totalTvl = pools.reduce((sum, pool) => sum + pool.tvl, 0);
  const totalVolume24h = pools.reduce((sum, pool) => sum + pool.volume24h, 0);
  const topApy = pools.length > 0 ? Math.max(...pools.map(pool => pool.apy)) : 0;
  
  return {
    totalTvl,
    totalVolume24h,
    topApy,
    totalPools: pools.length
  };
}

// Search and filter pools
export function searchPools(pools: RaydiumPool[], query: string): RaydiumPool[] {
  if (!query.trim()) return pools;
  
  const searchTerm = query.toLowerCase();
  return pools.filter(pool => 
    pool.baseSymbol.toLowerCase().includes(searchTerm) ||
    pool.quoteSymbol.toLowerCase().includes(searchTerm) ||
    `${pool.baseSymbol}-${pool.quoteSymbol}`.toLowerCase().includes(searchTerm)
  );
}

// Sort pools by different criteria
export function sortPools(pools: RaydiumPool[], sortBy: 'apy' | 'tvl' | 'volume24h' = 'apy'): RaydiumPool[] {
  return [...pools].sort((a, b) => {
    switch (sortBy) {
      case 'tvl':
        return b.tvl - a.tvl;
      case 'volume24h':
        return b.volume24h - a.volume24h;
      case 'apy':
      default:
        return b.apy - a.apy;
    }
  });
}

// Get priority pools (SOL/USDC first)
export function getPriorityPools(pools: RaydiumPool[]): RaydiumPool[] {
  const priorityPools: RaydiumPool[] = [];
  const otherPools: RaydiumPool[] = [];

  pools.forEach(pool => {
    const poolName = `${pool.baseSymbol}-${pool.quoteSymbol}`;
    if (poolName === 'SOL-USDC' || poolName === 'USDC-SOL') {
      priorityPools.unshift(pool); // SOL/USDC first
    } else if (poolName.includes('SOL') && (poolName.includes('USDT') || poolName.includes('RAY'))) {
      priorityPools.push(pool);
    } else {
      otherPools.push(pool);
    }
  });

  return [...priorityPools, ...otherPools];
}
