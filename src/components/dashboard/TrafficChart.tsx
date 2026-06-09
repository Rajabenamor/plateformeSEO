"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface TrafficChartProps {
  traffic?: { displayDate: string; users: number }[];
}

// 1. Create a modern, custom tooltip to replace the default one
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border shadow-lg rounded-xl p-3 flex flex-col gap-1 z-50">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-foreground flex items-center">
          <span className="text-blue-500 mr-2 text-lg leading-none">•</span>
          {payload[0].value} <span className="text-muted-foreground font-medium ml-1">Users</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function TrafficChart({ traffic }: TrafficChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const hasData = traffic && traffic.length > 0;
  const chartData = hasData ? traffic : [];

  if (!isMounted) {
    return <div className="bg-card p-6 rounded-2xl border border-border w-full h-[350px] animate-pulse" />;
  }

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border w-full transition-all duration-300 flex flex-col h-[350px]">
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">
            Traffic Overview
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            Sourced from Google Analytics 4
          </p>
        </div>
        <span className="bg-primary/10 text-primary text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
          Last 30 Days
        </span>
      </div>

      {/* Chart Section */}
      <div className="relative flex-1 w-full min-h-[200px] flex items-center justify-center mt-2">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center text-center space-y-3 opacity-60">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">No Traffic Data</p>
              <p className="text-xs font-medium text-muted-foreground mt-1 max-w-[220px]">
                Connect your GA4 property to view real-time visitor metrics.
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              
              {/* 2. Add a beautiful SVG Gradient for the bars */}
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2} />
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="4 4" 
                vertical={false} 
                stroke="hsl(var(--border))" 
                opacity={0.6}
              />
              
              <XAxis
                dataKey="displayDate"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontWeight: 500 }}
                dy={10}
              />

              {/* 3. Added the Y-Axis to ground the data visually */}
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontWeight: 500 }}
                dx={-10}
              />
              
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
              />
              
              <Bar
                dataKey="users"
                fill="url(#blueGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40} /* Prevents bars from getting too wide on large screens */
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}