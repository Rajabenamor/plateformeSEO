// @/app/dashboard/settings/integrations/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Github, Activity, CheckCircle2, AlertCircle, SignalMedium } from "lucide-react";
import toast from "react-hot-toast";

// Replace these with your actual OAuth App Client IDs
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`; 

export default function IntegrationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({
    github_connected: false,
    ga4_connected: false,
  });

  // Fetch the current integration status from Django on load
  useEffect(() => {
    async function fetchStatus() {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1] || localStorage.getItem("access_token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/integrations/status/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        }
      } catch (error) {
        console.error("Failed to load integrations", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStatus();
  }, []);

  const handleConnectGithub = () => {
    // Redirects to GitHub's OAuth authorization page
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}/github&scope=repo`;
    window.location.href = githubAuthUrl;
  };

  const handleConnectGA4 = () => {
    // Redirects to Google's OAuth authorization page
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}/google&response_type=code&scope=https://www.googleapis.com/auth/analytics.readonly access_type=offline prompt=consent`;
    window.location.href = googleAuthUrl;
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-start gap-4 mb-4 sm:mb-0">
            <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700">
              <Github size={24} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">GitHub</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Allow Strive AI to create branches and commit SEO fixes directly to your repositories.
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                {status.github_connected ? (
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
            onClick={status.github_connected ? undefined : handleConnectGithub}
            className={`shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              status.github_connected
                ? "bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600" // In the future, this would be a Disconnect function
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {status.github_connected ? "Manage" : "Connect"}
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