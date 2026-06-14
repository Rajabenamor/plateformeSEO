"use client"

import { useEffect, useState } from "react"

export function AnalysisLoadingScreen({
  targetUrl,
  isGaConnected = false,
  apiLoading = true
}: {
  targetUrl: string | null;
  isGaConnected?: boolean;
  apiLoading?: boolean;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // If the API finishes, instantly jump the progress bar to 100%
    if (!apiLoading) {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      // Hold at 95% maximum while API is still fetching
      setProgress((prev) => (prev >= 95 ? 95 : prev + 1));
    }, 150);
    
    return () => clearInterval(interval);
  }, [apiLoading]);

  // UPDATED: Added a "waiting" state for Step 1 between 30% and 100%
  const step1Status = progress < 30 ? "active" : progress < 100 ? "waiting" : "complete";
  const step2Status = progress < 30 ? "pending" : progress < 70 ? "active" : "complete";
  const step3Status = progress < 70 ? "pending" : (apiLoading ? "active" : "complete");

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-3xl w-full p-10 relative overflow-hidden border border-gray-100">
        
        <div className="flex flex-col items-center text-center mb-10 mt-4">
          <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            Analysis in Progress
          </span>
          <h1 className="text-2xl font-bold text-foreground mb-2">Analyzing Website</h1>
          <p className="text-muted-foreground text-sm">We are performing a comprehensive scan of <span className="font-semibold text-foreground">{targetUrl}</span></p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-muted" strokeWidth="6" />
              <circle 
                cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (283 * progress) / 100} 
                strokeLinecap="round"
                className="text-primary transition-all duration-300 ease-out"
              />
            </svg>
            <div className="text-center z-10">
              <span className="text-3xl font-bold text-foreground">{progress}%</span>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Complete</p>
            </div>
          </div>
        </div>

        {apiLoading && progress >= 95 && (
          <div className="text-center mb-8 animate-pulse">
            <p className="text-sm text-primary font-medium italic">
              Finalizing deep analysis... This may take a moment for larger sites.
            </p>
          </div>
        )}

        <div className="max-w-md mx-auto space-y-3">
          
          {/* STEP 1: Traffic Data / Google Analytics */}
          <div className={`p-4 rounded-xl flex items-center gap-4 transition-colors ${
            step1Status === 'active' ? 'bg-primary/5 border border-primary/10' : 
            step1Status === 'waiting' ? 'bg-yellow-50/50 border border-yellow-100' :
            'bg-muted/30 border border-transparent'
          }`}>
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
              ${step1Status === 'complete' 
                ? (isGaConnected ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600') 
                : step1Status === 'waiting'
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-primary/10 text-primary'}`}>
              
              {step1Status === 'complete' ? (
                !isGaConnected ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                )
              ) : step1Status === 'waiting' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              ) : (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Gathering Traffic Data</h3>
              <p className={`text-[10px] font-medium uppercase tracking-wider ${
                step1Status === 'complete' ? (isGaConnected ? 'text-emerald-600' : 'text-red-500/80') : 
                step1Status === 'waiting' ? 'text-yellow-600/90' :
                'text-muted-foreground'
              }`}>
                {step1Status === 'complete' 
                  ? (isGaConnected ? 'Connected & Gathered' : 'Not Connected') 
                  : step1Status === 'waiting'
                  ? 'Pending Verification'
                  : 'Connecting to Google Analytics'}
              </p>
            </div>
          </div>

          {/* STEP 2: Technical SEO */}
          <div className={`p-4 rounded-xl flex items-center gap-4 transition-colors ${step2Status === 'active' ? 'bg-primary/5 border border-primary/10' : 'bg-muted/30 border border-transparent'}`}>
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step2Status === 'complete' ? 'bg-emerald-100 text-emerald-600' : step2Status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {step2Status === 'complete' ? (
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              ) : step2Status === 'active' ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Analyzing Technical SEO</h3>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Evaluating Site Performance</p>
            </div>
          </div>

          {/* STEP 3: Generating Recommendations */}
          <div className={`p-4 rounded-xl flex items-center gap-4 transition-colors ${step3Status === 'active' ? 'bg-primary/5 border border-primary/10' : 'bg-muted/30 border border-transparent'}`}>
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step3Status === 'complete' ? 'bg-emerald-100 text-emerald-600' : step3Status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {step3Status === 'complete' ? (
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              ) : step3Status === 'active' ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Generating Recommendations</h3>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Preparing Strategic Insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}