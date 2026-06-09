import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Suspense } from "react";
import { verifyAdminSession } from "@/lib/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await verifyAdminSession();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300">
      
      {/* LEFT: Conditional Sidebar - ONLY render if NOT an admin */}
      {!isAdmin && (
        <Suspense fallback={<div className="w-16 md:w-64 bg-background border-r border-border" />}>
          <Sidebar />
        </Suspense>
      )}
      
      {/* RIGHT: Main App Architecture */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* TOP: Subtle, blur-backed sticky header */}
        {/* Pass the isAdmin status so the Header knows when to show the logout button */}
        <Header isAdmin={isAdmin} />
        
        {/* CENTER CANVAS: Fluid Grid Environment */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}