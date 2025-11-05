"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function IconMiner(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3 7l5-2 6 6-2 5-6-6 2-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 4l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function IconWallet(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M21 10h-4a2 2 0 0 0 0 4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="16.5" cy="12" r="1" fill="currentColor"/>
    </svg>
  );
}
function IconTasks(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M9.5 3l1.6 3.2 3.6.5-2.6 2.5.6 3.5-3.2-1.7-3.2 1.7.6-3.5L2.9 6.7l3.6-.5L8.1 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M14 14H4m12 4H4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

const tabs = [
  { href: "/", label: "Miner", icon: IconMiner },
  { href: "/wallet", label: "My Supply", icon: IconWallet },
  { href: "/tasks", label: "Tasks", icon: IconTasks },
];

export default function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="tabbar">
      <div className="mx-auto max-w-md px-3 grid grid-cols-3">
        {tabs.map(t => {
          const active = pathname === t.href;
          const Icon = t.icon;
          return (
            <Link key={t.href} href={t.href} className={`tab-item ${active ? "active" : ""}`} aria-label={t.label}>
              <Icon width={22} height={22} className={active ? "text-accent" : "text-muted"} />
              <span className={active ? "text-accent" : "text-muted"}>{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
