
'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Wallet, Loader2 } from 'lucide-react';
import { shortenAddress } from '@/lib/solana';

export function WalletButton() {
  const { publicKey, connected, connecting, disconnect } = useWallet();

  if (connecting) {
    return (
      <Button disabled className="bg-purple-600 hover:bg-purple-700">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Connexion...
      </Button>
    );
  }

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm text-purple-300">
          {shortenAddress(publicKey)}
        </div>
        <Button
          onClick={disconnect}
          variant="outline"
          size="sm"
          className="border-purple-500 text-purple-300 hover:bg-purple-600 hover:text-white"
        >
          Déconnecter
        </Button>
      </div>
    );
  }

  return (
    <WalletMultiButton className="!bg-purple-600 !hover:bg-purple-700 !text-white !rounded-lg !px-4 !py-2 !font-medium !transition-all !duration-200 !border-none">
      <Wallet className="w-4 h-4 mr-2" />
      Connecter le Wallet
    </WalletMultiButton>
  );
}
