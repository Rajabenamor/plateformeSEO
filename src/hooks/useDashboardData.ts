import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { fetchDashboardDataSecurely } from "@/app/actions/dashboard";
import { createGithubPullRequestAction } from "@/app/actions/integrations";
import { DashboardData } from "@/app/types/dashboard";

export function useDashboardData() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUrl = searchParams.get("url");

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(!!targetUrl);
  const [error, setError] = useState<string | null>(null);

  const [fixStatuses, setFixStatuses] = useState<Record<number, 'idle' | 'fixing' | 'success' | 'error'>>({});
  const [prUrls, setPrUrls] = useState<Record<number, string>>({});

  const handleFixNow = async (index: number, fix: any) => {
    setFixStatuses(prev => ({ ...prev, [index]: 'fixing' }));
    
    const targetFile = fix.target_file || "src/app/page.tsx"; 
    
    try {
        const result = await createGithubPullRequestAction(fix.title, fix.explanation, targetFile);
        
        if (result.success && result.prUrl) {
          setFixStatuses(prev => ({ ...prev, [index]: 'success' }));
          setPrUrls(prev => ({ ...prev, [index]: result.prUrl }));
        } else {
          setFixStatuses(prev => ({ ...prev, [index]: 'error' }));
          alert(`Error: ${result.error}`);
        }
    } catch (err) {
        setFixStatuses(prev => ({ ...prev, [index]: 'error' }));
        alert("An unexpected error occurred while creating the PR.");
    }
  };

  useEffect(() => {
    if (!targetUrl) {
      const lastUrl = Cookies.get("last_analyzed_url");
      if (lastUrl) {
        router.push(`/dashboard?url=${encodeURIComponent(lastUrl)}`);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
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
    error,
    targetUrl,
    fixStatuses,
    prUrls,
    handleFixNow
  };
}
