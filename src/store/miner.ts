import { create } from "zustand";

export type Boost = { label: string; x: number; done?: boolean };

type MinerState = {
  boostX: number;
  boosts: Boost[];
  lastStart?: number; // epoch ms
  cycleMs: number;
  baseReward: number;
  pending: number; // accumulates until claim
  balance: number; // wallet page display
  start: () => void;
  canStart: () => boolean;
  msLeft: () => number;
  claim: () => number; // returns claimed
  setBoostDone: (label: string) => void;
};

export const useMiner = create<MinerState>((set, get) => ({
  boostX: 1.0,
  boosts: [
    { label: "Daily Check-in", x: 0.1, done: false },
    { label: "Refer a Friend", x: 0.2, done: false },
    { label: "Join Telegram Group", x: 0.8, done: false },
    { label: "Watch a Short Ad", x: 1.0, done: false },
  ],
  lastStart: undefined,
  cycleMs: 12 * 60 * 60 * 1000,
  baseReward: 1000,
  pending: 0,
  balance: 0,
  start: () => {
    if (!get().canStart()) return;
    const now = Date.now();
    set({ lastStart: now });
    // compute pending to show "accumulated gas fee note" in UI if needed
  },
  canStart: () => {
    const { lastStart, cycleMs } = get();
    if (!lastStart) return true;
    return Date.now() - lastStart >= cycleMs;
  },
  msLeft: () => {
    const { lastStart, cycleMs } = get();
    if (!lastStart) return 0;
    const left = cycleMs - (Date.now() - lastStart);
    return Math.max(0, left);
  },
  claim: () => {
    const { lastStart, baseReward, boosts, cycleMs, balance } = get();
    if (!lastStart || Date.now() - lastStart < cycleMs) return 0;
    const x = 1 + boosts.filter(b => b.done).reduce((s, b) => s + b.x, 0);
    const amount = Math.floor(baseReward * x);
    set({ balance: balance + amount, lastStart: undefined, pending: 0 });
    return amount;
  },
  setBoostDone: (label: string) => {
    const boosts = get().boosts.map(b => (b.label === label ? { ...b, done: true } : b));
    set({ boosts });
  },
}));
