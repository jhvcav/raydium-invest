
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Loader2, Plus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { RaydiumPool, TokenBalance, DepositFormData } from '@/lib/types';
import { formatTokenAmount, formatUsdValue, formatPercentage } from '@/lib/solana';
import { SLIPPAGE_OPTIONS } from '@/lib/constants';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: RaydiumPool | null;
  tokenBalances: TokenBalance[];
  onDeposit: (poolId: string, data: DepositFormData) => Promise<void>;
}

export function DepositModal({ 
  isOpen, 
  onClose, 
  pool, 
  tokenBalances, 
  onDeposit 
}: DepositModalProps) {
  const [formData, setFormData] = useState<DepositFormData>({
    tokenAAmount: '',
    tokenBAmount: '',
    slippage: 0.5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get token balances
  const tokenABalance = tokenBalances.find(balance => 
    balance.mint === pool?.baseMint
  );
  const tokenBBalance = tokenBalances.find(balance => 
    balance.mint === pool?.quoteMint
  );

  // Reset form when pool changes
  useEffect(() => {
    setFormData({
      tokenAAmount: '',
      tokenBAmount: '',
      slippage: 0.5
    });
    setError(null);
  }, [pool?.id]);

  // Calculate the other token amount based on pool ratio
  const updateTokenAmounts = (amount: string, isTokenA: boolean) => {
    if (!pool || !amount || isNaN(parseFloat(amount))) {
      return;
    }

    const inputAmount = parseFloat(amount);
    const ratio = pool.price; // tokenB per tokenA

    if (isTokenA) {
      const tokenBAmount = (inputAmount * ratio).toFixed(pool.quoteDecimals);
      setFormData(prev => ({
        ...prev,
        tokenAAmount: amount,
        tokenBAmount: tokenBAmount
      }));
    } else {
      const tokenAAmount = (inputAmount / ratio).toFixed(pool.baseDecimals);
      setFormData(prev => ({
        ...prev,
        tokenAAmount: tokenAAmount,
        tokenBAmount: amount
      }));
    }
  };

  const handleMaxClick = (isTokenA: boolean) => {
    const balance = isTokenA ? tokenABalance : tokenBBalance;
    if (balance) {
      updateTokenAmounts(balance.uiAmount.toString(), isTokenA);
    }
  };

  const validateForm = (): string | null => {
    if (!formData.tokenAAmount || !formData.tokenBAmount) {
      return 'Veuillez entrer les montants pour les deux tokens';
    }

    const tokenAAmount = parseFloat(formData.tokenAAmount);
    const tokenBAmount = parseFloat(formData.tokenBAmount);

    if (tokenAAmount <= 0 || tokenBAmount <= 0) {
      return 'Les montants doivent être supérieurs à zéro';
    }

    if (tokenABalance && tokenAAmount > tokenABalance.uiAmount) {
      return `Solde insuffisant pour ${pool?.baseSymbol}`;
    }

    if (tokenBBalance && tokenBAmount > tokenBBalance.uiAmount) {
      return `Solde insuffisant pour ${pool?.quoteSymbol}`;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pool) return;

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onDeposit(pool.id, formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors du dépôt');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!pool) return null;

  const estimatedValue = parseFloat(formData.tokenAAmount || '0') * pool.price + 
                        parseFloat(formData.tokenBAmount || '0');

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="bg-[#1E1933] border-purple-500/30 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold relative z-10">
                    {pool.baseSymbol[0]}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center text-white text-sm font-bold">
                    {pool.quoteSymbol[0]}
                  </div>
                </div>
                Déposer dans {pool.baseSymbol}/{pool.quoteSymbol}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pool Info */}
              <div className="bg-[#2A2240] rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-400">APY</span>
                  <span className="text-green-400 font-bold">
                    {formatPercentage(pool.apy)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-400">TVL</span>
                  <span className="text-white">{formatUsdValue(pool.tvl)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-400">Type de Pool</span>
                  <Badge className={pool.type === 'CLMM' ? 'bg-purple-600' : 'bg-purple-800'}>
                    {pool.type}
                  </Badge>
                </div>
              </div>

              {/* Token A Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-purple-400 text-sm">
                    Montant {pool.baseSymbol}
                  </label>
                  <div className="text-xs text-purple-500">
                    Solde: {tokenABalance ? formatTokenAmount(tokenABalance.balance.toString(), tokenABalance.decimals) : '0'} {pool.baseSymbol}
                  </div>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    step="any"
                    value={formData.tokenAAmount}
                    onChange={(e) => updateTokenAmounts(e.target.value, true)}
                    placeholder={`0.0 ${pool.baseSymbol}`}
                    className="bg-[#2A2240] border-purple-500/30 text-white pr-16"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMaxClick(true)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
                  >
                    MAX
                  </Button>
                </div>
              </div>

              {/* Token B Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-purple-400 text-sm">
                    Montant {pool.quoteSymbol}
                  </label>
                  <div className="text-xs text-purple-500">
                    Solde: {tokenBBalance ? formatTokenAmount(tokenBBalance.balance.toString(), tokenBBalance.decimals) : '0'} {pool.quoteSymbol}
                  </div>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    step="any"
                    value={formData.tokenBAmount}
                    onChange={(e) => updateTokenAmounts(e.target.value, false)}
                    placeholder={`0.0 ${pool.quoteSymbol}`}
                    className="bg-[#2A2240] border-purple-500/30 text-white pr-16"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMaxClick(false)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
                  >
                    MAX
                  </Button>
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

              {/* Summary */}
              {estimatedValue > 0 && (
                <div className="bg-[#2A2240] rounded-lg p-4">
                  <div className="text-purple-400 text-sm mb-2">Résumé du dépôt</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Valeur estimée</span>
                      <span className="text-white font-medium">
                        {formatUsdValue(estimatedValue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Récompenses APY</span>
                      <span className="text-green-400 font-medium">
                        {formatPercentage(pool.apy)}
                      </span>
                    </div>
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
                  disabled={isSubmitting || !!validateForm()}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Dépôt en cours...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Déposer la Liquidité
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
