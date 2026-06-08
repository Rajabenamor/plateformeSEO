"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield } from "lucide-react";

const SETTINGS_NAV = [
  { name: "Profile", href: "/dashboard/settings/profile", icon: User },
  { name: "Security", href: "/dashboard/settings/security", icon: Shield },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-500">
      <aside className="w-full md:w-64 shrink-0">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 px-3">
          Account Control
        </h2>
        <nav className="flex flex-col gap-1">
          {SETTINGS_NAV.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-400 hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon size={18} className={isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-300"} />
                <span className={`font-semibold tracking-tight ${isActive ? "text-foreground" : ""}`}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 bg-card border border-white/5 rounded-2xl shadow-sm p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
