import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { createGithubPullRequestAction } from "@/app/actions/integrations";
import { DashboardData } from "@/app/types/dashboard";

export function useDashboardData() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const targetUrl = searchParams.get("url");
  const isChanging = searchParams.get("change") === "true";

  const [data, setData] = useState<DashboardData | null>(null);
  
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
        const result = await createGithubPullRequestAction(fix.title, fix.explanation, targetFile);
        
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
    if (initialCheck) return; // Wait for initial URL resolution

    if (!targetUrl) {
      setLoading(false);
      setData(null);
      return;
    }

    // Only trigger loading if the URL is different from what we already have
    if (data?.analyzed_url === targetUrl && !isChanging) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    Cookies.set("last_analyzed_url", targetUrl, { expires: 7, path: "/" });
    
    console.log(`Starting analysis for: ${targetUrl}`);

    // Using the proxy API route to benefit from maxDuration=60
    fetch(`/api/proxy/analysis?url=${encodeURIComponent(targetUrl)}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Analysis failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Analysis completed successfully");
        const json = { data }; 
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
          ...json.data,
          // Mapping new data to old data structure temporarily to prevent breaking existing components
          overall_score: json.data.global_health_score || 0,
          seo_fixes: json.data.critical_action_items || [],
          // Mock some old fields if they are missing
          traffic: formattedTraffic,
          analyzed_url: targetUrl,
          technical_health: json.data.technical_health || 0,
          content_score: 72,
          backlink_strength : 45
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to fetch dashboard data. Please try again.");
        setLoading(false);
      });
  }, [targetUrl, router]);

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
