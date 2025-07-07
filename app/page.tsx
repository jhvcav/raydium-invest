
'use client';

import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { Wallet, TrendingUp, Shield, Zap, ExternalLink, Users, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WalletButton } from '@/components/wallet-button';
import { PoolsTable } from '@/components/pools-table';
import { MetricsDashboard } from '@/components/metrics-dashboard';
import { PositionCard } from '@/components/position-card';
import { TransactionHistory } from '@/components/transaction-history';
import { DepositModal } from '@/components/deposit-modal';
import { WithdrawModal } from '@/components/withdraw-modal';
import { LoadingState } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { RaydiumPool, UserPosition, TransactionHistory as TransactionType, TokenBalance, DepositFormData, WithdrawFormData, PoolMetrics } from '@/lib/types';
import { fetchPools, calculatePoolMetrics } from '@/lib/raydium';
import { formatUsdValue } from '@/lib/solana';

export default function HomePage() {
  const { connected, publicKey } = useWallet();
  const { toast } = useToast();
  
  // Data states
  const [pools, setPools] = useState<RaydiumPool[]>([]);
  const [poolsLoading, setPoolsLoading] = useState(true);
  const [positions, setPositions] = useState<UserPosition[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [metrics, setMetrics] = useState<PoolMetrics>({
    totalTvl: 0,
    totalVolume24h: 0,
    topApy: 0,
    totalPools: 0
  });

  // Modal states
  const [depositModal, setDepositModal] = useState<{
    isOpen: boolean;
    pool: RaydiumPool | null;
  }>({
    isOpen: false,
    pool: null
  });

  const [withdrawModal, setWithdrawModal] = useState<{
    isOpen: boolean;
    position: UserPosition | null;
  }>({
    isOpen: false,
    position: null
  });

  // Refs for scroll animations
  const heroRef = React.useRef(null);
  const poolsRef = React.useRef(null);
  const positionsRef = React.useRef(null);
  const historyRef = React.useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const poolsInView = useInView(poolsRef, { once: true });
  const positionsInView = useInView(positionsRef, { once: true });
  const historyInView = useInView(historyRef, { once: true });

  // Load pools data
  useEffect(() => {
    const loadPools = async () => {
      try {
        setPoolsLoading(true);
        const poolsData = await fetchPools();
        setPools(poolsData);
        setMetrics(calculatePoolMetrics(poolsData));
      } catch (error) {
        console.error('Error loading pools:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les pools de liquidité",
          variant: "destructive",
        });
      } finally {
        setPoolsLoading(false);
      }
    };

    loadPools();
    
    // Refresh pools every 30 seconds
    const interval = setInterval(loadPools, 30000);
    return () => clearInterval(interval);
  }, [toast]);

  // Load user data when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      loadUserData();
    } else {
      setPositions([]);
      setTransactions([]);
      setTokenBalances([]);
    }
  }, [connected, publicKey]);

  const loadUserData = async () => {
    if (!publicKey) return;

    try {
      setPositionsLoading(true);
      setTransactionsLoading(true);

      // TODO: Load actual user positions and transactions from API
      // For now, we'll show demo data
      const demoPositions: UserPosition[] = [
        {
          poolId: '1',
          poolName: 'SOL/USDC',
          tokenA: 'SOL',
          tokenB: 'USDC',
          lpTokenAmount: '15.5',
          shareOfPool: 0.0025,
          value: 1250.75,
          rewards: [
            {
              accumulated: 2.45,
              daily: 0.125,
              symbol: 'RAY'
            }
          ],
          depositedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        }
      ];

      const demoTransactions: TransactionType[] = [
        {
          id: '1',
          type: 'DEPOSIT',
          poolName: 'SOL/USDC',
          tokenA: 'SOL',
          tokenB: 'USDC',
          amountA: '5.5',
          amountB: '115.25',
          signature: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R4k3Dyjzvzp8eMZWUXbBCjEvw',
          status: 'CONFIRMED',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        }
      ];

      setTimeout(() => {
        setPositions(demoPositions);
        setTransactions(demoTransactions);
        setPositionsLoading(false);
        setTransactionsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error loading user data:', error);
      setPositionsLoading(false);
      setTransactionsLoading(false);
    }
  };

  // Handle deposit
  const handleDeposit = async (poolId: string, data: DepositFormData) => {
    try {
      // TODO: Implement actual deposit logic with Raydium SDK
      console.log('Deposit:', poolId, data);
      
      toast({
        title: "Dépôt initié",
        description: "Votre transaction est en cours de traitement...",
      });

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Dépôt réussi",
        description: "Votre liquidité a été déposée avec succès",
      });

      // Reload user data
      loadUserData();
    } catch (error: any) {
      console.error('Deposit error:', error);
      toast({
        title: "Erreur de dépôt",
        description: error.message || "Une erreur est survenue lors du dépôt",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Handle withdraw
  const handleWithdraw = async (poolId: string, data: WithdrawFormData) => {
    try {
      // TODO: Implement actual withdraw logic with Raydium SDK
      console.log('Withdraw:', poolId, data);
      
      toast({
        title: "Retrait initié",
        description: "Votre transaction est en cours de traitement...",
      });

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Retrait réussi",
        description: "Votre liquidité a été retirée avec succès",
      });

      // Reload user data
      loadUserData();
    } catch (error: any) {
      console.error('Withdraw error:', error);
      toast({
        title: "Erreur de retrait",
        description: error.message || "Une erreur est survenue lors du retrait",
        variant: "destructive",
      });
      throw error;
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#120E1F]">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                Raydium LP Farming
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Button
                variant="ghost"
                onClick={() => scrollToSection('pools')}
                className="text-purple-300 hover:text-white hover:bg-purple-600/20"
              >
                Pools
              </Button>
              {connected && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => scrollToSection('my-positions')}
                    className="text-purple-300 hover:text-white hover:bg-purple-600/20"
                  >
                    Mes Positions
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => scrollToSection('history')}
                    className="text-purple-300 hover:text-white hover:bg-purple-600/20"
                  >
                    Historique
                  </Button>
                </>
              )}
            </nav>

            <WalletButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Investissez et Maximisez vos{' '}
              <span className="gradient-text">Rendements</span>{' '}
              sur Raydium
            </h1>
            <p className="text-xl text-purple-300 mb-8 max-w-3xl mx-auto">
              Plateforme complète de LP farming sur Solana. Interface moderne, sécurisée et optimisée 
              pour maximiser vos profits dans les pools de liquidité Raydium.
            </p>
            
            {!connected ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <WalletButton />
                <Button
                  variant="outline"
                  onClick={() => scrollToSection('pools')}
                  className="border-purple-500 text-purple-300 hover:bg-purple-600 hover:text-white"
                >
                  Explorer les Pools
                  <ArrowDown className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => scrollToSection('pools')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
              >
                Voir les Pools Disponibles
                <ArrowDown className="w-5 h-5 ml-2" />
              </Button>
            )}
          </motion.div>

          {/* Metrics Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16"
          >
            <MetricsDashboard metrics={metrics} />
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: TrendingUp,
                title: 'APY Élevés',
                description: 'Jusqu\'à 200%+ d\'APY sur les meilleurs pools'
              },
              {
                icon: Shield,
                title: 'Sécurisé',
                description: 'Protocole audité et décentralisé sur Solana'
              },
              {
                icon: Zap,
                title: 'Rapide & Peu Coûteux',
                description: 'Transactions quasi-instantanées avec frais minimaux'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-600/20 mb-4">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-purple-300">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pools Section */}
      <section ref={poolsRef} id="pools" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={poolsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <PoolsTable
              pools={pools}
              loading={poolsLoading}
              onDeposit={(pool) => setDepositModal({ isOpen: true, pool })}
            />
          </motion.div>
        </div>
      </section>

      {/* User Positions Section */}
      {connected && (
        <section ref={positionsRef} id="my-positions" className="py-16 bg-[#0D0A15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={positionsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Mes Positions Actives</h2>
                <p className="text-purple-300">
                  Gérez vos investissements et surveillez vos récompenses en temps réel
                </p>
              </div>

              {positionsLoading ? (
                <LoadingState message="Chargement de vos positions..." />
              ) : positions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {positions.map((position) => (
                    <PositionCard
                      key={position.poolId}
                      position={position}
                      onAddLiquidity={(poolId) => {
                        const pool = pools.find(p => p.id === poolId);
                        if (pool) {
                          setDepositModal({ isOpen: true, pool });
                        }
                      }}
                      onRemoveLiquidity={(poolId) => {
                        const position = positions.find(p => p.poolId === poolId);
                        if (position) {
                          setWithdrawModal({ isOpen: true, position });
                        }
                      }}
                      onViewDetails={(poolId) => {
                        // TODO: Implement position details view
                        console.log('View details for position:', poolId);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Aucune position active
                  </h3>
                  <p className="text-purple-300 mb-6">
                    Commencez par déposer de la liquidité dans un pool pour voir vos positions ici
                  </p>
                  <Button
                    onClick={() => scrollToSection('pools')}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Explorer les Pools
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Transaction History Section */}
      {connected && (
        <section ref={historyRef} id="history" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={historyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <TransactionHistory
                transactions={transactions}
                loading={transactionsLoading}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#0D0A15] border-t border-purple-500/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                Raydium LP Farming
              </span>
            </div>
            <p className="text-purple-400 mb-4">
              Powered by Raydium Protocol sur Solana
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-purple-500">
              <span>Mode Production</span>
              <span>•</span>
              <span>Solana Mainnet</span>
              <span>•</span>
              <Button
                variant="link"
                className="text-purple-500 hover:text-purple-400 p-0 h-auto"
                onClick={() => window.open('https://raydium.io', '_blank')}
              >
                Raydium.io
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="mt-6 text-xs text-purple-600">
              <p>
                ⚠️ Les investissements en DeFi comportent des risques. 
                Veuillez faire vos propres recherches avant d'investir.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DepositModal
        isOpen={depositModal.isOpen}
        onClose={() => setDepositModal({ isOpen: false, pool: null })}
        pool={depositModal.pool}
        tokenBalances={tokenBalances}
        onDeposit={handleDeposit}
      />

      <WithdrawModal
        isOpen={withdrawModal.isOpen}
        onClose={() => setWithdrawModal({ isOpen: false, position: null })}
        position={withdrawModal.position}
        onWithdraw={handleWithdraw}
      />
    </div>
  );
}
