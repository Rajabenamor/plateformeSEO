"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { forgotPasswordFormData, forgotPasswordSchema } from "@/app/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordAction } from "@/app/actions/auth";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<forgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: forgotPasswordFormData) => {
    setError("");
    setMessage("");
    const result = await forgotPasswordAction(data);

    if (result.success) {
      setMessage("If this email is registered, you will receive a reset link shortly.");
    } else {
      setError(String(result.error));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background text-foreground">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />

      <div className="w-full max-w-[500px] bg-card/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-saas relative z-10 p-8 md:p-12">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-foreground transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Sign In</span>
        </Link>

        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
            <Mail size={24} />
          </div>
          <h2 className="text-3xl font-black text-foreground mb-3 tracking-tight">Reset Password</h2>
          <p className="text-slate-400 font-medium leading-relaxed">
            Enter your email and we'll send you a link to get back into your account.
          </p>
        </div>

        {message ? (
          <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-500">
             <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl flex items-center gap-3 text-sm font-semibold mb-8 text-left">
               <CheckCircle2 size={20} className="shrink-0" />
               <p>{message}</p>
             </div>
             <Link
                href="/auth/login"
                className="inline-flex items-center justify-center w-full px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all"
              >
                Return to Sign In
              </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-semibold animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your registered email"
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-slate-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 font-semibold ml-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending Link..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
