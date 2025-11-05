"use client";
import { sdk } from "@farcaster/miniapp-sdk";

export default function CastButton({
  prefill = "⛏️ Mining HOURS (HRS) on Base — claim anytime from My Supply.",
  urlEmbed,
}: { prefill?: string; urlEmbed?: string }) {
  const onCast = async () => {
    const text = prefill;
    const embedUrl =
      urlEmbed || (typeof window !== "undefined" ? window.location.origin : "");
    try {
      await sdk.actions.composeCast({
        text,
        embeds: embedUrl ? [{ url: embedUrl }] : [],
      });
    } catch {
      const target = `https://warpcast.com/~/compose?text=${encodeURIComponent(
        text
      )}${embedUrl ? `&embeds[]=${encodeURIComponent(embedUrl)}` : ""}`;
      window.open(target, "_blank", "noopener,noreferrer");
    }
  };
  return (
    <button className="btn btn-primary min-w-[120px] h-10 px-4" onClick={onCast}>
      Publish Cast
    </button>
  );
}
