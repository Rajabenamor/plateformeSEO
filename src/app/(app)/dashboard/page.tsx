"use client";

import { useSearchParams } from "next/navigation";
import AnalysisLoadingScreen from "@/components/AnalysisLoadingScreen";
import SearchForm from "@/components/SearchForm";
import {
  SettingsIcon,
  AlertCircle,
  TrendingUp,
  Globe,
  MousePointer2,
} from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { useDashboardData } from "@/hooks/useDashboardData";
import ScoreCard from "@/components/dashboard/ScoreCard";
import TrafficChart from "@/components/dashboard/TrafficChart";
import MetricCard from "@/components/dashboard/MetricCard";
import RecommendationsList from "@/components/dashboard/RecommendationsList";
import EnrichedStatsGrid from "@/components/dashboard/EnrichedStatsGrid";
import ExportPdfButton from "@/components/ExportPdfButton";

function DashboardContent() {
  const {
    data,
    loading,
    initialCheck,
    error,
    targetUrl,
    fixStatuses,
    prUrls,
    handleFixNow,
  } = useDashboardData();

  const [isChanging, setIsChanging] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  // Close the change website form automatically when the URL updates
  React.useEffect(() => {
    setIsChanging(false);
  }, [targetUrl]);

  // 0. Prevent flicker: Wait for the hook to resolve its initial URL/cookie check
  if (initialCheck) {
    return null;
  }

  // 1. If NO website has been analyzed yet, show the onboarding view
  if (!targetUrl) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
        <div className="max-w-md w-full">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20">
            <Globe size={32} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
            Audit Your Site
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed font-medium">
            Enter your domain URL to start a comprehensive SEO audit and traffic
            analysis.
          </p>
          <div className="bg-card p-2 rounded-xl border border-border shadow-sm">
            <SearchForm />
          </div>
          <div className="mt-8 pt-8 border-t border-border">
            <Link
              href="/dashboard/settings/history"
              className="group text-xs font-bold text-primary flex items-center justify-center gap-2 hover:underline transition-all uppercase tracking-wider"
            >
              View History
              <TrendingUp
                size={14}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
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
    const errorParts = error.split("|_DOMAIN_|");
    const displayError = errorParts[0];
    const registeredDomain = errorParts.length > 1 ? errorParts[1] : null;

    return (
      <div className="min-h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="max-w-md w-full space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
            <AlertCircle size={24} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-foreground">
              Analysis Error
            </h1>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              {displayError}
            </p>
          </div>

          {registeredDomain && (
            <div className="pt-2">
              <Link
                href={`/dashboard?url=${encodeURIComponent(registeredDomain)}`}
                className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md inline-flex items-center gap-2"
              >
                Return to {registeredDomain}
              </Link>
            </div>
          )}

          <div className="pt-4 pb-2">
            <div className="bg-card p-2 rounded-xl border border-border shadow-sm text-left">
              <p className="text-xs font-bold text-muted-foreground px-2 mb-2 uppercase tracking-wider">
                Try a different website
              </p>
              <SearchForm />
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="text-xs font-bold text-muted-foreground hover:text-foreground transition-all uppercase tracking-wider"
          >
            Or click here to reload page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="dashboard-report"
      className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex-1">
          <h2 className="text-[10px] font-bold text-primary tracking-wider uppercase mb-1.5 opacity-80">
            Dashboard
          </h2>
          <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
              Overview
            </h1>
            <div className="h-5 w-px bg-border hidden md:block" />
            {!isChanging ? (
              <div className="flex items-center gap-2 text-muted-foreground font-medium animate-in fade-in slide-in-from-left-2 duration-300">
                <Globe size={14} className="text-primary/70" />
                <span className="text-sm font-semibold truncate max-w-50 md:max-w-md">
                  {targetUrl}
                </span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 ml-1" />
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
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              isChanging
                ? "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20"
                : "bg-muted border-border text-foreground/70 hover:text-foreground hover:bg-muted/80"
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
                Change Site
              </>
            )}
          </button>

          {!isChanging && (
            <>
            {/*export dashboard as pdf button */}
              <ExportPdfButton targetUrl={targetUrl} />
              <button
                onClick={() => {
                  const currentUrl = new URL(window.location.href);
                  currentUrl.searchParams.set("refresh", "true");
                  window.location.href = currentUrl.toString();
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
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
          title="Core Performance"
          score={data?.technical_health || 0}
          icon={SettingsIcon}
          variant="green"
          footer="Technical SEO health score based on Core Web Vitals."
        />
        <MetricCard
          title="Content Quality"
          score={data?.content_score || 0}
          icon={TrendingUp}
          variant="orange"
          footer="Semantic relevance and keyword optimization depth."
        />
        <MetricCard
          title="Link Authority"
          score={data?.backlink_strength || 0}
          icon={TrendingUp}
          variant="blue"
          footer="Structural integrity and strength of your backlink profile."
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
