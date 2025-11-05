"use client";
import { sdk } from "@farcaster/miniapp-sdk";

const TEXT =
  "⛏️ Mining HOURS (HRS$) on Base claim anytime try it .\n" +
  "gBase🟦\n" +
  "https://farcaster.xyz/miniapps/3PWnYsB8jh0c/hrs-minter";

const LINK = "https://farcaster.xyz/miniapps/3PWnYsB8jh0c/hrs-minter";

export default function CastButton() {
  const onCast = async () => {
    try {
      // نضع الرابط نفسه كـ embed لضمان المعاينة — النص يبقى كما هو
      await sdk.actions.composeCast({ text: TEXT, embeds: [LINK] });
    } catch {
      // fallback لواجهة Warpcast مع embeds[]
      const q = new URLSearchParams({ text: TEXT });
      q.append("embeds[]", LINK);
      const target = `https://warpcast.com/~/compose?${q.toString()}`;
      window.open(target, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button className="btn btn-primary min-w-[120px] h-10 px-4" onClick={onCast}>
      Publish Cast
    </button>
  );
}
