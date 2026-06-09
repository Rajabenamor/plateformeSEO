"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Zap, ShieldAlert, CheckCircle2, ChevronRight } from "lucide-react";

interface TopRecommendationsSummaryProps {
  fixes?: any[];
}

export default function TopRecommendationsSummary({ fixes = [] }: TopRecommendationsSummaryProps) {
  // 1. Grab the current website URL from the browser's search params
  const searchParams = useSearchParams();
  const currentUrl = searchParams.get("url");

  // 2. Safely attach it to the link so the next page knows what to load
  const viewAllHref = currentUrl 
    ? `/dashboard/recommendations?url=${encodeURIComponent(currentUrl)}` 
    : "/dashboard/recommendations";

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-foreground">Top Recommendations</h2>
          <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
            {fixes.length}
          </span>
        </div>
        {/* 3. Use the updated dynamic link here */}
        <Link 
          href={viewAllHref} 
          className="text-sm font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group"
        >
          View All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* List / Empty State */}
      <div className="flex flex-col">
        {fixes.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-foreground">All Clear!</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">
              No pending recommendations found for this site.
            </p>
          </div>
        ) : (
            fixes.slice(0, 4).map((fix: any, index: number) => {
            const isLast = index === fixes.length - 1;
            
            // Assign a dynamic icon/color based on the index
            const icons = [AlertCircle, Zap, ShieldAlert];
            const colors = ["text-red-500", "text-amber-500", "text-blue-500"];
            const Icon = icons[index % icons.length];
            const iconColor = colors[index % colors.length];

            return (
              <div 
                key={fix.id || index} 
                className={`flex items-start gap-4 p-5 hover:bg-muted/30 transition-colors ${
                  !isLast ? "border-b border-border" : ""
                }`}
              >
                <div className={`mt-0.5 ${iconColor}`}>
                  <Icon size={20} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col space-y-1">
                  <h3 className="text-sm font-bold text-foreground">{fix.title}</h3>
                  <p className="text-xs text-muted-foreground font-medium line-clamp-2">
                    {fix.explanation}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
      
    </div>
  );
}