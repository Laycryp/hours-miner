"use client";
import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";
import { base } from "wagmi/chains";

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();

  const ensureBase = async () => {
    if (!isConnected) await connectAsync({ connector: injected() });
    if (chainId !== base.id) await switchChainAsync({ chainId: base.id });
  };

  return (
    <button
      className="btn btn-muted"
      onClick={async () => {
        try {
          if (isConnected) return;
          await ensureBase();
        } catch (e) { alert("Wallet connect/switch failed"); }
      }}
    >
      {isConnected ? `${address?.slice(0,6)}…${address?.slice(-4)}` : "Connect Wallet"}
    </button>
  );
}
