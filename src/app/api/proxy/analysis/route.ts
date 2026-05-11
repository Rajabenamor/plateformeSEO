import { NextResponse } from 'next/server';
import { secureFetch } from "@/lib/api";

export const maxDuration = 60; // Set timeout for this specific API route
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    console.log(`[Proxy] Initiating secureFetch for: ${url}`);
    try {
        const response = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analysis/dashboard-data/?url=${encodeURIComponent(url)}`, {
            method: "GET",
        });

        const status = response.status;
        console.log(`[Proxy] Backend response status: ${status}`);

        // Handle various status codes
        if (status === 200) {
            const data = await response.json();
            return NextResponse.json(data);
        } else if (status === 401) {
            return NextResponse.json({ error: "Authentication failed. Please login again." }, { status: 401 });
        } else if (status === 403) {
            const data = await response.json().catch(() => ({ error: "Forbidden" }));
            return NextResponse.json({ error: data.error || "Forbidden" }, { status: 403 });
        } else {
            const errorText = await response.text().catch(() => "Unknown error");
            console.error(`[Proxy] Backend error (${status}): ${errorText}`);
            return NextResponse.json({ error: `Analysis failed: ${status}` }, { status: status });
        }
    } catch (error: any) {
        console.error(`[Proxy] Critical failure: ${error.message}`);
        // Check if it's a Next.js redirect error
        if (error.digest?.startsWith('NEXT_REDIRECT')) {
            return NextResponse.json({ error: "Session expired", redirect: true }, { status: 401 });
        }
        return NextResponse.json({ error: "Internal server error connecting to backend" }, { status: 500 });
    }
}
