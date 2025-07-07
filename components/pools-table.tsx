
'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, DollarSign, BarChart3, Plus } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { RaydiumPool } from '@/lib/types';
import { formatUsdValue, formatPercentage } from '@/lib/solana';
import { searchPools, sortPools, getPriorityPools } from '@/lib/raydium';
import { PRIORITY_POOLS } from '@/lib/constants';

interface PoolsTableProps {
  pools: RaydiumPool[];
  loading: boolean;
  onDeposit: (pool: RaydiumPool) => void;
}

export function PoolsTable({ pools, loading, onDeposit }: PoolsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'apy' | 'tvl' | 'volume24h'>('apy');

  const filteredAndSortedPools = useMemo(() => {
    const searched = searchPools(pools, searchQuery);
    const sorted = sortPools(searched, sortBy);
    return getPriorityPools(sorted);
  }, [pools, searchQuery, sortBy]);

  const isPriorityPool = (pool: RaydiumPool) => {
    const poolName = `${pool.baseSymbol}-${pool.quoteSymbol}`;
    return PRIORITY_POOLS.includes(poolName) || PRIORITY_POOLS.includes(`${pool.quoteSymbol}-${pool.baseSymbol}`);
  };

  if (loading) {
    return (
      <div className="bg-[#1E1933] rounded-xl p-8">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-center text-purple-300">Chargement des pools...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1E1933] rounded-xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Pools de Liquidité</h2>
          <p className="text-purple-300">
            Explorez et investissez dans les meilleurs pools Raydium
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
            <Input
              placeholder="Rechercher un pool (ex: SOL, USDC)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-[#2A2240] border-purple-500/30 text-white placeholder:text-purple-400"
            />
          </div>

          {/* Sort options */}
          <div className="flex gap-2">
            {[
              { key: 'apy', label: 'APY', icon: TrendingUp },
              { key: 'tvl', label: 'TVL', icon: DollarSign },
              { key: 'volume24h', label: 'Volume', icon: BarChart3 }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={sortBy === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(key as any)}
                className={
                  sortBy === key
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "border-purple-500/30 text-purple-300 hover:bg-purple-600/20"
                }
              >
                <Icon className="w-4 h-4 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-500/30">
              <th className="text-left py-3 px-2 text-purple-300 font-medium">Paire</th>
              <th className="text-right py-3 px-2 text-purple-300 font-medium">APY</th>
              <th className="text-right py-3 px-2 text-purple-300 font-medium">TVL</th>
              <th className="text-right py-3 px-2 text-purple-300 font-medium">Volume 24h</th>
              <th className="text-right py-3 px-2 text-purple-300 font-medium">Type</th>
              <th className="text-center py-3 px-2 text-purple-300 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedPools.map((pool, index) => (
              <motion.tr
                key={pool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-purple-500/10 hover:bg-purple-600/5 transition-colors"
              >
                {/* Pool Pair */}
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold relative z-10">
                        {pool.baseSymbol[0]}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center text-white text-xs font-bold">
                        {pool.quoteSymbol[0]}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          {pool.baseSymbol}/{pool.quoteSymbol}
                        </span>
                        {isPriorityPool(pool) && (
                          <Badge className="bg-purple-600 text-white text-xs">
                            Recommandé
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-purple-400">
                        {pool.type} Pool
                      </div>
                    </div>
                  </div>
                </td>

                {/* APY */}
                <td className="py-4 px-2 text-right">
                  <div className="text-green-400 font-bold">
                    {formatPercentage(pool.apy)}
                  </div>
                  {pool.farmApr > 0 && (
                    <div className="text-xs text-purple-400">
                      +{formatPercentage(pool.farmApr)} Farm
                    </div>
                  )}
                </td>

                {/* TVL */}
                <td className="py-4 px-2 text-right">
                  <div className="text-white font-medium">
                    {formatUsdValue(pool.tvl)}
                  </div>
                </td>

                {/* Volume 24h */}
                <td className="py-4 px-2 text-right">
                  <div className="text-purple-300">
                    {formatUsdValue(pool.volume24h)}
                  </div>
                </td>

                {/* Type */}
                <td className="py-4 px-2 text-right">
                  <Badge 
                    variant={pool.type === 'CLMM' ? 'default' : 'secondary'}
                    className={pool.type === 'CLMM' ? 'bg-purple-600' : 'bg-purple-800'}
                  >
                    {pool.type}
                  </Badge>
                </td>

                {/* Action */}
                <td className="py-4 px-2 text-center">
                  <Button
                    onClick={() => onDeposit(pool)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Déposer
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedPools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-purple-400 text-lg">Aucun pool trouvé</div>
            <div className="text-purple-500 text-sm mt-2">
              Essayez de modifier vos critères de recherche
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
