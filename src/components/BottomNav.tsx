"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function Tab({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-1 px-4 py-2 ${
        active ? "text-accent" : "text-muted"
      }`}
    >
      {children}
      <span className="text-xs">{label}</span>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav">
      <Tab href="/" label="Miner" active={pathname === "/"}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 8c4-4 10-4 14 0" stroke="currentColor" strokeWidth="2" />
          <path d="M9 14l6-6M11 16l-7 7" stroke="currentColor" strokeWidth="2" />
        </svg>
      </Tab>

      <Tab href="/wallet" label="My Supply" active={pathname.startsWith("/wallet")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="17" cy="12" r="1.5" fill="currentColor" />
        </svg>
      </Tab>

      <Tab href="/tasks" label="Tasks" active={pathname.startsWith("/tasks")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 3l2.8 6H22l-5 4.2L18.7 21 12 17.5 5.3 21 7 13.2 2 9h7.2L12 3z" stroke="currentColor" strokeWidth="2" />
        </svg>
      </Tab>
    </nav>
  );
}
