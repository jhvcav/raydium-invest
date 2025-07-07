
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, BarChart3, Zap } from 'lucide-react';
import { PoolMetrics } from '@/lib/types';
import { formatUsdValue, formatPercentage } from '@/lib/solana';

interface MetricsDashboardProps {
  metrics: PoolMetrics;
}

export function MetricsDashboard({ metrics }: MetricsDashboardProps) {
  const cards = [
    {
      title: 'TVL Totale',
      value: formatUsdValue(metrics.totalTvl),
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      change: '+12.5%'
    },
    {
      title: 'Volume 24h',
      value: formatUsdValue(metrics.totalVolume24h),
      icon: BarChart3,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      change: '+8.3%'
    },
    {
      title: 'Meilleur APY',
      value: formatPercentage(metrics.topApy),
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      change: '+2.1%'
    },
    {
      title: 'Pools Actifs',
      value: metrics.totalPools.toString(),
      icon: Zap,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      change: '+5'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -2, boxShadow: '0 10px 25px rgba(157, 78, 221, 0.15)' }}
          className="bg-[#1E1933] rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div className="text-green-400 text-sm font-medium">
              {card.change}
            </div>
          </div>
          
          <div className="mb-2">
            <h3 className="text-purple-300 text-sm font-medium">
              {card.title}
            </h3>
          </div>
          
          <div className="text-white text-2xl font-bold">
            {card.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
