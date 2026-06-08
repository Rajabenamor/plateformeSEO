"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield, Link2, Clock } from "lucide-react";

const SETTINGS_NAV = [
  { name: "Profile", href: "/dashboard/settings/profile", icon: User },
  { name: "Security", href: "/dashboard/settings/security", icon: Shield },
  { name: "Integrations", href: "/dashboard/integrations", icon: Link2 },
  { name: "SEO History", href: "/dashboard/history", icon: Clock },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-56 shrink-0">
        <h2 className="text-xl font-bold text-[#00415A] mb-6 tracking-tight">
          Account Settings
        </h2>
        <nav className="flex flex-col gap-1">
          {SETTINGS_NAV.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#15418c]/10 text-[#15418c]"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-[#15418c]" : "text-slate-400"}
                />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
