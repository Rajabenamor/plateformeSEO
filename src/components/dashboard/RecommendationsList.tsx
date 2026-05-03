import React from "react";

interface Fix {
  title: string;
  explanation: string;
  code_fix: string;
  target_file?: string;
}

interface RecommendationsListProps {
  fixes: Fix[];
  fixStatuses: Record<number, "idle" | "fixing" | "success" | "error">;
  prUrls: Record<number, string>;
  onFixNow: (index: number, fix: Fix) => void;
}

export default function RecommendationsList({
  fixes,
  fixStatuses,
  prUrls,
  onFixNow,
}: RecommendationsListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-base font-bold text-gray-800">
          Top Recommendations
        </h2>
      </div>
      <div className="divide-y divide-gray-100">
        {fixes.map((fix, index) => (
          <div
            key={index}
            className="p-6 flex items-start justify-between group hover:bg-gray-50 transition-colors"
          >
            <div className="flex gap-4">
              <div className="mt-1">
                <span className="text-red-500 text-xl font-bold">!</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  {fix.title}
                </h3>
                <p className="text-xs text-gray-500 max-w-2xl leading-relaxed mb-3">
                  {fix.explanation}
                </p>

                {fix.target_file && (
                  <div className="mb-3 inline-block bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded border border-blue-100">
                    Target: {fix.target_file}
                  </div>
                )}

                {fix.code_fix && (
                  <div className="bg-gray-800 text-gray-200 text-xs p-3 rounded-lg font-mono overflow-x-auto">
                    <code>{fix.code_fix}</code>
                  </div>
                )}
              </div>
            </div>

            <div className="ml-4 flex flex-col items-end gap-2 shrink-0 mt-1">
              {fixStatuses[index] === "success" ? (
                <div className="flex gap-2">
                  <a
                    href={prUrls[index]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors shadow-sm"
                  >
                    ✓ Fixed! View PR
                  </a>
                  <button
                    onClick={() => onFixNow(index, fix)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Retry
                  </button>
                </div>
              ) : fixStatuses[index] === "fixing" ? (
                <button
                  disabled
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed shadow-sm"
                >
                  Creating PR...
                </button>
              ) : (
                <button
                  onClick={() => onFixNow(index, fix)}
                  className="cursor-pointer bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                >
                  {fixStatuses[index] === "error" ? "Retry Fix" : "Fix Now"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
