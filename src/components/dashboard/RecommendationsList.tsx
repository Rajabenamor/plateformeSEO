import React from "react";
import { CheckCircle2, Zap, FileCode, Clock, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface Fix {
  id?: string;
  title: string;
  explanation: string;
  impact_score?: number;
  effort_level?: string;
  target_file?: string;
  technical_details?: string;
  code_fix?: string;
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
  
  if (!fixes || fixes.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm w-full">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-6">
            <CheckCircle2 size={32} />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Maximum Optimization Achieved</h2>
        <p className="text-muted-foreground max-w-sm mx-auto text-sm">
            Our AI agents couldn't find any critical vulnerabilities. Your site structure is currently adhering to elite SEO standards.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      {fixes.map((fix, index) => {
        const fixId = fix.id || index.toString();
        const status = fixStatuses[fixId] || 'idle';
        const prUrl = prUrls[fixId];

        return (
          <div 
            key={fixId} 
            className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* LEFT: Impact Score */}
              <div className="shrink-0 flex md:flex-col items-center justify-center gap-2 md:w-20">
                <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-lg font-bold text-primary">
                    {fix.impact_score || 8}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Impact</span>
              </div>

              {/* CENTER: Details */}
              <div className="flex-1 min-w-0 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {fix.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[9px] font-bold uppercase tracking-wider border border-amber-500/20 flex items-center gap-1">
                       <Clock size={10} />
                       {fix.effort_level || 'Low Effort'}
                    </span>
                    {fix.target_file && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-bold uppercase tracking-wider border border-blue-500/20 flex items-center gap-1">
                         <FileCode size={10} />
                         {fix.target_file}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  {fix.explanation}
                </p>

                {(fix.technical_details || fix.code_fix) && (
                  <div className="p-4 bg-muted/30 border border-border rounded-xl font-mono text-[11px] text-muted-foreground overflow-x-auto w-full">
                      <div className="flex items-center gap-2 mb-2 text-foreground/70 border-b border-border pb-2">
                          <ShieldAlert size={12} className="text-amber-500 shrink-0" />
                          <span className="font-bold">TECHNICAL VULNERABILITY DETECTED</span>
                      </div>
                      <code className="whitespace-pre text-foreground/80">
                        {fix.technical_details || fix.code_fix}
                      </code>
                  </div>
                )}
              </div>

              {/* RIGHT: Action (Only visible if GitHub is connected) */}
              <div className="shrink-0 flex flex-col gap-3 justify-center md:w-56">
                {isGithubConnected ? (
                  <>
                    <button
                      onClick={() => onFixNow(fixId, fix)}
                      disabled={status === 'fixing'}
                      className={`w-full group/btn relative overflow-hidden px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                        status === 'fixing' 
                        ? 'bg-muted text-muted-foreground cursor-not-allowed border border-border' 
                        : status === 'success'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-primary text-primary-foreground hover:brightness-110 cursor-pointer'
                      }`}
                    >
                      {status === 'fixing' ? (
                        <>
                          <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                          Deploying Fix...
                        </>
                      ) : status === 'success' ? (
                        <>
                          <CheckCircle2 size={14} />
                          Re-deploy Fix
                        </>
                      ) : (
                        <>
                          <Zap size={14} className="fill-current" />
                          Apply AI Fix
                        </>
                      )}
                    </button>

                    {status === 'success' && prUrl && (
                       <Link 
                         href={prUrl} 
                         target="_blank"
                         className="w-full flex items-center justify-center gap-2 bg-muted/50 text-foreground border border-border py-3 rounded-xl text-xs font-bold hover:bg-muted transition-all animate-in fade-in slide-in-from-top-2 duration-300"
                       >
                          <FileCode size={14} />
                          View PR on GitHub
                       </Link>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full min-h-[60px] flex items-center justify-center bg-muted/20 border border-border border-dashed rounded-xl p-3 text-center">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Connect GitHub to Apply Fixes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}