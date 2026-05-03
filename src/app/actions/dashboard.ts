"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import isURL from "validator/lib/isURL";
import { secureFetch } from "@/lib/api";

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

import { DashboardData } from "../types/dashboard";

export async function fetchDashboardDataSecurely(url: string): Promise<{ data: DashboardData }> {
    const response = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analysis/dashboard-data/?url=${encodeURIComponent(url)}`, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Analysis failed");
    }

    // The new backend endpoint returns the data object directly, so we wrap it
    const data = await response.json();
    return { data };
}
