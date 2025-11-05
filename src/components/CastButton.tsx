"use client";
import { sdk } from "@farcaster/miniapp-sdk";

const MINIAPP_URL = "https://farcaster.xyz/miniapps/3PWnYsB8jh0c/hoursrider";

export default function CastButton({
  prefill = "⛏️ Mining HOURS (HRS) on Base — claim anytime from My Supply.",
}: { prefill?: string }) {
  const onCast = async () => {
    const text = `${prefill}\n\n${MINIAPP_URL}`;
    try {
      await sdk.actions.composeCast({ text });
    } catch {
      const target = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
      window.open(target, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button className="btn btn-primary min-w-[120px] h-10 px-4" onClick={onCast}>
      Publish Cast
    </button>
  );
}
