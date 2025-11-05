"use client";
import { sdk } from "@farcaster/miniapp-sdk";

const MINIAPP_URL = "https://farcaster.xyz/miniapps/3PWnYsB8jh0c/hoursrider";

export default function CastButton({
  prefill = "⛏️ Mining HOURS (HRS$) on Base  claim anytime.",
  urlEmbed,
}: { prefill?: string; urlEmbed?: string }) {
  const onCast = async () => {
    // نص الترويج + سطر فارغ + رابط الميني-آب
    const text = `${prefill}\n\n${MINIAPP_URL}`;

    // نحدّد رابط الصفحة الحالي (إن وجد) لشرحه ضمن embeds بجانب رابط الميني-آب
    const origin =
      urlEmbed || (typeof window !== "undefined" ? window.location.origin : "");

    // نبني embeds وفق النوع المدعوم: [] | [string] | [string, string]
    const embeds: [] | [string] | [string, string] =
      origin && origin !== MINIAPP_URL ? [origin, MINIAPP_URL] : [MINIAPP_URL];

    try {
      await sdk.actions.composeCast({ text, embeds });
    } catch {
      // fallback لواجهة Warpcast
      const q = new URLSearchParams({ text });
      // embeds[] يمكن تكرارها
      (Array.isArray(embeds) ? embeds : []).forEach((u) => q.append("embeds[]", u));
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
