"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { forgotPasswordFormData, forgotPasswordSchema } from "@/app/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordAction } from "@/app/actions/auth";



export default function ForgotPasswordPage(){
    const [message, setMesssage]= useState("");
    const [error,setError]=useState("");
    const {
        register,handleSubmit,formState : {isSubmitting,errors}} = useForm<forgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
});
const onSubmit = async (data : forgotPasswordFormData) => {
    setError("");
    setMesssage("");
    const result = await forgotPasswordAction(data);

    if (result.success){
        setMesssage("If this email is registered, you will receive a reset link shortly");

    }else{
        setError(String(result.error));
    }
};
return(
    <div className="max-w-md mx-auto mt-20 p-6 bg-white border rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-4"> Reset Password</h2>
        <p className="text-gray-600 mb-6 text-sm">Enter your email and we'll send you a link to get back into your account.</p>
        {message && <div className="p-3 bg-green-50 text-green-700 rounded-lg mb-4 text-sm">{message}</div>}
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg mb-4 text-sm ">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
            {...register("email")}
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
          <button
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

    </div>
)
}