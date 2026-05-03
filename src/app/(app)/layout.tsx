import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* LEFT: Slim, collapsible Sidebar */}
      <Sidebar />
      
      {/* RIGHT: Main App Architecture */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* TOP: Subtle, blur-backed sticky header */}
        <Header />
        
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
