"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeGithubTokenAction } from "@/app/actions/auth"; 

export default function GithubCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Connecting to GitHub...");

  useEffect(() => {
    const code = searchParams.get("code");
    const installation_id = searchParams.get("installation_id");

    if (!code) {
      setStatus("Error: No authorization code found.");
      setTimeout(() => router.push("/dashboard/settings/integrations"), 3000);
      return;
    }

    async function processGithubAuth() {
      // Use the Server Action instead of raw fetch!
      const result = await exchangeGithubTokenAction(code, installation_id);

      if (result.success) {
        setStatus("Successfully connected! Redirecting...");
        setTimeout(() => router.push("/dashboard/settings/integrations"), 1500);
      } else {
        setStatus(`Failed to connect: ${result.error}`);
        setTimeout(() => router.push("/dashboard/settings/integrations"), 3000);
      }
    }

    processGithubAuth();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center max-w-md w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-4">GitHub Integration</h2>
        <p className="text-gray-500 animate-pulse">{status}</p>
      </div>
    </div>
  );
}