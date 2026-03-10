import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { verifySession } from "@/lib/session";
import LogoutButton from "./LogoutButton";
import { Suspense } from "react";

//AuthLinks is the smart component that handles the security logic

async function AuthLinks(){
  const IsLoggedIn= await verifySession();

  if(IsLoggedIn){
    return(
      <div>
        
        <LogoutButton/>
      </div>
    );
  }
  return(
    <div>
      <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-black transition">Sign In</Link>
      <Link href="/auth/register" className="text-sm font-medium text-gray-600 hover:text-black transition">Sign Up</Link>
    </div>
  )
}



//navbar component

export default async function navbar() {
  
  return (
    <nav className="flex items center justify-between p-4 borber-b boder-gray-200 bg-blue-300">
      <Link 
      href="/"
      className="text-xl font-bold tracking-tight"
      >
        Strive
      </Link>
      <div className="flex items-center gap-4">
        {/* wrapping cookie-reading in a component Suspense */}
        <Suspense fallback={<div className="w-24 h-8 bg-gray-100 animate-pulse rounded-md"/>}>
          <AuthLinks/>
        </Suspense>

      </div>
        <ThemeToggle/>
      
      
    </nav>
  );
}
