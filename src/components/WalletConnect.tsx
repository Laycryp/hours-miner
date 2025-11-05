"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import { useCallback } from "react";

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors, status } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();

  const onConnect = useCallback(async () => {
    // 1) جرّب موصل Farcaster Mini App مباشرة
    const fc = connectors.find((c) => c.id === "farcasterFrame");
    if (fc) {
      await connectAsync({ connector: fc });
      await switchChainAsync({ chainId: base.id });
      return;
    }
    // 2) ثم injected
    const inj = connectors.find((c) => c.id === "injected");
    if (inj) {
      await connectAsync({ connector: inj });
      await switchChainAsync({ chainId: base.id });
      return;
    }
    // 3) ثم WalletConnect/Coinbase إن كانا مضافين في providers
    const wc = connectors.find((c) => c.id === "walletConnect");
    if (wc) {
      await connectAsync({ connector: wc });
      await switchChainAsync({ chainId: base.id });
      return;
    }
    const cb = connectors.find((c) => c.id === "coinbaseWallet");
    if (cb) {
      await connectAsync({ connector: cb });
      await switchChainAsync({ chainId: base.id });
      return;
    }
    throw new Error("No wallet connector available.");
  }, [connectAsync, connectors, switchChainAsync]);

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
      disabled={status === "pending"}
      title="Connect Farcaster Wallet"
    >
      {status === "pending" ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}
