"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import AnalysisLoadingScreen from "@/components/AnalysisLoadingScreen";
import { AlertCircle, ArrowLeft, CheckCircle2, ChevronRight, Clock, Zap, FileCode, ShieldAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function RecommendationsPage() {
  const { data, loading, initialCheck, error, targetUrl, handleFixNow, fixStatuses, prUrls } = useDashboardData();

  if (initialCheck) {
    return null;
  }

  if (loading) {
    return <AnalysisLoadingScreen targetUrl={targetUrl} />;
  }

  if (!targetUrl) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
        <div className="max-w-md w-full space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-white/5 text-primary shadow-xl">
             <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">No Active Analysis</h1>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              We couldn't find an active SEO analysis. Please return to the dashboard and enter a URL to begin.
            </p>
          </div>
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
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
            <p className="text-slate-400 font-medium">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            Retry Fetch
          </button>
        </div>
      </div>
    );
  }

  const recommendations = data?.seo_fixes || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-accent tracking-[0.3em] uppercase opacity-70">
            <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
                Dashboard
            </Link>
            <ChevronRight size={10} />
            Recommendations
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Strategic Action Items</h1>
          <p className="text-slate-400 text-sm font-medium">
            AI-generated technical fixes for <span className="text-foreground">{targetUrl}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-900 border border-white/5 rounded-xl flex items-center gap-3">
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Findings</p>
                    <p className="text-sm font-bold text-foreground">{recommendations.length}</p>
                </div>
                <div className="h-8 w-px bg-white/5" />
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fixed Today</p>
                    <p className="text-sm font-bold text-green-500">0</p>
                </div>
            </div>
        </div>
      </div>

      {/* RECOMMENDATIONS GRID */}
      {recommendations.length === 0 ? (
        <div className="bg-card/30 border border-white/5 rounded-3xl p-12 text-center backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 text-green-500 mb-6">
                <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Maximum Optimization Achieved</h2>
            <p className="text-slate-400 max-w-sm mx-auto text-sm">
                Our AI agents couldn't find any critical vulnerabilities. Your site structure is currently adhering to elite SEO standards.
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {recommendations.map((fix: any, index: number) => {
            const fixId = fix.id || index.toString();
            const status = fixStatuses[fixId] || 'idle';
            const prUrl = prUrls[fixId];

            return (
              <div 
                key={fixId} 
                className="group relative bg-card/30 border border-white/5 rounded-2xl p-6 hover:bg-white/[0.03] transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* LEFT: Impact Score */}
                  <div className="shrink-0 flex md:flex-col items-center justify-center gap-2 md:w-20">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-lg font-black text-primary shadow-inner">
                        {fix.impact_score || 8}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500">Impact</span>
                  </div>

                  {/* CENTER: Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {fix.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[9px] font-bold uppercase tracking-widest border border-amber-500/10 flex items-center gap-1">
                           <Clock size={10} />
                           {fix.effort_level || 'Low Effort'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-50 text-[9px] font-bold uppercase tracking-widest border border-blue-500/10 flex items-center gap-1">
                           <FileCode size={10} />
                           {fix.target_file || 'Page Structure'}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                      {fix.explanation}
                    </p>

                    <div className="p-4 bg-slate-950/50 border border-white/5 rounded-xl font-mono text-[11px] text-slate-400 overflow-x-auto">
                        <div className="flex items-center gap-2 mb-2 text-slate-500 border-b border-white/5 pb-2">
                            <ShieldAlert size={12} className="text-amber-500" />
                            <span>TECHNICAL VULNERABILITY DETECTED</span>
                        </div>
                        <code className="whitespace-pre">{fix.technical_details}</code>
                    </div>
                  </div>

                  {/* RIGHT: Action */}
                  <div className="shrink-0 flex flex-col gap-3 justify-center md:w-56">
                    <button
                      onClick={() => handleFixNow(fixId, fix)}
                      disabled={status === 'fixing'}
                      className={`w-full group/btn relative overflow-hidden px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                        status === 'fixing' 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                        : status === 'success'
                        ? 'bg-green-500/20 text-green-500 border border-green-500/20 hover:bg-green-500/30'
                        : 'bg-primary text-primary-foreground hover:brightness-110 shadow-primary/20 cursor-pointer'
                      }`}
                    >
                      {status === 'fixing' ? (
                        <>
                          <div className="w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
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
                      {/* Subtle glow effect on hover */}
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                    </button>

                    {status === 'success' && prUrl && (
                       <Link 
                         href={prUrl} 
                         target="_blank"
                         className="w-full flex items-center justify-center gap-2 bg-white/5 text-slate-300 border border-white/10 py-3 rounded-xl text-xs font-bold hover:bg-white/10 transition-all animate-in fade-in slide-in-from-top-2 duration-300"
                       >
                          <FileCode size={14} />
                          View PR on GitHub
                       </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FOOTER ADVISORY */}
      <div className="mt-12 p-6 rounded-3xl border border-white/5 bg-slate-900/20 flex flex-col md:flex-row items-center gap-6">
        <div className="w-12 h-12 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Zap size={24} />
        </div>
        <div className="flex-1 space-y-1">
            <h4 className="text-sm font-bold text-foreground tracking-tight">Enterprise SEO Advisor</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Our AI agents prioritize fixes based on raw traffic impact and crawling efficiency. Applying these recommendations typically results in a <span className="text-primary font-bold">12-18% lift</span> in technical visibility within 48 hours.
            </p>
        </div>
      </div>
    </div>
  );
}
