// src/lib/wagmi.ts
import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";

// يمكنك تبديل الـ RPC لاحقًا (Alchemy/QuickNode) عبر ENV
const BASE_RPC = process.env.NEXT_PUBLIC_BASE_RPC ?? "https://mainnet.base.org";

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(BASE_RPC),
  },
  ssr: true, // بما أن مشروعك Next App Router
});
