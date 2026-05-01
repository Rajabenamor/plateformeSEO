"use client";

import AnalysisLoadingScreen from "@/components/AnalysisLoadingScreen";
import { Pencil, SettingsIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fetchDashboardDataSecurely, createGithubPullRequestAction } from "@/app/actions/auth";

// Tell TypeScript the exact shape of your Django API response
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
  const [loading, setloading] = useState(true);

  // NEW: State to track the exact status and PR URL for EACH individual fix
  const [fixStatuses, setFixStatuses] = useState<Record<number, 'idle' | 'fixing' | 'success' | 'error'>>({});
  const [prUrls, setPrUrls] = useState<Record<number, string>>({});

  const handleFixNow = async (index: number, fix: any) => {
    // Mark this specific item as 'fixing'
    setFixStatuses(prev => ({ ...prev, [index]: 'fixing' }));
    
    // Pass the file the AI guessed during the initial analysis, or default to page.tsx
    const targetFile = fix.target_file || "src/app/page.tsx"; 
    
    // Pass the title, EXPLANATION, and targetFile
    const result = await createGithubPullRequestAction(fix.title, fix.explanation, targetFile);
    
    if (result.success && result.prUrl) {
      // Mark as success and save the specific PR URL
      setFixStatuses(prev => ({ ...prev, [index]: 'success' }));
      setPrUrls(prev => ({ ...prev, [index]: result.prUrl }));
    } else {
      // Mark as error so the user can try again
      setFixStatuses(prev => ({ ...prev, [index]: 'error' }));
      alert(`Error: ${result.error}`);
    }
  };

  useEffect(() => {
    if (!targetUrl) {
      router.push("/");
      return;
    }
    
    // Fetch data using the secure server action
    fetchDashboardDataSecurely(targetUrl)
      .then((json) => {
        // Format the YYYYMMDD dates from GA4 into readable labels (e.g., "MAR 04")
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
      .catch((err) => console.error("Error fetching data:", err));
  }, [targetUrl, router]);

  // --- SCREEN 1: THE LOADING SCREEN ---
  if (loading) {
    return <AnalysisLoadingScreen targetUrl={targetUrl} />;
  }

  // --- SCREEN 2: THE ACTUAL DASHBOARD ---
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/*header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Real-time SEO & Traffic overview for your domain
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/*Overall Score Card */}
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
        
        {/* Traffic Chart Card */}
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

      {/* Dynamic Metric Cards*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/*Technical Health */}
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

        {/*content score */}
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

        {/*backlink strength */}
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

      {/* AI Recommendations Section */}
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
                  
                  {/* File Target Badge (Optional but helpful!) */}
                  {fix.target_file && (
                    <div className="mb-3 inline-block bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded border border-blue-100">
                      Target: {fix.target_file}
                    </div>
                  )}

                  {/* Fallback to show raw code if needed, hiding it makes the UI cleaner if AI is auto-fixing */}
                  {fix.code_fix && (
                    <div className="bg-gray-800 text-gray-200 text-xs p-3 rounded-lg font-mono overflow-x-auto">
                      <code>{fix.code_fix}</code>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Action Buttons Area */}
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