"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { loginServerAction } from "@/app/actions/auth";
import { LoginFormData, loginSchema } from "@/app/types/auth";


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
      <div>
        <h2>Log In to Your Dashboard</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 4. Conditionally display the error message to the user */}
          {error && <div className="color-red mb-10">{error}</div>}
          <input
            {...register("username")}
            type="text"
            name="username"
            placeholder="Username"
      
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">
              {errors.username.message}
            </p>
          )}
          {/* <input type="email" name="email" placeholder="Email" required /> */}
          <input
            {...register("password")}
            type="password"
            name="password"
            placeholder="Password"
        
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
          <button type="submit">
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    );
  };

