import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { verifySession } from "@/lib/session";
import LogoutButton from "./LogoutButton";
import { Suspense } from "react";
import Image from "next/image";
import { ChevronDown, Settings } from "lucide-react";
//AuthLinks is the smart component that handles the security logic

async function AuthLinks() {
  const IsLoggedIn = await verifySession();

  if (IsLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        <Link
            href="/dashboard/settings"
            className="text-sm font-semibold text-foreground hover:text-[#15418c] transition-colors"
          >
            <Settings size={20}/>
            {/* Settings */}
          </Link>
          {/* Separator Line */}
        <div className="h-4 w-px bg-border" />
        <LogoutButton />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/auth/register"
        className="px-6 py-2.5  text-sm font-semibold text-white bg-[#15418c] rounded-full hover:bg-[#0f306b] transition-colors shadow-sm"
      >
        Get Started
      </Link>
      <Link
        href="/auth/login"
        className="px-6 py-2.5  text-sm font-semibold text-gray-900 bg-[#f4f6f8] rounded-full hover:bg-[#e2e8f0] transition-colors"
      >
        Sign In
      </Link>
    </div>
  );
}

//navbar component

export default async function navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background backdrop-blur-md borber-b border-border">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        {/* ========================================== */}
        {/* LEFT SIDE: LOGO                            */}
        {/* ========================================== */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/6.png" alt="app_logo_strive" width={100} height={80} />
        </Link>
        {/* ========================================== */}
        {/* RIGHT SIDE: LINKS & BUTTONS                */}
        {/* ========================================== */}

        <div className="flex items-center gap-8">
          {/* Middle navigation links (hidden on mobile ) */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/features"
              className="text-sm font-semibold  text-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <div className="relative group flex items-center">
              {/* 1. The Trigger (Notice the 'py-2' to give hover breathing room) */}
             
              <button className="flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors py-2">
                Company
                <ChevronDown
                  size={14}
                  className=" mt-1 group-hover:rotate-180 transition-transform duration-200"
                />
              </button>
              
              {/* 2. The Dropdown Menu (Hidden by default, shows on group hover) */}
              <div className="absolute left-0 top-full mt-1 w-48 bg-card border border-border-card rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden translate-y-2 group-hover:translate-y-0">
                <div className="py-2 flex flex-col">
                  <Link
                    href="/about"
                    className="px-4 py-2.5 text-sm text-foreground/70 hover:bg-slate-50 hover:text-[#15418c] font-medium transition-colors"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/blog"
                    className="px-4 py-2.5 text-sm text-foreground/70 hover:bg-slate-50 hover:text-[#15418c] font-medium transition-colors"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/contact"
                    className="px-4 py-2.5 text-sm text-foreground/70 hover:bg-slate-50 hover:text-[#15418c] font-medium transition-colors"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* button areas*/}
          {/* wrapping cookie-reading in a component Suspense */}
          <div className="flex items-center gap-4">
            <Suspense
              fallback={
                <div className="flex gap-3">
                  <div className="w-28 h-10 bg-gray-100 animate-pulse rounded-full" />
                  <div className="w-28 h-10 bg-gray-100 animate-pulse rounded-full" />
                </div>
              }
            >
              <AuthLinks />
            </Suspense>
            <div className="ml-2 border-l border-gray-200 pl-4 hidden sm:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
