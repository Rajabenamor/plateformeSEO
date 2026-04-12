"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  getRedirectPathAction,
  GoogleLoginAction,
  loginServerAction,
} from "@/app/actions/auth";
import { LoginFormData, loginSchema } from "@/app/types/auth";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";

import { Eye, EyeOff } from "lucide-react";

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
    // If it succeeds, the action itself will trigger redirect('/admin') or redirect('/')
    const result = await loginServerAction(data);
    //If we reach this line, it means success was false (because redirects throw an error in Next.js that stops execution)
    if (!result.success) {
      //catch the specific django error for inactive
      setError(result.error);
    }
    // if (result.success) {
    //   //redirect to home page after successful login if user , if admin redirect to /admin
    //   const path = await getRedirectPathAction();
    //   router.push(path);
    //   router.refresh();
    // } else {
    //   setError(result.error);
    // }
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F5F5F7] font-serif">
      {/* ========================================== */}
      {/* LEFT PANEL - BRANDING (Hidden on Mobile)   */}
      {/* ========================================== */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 bg-[#00415A] p-12 lg:p-20 flex-col justify-between relative overflow-hidden text-white">
        {/* Top Logo Area */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-11">
          <div className=" text-white-10 font-serif  flex items-center justify-center font-extrabold text-lg leading-relaxed tracking-wide">
             STRIVE
            </div>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold leading-tght mb-6">
            Precision analytics for <br /> the modern web.
          </h1>
          <p className="text-white/70 text-base max-w-md mb-16 leading-relaxed">
            Transforming raw data into architectural intelligence. Our suite of
            technical SEO tools provides the blueprint for your digital growth.
          </p>
          {/*Stats Area */}
          <div className="flex gap-16">
            <div>
              <div className="text-3xl font-bold flex items-center gap-2 mb-1">
                <span className="text-xl opacity-70">99.8%</span>
              </div>
              <div className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">
                Crawl Accuracy
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold flex items-center gap-2 mb-1">
                <span className="text-xl opacity-70">24ms</span>
              </div>
              <div className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">
                Query Latency
              </div>
            </div>
          </div>
        </div>
        {/* bottom bar */}
        <div className="relative z-10 mt-20 text-[10px] text-white/40 tracking-widest uppercase font-semibold flex gap-4">
          <span>V2.4.0 Blueprints</span>
          <span>•</span>
          <span className="text-white/60">System Status : Optimal</span>
        </div>
      </div>
      {/* ========================================== */}
      {/* RIGHT PANEL - FORM AREA                    */}
      {/* ========================================== */}
      <div className="w-full bg-card md:w-7/12 lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative font-serif">
        <div className=" p-5 mb-11 rounded-md  shadow-xl shadow-primary/40 border border-border-card animate-in fade-in duration-500">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-primary mb-2">
              Log In to Your Dashboard
            </h2>
            <p className="text-foreground">
              Access your SEO intelligance dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* 4. Conditionally display the error message to the user */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 text-red-700 rounded-r text-sm font-medium">
                {error}
              </div>
            )}
            {/* username */}
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              Username
            </label>
            <input
              {...register("username")}
              type="text"
              name="username"
              placeholder="Username"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded text-gray-900 focus:outline-none focus:border-[#00415A] focus:ring-1 focus:ring-[#00415A] transition-all"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.username.message}
              </p>
            )}
            {/* Password */}
            <div className="relative w-full">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              {...register("password")}
              //   switch between password and text
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded text-gray-900 focus:outline-none focus:border-[#00415A] focus:ring-1 focus:ring-[#00415A] transition-all"
            />
            <button
                    type="button" //prevents form submission
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.password.message}
              </p>
            )}
            </div>
            {/*Forgot password link */}
            <div className="flex justify-end mt-2">
              <Link
                href="/auth/forgot-password"
                className="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || googleLoading}
              className="w-full mt-4 py-3.5 text-white font-medium bg-[#00415A] rounded hover:bg-[#003144] focus:outline-none focus:ring-4 focus:ring-[#00415A]/20 transition-all disabled:bg-[#00415A]/60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>
          {/* divider */}
          <div className="relative flex py-2  mt-5 mb-2 items-center">
            <div className="grow border-t border-gray-200" />
            <span className="shrink-0 mx-4 text-[9px] text-gray-400 uppercase tracking-widest font-bold">
              Or authenticate with email
            </span>
            <div className="grow border-t border-gray-200" />
          </div>
          {/*google Button */}
          <div className="flex justify-center w-full overflow-hidden rounded-lg">
            <GoogleLogin
              onSuccess={async (CredentialResponse) => {
                setGoogleLoading(true);
                setError("");
                const result = await GoogleLoginAction(
                  CredentialResponse.credential!
                );
                if (result.success) {
                  const path = await getRedirectPathAction();
                  router.push(path);
                  router.refresh();
                } else {
                  setError(result.error || "Google login failed");
                }
                setGoogleLoading(false);
              }}
              onError={() => setError("Google login failed. Please try again.")}
              width={400}
              text="signin_with"
              shape="rectangular"
              theme="outline"
            />
          </div>
          {/* bottom register link */}
          <div className="mt-10 text-center">
            <p className="text-sm text-foreground/70">New to Strive ?{" "}
              <Link
              href="/auth/register"
              className="text-primary font-bold hover:underline"
              >
                Sign up
              </Link>

            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
