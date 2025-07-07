
'use client';

import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { RPC_ENDPOINT, NETWORK } from '@/lib/constants';

// Import wallet adapter CSS
require('@solana/wallet-adapter-react-ui/styles.css');

interface Props {
  children: ReactNode;
}

export const SolanaWalletProvider: FC<Props> = ({ children }) => {
  // Configure the network
  const network = NETWORK === 'mainnet-beta' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;
  
  // Configure RPC endpoint
  const endpoint = useMemo(() => RPC_ENDPOINT, []);

  // Configure supported wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
