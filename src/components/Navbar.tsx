import Link from "next/link";

export default function navbar() {
  return (
    <nav className="border-b border-slate-100 bg-yellow-900">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/auth/login">Sign In</Link>
        <Link href="/auth/register">Sign Up</Link>
      </div>
      
    </nav>
  );
}
