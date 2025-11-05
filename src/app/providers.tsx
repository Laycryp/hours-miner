"use client";

import { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected, walletConnect, coinbaseWallet } from "@wagmi/connectors";
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";

const BASE_RPC = process.env.NEXT_PUBLIC_BASE_RPC ?? "https://mainnet.base.org";
const WC_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_ID; // اختياري

export const config = createConfig({
  chains: [base],
  transports: { [base.id]: http(BASE_RPC) },
  // ⬇️ ترتيب الأولوية الموصى به داخل الميني-آب
  connectors: [
    farcasterFrame(),                        // ✅ Farcaster Mini App (SDK provider)
    injected({ shimDisconnect: true }),      // fallback للمستعرضات
    ...(WC_ID ? [walletConnect({ projectId: WC_ID, showQrModal: true })] : []),
    coinbaseWallet({ appName: "HOURS" }),
  ],
  ssr: true,
});

const qc = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  // v2: لا يوجد autoConnect هنا – يعاد الاتصال تلقائيًا عبر WagmiProvider
  return (
    <WagmiProvider config={config} reconnectOnMount>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
