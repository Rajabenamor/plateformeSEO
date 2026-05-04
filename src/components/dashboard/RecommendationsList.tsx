import React from "react";
import { CheckCircle2, Zap, FileCode } from "lucide-react";

interface Fix {
  title: string;
  explanation: string;
  code_fix: string;
  target_file?: string;
}

interface RecommendationsListProps {
  fixes: Fix[];
  fixStatuses: Record<string, "idle" | "fixing" | "success" | "error">;
  prUrls: Record<string, string>;
  onFixNow: (id: string, fix: Fix) => void;
}

export default function RecommendationsList({
  fixes,
  fixStatuses,
  prUrls,
  onFixNow,
}: RecommendationsListProps) {
  return (
    <div className="bg-card rounded-3xl shadow-saas border border-border overflow-hidden transition-colors duration-300">
      <div className="px-8 py-6 border-b border-border flex justify-between items-center">
        <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
          Top Recommendations
        </h2>
      </div>
      <div className="divide-y divide-border">
        {fixes.map((fix: any, index: number) => {
          const fixId = fix.id || index.toString();
          return (
            <div
              key={fixId}
              className="p-8 flex items-start justify-between group hover:bg-white/5 transition-all"
            >
              <div className="flex gap-6">
                <div className="mt-1">
                  <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-black text-xl shadow-lg shadow-red-500/5">
                    !
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground mb-2 tracking-tight">
                    {fix.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed mb-4 font-medium">
                    {fix.explanation}
                  </p>

                  {fix.target_file && (
                    <div className="mb-4 inline-block bg-primary/10 text-primary text-[10px] font-black px-3 py-1.5 rounded-lg border border-primary/10 uppercase tracking-widest">
                      Target: {fix.target_file}
                    </div>
                  )}

                  {fix.code_fix && (
                    <div className="bg-slate-900 dark:bg-black/40 text-slate-300 text-xs p-4 rounded-2xl font-mono overflow-x-auto border border-white/5">
                      <code>{fix.code_fix}</code>
                    </div>
                  )}
                </div>
              </div>

              <div className="ml-6 flex flex-col items-end gap-3 shrink-0 mt-1">
                {fixStatuses[fixId] === "fixing" ? (
                  <button
                    disabled
                    className="px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed shadow-inner flex items-center gap-2"
                  >
                    <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    Creating PR...
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onFixNow(fixId, fix)}
                      className={`cursor-pointer text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 ${
                        fixStatuses[fixId] === "success"
                          ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shadow-emerald-500/5"
                          : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                      }`}
                    >
                      {fixStatuses[fixId] === "success" ? (
                        <>
                          <CheckCircle2 size={12} />
                          Re-apply Fix
                        </>
                      ) : fixStatuses[fixId] === "error" ? (
                        "Retry Fix"
                      ) : (
                        <>
                          <Zap size={12} className="fill-current" />
                          Fix Now
                        </>
                      )}
                    </button>

                    {fixStatuses[fixId] === "success" && prUrls[fixId] && (
                      <a
                        href={prUrls[fixId]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl bg-white/5 text-slate-400 hover:text-foreground hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-top-1"
                      >
                        <FileCode size={12} />
                        View on GitHub
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
