"use client";

import AnalysisLoadingScreen from "@/components/AnalysisLoadingScreen";
import SearchForm from "@/components/SearchForm";
import { Pencil, SettingsIcon, LayoutDashboard, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fetchDashboardDataSecurely, createGithubPullRequestAction } from "@/app/actions/auth";
import Cookies from "js-cookie";

interface DashboardData {
  overall_score: number;
  analyzed_url?: string;
  traffic: { date: string; users: number; displayDate: string }[];
  seo_fixes: { title: string; explanation: string; code_fix: string; target_file?: string }[];
  technical_health: number;
  content_score: number;
  backlink_strength: number;
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUrl = searchParams.get("url");
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setloading] = useState(!!targetUrl);
  const [error, setError] = useState<string | null>(null);

  const [fixStatuses, setFixStatuses] = useState<Record<number, 'idle' | 'fixing' | 'success' | 'error'>>({});
  const [prUrls, setPrUrls] = useState<Record<number, string>>({});

  const handleFixNow = async (index: number, fix: any) => {
    setFixStatuses(prev => ({ ...prev, [index]: 'fixing' }));
    
    const targetFile = fix.target_file || "src/app/page.tsx"; 
    
    const result = await createGithubPullRequestAction(fix.title, fix.explanation, targetFile);
    
    if (result.success && result.prUrl) {
      setFixStatuses(prev => ({ ...prev, [index]: 'success' }));
      setPrUrls(prev => ({ ...prev, [index]: result.prUrl }));
    } else {
      setFixStatuses(prev => ({ ...prev, [index]: 'error' }));
      alert(`Error: ${result.error}`);
    }
  };

  useEffect(() => {
    if (!targetUrl) {
      const lastUrl = Cookies.get("last_analyzed_url");
      if (lastUrl) {
        router.push(`/dashboard?url=${encodeURIComponent(lastUrl)}`);
      }
      setloading(false);
      return;
    }

    setloading(true);
    setError(null);
    
    Cookies.set("last_analyzed_url", targetUrl, { expires: 7, path: "/" });
    
    fetchDashboardDataSecurely(targetUrl)
      .then((json) => {
        const formattedTraffic = json.data.traffic?.map((item: any) => {
          const year = item.date.substring(0, 4);
          const month = item.date.substring(4, 6);
          const day = item.date.substring(6, 8);
          const dateObj = new Date(`${year}-${month}-${day}`);

          return {
            ...item,
            displayDate: dateObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
          };
        }) || [];
        
        setData({
          overall_score: json.data.overall_score || 0,
          analyzed_url: json.data.analyzed_url || targetUrl,
          traffic: formattedTraffic,
          seo_fixes: json.data.seo_fixes || [],
          technical_health: json.data.technical_health || 0,
          content_score: json.data.content_score || 0,
          backlink_strength : json.data.backlink_strength || 0

        });
        setloading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to fetch dashboard data. Please try again.");
        setloading(false);
      });
  }, [targetUrl, router]);

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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 self-start">
            Overall Score
          </p>
          <div className="w-32 h-32 rounded-full border-12 border-blue-600 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl font-black text-gray-800">
                {data ? data.overall_score : "--"}
              </span>
              <p className="text-xs text-gray-400">of 100</p>
            </div>
          </div>
          <p className="text-green-500 font-semibold text-sm mt-6">
            ~ +5.2% from last week
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-gray-800">
              Traffic Over Time (GA4)
            </h2>
            <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
              Last 30 Days
            </span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.traffic}>
                <XAxis
                  dataKey="displayDate"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9CA3AF" }}
                />
                <Tooltip
                  cursor={{ fill: "#F3F4F6" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="users"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <SettingsIcon size={16}/>
            </div>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold tracking-wide">EXCELLENT</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Technical Health</p>
          <h3 className="text-3xl font-bold text-gray-900">{data?.technical_health}%</h3>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4 mb-3">
            <div className="bg-green-500 h-1.5 rounded-full" style={{width:`${data?.technical_health}%`}}></div>
          </div>
          <p className="text-xs text-gray-500">
            2 critical issues resolved this week.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <Pencil size={16}/>
            </div>
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded font-bold tracking-wide">EXCELLENT</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Content Score</p>
          <h3 className="text-3xl font-bold text-gray-900">{data?.content_score}%</h3>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4 mb-3">
            <div className="bg-orange-500 h-1.5 rounded-full" style={{width:`${data?.content_score}%`}}></div>
          </div>
          <p className="text-xs text-gray-500">
            Focus on meta-descriptions and H1 tags.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Pencil size={16}/>
            </div>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-bold tracking-wide">EXCELLENT</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Backlink strength</p>
          <h3 className="text-3xl font-bold text-gray-900">{data?.backlink_strength}%</h3>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4 mb-3">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{width:`${data?.backlink_strength}%`}}></div>
          </div>
          <p className="text-xs text-gray-500">
            12 new domains linking to your site.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-800">
            Top Recommendations
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {data?.seo_fixes.map((fix: any, index: number) => (
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
                {fixStatuses[index] === 'success' ? (
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
                      onClick={() => handleFixNow(index, fix)}
                      className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      Retry
                    </button>
                  </div>
                ) : fixStatuses[index] === 'fixing' ? (
                  <button
                    disabled
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed shadow-sm"
                  >
                    Creating PR...
                  </button>
                ) : (
                  <button
                    onClick={() => handleFixNow(index, fix)}
                    className="cursor-pointer bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {fixStatuses[index] === 'error' ? "Retry Fix" : "Fix Now"}
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}