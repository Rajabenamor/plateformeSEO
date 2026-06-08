"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { createGithubPullRequestAction } from "@/app/actions/integrations";
import { DashboardData } from "@/app/types/dashboard";

let globalDashboardCache: DashboardData | null = null;

export function useDashboardData() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const targetUrl = searchParams.get("url");
  const isChanging = searchParams.get("change") === "true";
  const isRefreshing = searchParams.get("refresh") === "true";

  const [data, setData] = useState<DashboardData | null>(
    globalDashboardCache?.analyzed_url === targetUrl ? globalDashboardCache : null
  );
  
  const [loading, setLoading] = useState(false);
  const [initialCheck, setInitialCheck] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fixStatuses, setFixStatuses] = useState<Record<string, 'idle' | 'fixing' | 'success' | 'error'>>({});
  const [prUrls, setPrUrls] = useState<Record<string, string>>({});

  // 1. CLEAR INITIAL CHECK ON MOUNT
  useEffect(() => {
    setInitialCheck(false);
  }, []);

  // 2. CLEAR STATE IF URL CHANGES
  useEffect(() => {
    if (targetUrl) {
      if (data && data.analyzed_url !== targetUrl) {
        setData(null);
      }
      setError(null);
    }
  }, [targetUrl]);

  // 3. PERSISTENCE: Load/Save to localStorage
  useEffect(() => {
    if (!targetUrl) return;
    const savedStatuses = localStorage.getItem(`fix_statuses_${targetUrl}`);
    const savedPrUrls = localStorage.getItem(`pr_urls_${targetUrl}`);
    if (savedStatuses) setFixStatuses(JSON.parse(savedStatuses));
    if (savedPrUrls) setPrUrls(JSON.parse(savedPrUrls));
  }, [targetUrl]);

  useEffect(() => {
    if (!targetUrl) return;
    if (Object.keys(fixStatuses).length > 0) localStorage.setItem(`fix_statuses_${targetUrl}`, JSON.stringify(fixStatuses));
  }, [fixStatuses, targetUrl]);

  const handleFixNow = async (indexOrId: number | string, fix: any) => {
    const fixId = fix.id || indexOrId.toString();
    setFixStatuses(prev => ({ ...prev, [fixId]: 'fixing' }));
    
    try {
        const result = await createGithubPullRequestAction(
          fix.title, fix.explanation, fix.target_file || "src/app/page.tsx",
          fix.current_code, fix.suggested_code, fix.code_fix
        );
        
        if (result.success && result.prUrl) {
          setFixStatuses(prev => ({ ...prev, [fixId]: 'success' }));
          setPrUrls(prev => ({ ...prev, [fixId]: result.prUrl }));
        } else {
          setFixStatuses(prev => ({ ...prev, [fixId]: 'error' }));
          alert(`Error: ${result.error}`);
        }
    } catch (err) {
        setFixStatuses(prev => ({ ...prev, [fixId]: 'error' }));
        alert("An unexpected error occurred.");
    }
  };

  // 4. MAIN FETCH LOGIC
  useEffect(() => {
    if (initialCheck || !targetUrl) {
        setLoading(false);
        return;
    }

    if (data?.analyzed_url === targetUrl && !isChanging && !isRefreshing) {
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/proxy/analysis?url=${encodeURIComponent(targetUrl)}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    })
      .then(async (res) => {
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || "Fetch failed");
        }
        return res.json();
      })
      .then((responseData) => {
        const rawData = responseData.data || responseData;
        Cookies.set("last_analyzed_url", targetUrl, { expires: 7, path: "/" });
        
        const mappedData: DashboardData = {
          ...rawData,
          analyzed_url: targetUrl
        };

        globalDashboardCache = mappedData;
        setData(mappedData);
        setLoading(false);

        if (isRefreshing) {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("refresh");
          router.replace(`${pathname}?${params.toString()}`);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [targetUrl, initialCheck, isChanging, isRefreshing, pathname, router, searchParams]);

  return { data, loading,isGithubConnected: (data as any)?.is_github_connected ?? false,
    isGaConnected: (data as any)?.is_ga_connected ?? false, initialCheck, error, targetUrl, fixStatuses, prUrls, handleFixNow };
}