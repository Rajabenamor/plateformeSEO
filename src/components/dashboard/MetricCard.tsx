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
    bg: "bg-green-50",
    text: "text-green-600",
    badge: "bg-green-100 text-green-700",
    progress: "bg-green-500",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
    progress: "bg-orange-500",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    progress: "bg-blue-500",
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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 ${styles.bg} rounded-lg ${styles.text}`}>
          <Icon size={16} />
        </div>
        <span
          className={`${styles.badge} text-xs px-2 py-1 rounded font-bold tracking-wide`}
        >
          EXCELLENT
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900">{score}%</h3>
      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4 mb-3">
        <div
          className={`${styles.progress} h-1.5 rounded-full`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500">{footer}</p>
    </div>
  );
}
