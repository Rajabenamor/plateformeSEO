import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { verifySession } from "@/lib/session";
import LogoutButton from "./LogoutButton";
import { Suspense } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

async function AuthLinks() {
  const IsLoggedIn = await verifySession();

  if (IsLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        <Link
            href="/dashboard"
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent uppercase tracking-wider transition-colors"
          >
            Dashboard
          </Link>
        <div className="h-4 w-px bg-slate-200 dark:bg-white/10" />
        <LogoutButton />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/auth/login"
        className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-foreground transition-all uppercase tracking-wider"
      >
        Sign In
      </Link>
      <Link
        href="/auth/register"
        className="px-6 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:opacity-90 transition-all uppercase tracking-wider shadow-lg shadow-primary/20"
      >
        Get Started
      </Link>
    </div>
  );
}

export default async function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/5 bg-white/60 dark:bg-background/60 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
        <Link href="/" className="flex items-center gap-2 group">
          <Image 
            src="/6.png" 
            alt="STRIVE Logo" 
            width={100} 
            height={40} 
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105 dark:invert-0 brightness-0 dark:brightness-100"
            priority
          />
        </Link>

        <div className="flex items-center gap-10">
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/features"
              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-foreground transition-colors uppercase tracking-wider"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-foreground transition-colors uppercase tracking-wider"
            >
              Pricing
            </Link>
            <div className="relative group flex items-center">
              <button className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-foreground transition-colors py-2 uppercase tracking-wider cursor-pointer">
                Company
                <ChevronDown
                  size={14}
                  className="group-hover:rotate-180 transition-transform duration-300"
                />
              </button>
              <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-card border border-slate-200 dark:border-white/5 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden translate-y-4 group-hover:translate-y-0">
                <div className="py-2 flex flex-col">
                  <Link
                    href="/about"
                    className="px-6 py-3 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-foreground font-bold transition-colors uppercase tracking-wider"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/blog"
                    className="px-6 py-3 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-foreground font-bold transition-colors uppercase tracking-wider"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/contact"
                    className="px-6 py-3 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-foreground font-bold transition-colors uppercase tracking-wider"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <Suspense
              fallback={
                <div className="flex gap-3">
                  <div className="w-24 h-10 bg-slate-100 dark:bg-white/5 animate-pulse rounded-full" />
                </div>
              }
            >
              <AuthLinks />
            </Suspense>
            <div className="hidden sm:block border-l border-slate-200 dark:border-white/10 pl-6">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
