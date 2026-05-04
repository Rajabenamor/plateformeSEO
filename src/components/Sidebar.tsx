"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Lightbulb,
  ClipboardCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  ShieldCheck,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import Image from "next/image";

const NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Recommendations", href: "/dashboard/recommendations", icon: Lightbulb },
  { name: "Site Audit", href: "/dashboard/audit", icon: ClipboardCheck },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = searchParams.get("url");
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`relative h-screen bg-background border-r border-border transition-all duration-300 flex flex-col z-40 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-4 mb-6">
        <Link href={currentUrl ? `/?url=${encodeURIComponent(currentUrl)}` : "/"} className="flex items-center gap-3">
          <Image 
            src="/6.png" 
            alt="STRIVE Logo" 
            width={100} 
            height={40} 
            className={`h-8 w-auto object-contain transition-all brightness-0 dark:brightness-100 ${isCollapsed ? "scale-0 w-0" : "scale-100"}`}
            priority
          />
          {isCollapsed && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 shrink-0">
               <Zap size={22} className="text-white" />
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-3 space-y-8">
        <div>
          {!isCollapsed && (
            <p className="px-3 mb-4 text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest">
              Core Platform
            </p>
          )}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const href = currentUrl ? `${item.href}?url=${encodeURIComponent(currentUrl)}` : item.href;

              return (
                <Link
                  key={item.name}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-slate-500 dark:text-slate-400 hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5"
                  } ${isCollapsed ? "justify-center" : ""}`}
                >
                  <Icon size={18} className={isActive ? "text-white" : "text-slate-400 group-hover:text-primary transition-colors"} />
                  {!isCollapsed && (
                    <span className="tracking-tight">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          {!isCollapsed && (
            <p className="px-3 mb-4 text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest">
              Security
            </p>
          )}
          <nav className="space-y-1">
             <Link
                href={currentUrl ? `/admin?url=${encodeURIComponent(currentUrl)}` : "/admin"}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group ${
                    pathname === "/admin" 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-slate-500 dark:text-slate-400 hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <ShieldCheck size={18} className={pathname === "/admin" ? "text-white" : "text-slate-400 group-hover:text-primary transition-colors"} />
                {!isCollapsed && <span className="tracking-tight">Admin Console</span>}
             </Link>
          </nav>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-slate-500 hover:text-primary shadow-sm transition-all z-50 cursor-pointer"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* User Info / Footer */}
      <div className="p-3 border-t border-border">
        <form action={logoutAction}>
          <button className={`w-full flex items-center gap-3 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer ${isCollapsed ? "justify-center" : ""}`}>
             <LogOut size={18} />
             {!isCollapsed && <span>Log Out</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
