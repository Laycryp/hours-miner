"use client";

import { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors"; // ✅ Farcaster/Browser-injected
// (اختياري) لو عندك WalletConnect ProjectId فعّل التالي:
import { walletConnect } from "wagmi/connectors";

const BASE_RPC = process.env.NEXT_PUBLIC_BASE_RPC ?? "https://mainnet.base.org";
// (اختياري) WalletConnect:
// const WC_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_ID;

const config = createConfig({
  chains: [base],
  transports: { [base.id]: http(BASE_RPC) },
  connectors: [
    injected({
      // نسمح بأي مزوّد حقن (Farcaster/MetaMask/الخ..)
      shimDisconnect: true,
    }),
    // (اختياري) walletConnect({ projectId: WC_ID!, showQrModal: true }),
  ],
  ssr: true,
});

const qc = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
