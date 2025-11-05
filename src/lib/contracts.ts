// src/lib/contracts.ts

// ====== Addresses ======
/** Base mainnet */
export const HOURS_MINER =
  (process.env.NEXT_PUBLIC_MINER as `0x${string}`) ??
  "0x537088f6c012e68fafb91d23aaa46b8eefab29b2";

// (اختياري) ضع عنوان التوكن إن أردت عرضه في الواجهة
export const HOURS_TOKEN: `0x${string}` | undefined = undefined;

// ====== ABI (الحد الأدنى الذي نستخدمه في الواجهة) ======
export const minerAbi = [
  {
    type: "function",
    name: "getState",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "timeLeftSec", type: "uint64" },
      { name: "canWithdraw", type: "bool" },
      { name: "preview", type: "uint256" }
    ],
  },
  {
    type: "function",
    name: "startMining",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "withdrawAll",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  // قراءات مساعدة (غير مستخدمة حاليًا لكن مفيدة للديبغ)
  {
    type: "function",
    name: "previewAccrued",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "timeLeft",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint64" }],
  },
  {
    type: "function",
    name: "pending",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "tokenAddress",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
] as const;
