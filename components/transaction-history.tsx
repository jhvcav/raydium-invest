
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, CheckCircle, XCircle, Plus, Minus, Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TransactionHistory as TransactionType } from '@/lib/types';
import { formatTokenAmount, shortenAddress } from '@/lib/solana';

interface TransactionHistoryProps {
  transactions: TransactionType[];
  loading: boolean;
}

export function TransactionHistory({ transactions, loading }: TransactionHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <Plus className="w-4 h-4 text-green-400" />;
      case 'WITHDRAW':
        return <Minus className="w-4 h-4 text-red-400" />;
      case 'HARVEST':
        return <Gift className="w-4 h-4 text-purple-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return 'Dépôt';
      case 'WITHDRAW':
        return 'Retrait';
      case 'HARVEST':
        return 'Récolte';
      default:
        return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmé';
      case 'FAILED':
        return 'Échoué';
      case 'PENDING':
        return 'En attente';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-600';
      case 'FAILED':
        return 'bg-red-600';
      case 'PENDING':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1E1933] rounded-xl p-8">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-center text-purple-300">Chargement de l'historique...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-[#1E1933] rounded-xl p-8 text-center">
        <div className="text-purple-400 text-lg mb-2">Aucune transaction</div>
        <div className="text-purple-500 text-sm">
          Vos transactions apparaîtront ici une fois que vous aurez commencé à interagir avec les pools
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1E1933] rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Historique des Transactions</h2>
      
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#2A2240] rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              {/* Left side - Transaction info */}
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  {getTypeIcon(transaction.type)}
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-white font-medium">
                      {getTypeLabel(transaction.type)}
                    </span>
                    <Badge 
                      className={`${getStatusColor(transaction.status)} text-white text-xs`}
                    >
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1">{getStatusLabel(transaction.status)}</span>
                    </Badge>
                  </div>
                  
                  <div className="text-purple-400 text-sm">
                    {transaction.poolName}
                  </div>
                  
                  {(transaction.amountA || transaction.amountB) && (
                    <div className="text-purple-300 text-sm mt-1">
                      {transaction.amountA && (
                        <span className="mr-3">
                          {formatTokenAmount(transaction.amountA, 6)} {transaction.tokenA}
                        </span>
                      )}
                      {transaction.amountB && (
                        <span>
                          {formatTokenAmount(transaction.amountB, 6)} {transaction.tokenB}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right side - Date and link */}
              <div className="text-right">
                <div className="text-purple-400 text-sm mb-2">
                  {transaction.createdAt.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`https://solscan.io/tx/${transaction.signature}`, '_blank')}
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/20"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  {shortenAddress(transaction.signature)}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
