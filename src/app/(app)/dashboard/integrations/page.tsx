"use client";

import { useState, useEffect } from "react";
// Added Loader2 for the disconnect loading state
import { Github, CheckCircle2, AlertCircle, SignalMedium, Loader2 } from "lucide-react";
// Added disconnectIntegrationAction import
import { getIntegrationStatusAction, saveGithubRepoAction, saveGA4PropertyAction, disconnectIntegrationAction } from "@/app/actions/integrations"; 
import { resetDomainLockAction } from "@/app/actions/integrations";
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`; 

export default function IntegrationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  const [repoInput, setRepoInput] = useState("");
  const [isSavingRepo, setIsSavingRepo] = useState(false);

  const [ga4Input, setGa4Input] = useState("");
  const [isSavingGa4, setIsSavingGa4] = useState(false);
  
  const [isResetting, setIsResetting] = useState(false);

  // Added state to track which provider is currently disconnecting
  const [disconnectingProvider, setDisconnectingProvider] = useState<"google" | "github" | null>(null);

  const [status, setStatus] = useState({
    github_connected: false,
    github_repo: null as string | null,
    ga4_connected: false,
    ga4_property: null as string | null,
    primary_domain: null as string | null,
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

  const handleResetDomain = async () => {
    if (!confirm("Are you sure? The next site you analyze will become your new registered project.")) return;
    
    setIsResetting(true);
    const res = await resetDomainLockAction();
    setIsResetting(false);

    if (res.success) {
      // Clear it from the local UI state so it updates instantly
      setStatus(prev => ({ ...prev, primary_domain: null }));
      alert("Success! Go to the dashboard and analyze your new site.");
    } else {
      alert("Failed to reset domain.");
    }
  };

  const handleConnectGithub = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}/github&scope=repo`;
    window.location.href = githubAuthUrl;
  };

  const handleConnectGA4 = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}/google&response_type=code&scope=https://www.googleapis.com/auth/analytics.readonly&access_type=offline&prompt=consent`;
    window.location.href = googleAuthUrl;
  };

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

  const handleSaveGA4Property = async () => {
    if (!ga4Input) {
      alert("Please enter a valid GA4 Property ID (e.g., 123456789)");
      return;
    }
    
    setIsSavingGa4(true);
    const res = await saveGA4PropertyAction(ga4Input);
    setIsSavingGa4(false);

    if (res.success) {
      setStatus({ ...status, ga4_property: ga4Input });
    } else {
      alert(res.error || "Failed to save GA4 Property");
    }
  };

  // Added the new disconnect handler
  const handleDisconnect = async (provider: "google" | "github") => {
    setDisconnectingProvider(provider);
    const res = await disconnectIntegrationAction(provider);
    setDisconnectingProvider(null);

    if (res.success) {
      if (provider === "google") {
        setStatus(prev => ({ ...prev, ga4_connected: false, ga4_property: null }));
      } else {
        setStatus(prev => ({ ...prev, github_connected: false, github_repo: null }));
      }
    } else {
      alert(res.error || `Failed to disconnect ${provider}`);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-slate-100 rounded-xl"></div>;
  }

  return (
    <div className="max-w-3xl space-y-8 mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Integrations</h2>
        <p className="text-sm text-slate-500">
          Connect third-party apps to Strive to enable AI code fixes and traffic analysis.
        </p>
        {/* NEW RESET BUTTON */}
        {status.primary_domain && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
             <p className="text-xs text-amber-800">
               Integrations are currently locked to: <strong className="font-mono">{status.primary_domain}</strong>
             </p>
             <button 
               onClick={handleResetDomain}
               disabled={isResetting}
               className="text-xs font-bold bg-white border border-amber-300 text-amber-700 px-3 py-1.5 rounded-md hover:bg-amber-100 disabled:opacity-50"
             >
               {isResetting ? "Resetting..." : "Change Project"}
             </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
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
              
              <div className="flex flex-col gap-2">
                {status.github_connected ? (
                  <>
                    <span className="flex w-max items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={14} className="mr-1" /> Connected
                    </span>
                    
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
          
          {/* UPDATED GITHUB CONNECT/DISCONNECT BUTTON */}
          {status.github_connected ? (
            <button
              onClick={() => handleDisconnect("github")}
              disabled={disconnectingProvider === "github"}
              className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            >
              {disconnectingProvider === "github" ? <><Loader2 size={16} className="animate-spin" /> Disconnecting...</> : "Disconnect GitHub"}
            </button>
          ) : (
            <button
              onClick={handleConnectGithub}
              className="shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-slate-900 text-white hover:bg-slate-800"
            >
              Connect
            </button>
          )}
        </div>

         <div className="flex flex-col sm:flex-row sm:items-start justify-between p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-start gap-4 mb-4 sm:mb-0">
            <div className="p-2.5 bg-blue-50 rounded-lg text-orange-600">
              <SignalMedium size={30}  />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Google Analytics 4</h3>
              <p className="text-sm text-slate-500 mt-0.5 mb-3">
                Import page traffic and engagement data to cross-reference with SEO scores.
              </p>
              
              <div className="flex flex-col gap-2">
                {status.ga4_connected ? (
                  <>
                    <span className="flex w-max items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={14} className="mr-1" /> Connected
                    </span>
                    
                    {status.ga4_property ? (
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-600 font-mono bg-slate-100 px-2 py-1.5 rounded-md border border-slate-200">
                          Property ID: {status.ga4_property}
                        </span>
                        <button 
                          onClick={() => setStatus({ ...status, ga4_property: null })} 
                          className="text-xs font-medium text-orange-600 hover:text-orange-800 transition-colors"
                        >
                          Change Property
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          placeholder="e.g. 123456789"
                          value={ga4Input}
                          onChange={(e) => setGa4Input(e.target.value)}
                          className="text-xs px-3 py-1.5 border border-slate-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-mono"
                        />
                        <button
                          onClick={handleSaveGA4Property}
                          disabled={isSavingGa4}
                          className="text-xs font-medium bg-orange-600 text-white px-3 py-1.5 rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
                        >
                          {isSavingGa4 ? "Saving..." : "Save ID"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="flex items-center text-xs w-max font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    <AlertCircle size={14} className="mr-1" /> Not Connected
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* UPDATED GA4 CONNECT/DISCONNECT BUTTON */}
          {status.ga4_connected ? (
            <button
              onClick={() => handleDisconnect("google")}
              disabled={disconnectingProvider === "google"}
              className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            >
              {disconnectingProvider === "google" ? <><Loader2 size={16} className="animate-spin" /> Disconnecting...</> : "Disconnect GA4"}
            </button>
          ) : (
            <button
              onClick={handleConnectGA4}
              className="shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-orange-600 text-white hover:bg-orange-700"
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}