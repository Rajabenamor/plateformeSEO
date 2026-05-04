"use client";

import { useSearchParams } from "next/navigation";
import AnalysisLoadingScreen from "@/components/AnalysisLoadingScreen";
import SearchForm from "@/components/SearchForm";
import { SettingsIcon, AlertCircle, TrendingUp, Globe, MousePointer2 } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import ScoreCard from "@/components/dashboard/ScoreCard";
import TrafficChart from "@/components/dashboard/TrafficChart";
import MetricCard from "@/components/dashboard/MetricCard";
import RecommendationsList from "@/components/dashboard/RecommendationsList";
import EnrichedStatsGrid from "@/components/dashboard/EnrichedStatsGrid";

function DashboardContent() {
  const {
    data,
    loading,
    initialCheck,
    error,
    targetUrl,
    fixStatuses,
    prUrls,
    handleFixNow
  } = useDashboardData();

  const [isChanging, setIsChanging] = React.useState(false);

  // 0. Prevent flicker: Wait for the hook to resolve its initial URL/cookie check
  if (initialCheck) {
    return null;
  }

  // 1. If NO website has been analyzed yet, show the full-screen onboarding canvas
  if (!targetUrl) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
        <div className="max-w-md w-full">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30 rotate-3">
            <Globe size={40} />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">Intelligence Canvas</h1>
          <p className="text-slate-400 mb-10 leading-relaxed font-medium">
            Deploy your domain URL to initiate a deep structural SEO audit and neural traffic analysis.
          </p>
          <div className="bg-card p-2 rounded-2xl border border-white/5 shadow-saas">
             <SearchForm />
          </div>
          <div className="mt-10 pt-10 border-t border-white/5">
            <Link 
              href="/dashboard/settings/history" 
              className="group text-sm font-bold text-primary flex items-center justify-center gap-2 hover:opacity-80 transition-all uppercase tracking-widest"
            >
              Access Analysis Archives
              <TrendingUp size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Only show loading if we have a URL and are waiting for data
  if (loading) {
    return <AnalysisLoadingScreen targetUrl={targetUrl} />;
  }

  if (error) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="max-w-md w-full space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Signal Interruption</h1>
            <p className="text-slate-400 font-medium">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/30 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
        <div className="flex-1">
          <h2 className="text-[10px] font-bold text-accent tracking-[0.3em] uppercase mb-1.5 opacity-80">Performance Blueprint</h2>
          <div className="flex items-center gap-4">
             <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                Dashboard
             </h1>
             <div className="h-6 w-px bg-white/10 hidden md:block" />
             {!isChanging ? (
               <div className="flex items-center gap-2 text-slate-400 font-medium animate-in fade-in slide-in-from-left-2 duration-300">
                  <Globe size={14} className="text-primary" />
                  <span className="text-sm font-semibold truncate max-w-[200px] md:max-w-md">{targetUrl}</span>
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse ml-1" />
               </div>
             ) : (
               <div className="flex-1 max-w-xl animate-in fade-in zoom-in-95 duration-300">
                  <SearchForm />
               </div>
             )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
           <button 
              onClick={() => setIsChanging(!isChanging)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                isChanging 
                ? "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20" 
                : "bg-white/5 border-white/10 text-slate-300 hover:text-foreground hover:bg-white/10"
              }`}
           >
              {isChanging ? (
                <>
                  <AlertCircle size={14} />
                  Cancel
                </>
              ) : (
                <>
                  <Globe size={14} />
                  Change Website
                </>
              )}
           </button>
           
           {!isChanging && (
             <>
               <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-foreground hover:bg-white/10 transition-all shadow-sm flex items-center gap-2 cursor-pointer">
                  <MousePointer2 size={14} />
                  Export
               </button>
               <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer">
                  Refresh
               </button>
             </>
           )}
        </div>
      </div>
      
      {/* TOP KPI GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
           <ScoreCard score={data?.overall_score || 0} />
        </div>
        <div className="lg:col-span-8">
           <TrafficChart traffic={data?.traffic || []} />
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Technical Health" 
          score={data?.technical_health || 0} 
          icon={SettingsIcon} 
          variant="green"
          footer="Proprietary audit of 42+ technical SEO checkpoints."
        />
        <MetricCard 
          title="Content Density" 
          score={data?.content_score || 0} 
          icon={TrendingUp} 
          variant="orange"
          footer="Neural analysis of semantic keyword clustering."
        />
        <MetricCard 
          title="Authority Linkage" 
          score={data?.backlink_strength || 0} 
          icon={TrendingUp} 
          variant="blue"
          footer="Graph-based evaluation of backlink structural integrity."
        />
      </div>

      {/* STRATEGIC RECOMMENDATIONS */}
      <EnrichedStatsGrid stats={data?.enriched_statistics} />

      <RecommendationsList 
        fixes={data?.seo_fixes || []}
        fixStatuses={fixStatuses}
        prUrls={prUrls}
        onFixNow={handleFixNow}
      />
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<AnalysisLoadingScreen targetUrl={null} />}>
      <DashboardContent />
    </Suspense>
  );
}
