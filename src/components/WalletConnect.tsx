"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import { useCallback, useMemo, useState } from "react";

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors, status: connectStatus } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const [err, setErr] = useState<string>("");

  const injected = useMemo(() => connectors.find((c) => c.id === "injected"), [connectors]);
  // (اختياري) أضف لاحقًا:
  // const cb = useMemo(() => connectors.find((c) => c.id === "coinbaseWallet"), [connectors]);
  // const wc = useMemo(() => connectors.find((c) => c.id === "walletConnect"), [connectors]);

  const ensureBase = useCallback(async () => {
    try { await switchChainAsync({ chainId: base.id }); } catch {}
  }, [switchChainAsync]);

  // محاولة اتصال Farcaster Injected بقوة (مفيد للجوال)
  const connectFarcasterInjected = useCallback(async () => {
    // 1) تحقق مزوّد EIP-1193
    const eth: any = typeof window !== "undefined" ? (window as any).ethereum : undefined;
    if (!eth) throw new Error("Farcaster provider not found");

    try {
      // 2) طلب صلاحية الحساب مباشرة قبل wagmi (يعالج مزالق الجوال)
      await eth.request?.({ method: "eth_requestAccounts" });
    } catch (e) {
      // يتجاهل لو رفض — wagmi سيظهر رسالة أنسب
    }

    if (!injected) throw new Error("Injected connector unavailable");

    // 3) اتصال عبر wagmi
    const res = await connectAsync({ connector: injected });
    await ensureBase();
    return res;
  }, [connectAsync, injected, ensureBase]);

  const onConnect = useCallback(async () => {
    setErr("");
    try {
      // ✅ الأولوية لمحفظة Farcaster (injected)
      await connectFarcasterInjected();
      return;
    } catch (e: any) {
      // لو ما توفر أو فشل، أعرض سببًا واضحًا
      const msg = e?.shortMessage ?? e?.message ?? "Failed to connect Farcaster wallet";
      setErr(msg);

      // (اختياري) سقوط لمحفظة خارجية:
      // try {
      //   if (cb) {
      //     await connectAsync({ connector: cb }); await ensureBase(); return;
      //   }
      //   if (wc) {
      //     await connectAsync({ connector: wc }); await ensureBase(); return;
      //   }
      // } catch (e2: any) {
      //   setErr(e2?.shortMessage ?? e2?.message ?? "Failed to connect external wallet");
      // }
    }
  }, [connectFarcasterInjected /*, connectAsync, cb, wc, ensureBase*/]);

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
        title="Connect Farcaster Wallet"
      >
        {connectStatus === "pending" ? "Connecting…" : "Connect Wallet"}
      </button>
      {err && <span className="text-xs text-red-400">{err}</span>}
    </div>
  );
}
