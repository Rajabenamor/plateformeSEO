"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerServerAction } from "@/app/actions/auth";
import { RegisterFormData, registerSchema } from "@/app/types/auth";
import { Check, Eye, EyeOff, Zap, ArrowRight, ShieldCheck, Database } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");
    setSuccess(false);

    const result = await registerServerAction(data);

    if (result.success) {
      setSuccess(true);
    } else {
      setServerError(String(result.error) || "An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 bg-card/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-saas relative z-10">
        
        {/* Left Side: Brand & Marketing */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-primary/5 border-r border-white/5">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-16">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <Zap size={22} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tightest text-foreground uppercase">
                STRIVE<span className="text-accent italic">.</span>
              </span>
            </Link>

            <h1 className="text-4xl lg:text-5xl font-black text-foreground leading-[1.1] mb-6 tracking-tight">
              Build your technical <span className="text-accent">authority.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              STRIVE provides a structural blueprint for your search performance, mapping every keyword and backlink into a high-performance growth engine.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                  <ShieldCheck size={20} />
                </div>
                <div>
                   <h3 className="font-bold text-foreground text-sm">Precision Auditing</h3>
                   <p className="text-xs text-slate-500 mt-1">Every line of code analyzed for structural integrity.</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Database size={20} />
                </div>
                <div>
                   <h3 className="font-bold text-foreground text-sm">Structural Linking</h3>
                   <p className="text-xs text-slate-500 mt-1">Visualize your internal and external backlink architecture.</p>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/5 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Trusted by Technical SEOs Worldwide
            </div>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          {success ? (
            <div className="text-center space-y-6 py-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/5">
                <Check size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-foreground mb-3 tracking-tight">Registration Received!</h2>
                <p className="text-slate-400 font-medium leading-relaxed max-w-sm mx-auto">
                  Please wait for an administrator to review and activate your account. We will email you once you are approved.
                </p>
              </div>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center w-full max-w-xs px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all"
              >
                Return to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight">Create Account</h2>
                <p className="text-slate-400 font-medium">Join the next generation of technical SEOs.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {serverError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-semibold animate-in fade-in slide-in-from-top-1">
                    {serverError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                      Username
                    </label>
                    <input
                      {...register("username")}
                      type="text"
                      placeholder="Username"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-slate-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium"
                    />
                    {errors.username && (
                      <p className="text-red-400 text-xs mt-1 font-semibold ml-1">{errors.username.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="Email address"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-slate-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1 font-semibold ml-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Password
                  </label>
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
                    <p className="text-red-400 text-xs mt-1 font-semibold ml-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-slate-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1 font-semibold ml-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? "Creating Account..." : (
                    <>
                      Get Started
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm font-medium text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-accent hover:text-accent/80 font-bold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
