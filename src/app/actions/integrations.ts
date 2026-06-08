"use server";

import { secureFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function getIntegrationStatusAction() {
    try {
        const res = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/integrations/status/`, {
            method: "GET",
            cache: "no-store",
        });
        if (!res.ok) return { success: false };
        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        return { success: false };
    }
}

export async function exchangeGithubTokenAction(code: string, installation_id: string | null) {
    try {
        const res = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integrations/github/exchange/`, {
            method: "POST",
            body: JSON.stringify({ code, installation_id })
        });
        if (!res.ok) {
            const err = await res.json();
            return { success: false, error: err.error || "Failed to exchange token" };
        }
        
        revalidatePath("/dashboard/integrations"); // <-- FIX 2: Clear cache upon success
        return { success: true };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export async function createGithubPullRequestAction(
    fixTitle: string, 
    fixExplanation: string, 
    targetFile: string,
    currentCode?: string,
    suggestedCode?: string,
    codeFix?: string
) {
    try {
        const res = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integrations/github/create-pr/`, {
            method: "POST",
            body: JSON.stringify({
                title: fixTitle,
                explanation: fixExplanation,
                target_file: targetFile,
                current_code: currentCode,
                suggested_code: suggestedCode,
                code_fix: codeFix
            })
        });
        const data = await res.json();
        if (!res.ok) {
            return { success: false, error: data.error || "Failed to create PR" };
        }
        return { success: true, prUrl: data.pr_url };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export async function saveGithubRepoAction(repoName: string) {
    try {
        const res = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integrations/github/save-repo/`, {
            method: "POST",
            body: JSON.stringify({ repo_name: repoName })
        });
        if (!res.ok) {
            return { success: false, error: "Failed to save repository" };
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export async function exchangeGoogleTokenAction(code: string) {
    try {
        const res = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integrations/google/exchange/`, {
            method: "POST",
            body: JSON.stringify({ code })
        });
        if (!res.ok) {
            const err = await res.json();
            return { success: false, error: err.error || "Failed to exchange google token" };
        }
        
        revalidatePath("/dashboard/integrations"); // <-- FIX 3: Clear cache upon success
        return { success: true };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export async function saveGA4PropertyAction(propertyId: string) {
    try {
        const res = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integrations/google/save-property/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Crucial for parsing the body
            },
            body: JSON.stringify({ property_id: propertyId })
        });
        if (!res.ok) {
            const errorDetails = await res.text();
            console.error(`Backend returned ${res.status}:`, errorDetails);
            return { success: false, error: "Failed to save GA4 property" };
        }
        return { success: true };
    } catch (error) {
        console.error("Network or execution error:", error);
        return { success: false, error: "Network error" };
    }
}

export async function disconnectIntegrationAction(provider: "google" | "github") {
    try {
      const res = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/integrations/disconnect/`, {
          method: "POST",
          body: JSON.stringify({ provider }),
      });
  
      if (!res.ok) return { success: false, error: "Failed to disconnect." };
      
      revalidatePath("/dashboard/integrations");
      return { success: true };
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  }

  export async function resetDomainLockAction() {
    try {
        const res = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/integrations/reset-domain/`, {
            method: "POST",
        });
        
        if (!res.ok) return { success: false, error: "Failed to reset domain." };
        
        revalidatePath("/dashboard/integrations");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}