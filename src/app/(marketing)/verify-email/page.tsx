// app/verify-email/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { verifyEmailAction } from "@/app/actions/settings";
import { CheckCircle2, XCircle, Loader2, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

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
      const result = await verifyEmailAction(token);

      if (result.success && result.new_email) {
        setStatus("success");
        toast.success("Email successfully updated!");
        
        const storedUser = Cookies.get("user_data");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const updatedUser = { ...parsedUser, email: result.new_email };
          Cookies.set("user_data", JSON.stringify(updatedUser));
          window.dispatchEvent(new Event("userUpdated"));
        }

        setTimeout(() => router.push("/dashboard/settings/profile"), 3000);
      } else {
        setStatus("error");
        toast.error(result.error || "Verification failed");
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />

      <div className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 md:p-12 shadow-sm relative z-10 text-center">
        {status === "loading" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-center">
              <Loader2 size={64} className="text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Verifying your email</h2>
            <p className="text-slate-500 font-medium">Securing your account with technical precision.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shadow-lg shadow-green-500/5">
                <CheckCircle2 size={48} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">Email Verified!</h2>
              <p className="text-slate-500 font-medium">Your account identity has been confirmed.</p>
            </div>
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Redirecting to profile...</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                <XCircle size={48} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">Invalid Link</h2>
              <p className="text-slate-500 font-medium">This verification link has expired or is invalid.</p>
            </div>
            <Link
              href="/dashboard/settings/profile"
              className="inline-flex items-center justify-center w-full px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all gap-2 group"
            >
              Back to Settings
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-3">
           <Zap size={16} className="text-primary" />
           <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">STRIVE Identity Protocol V2</span>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Loader2 size={32} className="text-primary animate-spin" />
        </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}