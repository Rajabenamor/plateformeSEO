import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  variant: "green" | "orange" | "blue";
  footer: string;
}

const variants = {
  green: {
    bg: "bg-green-500/10",
    text: "text-green-500",
    badge: "bg-green-500/10 text-green-500",
    progress: "bg-green-500",
  },
  orange: {
    bg: "bg-orange-500/10",
    text: "text-orange-500",
    badge: "bg-orange-500/10 text-orange-500",
    progress: "bg-orange-500",
  },
  blue: {
    bg: "bg-primary/10",
    text: "text-primary",
    badge: "bg-primary/10 text-primary",
    progress: "bg-primary",
  },
};

export default function MetricCard({
  title,
  score,
  icon: Icon,
  variant,
  footer,
}: MetricCardProps) {
  const styles = variants[variant];
  
  // Status logic for professional feedback
  const status = score >= 80 ? 'Optimal' : score >= 50 ? 'Stable' : 'Needs Work';
  const statusColor = score >= 80 ? 'text-emerald-500 bg-emerald-500/10' : score >= 50 ? 'text-amber-500 bg-amber-500/10' : 'text-red-500 bg-red-500/10';

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border transition-all duration-300 hover:shadow-md flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-2 ${styles.bg} rounded-lg ${styles.text}`}>
          <Icon size={18} />
        </div>
        <span
          className={`text-[10px] px-2.5 py-1 rounded-md font-bold tracking-wider uppercase ${statusColor}`}
        >
          {status}
        </span>
      </div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-foreground tracking-tight">{score}%</h3>
      <div className="w-full bg-muted rounded-full h-1 mt-4 mb-4 overflow-hidden">
        <div
          className={`${styles.progress} h-full transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <div className="mt-auto">
        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">{footer}</p>
      </div>
    </div>
  );
}
