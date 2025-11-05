"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { base } from "wagmi/chains";
import { HOURS_MINER, minerAbi } from "@/lib/contracts";
import WalletConnect from "@/components/WalletConnect";
import { parseUnits, formatUnits } from "viem";

export default function WalletPage() {
  const { address, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  // تحديث كل ثانية
  const { data, refetch } = useReadContract({
    abi: minerAbi,
    address: HOURS_MINER,
    functionName: "getState",
    args: [address ?? ("0x0000000000000000000000000000000000000000" as `0x${string}`)],
    query: { enabled: !!address, refetchInterval: 1000 },
  });

  useEffect(() => { if (address) refetch?.(); }, [address, refetch]);

  const canWithdraw = Boolean(data?.[1] ?? false);
  const claimableWei = (data?.[2] as bigint) ?? 0n;
  const claimableHRS = Number(formatUnits(claimableWei, 18));

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });
  useEffect(() => { if (isSuccess) refetch?.(); }, [isSuccess, refetch]);

  const [amountStr, setAmountStr] = useState("");

  const ensureBaseAndConnected = async () => {
    if (!isConnected) throw new Error("Connect wallet first");
    await switchChainAsync({ chainId: base.id });
  };

  const onWithdrawAll = async () => {
    try {
      await ensureBaseAndConnected();
      if (!canWithdraw || claimableWei === 0n) throw new Error("Nothing to withdraw");
      await writeContract({ abi: minerAbi, address: HOURS_MINER, functionName: "withdrawAll" });
    } catch (e: any) {
      alert(e?.message ?? "Withdraw failed");
    }
  };

  const onWithdrawPartial = async () => {
    try {
      await ensureBaseAndConnected();
      const clean = amountStr.trim();
      if (!clean) throw new Error("Enter amount");
      const amountWei = parseUnits(clean, 18);
      if (amountWei <= 0n) throw new Error("Amount must be > 0");
      if (amountWei > claimableWei) throw new Error("Amount exceeds claimable");
      await writeContract({ abi: minerAbi, address: HOURS_MINER, functionName: "withdraw", args: [amountWei] });
      setAmountStr("");
    } catch (e: any) {
      alert(e?.message ?? "Withdraw failed");
    }
  };

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold">My Supply</h2>
        <WalletConnect />
      </div>

      <div className="card space-y-3">
        <div className="text-muted">Claimable now (on-chain)</div>
        <div className="text-4xl font-bold">
          {address ? claimableHRS.toFixed(6) : "—"} <span className="text-accent">HRS</span>
        </div>

        <button
          className="btn btn-primary w-full mt-1"
          onClick={onWithdrawAll}
          disabled={!canWithdraw || claimableWei === 0n || isPending}
          title="Mint all accrued HRS to your wallet"
        >
          {isPending ? "Confirm…" : "Withdraw All"}
        </button>
        {error && <div className="text-xs text-red-400">{String(error.message)}</div>}
        {isSuccess && <div className="text-xs text-accent">Withdrawal submitted ✅</div>}
      </div>

      <div className="card space-y-3">
        <div className="text-lg font-semibold">Withdraw partial</div>
        <div className="text-sm text-muted">Enter amount ≤ claimable. Mint happens on-chain to your wallet.</div>
        <div className="flex items-center gap-2">
          <input
            className="w-full rounded-xl2 bg-card border-soft px-3 py-3 outline-none"
            placeholder="Amount in HRS, e.g. 0.01"
            inputMode="decimal"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
          />
          <button
            className="btn btn-muted"
            onClick={() => setAmountStr(claimableHRS.toFixed(6))}
            disabled={claimableWei === 0n}
            title="Max"
          >
            Max
          </button>
        </div>
        <button
          className="btn btn-primary w-full"
          onClick={onWithdrawPartial}
          disabled={claimableWei === 0n || isPending}
        >
          {isPending ? "Confirm…" : "Withdraw"}
        </button>
      </div>
    </div>
  );
}
