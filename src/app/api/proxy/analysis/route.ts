import { NextResponse } from 'next/server';
import { secureFetch } from "@/lib/api";

export const maxDuration = 60; // Set timeout for this specific API route

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

        console.log(`[Proxy] Backend response status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Proxy] Backend error: ${errorText}`);
            return NextResponse.json({ error: "Analysis failed" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
