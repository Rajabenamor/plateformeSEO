"use client";

import { Bell, Search, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-white/5 bg-background/60 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left: Breadcrumbs or Search Placeholder */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Global Search..." 
              className="h-9 w-64 rounded-lg border border-white/5 bg-white/5 pl-10 pr-4 text-xs tracking-wide text-slate-300 outline-none focus:ring-1 focus:ring-accent/50"
            />
          </div>
        </div>

        {/* Right: Context Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-foreground transition-colors">
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent animate-pulse" />
          </button>
          
          <div className="h-6 w-px bg-white/5" />
          
          <div className="flex items-center gap-3">
             <ThemeToggle />
             <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-slate-400">
                <User size={18} />
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}
