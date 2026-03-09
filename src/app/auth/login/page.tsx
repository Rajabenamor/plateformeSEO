"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { loginServerAction } from "@/app/actions/auth";
import { LoginFormData, loginSchema } from "@/app/types/auth";
import Link from "next/link";


export default function LoginPage() {
  const [error, setError] = useState("");
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

    if (result.success) {
      //redirect to home page after successful login
      router.push("/");
      router.refresh();
    } else {
      setError(result.error);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
     <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900">Log In to Your Dashboard</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 4. Conditionally display the error message to the user */}
        {error && <div className="color-red mb-10">{error}</div>}
        <input
          {...register("username")}
          type="text"
          name="username"
          placeholder="Username"
          className="w-full px-4 py-2.5 mt-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
        )}
        {/* <input type="email" name="email" placeholder="Email" required /> */}
        <input
          {...register("password")}
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2.5 mt-4 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
        {/*Forgot password link */}
        <div className="flex justify-end mt-2">
          <Link
            href="/auth/forgot-password"
            className="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            Forgot password?
          </Link>
        </div>
        <button type="submit"
        className="w-full mt-2 px-4 py-2.5 text-white font-medium bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>
      </div>
    </div>
  );
}
