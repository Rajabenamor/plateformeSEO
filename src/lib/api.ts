"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * A secure fetch wrapper for Server Actions that handles:
 * 1. Automatic Authorization header injection
 * 2. Automatic token refresh on 401 Unauthorized
 * 3. Automatic logout/redirect on session expiration
 */
export async function secureFetch(url: string, options: RequestInit = {}) {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get("access_token")?.value;

    const headers = new Headers(options.headers);
    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }
    headers.set("Content-Type", "application/json");

    let response = await fetch(url, {
        ...options,
        headers,
        cache: 'no-store',
    });

    // If 401, attempt to refresh the token
    if (response.status === 401) {
        const refreshToken = cookieStore.get("refresh_token")?.value;

        if (refreshToken) {
            try {
                const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login/refresh/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh: refreshToken }),
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    const newAccessToken = data.access;
                    const newRefreshToken = data.refresh;

                    // Update cookies with new tokens
                    try {
                        cookieStore.set("access_token", newAccessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "lax",
                            maxAge: 60 * 15,
                            path: "/",
                        });

                        if (newRefreshToken) {
                            cookieStore.set("refresh_token", newRefreshToken, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === "production",
                                sameSite: "lax",
                                maxAge: 60 * 60 * 24, // 1 day
                                path: "/",
                            });
                        }
                    } catch (error) {
                        // This happens when secureFetch is called during a Server Component render.
                        // We can't set cookies here, but we will still retry the request with the new token.
                        console.warn("Skipping cookie update during render. Session will refresh on next action.");
                    }

                    // Retry original request with new token
                    headers.set("Authorization", `Bearer ${newAccessToken}`);
                    response = await fetch(url, {
                        ...options,
                        headers,
                    });
                    
                    return response;
                }
            } catch (error) {
                console.error("Token refresh failed:", error);
            }
        }

        // If refresh fails or no refresh token, logout and redirect
        try {
            cookieStore.delete("access_token");
            cookieStore.delete("refresh_token");
            cookieStore.delete("user_data");
            revalidatePath('/');
        } catch (error) {
            // During render, we can't delete cookies, but the redirect will still work
            // and the middleware will catch the invalid session on the next request.
        }
        redirect("/auth/login?error=session_expired");
    }

    return response;
}
