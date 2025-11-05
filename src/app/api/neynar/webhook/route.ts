import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

// سرّ التوقيع من لوحة Neynar
const WEBHOOK_SECRET = process.env.NEYNAR_WEBHOOK_SECRET!;

/** تحقق HMAC-SHA256 من هيدر X-Neynar-Signature على جسم الطلب الخام */
async function verifySignature(req: NextRequest, rawBody: string) {
  const sig = req.headers.get("x-neynar-signature") || "";
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  const digest = hmac.update(rawBody, "utf8").digest("hex");
  // مقارنة زمن-ثابتة
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(sig));
}

export async function POST(req: NextRequest) {
  // خذ الـRAW body قبل json()
  const raw = await req.text();
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing NEYNAR_WEBHOOK_SECRET" }, { status: 500 });
  }
  const ok = await verifySignature(req, raw);
  if (!ok) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

  // الآن آمن تفكّ الجسم
  const event = JSON.parse(raw);
  // أمثلة للأحداث: app_added / notifications_enabled / app_removed ... إلخ
  // سجّلها مؤقتًا، أو خزّن حالة المستخدم إن رغبت.
  console.log("Neynar event:", event?.type, event);

  // مثال: رد 200 دائماً
  return NextResponse.json({ received: true });
}
