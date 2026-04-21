"use client";

import { useState, useEffect } from "react";
import { Github, CheckCircle2, AlertCircle, SignalMedium } from "lucide-react";
import { getIntegrationStatusAction, saveGithubRepoAction } from "@/app/actions/auth"; 

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`; 

export default function IntegrationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  // NEW: State for the repository input field
  const [repoInput, setRepoInput] = useState("");
  const [isSavingRepo, setIsSavingRepo] = useState(false);

  const [status, setStatus] = useState({
    github_connected: false,
    github_repo: null as string | null,
    ga4_connected: false,
  });

  useEffect(() => {
    async function fetchStatus() {
      const result = await getIntegrationStatusAction();
      if (result.success && result.data) {
        setStatus(result.data);
      }
      setIsLoading(false);
    }
    fetchStatus();
  }, []);

  const handleConnectGithub = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}/github&scope=repo`;
    window.location.href = githubAuthUrl;
  };

  const handleConnectGA4 = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}/google&response_type=code&scope=https://www.googleapis.com/auth/analytics.readonly access_type=offline prompt=consent`;
    window.location.href = googleAuthUrl;
  };
  // NEW: Function to save the repo
  const handleSaveRepo = async () => {
    if (!repoInput.includes("/")) {
      alert("Please enter in format: username/repository (e.g., vercel/next.js)");
      return;
    }
    
    setIsSavingRepo(true);
    const res = await saveGithubRepoAction(repoInput);
    setIsSavingRepo(false);

    if (res.success) {
      setStatus({ ...status, github_repo: repoInput });
    } else {
      alert(res.error || "Failed to save repo");
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-slate-100 rounded-xl"></div>;
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Integrations</h2>
        <p className="text-sm text-slate-500">
          Connect third-party apps to Strive to enable AI code fixes and traffic analysis.
        </p>
      </div>

      <div className="space-y-4">
        {/* GitHub Integration Card */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-start gap-4 mb-4 sm:mb-0">
            <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700">
              <Github size={24} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">GitHub</h3>
              <p className="text-sm text-slate-500 mt-0.5 mb-3">
                Allow Strive AI to create branches and commit SEO fixes directly to your repositories.
              </p>
              
              {/* STATUS & INPUT AREA */}
              <div className="flex flex-col gap-2">
                {status.github_connected ? (
                  <>
                    <span className="flex w-max items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={14} className="mr-1" /> Connected
                    </span>
                    
                    {/* IF REPO IS SAVED */}
                    {status.github_repo ? (
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-600 font-mono bg-slate-100 px-2 py-1.5 rounded-md border border-slate-200">
                          Target: {status.github_repo}
                        </span>
                        <button 
                          onClick={() => setStatus({ ...status, github_repo: null })} 
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Change Repo
                        </button>
                      </div>
                    ) : (
                      /* IF NO REPO SAVED YET */
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          placeholder="e.g. your-username/your-repo"
                          value={repoInput}
                          onChange={(e) => setRepoInput(e.target.value)}
                          className="text-xs px-3 py-1.5 border border-slate-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                        />
                        <button
                          onClick={handleSaveRepo}
                          disabled={isSavingRepo}
                          className="text-xs font-medium bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors"
                        >
                          {isSavingRepo ? "Saving..." : "Save Repo"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="flex w-max items-center text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    <AlertCircle size={14} className="mr-1" /> Not Connected
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={status.github_connected ? undefined : handleConnectGithub}
            className={`shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              status.github_connected
                ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {status.github_connected ? "Connected" : "Connect"}
          </button>
        </div>

         {/* GA4 Integration Card */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-start gap-4 mb-4 sm:mb-0">
            <div className="p-2.5 bg-blue-50 rounded-lg text-orange-600">
              <SignalMedium size={30}  />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Google Analytics 4</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Import page traffic and engagement data to cross-reference with SEO scores.
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                {status.ga4_connected ? (
                  <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={14} className="mr-1" /> Connected
                  </span>
                ) : (
                  <span className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    <AlertCircle size={14} className="mr-1" /> Not Connected
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={status.ga4_connected ? undefined : handleConnectGA4}
            className={`shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              status.ga4_connected
                ? "bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600" 
                : "bg-orange-600 text-white hover:bg-orange-700"
            }`}
          >
            {status.ga4_connected ? "Manage" : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
}