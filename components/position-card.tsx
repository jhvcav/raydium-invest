
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Plus, Minus, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPosition } from '@/lib/types';
import { formatUsdValue, formatPercentage, formatTokenAmount } from '@/lib/solana';

interface PositionCardProps {
  position: UserPosition;
  onAddLiquidity: (poolId: string) => void;
  onRemoveLiquidity: (poolId: string) => void;
  onViewDetails: (poolId: string) => void;
}

export function PositionCard({ 
  position, 
  onAddLiquidity, 
  onRemoveLiquidity, 
  onViewDetails 
}: PositionCardProps) {
  const totalRewards = position.rewards?.reduce((sum, reward) => sum + reward.accumulated, 0) || 0;
  const hasRewards = totalRewards > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 10px 25px rgba(157, 78, 221, 0.15)' }}
      className="bg-[#1E1933] rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold relative z-10">
              {position.tokenA[0]}
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center text-white font-bold">
              {position.tokenB[0]}
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{position.poolName}</h3>
            <p className="text-purple-400 text-sm">
              Déposé le {position.depositedAt.toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(position.poolId)}
          className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/20"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      {/* Value & Share */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#2A2240] rounded-lg p-4">
          <div className="text-purple-400 text-sm mb-1">Valeur Totale</div>
          <div className="text-white text-xl font-bold">
            {formatUsdValue(position.value)}
          </div>
        </div>
        
        <div className="bg-[#2A2240] rounded-lg p-4">
          <div className="text-purple-400 text-sm mb-1">Part du Pool</div>
          <div className="text-white text-xl font-bold">
            {formatPercentage(position.shareOfPool, 4)}
          </div>
        </div>
      </div>

      {/* LP Token Amount */}
      <div className="mb-4">
        <div className="text-purple-400 text-sm mb-2">Tokens LP</div>
        <div className="text-white font-medium">
          {formatTokenAmount(position.lpTokenAmount, 6)} LP
        </div>
      </div>

      {/* Rewards */}
      {hasRewards && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-purple-400 text-sm">Récompenses Accumulées</span>
          </div>
          
          <div className="space-y-2">
            {position.rewards.map((reward, index) => (
              <div key={index} className="flex items-center justify-between bg-[#2A2240] rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                    {reward.symbol[0]}
                  </div>
                  <span className="text-white font-medium">{reward.symbol}</span>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">
                    {formatTokenAmount(reward.accumulated.toString(), 6)}
                  </div>
                  <div className="text-xs text-purple-400">
                    +{formatTokenAmount(reward.daily.toString(), 6)}/jour
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={() => onAddLiquidity(position.poolId)}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
        
        <Button
          onClick={() => onRemoveLiquidity(position.poolId)}
          variant="outline"
          className="flex-1 border-purple-500 text-purple-300 hover:bg-purple-600 hover:text-white hover:scale-105 transition-all duration-200"
        >
          <Minus className="w-4 h-4 mr-2" />
          Retirer
        </Button>
      </div>
    </motion.div>
  );
}
