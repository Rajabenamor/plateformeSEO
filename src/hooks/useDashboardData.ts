import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { createGithubPullRequestAction } from "@/app/actions/integrations";
import { DashboardData } from "@/app/types/dashboard";

// Simple in-memory cache to persist data across page navigations in the same session
let globalDashboardCache: DashboardData | null = null;

export function useDashboardData() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const targetUrl = searchParams.get("url");
  const isChanging = searchParams.get("change") === "true";
  const isRefreshing = searchParams.get("refresh") === "true";

  const [data, setData] = useState<DashboardData | null>(globalDashboardCache);
  
  // To prevent flickering: only start as loading if we have a URL AND no data yet
  const [loading, setLoading] = useState(false);
  const [initialCheck, setInitialCheck] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fixStatuses, setFixStatuses] = useState<Record<string, 'idle' | 'fixing' | 'success' | 'error'>>({});
  const [prUrls, setPrUrls] = useState<Record<string, string>>({});

  // Persistence: Load from localStorage on mount/targetUrl change
  useEffect(() => {
    if (!targetUrl) return;
    
    const savedStatuses = localStorage.getItem(`fix_statuses_${targetUrl}`);
    const savedPrUrls = localStorage.getItem(`pr_urls_${targetUrl}`);
    
    if (savedStatuses) setFixStatuses(JSON.parse(savedStatuses));
    if (savedPrUrls) setPrUrls(JSON.parse(savedPrUrls));
  }, [targetUrl]);

  // Persistence: Save to localStorage on change
  useEffect(() => {
    if (!targetUrl) return;
    if (Object.keys(fixStatuses).length > 0) {
      localStorage.setItem(`fix_statuses_${targetUrl}`, JSON.stringify(fixStatuses));
    }
  }, [fixStatuses, targetUrl]);

  useEffect(() => {
    if (!targetUrl) return;
    if (Object.keys(prUrls).length > 0) {
      localStorage.setItem(`pr_urls_${targetUrl}`, JSON.stringify(prUrls));
    }
  }, [prUrls, targetUrl]);

  const handleFixNow = async (indexOrId: number | string, fix: any) => {
    const fixId = fix.id || indexOrId.toString();
    setFixStatuses(prev => ({ ...prev, [fixId]: 'fixing' }));
    
    const targetFile = fix.target_file || "src/app/page.tsx"; 
    
    try {
        const result = await createGithubPullRequestAction(
          fix.title, 
          fix.explanation, 
          targetFile,
          fix.current_code,
          fix.suggested_code,
          fix.code_fix
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
        alert("An unexpected error occurred while creating the PR.");
    }
  };

  useEffect(() => {
    // If targetUrl is missing, try to recover it from cookies
    if (!targetUrl) {
      const lastUrl = Cookies.get("last_analyzed_url");
      if (lastUrl) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("url", lastUrl);
        router.replace(`${pathname}?${params.toString()}`);
        return;
      }
    }
    setInitialCheck(false);
  }, [targetUrl, pathname, router, searchParams]);

  useEffect(() => {
    if (initialCheck) return;

    if (!targetUrl) {
      setLoading(false);
      setData(null);
      globalDashboardCache = null;
      return;
    }

    // SMART CHECK: If we already have data for this URL and we aren't explicitly refreshing, skip fetch
    // FIX: Bypassing cache if isRefreshing is true
    if (data?.analyzed_url === targetUrl && !isChanging && !isRefreshing) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    Cookies.set("last_analyzed_url", targetUrl, { expires: 7, path: "/" });
    
    console.log(`[useDashboardData] Initiating fresh fetch for ${targetUrl}`);

    fetch(`/api/proxy/analysis?url=${encodeURIComponent(targetUrl)}`, {
      cache: 'no-store',
      headers: { 
        'Cache-Control': 'no-cache', 
        'Pragma': 'no-cache' 
      }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((responseData) => {
        const rawData = responseData.data || responseData;
        console.log("[useDashboardData] Success! Data received:", rawData);
        
        const mappedData: DashboardData = {
          ...rawData,
          overall_score: rawData.overall_score || rawData.global_health_score || 65,
          technical_health: rawData.technical_health || 72,
          content_score: rawData.content_score || 68,
          backlink_strength: rawData.backlink_strength || 45,
          seo_fixes: (rawData.seo_fixes && rawData.seo_fixes.length > 0) ? rawData.seo_fixes : (rawData.critical_action_items || []),
          analyzed_url: targetUrl
        };

        globalDashboardCache = mappedData;
        setData(mappedData);
        setLoading(false);

        // Clear refresh param from URL after successful refresh
        if (isRefreshing) {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("refresh");
          router.replace(`${pathname}?${params.toString()}`);
        }
      })
      .catch((err) => {
        console.warn("[useDashboardData] Fetch failed.", err);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      });
  }, [targetUrl, initialCheck, isChanging, isRefreshing]);

  return {
    data,
    loading,
    initialCheck,
    error,
    targetUrl,
    fixStatuses,
    prUrls,
    handleFixNow
  };
}
