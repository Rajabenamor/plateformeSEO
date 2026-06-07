"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerServerAction, verifyOtpServerAction } from "@/app/actions/auth"; // Added verify action
import { RegisterFormData, registerSchema } from "@/app/types/auth";
import { Check, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [serverError, setServerError] = useState("");
  const [step, setStep] = useState<"register" | "otp" | "success">("register");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Handle Registration Submit (Step 1)
  const onRegisterSubmit = async (data: RegisterFormData) => {
    setServerError("");

    const result = await registerServerAction(data);

    if (result.success) {
      setRegisteredEmail(data.email);
      setStep("otp"); // Move to OTP verification step
    } else {
      setServerError(String(result.error) || "An unexpected error occurred.");
    }
  };

  // Handle OTP Verification Submit (Step 2)
  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setIsVerifying(true);

    const result = await verifyOtpServerAction({ email: registeredEmail, otp: otpCode });

    setIsVerifying(false);
    if (result.success) {
      setStep("success"); // Move to final success screen
    } else {
      setServerError(String(result.error) || "Invalid or expired OTP code.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-275 grid grid-cols-1 md:grid-cols-2 bg-card/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-sm relative z-10">
        
        {/* Left Side: Brand & Marketing */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-primary/5 border-r border-white/5">
          <div>
             <Image 
                src="/strive-logo21.png" 
                alt="STRIVE Logo" 
                width={200} 
                height={200} 
                className="h-14 w-auto object-contain transition-transform group-hover:scale-105 dark:invert-0 brightness-0 dark:brightness-100"
                priority
              />

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-[1.1] mb-6 tracking-tight mt-20">
              Build your technical <span className="text-accent">authority</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-md">
              STRIVE provides a structural blueprint for your search performance, mapping every keyword and backlink into a high-performance growth engine.
            </p>
          </div>
        </div>

        {/* Right Side: Form Handler */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          
          {/* Global Server Error State */}
          {serverError && (
            <div className="p-4 mb-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-semibold animate-in fade-in slide-in-from-top-1">
              {serverError}
            </div>
          )}

          {/* STEP 1: REGISTRATION FORM */}
          {step === "register" && (
            <>
              <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Create Account</h2>
                <p className="text-slate-400 font-medium">Join the next generation of technical SEOs.</p>
              </div>

              <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
                    <input
                      {...register("username")}
                      type="text"
                      placeholder="Username"
                      className="w-full px-4 py-3 bg-white/5 border rounded-xl text-foreground placeholder:text-slate-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium"
                    />
                    {errors.username && <p className="text-red-400 text-xs mt-1 font-semibold ml-1">{errors.username.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="Email address"
                      className="w-full px-4 py-3 bg-white/5 border rounded-xl text-foreground placeholder:text-slate-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1 font-semibold ml-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-white/5 border rounded-xl text-foreground placeholder:text-slate-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1 font-semibold ml-1">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-white/5 border rounded-xl text-foreground placeholder:text-slate-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 font-semibold ml-1">{errors.confirmPassword.message}</p>}
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
                <Link href="/auth/login" className="text-accent hover:text-accent/80 font-bold transition-colors">Sign in</Link>
              </p>
            </>
          )}

          {/* STEP 2: OTP VERIFICATION INPUT */}
          {step === "otp" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
              <div className="mb-8 text-center md:text-left">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck size={24} />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Verify Account</h2>
                <p className="text-slate-400 font-medium">
                  We sent a 6-digit verification code to <span className="text-foreground font-semibold">{registeredEmail}</span>.
                </p>
              </div>

              <form onSubmit={onOtpSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Verification Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-4 bg-white/5 border rounded-xl text-foreground tracking-[0.5em] text-center text-2xl placeholder:text-slate-700 placeholder:tracking-normal focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || otpCode.length !== 6}
                  className="w-full py-4 bg-accent hover:bg-accent/95 text-background font-bold rounded-xl shadow-lg shadow-accent/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? "Verifying..." : "Verify & Activate"}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: SUCCESS ACTION */}
          {step === "success" && (
            <div className="text-center space-y-6 py-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/5">
                <Check size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Account Activated!</h2>
                <p className="text-slate-400 font-medium leading-relaxed max-w-sm mx-auto">
                  Your identity has been successfully verified. You can now access your dashboard.
                </p>
              </div>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center w-full max-w-xs px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all"
              >
                Proceed to Sign In
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}