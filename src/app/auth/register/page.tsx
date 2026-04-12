"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerServerAction } from "@/app/actions/auth";
import { RegisterFormData, registerSchema } from "@/app/types/auth";
import { Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [isLoading , setIsLoading]=useState(false);

  //initialize React Hook Form with Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  //the submit handler
  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");
    setSuccess(false);

    //calls the secure nextJs server Action
    const result = await registerServerAction(data);

    if (result.success) {
      setSuccess(true);
    } else {
      //string(error) => telling typescript that it is a string
      setServerError(String(result.error) || "An unexpected error occured.");
    }
  };
  // //success state
  // if (success) {
  //   return (
  //     <div className="max-w-md mx-auto mt-10 p-8 bg-white border border-gray-200 rounded-xl shadow-sm text-center">
  //       <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
  //         <Check size={20} />
  //       </div>
  //       <h2 className="text-2xl font-bold text-gray-900 mb-2">
  //         Registration Received!
  //       </h2>
  //       <p className="text-gray-500 text-sm mb-6">
  //         Please wait for an administrator to review and activate your account.
  //         We will email you once you are approved.
  //       </p>
  //       <Link
  //         href="/auth/login"
  //         className="inline-block w-full px-4 py-2.5 text-white font-medium bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
  //       >
  //         Return to login
  //       </Link>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F5F5F7] font-serif">
      {/* ========================================== */}
      {/* LEFT PANEL - BRANDING (Hidden on Mobile)   */}
      {/* ========================================== */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 bg-[#00415A] p-12 lg:p-20 flex-col justify-between relative overflow-hidden text-white">
        {/* top lofo-area */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className=" text-white-10 font-serif  flex items-center justify-center font-extrabold text-lg leading-relaxed tracking-wide">
              STRIVE
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Build Your Domain's <br /> Technical Authority
          </h1>
          <p className="text-white/70 text-base max-w-md mb-12 leading-relaxed">
            Escape the chaos of unorganized data. STRIVE provides a structural
            blueprint for your search performance, mapping every keyword and
            backlink into a high-performance growth engine.
          </p>
          {/*featur boxes */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 max-w-xl">
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-xl opacity-70">
                  <svg
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.625 13.025L0 11.85L5 3.85L8 7.35L12 0.85L15 5.35L18.375 0L20 1.175L15.05 9.025L12.075 4.55L8.275 10.725L5.25 7.2L1.625 13.025V13.025M13.5 17C14.2 17 14.7917 16.7583 15.275 16.275C15.7583 15.7917 16 15.2 16 14.5C16 13.8 15.7583 13.2083 15.275 12.725C14.7917 12.2417 14.2 12 13.5 12C12.8 12 12.2083 12.2417 11.725 12.725C11.2417 13.2083 11 13.8 11 14.5C11 15.2 11.2417 15.7917 11.725 16.275C12.2083 16.7583 12.8 17 13.5 17V17M18.6 21L15.9 18.3C15.55 18.5333 15.1708 18.7083 14.7625 18.825C14.3542 18.9417 13.9333 19 13.5 19C12.25 19 11.1875 18.5625 10.3125 17.6875C9.4375 16.8125 9 15.75 9 14.5C9 13.25 9.4375 12.1875 10.3125 11.3125C11.1875 10.4375 12.25 10 13.5 10C14.75 10 15.8125 10.4375 16.6875 11.3125C17.5625 12.1875 18 13.25 18 14.5C18 14.9333 17.9417 15.3542 17.825 15.7625C17.7083 16.1708 17.5333 16.55 17.3 16.9L20 19.6L18.6 21V21"
                      fill="#C6E7FF"
                    />
                  </svg>
                </span>
                Precision Auditing
              </h3>
              <p className="text-sm text-xhite/60 leading-relaxed">
                Every line code analyzed for structural integrity
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-xl opacity-70">
                  <svg
                    width="24"
                    height="23"
                    viewBox="0 0 24 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 23C5.16667 23 4.45833 22.7083 3.875 22.125C3.29167 21.5417 3 20.8333 3 20C3 19.1667 3.29167 18.4583 3.875 17.875C4.45833 17.2917 5.16667 17 6 17C6.23333 17 6.45 17.025 6.65 17.075C6.85 17.125 7.04167 17.1917 7.225 17.275L8.65 15.5C8.18333 14.9833 7.85833 14.4 7.675 13.75C7.49167 13.1 7.45 12.45 7.55 11.8L5.525 11.125C5.24167 11.5417 4.88333 11.875 4.45 12.125C4.01667 12.375 3.53333 12.5 3 12.5C2.16667 12.5 1.45833 12.2083 0.875 11.625C0.291667 11.0417 0 10.3333 0 9.5C0 8.66667 0.291667 7.95833 0.875 7.375C1.45833 6.79167 2.16667 6.5 3 6.5C3.83333 6.5 4.54167 6.79167 5.125 7.375C5.70833 7.95833 6 8.66667 6 9.5C6 9.53333 6 9.56667 6 9.6C6 9.63333 6 9.66667 6 9.7L8.025 10.4C8.35833 9.8 8.80417 9.29167 9.3625 8.875C9.92083 8.45833 10.55 8.19167 11.25 8.075V5.9C10.6 5.71667 10.0625 5.3625 9.6375 4.8375C9.2125 4.3125 9 3.7 9 3C9 2.16667 9.29167 1.45833 9.875 0.875C10.4583 0.291667 11.1667 0 12 0C12.8333 0 13.5417 0.291667 14.125 0.875C14.7083 1.45833 15 2.16667 15 3C15 3.7 14.7833 4.3125 14.35 4.8375C13.9167 5.3625 13.3833 5.71667 12.75 5.9V8.075C13.45 8.19167 14.0792 8.45833 14.6375 8.875C15.1958 9.29167 15.6417 9.8 15.975 10.4L18 9.7C18 9.66667 18 9.63333 18 9.6C18 9.56667 18 9.53333 18 9.5C18 8.66667 18.2917 7.95833 18.875 7.375C19.4583 6.79167 20.1667 6.5 21 6.5C21.8333 6.5 22.5417 6.79167 23.125 7.375C23.7083 7.95833 24 8.66667 24 9.5C24 10.3333 23.7083 11.0417 23.125 11.625C22.5417 12.2083 21.8333 12.5 21 12.5C20.4667 12.5 19.9792 12.375 19.5375 12.125C19.0958 11.875 18.7417 11.5417 18.475 11.125L16.45 11.8C16.55 12.45 16.5083 13.0958 16.325 13.7375C16.1417 14.3792 15.8167 14.9667 15.35 15.5L16.775 17.25C16.9583 17.1667 17.15 17.1042 17.35 17.0625C17.55 17.0208 17.7667 17 18 17C18.8333 17 19.5417 17.2917 20.125 17.875C20.7083 18.4583 21 19.1667 21 20C21 20.8333 20.7083 21.5417 20.125 22.125C19.5417 22.7083 18.8333 23 18 23C17.1667 23 16.4583 22.7083 15.875 22.125C15.2917 21.5417 15 20.8333 15 20C15 19.6667 15.0542 19.3458 15.1625 19.0375C15.2708 18.7292 15.4167 18.45 15.6 18.2L14.175 16.425C13.4917 16.8083 12.7625 17 11.9875 17C11.2125 17 10.4833 16.8083 9.8 16.425L8.4 18.2C8.58333 18.45 8.72917 18.7292 8.8375 19.0375C8.94583 19.3458 9 19.6667 9 20C9 20.8333 8.70833 21.5417 8.125 22.125C7.54167 22.7083 6.83333 23 6 23V23M3 10.5C3.28333 10.5 3.52083 10.4042 3.7125 10.2125C3.90417 10.0208 4 9.78333 4 9.5C4 9.21667 3.90417 8.97917 3.7125 8.7875C3.52083 8.59583 3.28333 8.5 3 8.5C2.71667 8.5 2.47917 8.59583 2.2875 8.7875C2.09583 8.97917 2 9.21667 2 9.5C2 9.78333 2.09583 10.0208 2.2875 10.2125C2.47917 10.4042 2.71667 10.5 3 10.5V10.5M6 21C6.28333 21 6.52083 20.9042 6.7125 20.7125C6.90417 20.5208 7 20.2833 7 20C7 19.7167 6.90417 19.4792 6.7125 19.2875C6.52083 19.0958 6.28333 19 6 19C5.71667 19 5.47917 19.0958 5.2875 19.2875C5.09583 19.4792 5 19.7167 5 20C5 20.2833 5.09583 20.5208 5.2875 20.7125C5.47917 20.9042 5.71667 21 6 21V21M12 4C12.2833 4 12.5208 3.90417 12.7125 3.7125C12.9042 3.52083 13 3.28333 13 3C13 2.71667 12.9042 2.47917 12.7125 2.2875C12.5208 2.09583 12.2833 2 12 2C11.7167 2 11.4792 2.09583 11.2875 2.2875C11.0958 2.47917 11 2.71667 11 3C11 3.28333 11.0958 3.52083 11.2875 3.7125C11.4792 3.90417 11.7167 4 12 4V4M12 15C12.7 15 13.2917 14.7583 13.775 14.275C14.2583 13.7917 14.5 13.2 14.5 12.5C14.5 11.8 14.2583 11.2083 13.775 10.725C13.2917 10.2417 12.7 10 12 10C11.3 10 10.7083 10.2417 10.225 10.725C9.74167 11.2083 9.5 11.8 9.5 12.5C9.5 13.2 9.74167 13.7917 10.225 14.275C10.7083 14.7583 11.3 15 12 15V15M18 21C18.2833 21 18.5208 20.9042 18.7125 20.7125C18.9042 20.5208 19 20.2833 19 20C19 19.7167 18.9042 19.4792 18.7125 19.2875C18.5208 19.0958 18.2833 19 18 19C17.7167 19 17.4792 19.0958 17.2875 19.2875C17.0958 19.4792 17 19.7167 17 20C17 20.2833 17.0958 20.5208 17.2875 20.7125C17.4792 20.9042 17.7167 21 18 21V21M21 10.5C21.2833 10.5 21.5208 10.4042 21.7125 10.2125C21.9042 10.0208 22 9.78333 22 9.5C22 9.21667 21.9042 8.97917 21.7125 8.7875C21.5208 8.59583 21.2833 8.5 21 8.5C20.7167 8.5 20.4792 8.59583 20.2875 8.7875C20.0958 8.97917 20 9.21667 20 9.5C20 9.78333 20.0958 10.0208 20.2875 10.2125C20.4792 10.4042 20.7167 10.5 21 10.5V10.5M12 3V3V3V3V3V3V3V3V3V3M3 9.5V9.5V9.5V9.5V9.5V9.5V9.5V9.5V9.5V9.5M12 12.5V12.5V12.5V12.5V12.5V12.5V12.5V12.5V12.5V12.5M21 9.5V9.5V9.5V9.5V9.5V9.5V9.5V9.5V9.5V9.5M6 20V20V20V20V20V20V20V20V20V20M18 20V20V20V20V20V20V20V20V20V20"
                      fill="#C6E7FF"
                    />
                  </svg>
                </span>
                Structural linking
              </h3>
              <p className="text-sm text-xhite/60 leading-relaxed">
                Visualize your internal and external backlink architecture
              </p>
            </div>
          </div>
        </div>
        {/*bottom bar */}
        <div className="relative z-10 flex items-center justify-betwenn mt-20">
          {/* */}
          <div className="text-[10px] text-white/50 tracking-widest uppercase font-semibold">
            Trusted by Technical SEOs Worldwide
          </div>
        </div>
      </div>
      {/* ========================================== */}
      {/* RIGHT PANEL - FORM AREA                    */}
      {/* ========================================== */}
      <div className=" bg-card w-full md:w-7/12 lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative font-serif">
        <div className="w-full max-w-md">
          {/* state 1 : SUCCESS VIEW      */}
          {success ? (
            <div className="animate in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <div className="w-16 h-16 bg-[#00415A]/10 text-[#00415A] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                <Check size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Registration Received!
              </h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Please wait for an administrator to review and activate your
                account. We will email you once you are approved.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex justify-center w-full px-4 py-3.5 text-white font-medium bg-[#00415A] rounded-lg hover:bg-[#003144] transition-colors shadow-sm"
              >
                Return to login
              </Link>
            </div>
          ) : (
            /* state 2 : FORM VIEW      */

            <div className="bg-card p-5 mb-11 rounded-md  shadow-xl shadow-primary/40 border border-border-card animate-in fade-in duration-500">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-primary mb-2">
                  Create Account
                </h2>
                <p className="text-foreground text-sm mt-1">
                  Sign up to get started
                </p>
              </div>
              {/*show error or success messages here */}
              {serverError && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 text-red-700 rounded-r text-sm font-medium">
                  {serverError}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
                {/* Username */}
                <div>
                  <label className="block text-[10px] font-bold text-foreground/60 uppercase tracking-widest mb-2">
                    Username
                  </label>
                  <input
                    {...register("username")}
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#00415A] focus:ring-1 focus:ring-[#00415A]  transition-all"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold text-foreground/60 uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#00415A] focus:ring-1 focus:ring-[#00415A]  transition-all"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                
                <div className="relative w-full">
                <label className="block text-[10px] font-bold text-foreground/60 uppercase tracking-widest mb-2">
                    Password
                  </label>
                  <input
                    {...register("password")}
                    name="password"
                    placeholder="•••••••••"
                    //   switch between password and text
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#00415A] focus:ring-1 focus:ring-[#00415A]  transition-all"
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
                {/* Confirm Password */}
                <div className="relative w-full">
                  <label className="block text-[10px] font-bold text-foreground/60 uppercase tracking-widest mb-2">
                    Confirm Password
                  </label>
                  <input
                    {...register("confirmPassword")}
                    //   switch between password and text
                    type={showConfirmPassword? "text" : "password"}
                    name="confirmPassword"
                    placeholder="•••••••••"
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#00415A] focus:ring-1 focus:ring-[#00415A]  transition-all"
                  />
                  <button
                    type="button" //prevents form submission
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "show password"
                    }
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-3.5 text-white font-medium bg-[#00415A] rounded hover:bg-[#003144] focus:outline-none focus:ring-4 focus:ring-[#00415A]/20 transition-all disabled:bg-[#00415A]/60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Registering..." : "Sign Up"}
                </button>
              </form>
              {/* bottom login link */}
              <div className="mt-10 text-center">
                <p className="text-sm text-foreground/70">
                  Already have an account ?{" "}
                  <Link
                    href="/auth/login"
                    className="text-primary font-bold hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
