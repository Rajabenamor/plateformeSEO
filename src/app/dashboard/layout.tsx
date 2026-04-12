import Sidebar from "@/components/Sidebar"; // Check that this path is correct for your app!

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* 1. The Sidebar (Fixed on the left) */}
      <Sidebar />

      {/* 2. The Main Content Area (Scrollable on the right) */}
      <main className="flex-1 overflow-y-auto">
        {children} 
      </main>
    </div>
  );
}