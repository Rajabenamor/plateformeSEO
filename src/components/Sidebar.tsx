"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  ClipboardCheck,
  LayoutDashboard,
  Lightbulb,
  Settings,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { user } from "@/app/types/auth";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Recommendations",
    href: "/dashboard/recommendations",
    icon: Lightbulb,
  },
  { name: "Site Audit", href: "/dashboard/audit", icon: ClipboardCheck },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const getInitials = (name: string) => {
  if (!name) return "G";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export default function Sidebar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<user | null>(null);

  useEffect(() => {
    const storedUser = Cookies.get("user_data");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data from cookie", error);
      }
    }
  }, []);

  return (
    <aside className="w-64 h-screen bg-[#fafbfc] border-r border-slate-200 flex flex-col justify-between sticky top-0 shrink-0">
      <div>
        <div className="h-24 flex items-center px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-[#00415A] font-black text-2xl tracking-tight"
          >
            <TrendingUp size={28} strokeWidth={3} className="text-blue-600" />
            STRIVE
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-blue-600" : "text-slate-400"}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors">
          <div className="w-10 h-10 rounded-full bg-[#15418c] flex items-center justify-center text-white font-bold overflow-hidden shrink-0">
            {getInitials(currentUser?.username || "Guest")}
          </div>

          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">
              {currentUser?.username || "Guest"}
            </p>
            <p className="text-xs text-slate-500">
              Free Plan
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
