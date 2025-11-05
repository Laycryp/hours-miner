// src/lib/wagmi.ts
import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";

const BASE_RPC = process.env.NEXT_PUBLIC_BASE_RPC ?? "https://mainnet.base.org";

export const config = createConfig({
  chains: [base],
  transports: { [base.id]: http(BASE_RPC) },
  ssr: true,
});
