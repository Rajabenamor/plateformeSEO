"use server";

import { cookies } from "next/headers";
import { 
    AdminSchema, 
    AdminSchemaData, 
    forgotPasswordFormData, 
    LoginFormData, 
    RegisterFormData, 
    ResetPasswordFormData 
} from "@/app/types/auth";
import { ActionResult } from "next/dist/shared/lib/app-router-types";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifyAdminSession, verifySession } from "@/lib/session";
import { getAuthUser } from "@/lib/auth-utils";
import isURL from "validator/lib/isURL";
import { secureFetch } from "@/lib/api";

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
        
        // Check for pending analysis
        const pendingUrl = cookieStore.get("pending_analysis")?.value;
        if (pendingUrl && !isAdmin) {
            cookieStore.delete("pending_analysis");
            redirectPath = `/dashboard?url=${encodeURIComponent(pendingUrl)}`;
        } else {
            redirectPath = isAdmin ? "/admin" : "/dashboard";
        }
    } catch (error) {
        return { success: false, error: "Connection Failed" };
    }

    revalidatePath('/');
    redirect(redirectPath);
}

//logout action 
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

export type ActionState = {
    error: string | null;
};

export async function analyzeUrlAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const isLoggedIn = await verifySession();

    if (!isLoggedIn) {
        const url = formData.get('url') as string;
        if (url) {
            const cookieStore = await cookies();
            cookieStore.set('pending_analysis', url, { maxAge: 60 * 5 }); // 5 minutes
        }
        redirect('/auth/login?error=please_login');
    }

    let url = formData.get('url') as string;
    if (!url) return { error: null };

    url = url.trim();
    if (!isURL(url, { require_tld: true, require_protocol: false })) {
        return { error: "Please enter a valid website URL with a dot (e.g., example.com)" };
    }
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

    redirect(`/dashboard?url=${encodeURIComponent(formattedUrl)}`);
}

export async function fetchDashboardDataSecurely(url: string) {
    const response = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/?url=${encodeURIComponent(url)}`, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Analysis failed");
    }

    return await response.json();
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

// Admin Actions

export async function getUsersAction() {
    try {
        const response = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/`, {
            method: "GET",
            cache: "no-store",
        });

        if (!response.ok) return { success: false, error: "Failed to fetch users" };
        const data = await response.json();
        const users = data.results ?? data;
        const count = data.count ?? users.length;

        return { success: true, users, count };
    } catch (error) {
        return { success: false, error: "Server connection failed" };
    }
}

export async function toggleUserAction(userId: number, newStatus: boolean) {
    try {
        const response = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}/toggle/`, {
            method: "PATCH",
            body: JSON.stringify({ is_active: newStatus })
        });

        if (!response.ok) return { success: false, error: "Failed to toggle user" };
        const result = await response.json();
        return { success: true, user: result };
    } catch (error) {
        return { success: false, error: "Server connection failed" };
    }
}

export async function deleteUserAction(userId: number) {
    try {
        const response = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}/delete/`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const error = await response.json();
            return { success: false, error: error.detail || "Failed to delete user" };
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: "Server connection failed" };
    }
}

export async function updateUserAction(userId: number, data: { username: string; email: string; is_staff: boolean }) {
    try {
        const response = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}/update/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.detail || "Failed to update user." };
        }
        const updatedUser = await response.json();
        return { success: true, data: updatedUser };
    } catch (error) {
        return { success: false, error: "Server Connection failed." };
    }
}

export async function getRedirectPathAction() {
    const isAdmin = await verifyAdminSession();
    return isAdmin ? "/admin" : "/";
}

export async function createUserAction(data: AdminSchemaData) {
    const user = await getAuthUser();

    if (!user) {
        return { success: false, error: "Unauthorized: You must be logged in." };
    }

    if (data.role === "admin" || data.role === "super_admin") {
        if (!user.isSuperAdmin) {
            return { success: false, error: "Unauthorized: Only Super Admins can create other administrators." };
        }
    }

    const validation = AdminSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: "Invalid input data" };
    }

    try {
        const validData = validation.data;
        const djangoPayload = {
            username: validData.username,
            password: validData.password,
            email: validData.email,
            is_staff: validData.role === "admin" || validData.role === "super_admin",
            is_superuser: validData.role === "super_admin",
            is_active: validData.role !== "user",
        };

        const response = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/create/`, {
            method: "POST",
            body: JSON.stringify(djangoPayload),
        });

        if (!response.ok) {
            const error = await response.json();
            return { success: false, error: error.error || error.detail || "Failed to create user" };
        }

        const result = await response.json();
        return { success: true, user: result };
    } catch (error) {
        console.error("Create User Error:", error);
        return { success: false, error: "Server connection failed" };
    }
}

// Integration Actions

export async function getIntegrationStatusAction() {
    try {
        const res = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/integrations/status/`, {
            method: "GET",
        });
        if (!res.ok) return { success: false };
        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        return { success: false };
    }
}

export async function exchangeGithubTokenAction(code: string, installation_id: string | null) {
    try {
        const res = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integrations/github/exchange/`, {
            method: "POST",
            body: JSON.stringify({ code, installation_id })
        });
        if (!res.ok) {
            const err = await res.json();
            return { success: false, error: err.error || "Failed to exchange token" };
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export async function createGithubPullRequestAction(fixTitle: string, fixExplanation: string, targetFile: string) {
    try {
        const res = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integrations/github/create-pr/`, {
            method: "POST",
            body: JSON.stringify({
                title: fixTitle,
                explanation: fixExplanation,
                target_file: targetFile
            })
        });
        const data = await res.json();
        if (!res.ok) {
            return { success: false, error: data.error || "Failed to create PR" };
        }
        return { success: true, prUrl: data.pr_url };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export async function saveGithubRepoAction(repoName: string) {
    try {
        const res = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integrations/github/save-repo/`, {
            method: "POST",
            body: JSON.stringify({ repo_name: repoName })
        });
        if (!res.ok) {
            return { success: false, error: "Failed to save repository" };
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}
