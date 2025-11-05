"use client";
import { sdk } from "@farcaster/miniapp-sdk";

const TEXT =
  "⛏️ Mining HOURS (HRS$) on Base claim anytime try it .\n" +
  "gBase🟦\n" +
  "https://farcaster.xyz/miniapps/3PWnYsB8jh0c/hrs-minter";

export default function CastButton() {
  const onCast = async () => {
    try {
      await sdk.actions.composeCast({ text: TEXT });
    } catch {
      const target = `https://warpcast.com/~/compose?text=${encodeURIComponent(TEXT)}`;
      window.open(target, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button className="btn btn-primary min-w-[120px] h-10 px-4" onClick={onCast}>
      Publish Cast
    </button>
  );
}
