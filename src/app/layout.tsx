// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import Providers from "./providers";
import FarcasterReady from "@/components/FarcasterReady";
import BottomNav from "@/components/BottomNav";
import WalletConnect from "@/components/WalletConnect";

// URL آمن للميتا
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
      <body>
        <Providers>
          <FarcasterReady />

          <header className="sticky top-0 z-40 bg-bg/70 backdrop-blur border-b border-soft">
            <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
              <h1 className="text-lg font-bold tracking-wide">HOURS</h1>
              <WalletConnect />
            </div>
          </header>

          <div className="min-h-screen pb-20">{children}</div>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
