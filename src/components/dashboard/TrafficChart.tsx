"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface TrafficChartProps {
  traffic?: { displayDate: string; users: number }[];
}

export default function TrafficChart({ traffic }: TrafficChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hasData = traffic && traffic.length > 0;
  const chartData = hasData ? traffic : [
    { displayDate: "01/05", users: 120 },
    { displayDate: "05/05", users: 300 },
    { displayDate: "10/05", users: 150 },
    { displayDate: "15/05", users: 450 },
    { displayDate: "20/05", users: 200 },
    { displayDate: "25/05", users: 380 },
    { displayDate: "30/05", users: 250 },
  ];

  if (!isMounted) {
    return <div className="bg-card p-6 rounded-2xl border border-border w-full h-[350px] animate-pulse bg-muted/20" />;
  }

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border w-full transition-all duration-300 flex flex-col h-[350px]">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h2 className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
            Traffic Over Time
          </h2>
          <p className="text-[10px] text-[#94a3b8] font-medium">
            {traffic && traffic.length > 0 ? "GA4 Property" : "Displaying Sample Growth Data"}
          </p>
        </div>
        <span className="bg-[#1E4E9D]/5 text-[#1E4E9D] text-[10px] px-3 py-1 rounded-md font-bold uppercase tracking-wider border border-[#1E4E9D]/10">
          Last 30 Days
        </span>
      </div>

      <div className="relative flex-1 w-full min-h-[200px]">
        {/* If the graph still doesn't show, this text will at least confirm the component is here */}
        {!hasData && (
          <div className="absolute top-0 left-0 text-[8px] text-muted-foreground/20 pointer-events-none">
            DEBUG: NO_REAL_TRAFFIC_DATA_DETECTED
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 500 }}
              dy={10}
            />
            <Tooltip
              cursor={{ fill: "#f1f5f9", opacity: 0.5 }}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                fontSize: "11px",
                fontWeight: "600",
                color: "#0f172a"
              }}
              itemStyle={{ color: "#1E4E9D", padding: 0 }}
            />
            <Bar
              dataKey="users"
              fill="#1E4E9D"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
