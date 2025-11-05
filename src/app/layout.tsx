// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import Providers from "./providers";
import FarcasterReady from "@/components/FarcasterReady";
import BottomNav from "@/components/BottomNav";

// ⚠️ URL آمنة للميتا
const RAW_SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").trim();
const SITE_URL: URL | undefined = RAW_SITE_URL ? new URL(RAW_SITE_URL) : undefined;

export const metadata: Metadata = {
  title: "HOURS — Time-based mining on Base",
  description: "Mine HOURS (HRS) every cycle. Withdraw anytime from My Supply.",
  ...(SITE_URL ? { metadataBase: SITE_URL } : {}),
  openGraph: {
    title: "HOURS — Time-based mining on Base",
    description: "Mine HOURS (HRS) every cycle. Withdraw anytime from My Supply.",
    images: ["/brand/og_hours_v3_1200x630.png"],
  },
  icons: {
    icon: "/brand/hours_app_icon_v3_1024.png",
    shortcut: "/brand/hours_app_icon_v3_1024.png",
    apple: "/brand/hours_app_icon_v3_1024.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Farcaster Mini App rich embed (imageUrl فقط) */}
        <meta
          name="fc:miniapp"
          content={JSON.stringify({
            version: "next",
            imageUrl: "https://hours-miner.vercel.app/public/og.png",
          })}
        />
      </head>
      <body>
        <Providers>
          <FarcasterReady />
          {/* مساحة كافية أسفل المحتوى + دعم safe-area للآيفون */}
          <div
            className="min-h-screen"
            style={{ paddingBottom: "calc(96px + max(env(safe-area-inset-bottom), 10px))" }}
          >
            {children}
          </div>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
