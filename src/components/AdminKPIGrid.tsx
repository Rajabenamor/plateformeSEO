"use client";

import React, { useEffect, useState } from "react";
import { Users, Activity, BarChart as BarChartIcon, Github, AlertTriangle, TrendingUp } from "lucide-react";
import { getAdminKPIsAction } from "@/app/actions/admin";
// Import the chart components
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface KPIData {
  users: { total: number; new_this_week: number };
  audits: { total: number; avg_score: number };
  integrations: { ga4: number; github: number };
  feedback: { ignored_fixes: number };
  chart_data: Array<{ name: string; "New Users": number; "Audits Run": number }>;
}

export function AdminKPIGrid() {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const result = await getAdminKPIsAction();
        if (result.success) {
            setKpis(result.data);
        } else {
            setError(result.error || "Failed to load KPIs.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  if (loading) return <div className="animate-pulse h-32 bg-muted rounded-xl w-full mb-8"></div>;
  if (error || !kpis) return <div className="text-red-500 mb-8 font-medium">{error}</div>;

  return (
    <div className="space-y-8">
      
      {/* --- TOP ROW: KPI GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Users */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 text-blue-600 rounded-xl"><Users size={24} /></div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Users</p>
            <h3 className="text-2xl font-bold text-foreground">{kpis.users.total}</h3>
            <p className="text-xs text-emerald-500 font-medium">+{kpis.users.new_this_week} this week</p>
          </div>
        </div>

        {/* 2. Audits */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-primary/10 text-primary rounded-xl"><Activity size={24} /></div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Audits</p>
            <h3 className="text-2xl font-bold text-foreground">{kpis.audits.total}</h3>
            <p className="text-xs text-muted-foreground font-medium">All time</p>
          </div>
        </div>

        {/* 3. Average Score */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-xl"><TrendingUp size={24} /></div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Platform Avg Score</p>
            <h3 className="text-2xl font-bold text-foreground">{kpis.audits.avg_score}/100</h3>
          </div>
        </div>

        {/* 4. GA4 Integrations */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-orange-500/10 text-orange-500 rounded-xl"><BarChartIcon size={24} /></div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active GA4</p>
            <h3 className="text-2xl font-bold text-foreground">{kpis.integrations.ga4}</h3>
            <p className="text-xs text-muted-foreground font-medium">Connected</p>
          </div>
        </div>

        {/* 5. GitHub Integrations */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-gray-500/10 text-gray-600 rounded-xl"><Github size={24} /></div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active GitHub</p>
            <h3 className="text-2xl font-bold text-foreground">{kpis.integrations.github}</h3>
            <p className="text-xs text-muted-foreground font-medium">Connected</p>
          </div>
        </div>

        {/* 6. Ignored Fixes */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-red-500/10 text-red-500 rounded-xl"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ignored Fixes</p>
            <h3 className="text-2xl font-bold text-foreground">{kpis.feedback.ignored_fixes}</h3>
            <p className="text-xs text-muted-foreground font-medium">By users</p>
          </div>
        </div>
      </div>

      {/* --- BOTTOM ROW: ACTIVITY LINE CHART --- */}
      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
        <h2 className="text-lg font-bold text-foreground mb-1">Platform Activity Trend</h2>
        <p className="text-xs text-muted-foreground mb-6">User signups vs. Audits performed over the last 7 days.</p>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={kpis.chart_data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              
              {/* Blue Line: New Users */}
              <Line 
                type="monotone" 
                dataKey="New Users" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2 }} 
                activeDot={{ r: 6 }} 
              />
              
              {/* Purple/Primary Line: Audits Run */}
              <Line 
                type="monotone" 
                dataKey="Audits Run" 
                stroke="#8b5cf6"
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2 }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}