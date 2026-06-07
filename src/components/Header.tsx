"use client";

import { Bell, LogOut, Search, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { logoutAction } from "@/app/actions/auth";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-white/5 bg-background/60 backdrop-blur-md">
      <div className="flex h-full items-center justify-end px-6">
        

        {/* Right: Context Actions */}
        <div className="flex items-center gap-4">
          
          
          <div className="h-6 w-px bg-white/5" />
          
          <div className="flex items-center gap-3">
             <ThemeToggle />
            
                 {/* <form action={logoutAction}>
                          <button className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer `}>
                             <LogOut size={18} />
                             <span>Log Out</span>
                          </button>
                        </form>
              */}
          </div>
        </div>
      </div>
    </header>
  );
}
