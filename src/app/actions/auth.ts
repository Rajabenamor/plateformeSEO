"use server";

import { cookies } from "next/headers";
import { 
    forgotPasswordFormData, 
    LoginFormData, 
    RegisterFormData, 
    ResetPasswordFormData 
} from "@/app/types/auth";
import { ActionResult } from "next/dist/shared/lib/app-router-types";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifyAdminSession } from "@/lib/session";

export async function registerServerAction(data: RegisterFormData) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: data.username,
                email: data.email,
                password: data.password,
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: Object.values(errorData)[0] };
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to connect to the server." };
    }
}
export async function verifyOtpServerAction(data: { email: string; otp: string }) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        return { success: false, error: result.error || "Verification failed." };
      }
  
      return { success: true };
    } catch (error) {
      return { success: false, error: "Network error occurred. Try again." };
    }
  }

export async function loginServerAction(data: LoginFormData) {
    let redirectPath = "/dashboard";
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: data.username,
                password: data.password,
            }),
        });
        const result = await response.json();

        if (!response.ok) {
            if (result.error && Array.isArray(result.error)) {
                return { success: false, error: result.error[0] };
            }
            if (result.detail) {
                return { success: false, error: result.detail || "Invalid credentials" };
            }
            return { success: false, error: "Login failed" };
        }

        const cookieStore = await cookies();

        cookieStore.set("access_token", result.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 15,
            path: "/",
        });

        cookieStore.set("refresh_token", result.refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day to match backend
            path: "/",
        });

        if (result.user) {
            cookieStore.set("user_data", JSON.stringify(result.user), {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24,
            });
        }

        const isAdmin = await verifyAdminSession();
        redirectPath = isAdmin ? "/admin" : "/dashboard";
    } catch (error) {
        return { success: false, error: "Connection Failed" };
    }

    revalidatePath('/');
    redirect(redirectPath);
}

export async function logoutAction(){
    const cookieStore = await cookies();

    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("user_data"); 

    revalidatePath('/');
    redirect('/');
}

export async function forgotPasswordAction(data: forgotPasswordFormData): Promise<ActionResult> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/password_reset/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: data.email }),
        });
        if (!response.ok) {
            console.error("Password reset failed:", await response.json());
        }
        return { success: true };
    } catch (e) {
        return { success: false, error: "Server connection failed" };
    }
}

export async function resetPasswordAction(data: ResetPasswordFormData, token: string): Promise<ActionResult> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/password_reset/confirm/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: token.trim(),
                password: data.password
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.password?.[0] || "Invalid or expired token." };
        }
        return { success: true };
    } catch (e) {
        console.error("Reset password error:", e);
        return { success: false, error: "Server connection failed." };
    }
}

export async function validateResetTokenAction(token: string): Promise<ActionResult> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/password_reset/validate_token/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

export async function GoogleLoginAction(Credential: string) {
    let redirectPath = "/";
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: Credential }),
        });

        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result.error || "Google login failed" };
        }

        const cookieStore = await cookies();

        cookieStore.set("access_token", result.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 15,
            path: "/",
        });

        cookieStore.set("refresh_token", result.refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        if (result.user) {
            cookieStore.set("user_data", JSON.stringify(result.user), {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24,
            });
        }

        const isAdmin = await verifyAdminSession();
        redirectPath = isAdmin ? "/admin" : "/dashboard";
    } catch (error) {
        return { success: false, error: "Connection failed" };
    }

    revalidatePath('/');
    redirect(redirectPath);
}
export async function deleteAccountAction() {
    let redirectPath = "/";

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            return { success: false, error: "Not authenticated" };
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/delete-account/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { success: false, error: "Failed to delete account on the server." };
        }

        // Wipe local session data
        cookieStore.delete("access_token");
        cookieStore.delete("refresh_token");
        cookieStore.delete("user_data");

    } catch (error) {
        return { success: false, error: "Network error occurred." };
    }

    revalidatePath('/');
    redirect(redirectPath);
}

