"use client";

import React, { useState } from "react";
import AdminTable from "@/components/AdminTable";
import AdminError from "@/components/AdminError";
import { AdminKPIGrid } from "@/components/AdminKPIGrid"; 
import { Users, LayoutDashboard } from "lucide-react";

export default function AdminDashboardClient({ result, currentUser }: { result: any, currentUser: any }) {
  const [activeTab, setActiveTab] = useState<'kpis' | 'users'>('kpis');

  if (!result || !result.success) {
    return <AdminError error={result?.error || "Failed to load"} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 transition-colors">
      <h1 className="text-2xl font-bold text-primary mb-2">Admin Dashboard</h1>
      <p className="text-sm text-foreground/60 mb-6">{result.count} total users</p>

      {/* Tabs Navigation */}
      <div className="flex space-x-6 border-b border-border mb-8">
        <button
          onClick={() => setActiveTab('kpis')}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'kpis'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <LayoutDashboard size={16} />
          KPI Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users size={16} />
          User Management
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'kpis' ? (
        <div className="animate-in fade-in duration-300">
          <AdminKPIGrid />
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          <AdminTable 
            initialUsers={result.users}
            isSuperAdmin={!!currentUser?.isSuperAdmin}
            currentUserId={currentUser?.id}
          />
        </div>
      )}
    </div>
  );
}