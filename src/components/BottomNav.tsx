"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Miner", icon: "?" },          // ضع أيقوناتك المعتادة هنا
  { href: "/wallet", label: "My Supply", icon: "▭" },
  { href: "/tasks", label: "Tasks", icon: "★" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-soft/60 bg-bg/85 backdrop-blur"
      style={{
        // ارتفاع أساسي + مساحة آمنة لآيفون
        paddingBottom: "max(env(safe-area-inset-bottom), 10px)",
      }}
    >
      <div className="mx-auto max-w-3xl px-4">
        <ul className="flex items-stretch justify-between gap-1">
          {tabs.map((t) => {
            const active = pathname === t.href;
            return (
              <li key={t.href} className="flex-1">
                <Link
                  href={t.href}
                  className={`flex flex-col items-center justify-center rounded-xl transition-colors
                              min-h-14 py-2
                              ${active ? "text-accent" : "text-white/80 hover:text-white"}`}
                >
                  <span className="text-xl leading-none">{t.icon}</span>
                  {/* تكبير الخط + وزن أوضح */}
                  <span className={`mt-1 leading-none ${active ? "font-semibold" : "font-medium"} text-[15px]`}>
                    {t.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
