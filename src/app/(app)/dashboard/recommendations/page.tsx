"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import { 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Zap, 
  FileCode, 
  ShieldAlert 
} from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";

import { AnalysisLoadingScreen } from "@/components/AnalysisLoadingScreen"; 

function RecommendationsContent() {
  const { data, loading, initialCheck, error, targetUrl, handleFixNow, fixStatuses, prUrls } = useDashboardData();

  if (initialCheck) return null;

  if (loading) {
    return <AnalysisLoadingScreen targetUrl={targetUrl} />;
  }

  if (!targetUrl) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
        <div className="max-w-md w-full space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-border text-primary shadow-sm">
             <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">No Active Analysis</h1>
            <p className="text-muted-foreground font-medium text-sm leading-relaxed">
              We couldn't find an active SEO analysis. Please return to the dashboard and enter a URL to begin.
            </p>
          </div>
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="max-w-md w-full space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Data Retrieval Error</h1>
            <p className="text-muted-foreground font-medium">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-sm"
          >
            Retry Fetch
          </button>
        </div>
      </div>
    );
  }

  const recommendations = data?.seo_fixes || [];
  const isGithubConnected = data?.is_github_connected || false;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary tracking-[0.3em] uppercase">
            <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                Dashboard
            </Link>
            <ChevronRight size={10} className="text-muted-foreground" />
            Recommendations
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Strategic Action Items</h1>
          <p className="text-muted-foreground text-sm font-medium">
            AI-generated technical fixes for <span className="text-foreground">{targetUrl}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-card border border-border rounded-xl flex items-center gap-3 shadow-sm">
                <div className="text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Findings</p>
                    <p className="text-sm font-bold text-foreground">{recommendations.length}</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fixed Today</p>
                    <p className="text-sm font-bold text-emerald-500">0</p>
                </div>
            </div>
        </div>
      </div>

      {/* COMBINED UI LIST SECTION */}
      <div className="w-full">
        {recommendations.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm w-full">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-6">
                <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Maximum Optimization Achieved</h2>
            <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                Our AI agents couldn't find any critical vulnerabilities. Your site structure is currently adhering to elite SEO standards.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 w-full">
            {recommendations.map((fix: any, index: number) => {
              const fixId = fix.id || index.toString();
              const status = fixStatuses[fixId] || 'idle';
              const prUrl = prUrls[fixId];

              // Fallbacks for data properties
              const displayCode = fix.code_fix || fix.technical_details;

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

                      {/* Display the Code Snippet if it exists */}
                      {displayCode && (
                        <div className="p-4 bg-muted/30 border border-border rounded-xl font-mono text-[11px] text-muted-foreground overflow-x-auto w-full">
                            <div className="flex items-center gap-2 mb-2 text-foreground/70 border-b border-border pb-2">
                                <ShieldAlert size={12} className="text-amber-500 shrink-0" />
                                <span className="font-bold">TECHNICAL FIX SUGGESTION</span>
                            </div>
                            <code className="whitespace-pre text-foreground/80">{displayCode}</code>
                        </div>
                      )}
                    </div>

                    {/* RIGHT: Action Buttons */}
                    <div className="shrink-0 flex flex-col gap-3 justify-center md:w-56 mt-4 md:mt-0">
                      {isGithubConnected ? (
                        <>
                          <button
                            onClick={() => handleFixNow(fixId, fix)}
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
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                            Connect GitHub to Apply
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FOOTER ADVISORY */}
      <div className="mt-12 p-6 rounded-2xl border border-border bg-muted/20 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="w-12 h-12 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Zap size={24} />
        </div>
        <div className="flex-1 space-y-1">
            <h4 className="text-sm font-bold text-foreground tracking-tight">Enterprise SEO Advisor</h4>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Our AI agents prioritize fixes based on raw traffic impact and crawling efficiency. Applying these recommendations typically results in a <span className="text-primary font-bold">12-18% lift</span> in technical visibility within 48 hours.
            </p>
        </div>
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground font-medium">Loading recommendations...</div>}>
      <RecommendationsContent />
    </Suspense>
  );
}