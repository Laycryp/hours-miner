"use client";

import { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";
// (اختياري لاحقًا)
// import { walletConnect, coinbaseWallet } from "wagmi/connectors";

const BASE_RPC = process.env.NEXT_PUBLIC_BASE_RPC ?? "https://mainnet.base.org";

export const config = createConfig({
  chains: [base],
  transports: { [base.id]: http(BASE_RPC) },
  connectors: [
    injected({ shimDisconnect: true }),
    // coinbaseWallet({ appName: "HOURS" }),
    // walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!, showQrModal: true }),
  ],
  ssr: true,
  // ❌ autoConnect: true  (غير مدعوم في v2)
});

const qc = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // ✅ استخدم reconnectOnMount بدل autoConnect
    <WagmiProvider config={config} reconnectOnMount>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
