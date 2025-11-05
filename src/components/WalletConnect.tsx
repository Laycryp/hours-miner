"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors, status } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();

  const onConnectInjected = async () => {
    // نحاول استخدام موصل injected (Farcaster إذا كان داخل الميني-آب)
    const inj = connectors.find((c) => c.id === "injected") ?? injected({ shimDisconnect: true });
    const res = await connectAsync({ connector: inj });
    // نضمن شبكة Base
    await switchChainAsync({ chainId: base.id });
    return res;
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
    <div className="flex items-center gap-2">
      <button
        className="btn btn-primary"
        onClick={onConnectInjected}
        title="Connect Farcaster / Embedded Wallet"
      >
        Connect Farcaster Wallet
      </button>
      {/* (اختياري) يمكن إضافة أزرار لمحافظ أخرى لاحقاً */}
    </div>
  );
}
