import React from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

interface TrafficChartProps {
  traffic: { displayDate: string; users: number }[];
}

export default function TrafficChart({ traffic }: TrafficChartProps) {
  return (
    <div className="bg-card p-6 rounded-2xl shadow-saas border border-border lg:col-span-2 transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
          Traffic Over Time (GA4)
        </h2>
        <span className="bg-primary/10 text-primary text-[10px] px-3 py-1 rounded-lg font-black uppercase tracking-widest">
          Last 30 Days
        </span>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={traffic}>
            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#64748b", fontWeight: 700 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(var(--color-primary), 0.05)" }}
              contentStyle={{
                backgroundColor: "var(--color-card)",
                borderRadius: "12px",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-saas)",
                fontSize: "12px",
                fontWeight: "bold",
                color: "var(--color-foreground)"
              }}
              itemStyle={{ color: "var(--color-primary)" }}
            />
            <Bar
              dataKey="users"
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
