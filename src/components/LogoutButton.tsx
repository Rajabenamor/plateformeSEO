"use client"
import { logoutAction } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

export  default function LogoutButton(){
    const handleLogout = async () => {
        // 1. Kill the "Ghost State" (Browser Memory)
        if (typeof window !== 'undefined') {
          localStorage.clear();
          sessionStorage.clear();
        }
    
        // 2. Kill the Auth Tokens (Server Memory) & Redirect
        await logoutAction();
      };
    return(
        <form action={handleLogout}>
            <button
            type="submit"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider cursor-pointer"
            >
                <LogOut size={16}/>
                Log Out
            </button>
        </form>
    );
}
