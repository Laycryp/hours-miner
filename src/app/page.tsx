"use client";

import { useEffect, useMemo, useState } from "react";
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
import CastButton from "@/components/CastButton";
import { formatUnits } from "viem";

function useCountdownFrom(seconds: number) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => setLeft(seconds), [seconds]);
  useEffect(() => {
    const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(Math.floor(left / 3600)).padStart(2, "0");
  const mm = String(Math.floor((left % 3600) / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return { left, text: `${hh}:${mm}:${ss}` };
}

export default function MinerPage() {
  const { address, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const { data: state, refetch } = useReadContract({
    abi: minerAbi,
    address: HOURS_MINER,
    functionName: "getState",
    args: [address ?? ("0x0000000000000000000000000000000000000000" as `0x${string}`)],
    query: { enabled: !!address, refetchInterval: 5000 },
  });

  const timeLeftSecOnChain = Number((state?.[0] as bigint) ?? 0n);
  const previewWei = (state?.[2] as bigint) ?? 0n;
  const previewAccrued = Number(formatUnits(previewWei, 18));

  const countdown = useCountdownFrom(timeLeftSecOnChain);

  // إعادة قراءة فورية عند وصول العداد للصفر
  useEffect(() => {
    if (address && countdown.left === 0) refetch?.();
  }, [address, countdown.left, refetch]);

  // إعادة قراءة أسرع في آخر دقيقة
  useEffect(() => {
    if (!address) return;
    if (timeLeftSecOnChain > 0 && timeLeftSecOnChain <= 60) {
      const id = setInterval(() => refetch?.(), 5000);
      return () => clearInterval(id);
    }
  }, [address, timeLeftSecOnChain, refetch]);

  useEffect(() => {
    if (isSuccess) refetch?.();
  }, [isSuccess, refetch]);

  useEffect(() => {
    if (error) alert(error.message);
  }, [error]);

  // ✅ افعل الزر بمجرد انتهاء العداد محليًا (لا ننتظر البول)
  const canStartNow = useMemo(() => countdown.left <= 0 && !isPending, [countdown.left, isPending]);

  const onStart = async () => {
    if (!canStartNow) return;
    if (!isConnected) return alert("Connect wallet first");
    await switchChainAsync({ chainId: base.id });
    await writeContract({ abi: minerAbi, address: HOURS_MINER, functionName: "startMining" });
  };

  return (
    <div className="space-y-4 pb-28">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold">Mining Dashboard</h2>
        <WalletConnect />
      </div>

      <div className="flex items-center justify-center pt-2">
        <div className="ring-btn">
          <button
            className={`ring-btn-inner ${canStartNow ? "ready" : ""}`}
            onClick={onStart}
            disabled={!canStartNow}
            title={canStartNow ? "Start mining (one-time transaction)" : "Session active; wait until it ends"}
          >
            {canStartNow ? (
              <span className="text-xl font-bold tracking-wide">START</span>
            ) : (
              <span className="relative inline-flex items-center justify-center">
                <svg className="pickaxe" width="34" height="34" viewBox="0 0 24 24" fill="none">
                  <path d="M3 8c4-4 10-4 14 0" stroke="currentColor" strokeWidth="2" />
                  <path d="M9 14l6-6M11 16l-7 7" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="pulse-dot" />
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="kpi text-center">
        <div className="badge mb-2">Time Until Next Mining Cycle</div>
        <div className="text-3xl tracking-widest">{countdown.text}</div>
        <div className="mt-3 text-sm text-muted">
          Claimable preview (read-only): <span className="text-accent">{previewAccrued.toFixed(6)}</span> HRS
        </div>
        <div className="text-xs text-muted mt-2">
          Withdraw from <span className="text-accent">My Supply</span> anytime.
        </div>
      </div>

      <div className="flex items-center justify-center mt-2">
        <CastButton />
      </div>
    </div>
  );
}
