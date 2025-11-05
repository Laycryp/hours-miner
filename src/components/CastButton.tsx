"use client";
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

const TEXT =
  "⛏️ Mining HOURS (HRS$) on Base claim anytime try it .\n" +
  "gBase🟦\n" +
  "https://farcaster.xyz/miniapps/3PWnYsB8jh0c/hrs-minter";

const HOME_URL = "https://hours-miner.vercel.app"; // يحمل fc:miniapp meta

export default function CastButton() {
  useEffect(() => { try { sdk.actions.ready(); } catch {} }, []);

  const onCast = async () => {
    try {
      await sdk.actions.composeCast({
        text: TEXT,
        embeds: [HOME_URL],          // ← هذا ما يُظهر المعاينة داخل Base App
      });
    } catch {
      // Fallback لواجهة Warpcast
      const params = new URLSearchParams({ text: TEXT });
      params.append("embeds[]", HOME_URL);
      const target = `https://warpcast.com/~/compose?${params.toString()}`;
      window.open(target, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button className="btn btn-primary min-w-[120px] h-10 px-4" onClick={onCast}>
      Publish Cast
    </button>
  );
}
