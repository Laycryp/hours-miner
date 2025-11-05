// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import Providers from "./providers";
import FarcasterReady from "@/components/FarcasterReady";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "HOURS — Time-based mining on Base",
  description: "Mine HOURS (HRS) every cycle. Withdraw anytime from My Supply.",
  openGraph: {
    title: "HOURS — Time-based mining on Base",
    description: "Mine HOURS (HRS) every cycle. Withdraw anytime from My Supply.",
    images: ["/brand/og_hours_1200x630.png"],
  },
  icons: {
    icon: "/brand/hours_app_icon_1024.png",
    shortcut: "/brand/hours_app_icon_1024.png",
    apple: "/brand/hours_app_icon_1024.png",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.example"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {/* Mini App readiness */}
          <FarcasterReady />

          {/* مساحة المحتوى مع حافة سفلية لعدم تغطية البار */}
          <div className="min-h-screen pb-20">{children}</div>

          {/* الشريط السفلي ثابت لكل الصفحات */}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
