"use client";

import { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

const BASE_RPC = process.env.NEXT_PUBLIC_BASE_RPC ?? "https://mainnet.base.org";
const WC_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_ID; // ضع Project ID

export const config = createConfig({
  chains: [base],
  transports: { [base.id]: http(BASE_RPC) },
  connectors: [
    injected({ shimDisconnect: true }),                 // Farcaster / أي Injected
    coinbaseWallet({ appName: "HOURS", preference: "all" }),
    ...(WC_ID ? [walletConnect({ projectId: WC_ID, showQrModal: true })] : []),
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
