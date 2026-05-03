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

  return (
    <div className="bg-card p-6 rounded-2xl shadow-saas border border-border transition-colors duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-2.5 ${styles.bg} rounded-xl ${styles.text}`}>
          <Icon size={18} />
        </div>
        <span
          className={`${styles.badge} text-[10px] px-2.5 py-1 rounded-lg font-black tracking-widest uppercase`}
        >
          Excellent
        </span>
      </div>
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black text-foreground tracking-tight">{score}%</h3>
      <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5 mt-4 mb-4">
        <div
          className={`${styles.progress} h-1.5 rounded-full shadow-[0_0_8px_rgba(var(--color-primary),0.5)]`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{footer}</p>
    </div>
  );
}
