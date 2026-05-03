"use client";

import {
  resetPasswordAction,
  validateResetTokenAction,
} from "@/app/actions/auth";
import { ResetPasswordFormData, resetPasswordSchema } from "@/app/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ShieldAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token"); // gets the token from the URL

  //setting up pre_validating states
  const [isValidating, setValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  //checks token on load
  useEffect(() => {
    if (!token) {
      setValidating(false);
      return;
    }
    const checkToken = async () => {
      const isValid = await validateResetTokenAction(token);
      setIsTokenValid(isValid);
      setValidating(false);
    };
    checkToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    const result = await resetPasswordAction(data, token);
    if (result.success) {
      setSuccess(true);
      //redirect to login after 3 seconds
      setTimeout(() => router.push("/auth/login"), 3000);
    } else {
      setError(String(result.error));
    }
  };

  //token conditions
  //state 1 : checking the token
  if (isValidating) {
    return (
      <div className="p-8 text-center text-gray-600">
        <p>Verifying your secure link...</p>
      </div>
    );
  }
  //state 2 : token is expired or missing
  if (!isTokenValid) {
    return (
      <div className="p-8 text-center flex flex-col items-center">

        <ShieldAlert size={60} className="text-red-600 mb-2"/>
        <h2 className="text-xl font-bold text-red-600 mb-2">Link Expired</h2>
        <p className="text-gray-600 mb-4">
          This password reset link is invalid or has expired.
        </p>
        <button
          onClick={() => router.push("/auth/forgot-password")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Request a new link
        </button>
      </div>
    );
  }

  //state 3 : password changed successfully
  if (success) {
    return (
      <div className="p-4 bg-green-100 text-green-700 rounded-lg text-center">
        Password updated successfully! Redirecting to login...
      </div>
    );
  }
  //state 4 : token is valid ! showing the form
  return (
    <div className="max-w-md mx-auto mt-20 bg-white border rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        method="POST"
      >
        {error && (
          <div className="p-3 bg-reg-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        <div>
          <input
            {...register("password")}
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm New Password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

//the main page export

export default function ResetPasswordPage() {
  return (
    <div className="max-w-md mx-auto mt-20">
      {/*Suspense is required when using useSearchParams in next.js app router */}
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
