"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeGithubTokenAction } from "@/app/actions/integrations"; 

function GithubCallbackContent() {
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
      const result = await exchangeGithubTokenAction(code as string, installation_id);

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
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center max-w-md w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-4">GitHub Integration</h2>
      <p className="text-gray-500 animate-pulse">{status}</p>
    </div>
  );
}

export default function GithubCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <Suspense fallback={
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-4">GitHub Integration</h2>
          <p className="text-gray-500 animate-pulse">Loading...</p>
        </div>
      }>
        <GithubCallbackContent />
      </Suspense>
    </div>
  );
}