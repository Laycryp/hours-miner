"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import { useCallback, useMemo, useState } from "react";

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors, status: connectStatus } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const [err, setErr] = useState("");

  const injected = useMemo(() => connectors.find((c) => c.id === "injected"), [connectors]);
  const walletC = useMemo(() => connectors.find((c) => c.id === "walletConnect"), [connectors]);
  const coinbase = useMemo(() => connectors.find((c) => c.id === "coinbaseWallet"), [connectors]);

  const ensureBase = useCallback(async () => {
    try { await switchChainAsync({ chainId: base.id }); } catch {}
  }, [switchChainAsync]);

  const onConnect = useCallback(async () => {
    setErr("");
    try {
      const hasInjected = typeof window !== "undefined" && (window as any).ethereum;
      if (injected && hasInjected) {
        await connectAsync({ connector: injected });
        await ensureBase();
        return;
      }
      if (coinbase) {
        await connectAsync({ connector: coinbase });
        await ensureBase();
        return;
      }
      if (walletC) {
        // على الجوال سيفتح تطبيق المحفظة تلقائيًا
        await connectAsync({ connector: walletC });
        await ensureBase();
        return;
      }
      throw new Error("No wallet provider found. Enable WalletConnect in providers.");
    } catch (e: any) {
      setErr(e?.shortMessage ?? e?.message ?? "Failed to connect");
    }
  }, [connectAsync, injected, coinbase, walletC, ensureBase]);

  const onDisconnect = async () => {
    setErr("");
    await disconnectAsync();
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="badge">{address?.slice(0, 6)}…{address?.slice(-4)}</span>
        <button className="btn btn-muted" onClick={onDisconnect}>Disconnect</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        className="btn btn-primary"
        onClick={onConnect}
        disabled={connectStatus === "pending"}
        title="Connect Farcaster / External Wallet"
      >
        {connectStatus === "pending" ? "Connecting…" : "Connect Wallet"}
      </button>
      {err && <span className="text-xs text-red-400">{err}</span>}
    </div>
  );
}
