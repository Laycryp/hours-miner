"use client";

import { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";
// (اختياري) أضف لاحقًا:
// import { walletConnect, coinbaseWallet } from "wagmi/connectors";

const BASE_RPC = process.env.NEXT_PUBLIC_BASE_RPC ?? "https://mainnet.base.org";

export const config = createConfig({
  chains: [base],
  transports: { [base.id]: http(BASE_RPC) },
  connectors: [
    injected({ shimDisconnect: true }),
    // (اختياري) coinbaseWallet({ appName: "HOURS" }),
    // (اختياري) walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!, showQrModal: true }),
  ],
  ssr: true,
  autoConnect: true, // ✅ يتصل تلقائيًا إذا سبق التفويض
});

const qc = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
