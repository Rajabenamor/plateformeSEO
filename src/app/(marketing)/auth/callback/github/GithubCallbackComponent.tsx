"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { secureFetch } from "@/lib/api";

export default function GithubCallbackComponent() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Keeping router for fallback if needed, though we use window.location
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // Contains user_id (if passed from backend)

    if (!code) {
      setStatus("error");
      setErrorMsg("No authorization code found from GitHub.");
      return;
    }

    const exchangeCode = async () => {
      try {
        const res = await secureFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/github/exchange/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, state }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to exchange GitHub code.");
        }

        setStatus("success");

        // --- THE FIX: Scrub the browser memory so the dashboard starts fresh ---
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
        }
        // -----------------------------------------------------------------------

        // Wait briefly, then execute a HARD redirect to clear Next.js router cache
        setTimeout(() => {
          window.location.href = "/dashboard/integrations";
        }, 2000);
      } catch (err: any) {
        console.error("GitHub Exchange Error:", err);
        setStatus("error");
        setErrorMsg(err.message || "An unexpected error occurred.");
      }
    };

    exchangeCode();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl max-w-md w-full text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <h2 className="text-xl font-bold text-white">
              Connecting to GitHub...
            </h2>
            <p className="text-slate-400 text-sm">
              Please wait while we secure your connection.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-2xl font-bold">
              ✓
            </div>
            <h2 className="text-xl font-bold text-white">
              Successfully Connected!
            </h2>
            <p className="text-slate-400 text-sm">
              Redirecting you back to your integrations...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-2xl font-bold">
              ✕
            </div>
            <h2 className="text-xl font-bold text-white">Connection Failed</h2>
            <p className="text-slate-400 text-sm">{errorMsg}</p>
            <button
              // Also use window.location here for consistency
              onClick={() => (window.location.href = "/dashboard/integrations")}
              className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-semibold"
            >
              Return to Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}