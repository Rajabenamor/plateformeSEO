import React from "react";

interface ScoreCardProps {
  score: number;
}

export default function ScoreCard({ score }: ScoreCardProps) {
  const radius = 56; // 3.5rem (56px) radius
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((score || 0) / 100) * circumference;

  return (
    <div className="bg-card p-6 h-[350px] rounded-2xl shadow-sm border border-border flex flex-col transition-all duration-300 relative overflow-hidden group hover:shadow-md">
      
      {/* Header Section - Matches the Traffic Chart layout perfectly */}
      <div className="flex justify-between items-start mb-6 z-10 relative">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">
            Overall Score
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            Platform Audit Average
          </p>
        </div>
      </div>
      
      {/* Circle Section - 'flex-1' ensures it perfectly centers in the remaining space */}
      <div className="relative flex-1 flex items-center justify-center z-10">
        
        {/* SVG Container */}
        <svg className="w-36 h-36 transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-primary/5"
          />
          {/* Progress Circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Score Text inside the circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground tracking-tighter">
            {score || "--"}
          </span>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">
            of 100
          </p>
        </div>

      </div>

      {/* Subtle background glow on hover */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}