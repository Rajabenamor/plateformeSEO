"use client"

import { useEffect, useState } from "react"



export default function AnalysisLoadingScreen({targetUrl} : {targetUrl: string | null}){
    const [progress , setProgress] = useState(0);

    useEffect(()=> {
      const interval = setInterval(()=> {
        setProgress((prev)=>(prev >= 98 ? 98 : prev + 1));
    }, 150); // Faster visual progress
        return () => clearInterval(interval);
      }, []);

  const step1Status = progress < 30 ? "active" : "complete";
  const step2Status = progress < 30 ? "pending" : progress < 70 ? "active" : "complete";
  const step3Status = progress < 70 ? "pending" : "active";

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-3xl w-full p-10 relative overflow-hidden border border-gray-100">
        
        <div className="flex flex-col items-center text-center mb-10 mt-4">
          <span className="bg-[#eef2ff] text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
            System Active
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">AI Deep Crawl in Progress</h1>
          <p className="text-gray-500 text-sm">Our advanced AI agents are performing a comprehensive scan of <span className="font-bold">{targetUrl}</span></p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="45" fill="none" stroke="#15418c" strokeWidth="8" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (283 * progress) / 100} 
                strokeLinecap="round"
                className="transition-all duration-300 ease-out"
              />
            </svg>
            <div className="text-center z-10">
              <span className="text-4xl font-black text-gray-900">{progress}%</span>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Crawled</p>
              </div>
              </div>
              </div>

              {progress >= 95 && (
              <div className="text-center mb-8 animate-pulse">
              <p className="text-sm text-blue-600 font-semibold italic">
              Finalizing deep analysis... This can take up to 60 seconds for larger sites.
              </p>
              </div>
              )}

              <div className="max-w-md mx-auto space-y-3">

          <div className={`p-4 rounded-xl flex items-center gap-4 transition-colors ${step1Status === 'active' ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-transparent'}`}>
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step1Status === 'complete' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
              {step1Status === 'complete' ? (
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              ) : (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Gathering GA4 Traffic Data...</h3>
              <p className="text-xs text-gray-500">Connecting to Google Analytics API</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl flex items-center gap-4 transition-colors ${step2Status === 'active' ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-transparent'}`}>
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step2Status === 'complete' ? 'bg-green-100 text-green-600' : step2Status === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'}`}>
              {step2Status === 'complete' ? (
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              ) : step2Status === 'active' ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Analyzing Technical SEO...</h3>
              <p className="text-xs text-gray-500">Checking Core Web Vitals via PageSpeed Insights</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl flex items-center gap-4 transition-colors ${step3Status === 'active' ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-transparent'}`}>
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step3Status === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'}`}>
              {step3Status === 'active' ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Generating AI Fixes...</h3>
              <p className="text-xs text-gray-500">Gemini is writing custom code recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}