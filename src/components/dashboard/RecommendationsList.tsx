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
  isGithubConnected: boolean;
}

export default function RecommendationsList({
  fixes,
  fixStatuses,
  prUrls,
  onFixNow,
  isGithubConnected,
}: RecommendationsListProps) {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden transition-all duration-300">
      <div className="px-8 py-6 border-b border-border flex justify-between items-center bg-muted/30">
        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Top Recommendations
        </h2>
      </div>
      <div className="divide-y divide-border">
        {fixes.map((fix: any, index: number) => {
          const fixId = fix.id || index.toString();
          return (
            <div
              key={fixId}
              className="p-8 flex items-start justify-between group hover:bg-muted/30 transition-all"
            >
              <div className="flex gap-6">
                <div className="mt-1">
                  <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-lg">
                    !
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2 tracking-tight">
                    {fix.title}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed mb-4 font-medium">
                    {fix.explanation}
                  </p>

                  {fix.target_file && (
                    <div className="mb-4 inline-block bg-primary/5 text-primary text-[10px]  px-3 py-1.5 rounded-md border border-primary/10 uppercase tracking-wider">
                      Target: {fix.target_file}
                    </div>
                  )}

                  {fix.code_fix && (
                    <div className="bg-slate-950  text-white text-xs p-4 rounded-xl font-mono overflow-x-auto border border-border">
                      <code>{fix.code_fix}</code>
                    </div>
                  )}
                </div>
              </div>

              <div className="ml-6 flex flex-col items-end gap-3 shrink-0 mt-1">
                {/* CONDITIONAL RENDER: Only show buttons if GitHub is connected */}
                {isGithubConnected && (
                  <>
                    {fixStatuses[fixId] === "fixing" ? (
                      <button
                        disabled
                        className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-muted text-muted-foreground cursor-not-allowed flex items-center gap-2"
                      >
                        <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                        Creating PR...
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => onFixNow(fixId, fix)}
                          className={`cursor-pointer text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all shadow-md flex items-center gap-2 ${
                            fixStatuses[fixId] === "success"
                              ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                              : "bg-primary text-white hover:bg-primary/90"
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
                            className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all border border-border flex items-center gap-2 animate-in fade-in slide-in-from-top-1"
                          >
                            <FileCode size={12} />
                            GitHub PR
                          </a>
                        )}
                      </>
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