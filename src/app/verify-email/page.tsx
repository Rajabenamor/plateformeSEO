// app/verify-email/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { verifyEmailAction } from "@/app/actions/settings";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyToken = async () => {
      // Call your clean action function instead of fetch
      const result = await verifyEmailAction(token);

      if (result.success && result.new_email) {
        setStatus("success");
        toast.success("Email successfully updated!");
        
        // --- NEW COOKIE UPDATE LOGIC ---
        const storedUser = Cookies.get("user_data");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Overwrite the old email with the newly verified one
          const updatedUser = { ...parsedUser, email: result.new_email };
          Cookies.set("user_data", JSON.stringify(updatedUser));
          
          // Fire the event to update the Sidebar instantly
          window.dispatchEvent(new Event("userUpdated"));
        }
        // -------------------------------

        // Send them smoothly back to their profile instead of login
        setTimeout(() => router.push("/dashboard/settings/profile"), 3000);
      } else {
        setStatus("error");
        toast.error(result.error || "Verification failed");
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {status === "loading" && <p className="text-slate-600">Verifying your email...</p>}
      {status === "success" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-2">Email Verified!</h2>
          <p className="text-slate-500">Redirecting you to settings...</p>
        </div>
      )}
      {status === "error" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Link Expired or Invalid</h2>
          <p className="text-slate-500">Please request a new email change from your profile settings.</p>
        </div>
      )}
    </div>
  );
}

// Suspense boundary is required by Next.js when using useSearchParams
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}