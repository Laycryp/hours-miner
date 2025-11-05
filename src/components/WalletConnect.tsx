"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import { useCallback } from "react";

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, status: connectStatus } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();

  const ensureBase = useCallback(async () => {
    try { await switchChainAsync({ chainId: base.id }); } catch {}
  }, [switchChainAsync]);

  const onConnect = async () => {
    // نفس منطق الملف: نختار أول Connector (Injected/Farcaster داخل الميني-آب)
    const first = connectors?.[0];
    if (first) {
      await connect({ connector: first });
      await ensureBase();
    }
  };

  const onDisconnect = async () => {
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
    <button
      className="btn btn-primary"
      onClick={onConnect}
      disabled={connectStatus === "pending"}
      title="Sign in with Farcaster Wallet"
    >
      {connectStatus === "pending" ? "Connecting…" : "Sign in with Farcaster Wallet"}
    </button>
  );
}
