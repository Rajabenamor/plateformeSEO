import React from "react";

interface ScoreCardProps {
  score: number;
}

export default function ScoreCard({ score }: ScoreCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 self-start">
        Overall Score
      </p>
      <div className="w-32 h-32 rounded-full border-12 border-blue-600 flex items-center justify-center">
        <div className="text-center">
          <span className="text-3xl font-black text-gray-800">
            {score || "--"}
          </span>
          <p className="text-xs text-gray-400">of 100</p>
        </div>
      </div>
      <p className="text-green-500 font-semibold text-sm mt-6">
        ~ +5.2% from last week
      </p>
    </div>
  );
}
