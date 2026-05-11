"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  GoogleLoginAction,
  loginServerAction,
} from "@/app/actions/auth";
import { LoginFormData, loginSchema } from "@/app/types/auth";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, Zap, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    
    const result = await loginServerAction(data);
    
    if (result && !result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 bg-card/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-sm relative z-10">
        
        {/* Left Side: Brand & Marketing */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-primary/5 border-r border-white/5">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-16">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <Zap size={22} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground uppercase">
                STRIVE<span className="text-accent italic">.</span>
              </span>
            </Link>

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-[1.1] mb-6 tracking-tight">
              Precision analytics for the <span className="text-accent">modern web.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Transform raw data into architectural intelligence. Our suite of technical SEO tools provides the blueprint for your digital growth.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-12">
              <div>
                <p className="text-2xl font-bold text-foreground">99.8%</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Crawl Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">24ms</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Query Latency</p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/5 flex items-center gap-4 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
              <span>V2.4.0 Blueprints</span>
              <span className="h-1 w-1 rounded-full bg-slate-500" />
              <span className="text-accent">System Status: Optimal</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-slate-400 font-medium">Log in to your SEO intelligence dashboard.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-semibold animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Username
              </label>
              <input
                {...register("username")}
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-slate-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium"
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1 font-semibold ml-1">
                  {errors.username.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[10px] font-bold text-accent uppercase tracking-wider hover:text-accent/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-slate-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium"
                />
                <button
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 font-semibold ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || googleLoading}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Authenticating..." : (
                <>
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
              <span className="bg-[#0c1222] px-4 text-slate-500">Or continue with</span>
            </div>
          </div>
          
          <div className="flex justify-center w-full overflow-hidden rounded-xl border border-white/10 hover:border-white/20 transition-colors bg-white/5">
            <GoogleLogin
              onSuccess={async (CredentialResponse) => {
                setGoogleLoading(true);
                setError("");
                
                const result = await GoogleLoginAction(CredentialResponse.credential!);
                
                if (result && !result.success) {
                  setError(result.error || "Google login failed");
                  setGoogleLoading(false);
                }
              }}
              onError={() => setError("Google login failed. Please try again.")}
              width={350}
              text="signin_with"
              shape="rectangular"
              theme="outline"
            />
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-slate-400">
              New to Strive?{" "}
              <Link
              href="/auth/register"
              className="text-accent font-bold hover:text-accent/80 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}