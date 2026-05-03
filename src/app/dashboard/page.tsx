"use client";

import AnalysisLoadingScreen from "@/components/AnalysisLoadingScreen";
import SearchForm from "@/components/SearchForm";
import { SettingsIcon, LayoutDashboard, AlertCircle, Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import ScoreCard from "@/components/dashboard/ScoreCard";
import TrafficChart from "@/components/dashboard/TrafficChart";
import MetricCard from "@/components/dashboard/MetricCard";
import RecommendationsList from "@/components/dashboard/RecommendationsList";

export default function Dashboard() {
  const {
    data,
    loading,
    error,
    targetUrl,
    fixStatuses,
    prUrls,
    handleFixNow
  } = useDashboardData();

  if (loading) {
    return <AnalysisLoadingScreen targetUrl={targetUrl} />;
  }

  if (!targetUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 font-sans">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600">
            <LayoutDashboard size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome to your Dashboard</h1>
          <p className="text-gray-500 mb-8">
            Enter a website URL to start your SEO analysis and get AI-powered recommendations.
          </p>
          <SearchForm />
          <div className="mt-8">
            <Link 
              href="/dashboard/settings/history" 
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              View Analysis History →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 font-sans">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
          <p className="text-gray-500 mb-8">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Real-time SEO & Traffic overview for your domain
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ScoreCard score={data?.overall_score || 0} />
        <TrafficChart traffic={data?.traffic || []} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard 
          title="Technical Health" 
          score={data?.technical_health || 0} 
          icon={SettingsIcon} 
          variant="green"
          footer="2 critical issues resolved this week."
        />
        <MetricCard 
          title="Content Score" 
          score={data?.content_score || 0} 
          icon={Pencil} 
          variant="orange"
          footer="Focus on meta-descriptions and H1 tags."
        />
        <MetricCard 
          title="Backlink strength" 
          score={data?.backlink_strength || 0} 
          icon={Pencil} 
          variant="blue"
          footer="12 new domains linking to your site."
        />
      </div>

      <RecommendationsList 
        fixes={data?.seo_fixes || []}
        fixStatuses={fixStatuses}
        prUrls={prUrls}
        onFixNow={handleFixNow}
      />
    </div>
  );
}