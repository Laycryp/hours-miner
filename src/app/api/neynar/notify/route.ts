import { NextRequest, NextResponse } from "next/server";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY!;

// استدعها بـ body: { targetFids?: number[], title?: string, body: string, url?: string }
export async function POST(req: NextRequest) {
  if (!NEYNAR_API_KEY) {
    return NextResponse.json({ error: "Missing NEYNAR_API_KEY" }, { status: 500 });
  }
  const { targetFids = [], title = "HOURS update", body, url } = await req.json();

  if (!body || typeof body !== "string") {
    return NextResponse.json({ error: "body is required" }, { status: 400 });
  }

  const res = await fetch("https://api.neynar.com/v2/farcaster/frame/notifications/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": NEYNAR_API_KEY,
    },
    body: JSON.stringify({
      target_fids: targetFids,          // [] = كل من فعّل إشعارات هذا الميني-آب
      filters: {},                      // أضف فلاتر لاحقًا إن شئت
      notification: {
        title,
        body,
        target_url: url ?? (process.env.NEXT_PUBLIC_SITE_URL || "https://YOUR_DOMAIN"),
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: "Neynar error", details: data }, { status: 500 });
  }
  return NextResponse.json(data);
}
