import React from "react";

interface ScoreCardProps {
  score: number;
}

export default function ScoreCard({ score }: ScoreCardProps) {
  const radius = 56; // 3.5rem (56px) radius
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((score || 0) / 100) * circumference;

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden group hover:shadow-md">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-6 self-start z-10">
        Overall Score
      </p>
      
      <div className="relative flex items-center justify-center z-10 my-2">
        {/* Background Circle */}
        <svg className="w-36 h-36 transform -rotate-90">
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
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground tracking-tighter">
            {score || "--"}
          </span>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">of 100</p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg z-10">
         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
         <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-wider">
           +5.2% vs last week
         </p>
      </div>

      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
