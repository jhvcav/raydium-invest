
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Loader2, Minus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { UserPosition, WithdrawFormData } from '@/lib/types';
import { formatTokenAmount, formatUsdValue, formatPercentage } from '@/lib/solana';
import { SLIPPAGE_OPTIONS, WITHDRAW_PRESET_PERCENTAGES } from '@/lib/constants';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: UserPosition | null;
  onWithdraw: (poolId: string, data: WithdrawFormData) => Promise<void>;
}

export function WithdrawModal({ 
  isOpen, 
  onClose, 
  position, 
  onWithdraw 
}: WithdrawModalProps) {
  const [formData, setFormData] = useState<WithdrawFormData>({
    percentage: 25,
    slippage: 0.5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when position changes
  useEffect(() => {
    setFormData({
      percentage: 25,
      slippage: 0.5
    });
    setError(null);
  }, [position?.poolId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!position) return;

    if (formData.percentage <= 0 || formData.percentage > 100) {
      setError('Le pourcentage doit être entre 1 et 100%');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onWithdraw(position.poolId, formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors du retrait');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!position) return null;

  const withdrawValue = (position.value * formData.percentage) / 100;
  const withdrawLpAmount = (parseFloat(position.lpTokenAmount) * formData.percentage) / 100;
  const totalRewards = position.rewards?.reduce((sum, reward) => sum + reward.accumulated, 0) || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="bg-[#1E1933] border-purple-500/30 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold relative z-10">
                    {position.tokenA[0]}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center text-white text-sm font-bold">
                    {position.tokenB[0]}
                  </div>
                </div>
                Retirer de {position.poolName}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Position Info */}
              <div className="bg-[#2A2240] rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-400">Valeur totale</span>
                  <span className="text-white font-bold">
                    {formatUsdValue(position.value)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-400">Tokens LP</span>
                  <span className="text-white">
                    {formatTokenAmount(position.lpTokenAmount, 6)} LP
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-400">Part du pool</span>
                  <span className="text-white">
                    {formatPercentage(position.shareOfPool, 4)}
                  </span>
                </div>
              </div>

              {/* Percentage Selection */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-purple-400 text-sm">
                    Pourcentage à retirer
                  </label>
                  <span className="text-white font-bold text-lg">
                    {formData.percentage}%
                  </span>
                </div>

                {/* Preset Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {WITHDRAW_PRESET_PERCENTAGES.map((percentage) => (
                    <Button
                      key={percentage}
                      type="button"
                      size="sm"
                      variant={formData.percentage === percentage ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, percentage }))}
                      className={
                        formData.percentage === percentage
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "border-purple-500/30 text-purple-300 hover:bg-purple-600/20"
                      }
                    >
                      {percentage}%
                    </Button>
                  ))}
                </div>

                {/* Slider */}
                <div className="px-2">
                  <Slider
                    value={[formData.percentage]}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, percentage: value[0] }))}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Slippage */}
              <div className="space-y-3">
                <label className="text-purple-400 text-sm flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Tolérance de Slippage: {formatPercentage(formData.slippage)}
                </label>
                <div className="flex gap-2">
                  {SLIPPAGE_OPTIONS.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      size="sm"
                      variant={formData.slippage === option ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, slippage: option }))}
                      className={
                        formData.slippage === option
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "border-purple-500/30 text-purple-300 hover:bg-purple-600/20"
                      }
                    >
                      {formatPercentage(option)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Withdrawal Summary */}
              <div className="bg-[#2A2240] rounded-lg p-4">
                <div className="text-purple-400 text-sm mb-3">Résumé du retrait</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-300">Valeur à retirer</span>
                    <span className="text-white font-medium">
                      {formatUsdValue(withdrawValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Tokens LP à retirer</span>
                    <span className="text-white font-medium">
                      {formatTokenAmount(withdrawLpAmount.toString(), 6)} LP
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Valeur restante</span>
                    <span className="text-white font-medium">
                      {formatUsdValue(position.value - withdrawValue)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rewards Info */}
              {totalRewards > 0 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Récompenses disponibles</span>
                  </div>
                  <div className="text-green-300 text-sm">
                    Vos récompenses accumulées seront automatiquement récoltées lors du retrait.
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-600/20"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Retrait en cours...
                    </>
                  ) : (
                    <>
                      <Minus className="w-4 h-4 mr-2" />
                      Retirer la Liquidité
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
