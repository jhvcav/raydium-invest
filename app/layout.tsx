
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SolanaWalletProvider } from '@/components/wallet-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Raydium LP Farming - Investissement DeFi sur Solana',
  description: 'Interface d\'investissement complète pour le LP farming sur Raydium. Maximisez vos rendements avec les pools de liquidité Solana.',
  keywords: 'Raydium, LP farming, Solana, DeFi, liquidité, investissement, crypto',
  authors: [{ name: 'Raydium LP Farming' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#9D4EDD',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Raydium LP Farming - Interface d\'Investissement DeFi',
    description: 'Plateforme complète pour investir dans les pools de liquidité Raydium sur Solana. APY élevés, interface moderne, sécurisé.',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Raydium LP Farming',
    description: 'Interface d\'investissement pour le LP farming sur Raydium',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SolanaWalletProvider>
            <div className="min-h-screen bg-[#120E1F]">
              {children}
            </div>
            <Toaster />
          </SolanaWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
