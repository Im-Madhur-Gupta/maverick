"use client";

import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import Header from "@/modules/common/components/Header";
import Footer from "@/modules/common/components/Footer";
import { Toaster } from "@/modules/common/components/ui/toaster";

import "./globals.css";
import { AppStoreProvider } from "@/modules/common/providers/AppStoreProvider";

const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error("REOWN_PROJECT_ID is not set");
}

// TODO: Fix Nextjs metadata

const metadata = {
  name: "Maverick - AI Trading Agents",
  description: "Create your personalized AI trading agent",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  icons: ["/icon.png"],
};

createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solana, solanaTestnet, solanaDevnet],
  metadata: metadata,
  projectId,
  features: {
    analytics: true,
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-background mx-auto`}>
        <AppStoreProvider>
          <Header />
          {children}
          <Footer />

          <Toaster />
        </AppStoreProvider>
      </body>
    </html>
  );
}
