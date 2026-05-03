import React from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

interface TrafficChartProps {
  traffic: { displayDate: string; users: number }[];
}

export default function TrafficChart({ traffic }: TrafficChartProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-gray-800">
          Traffic Over Time (GA4)
        </h2>
        <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
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
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
            />
            <Tooltip
              cursor={{ fill: "#F3F4F6" }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar
              dataKey="users"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
