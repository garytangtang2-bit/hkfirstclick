import { NextRequest, NextResponse } from "next/server";

// Wikipedia REST API - returns thumbnail for any city article (no key needed)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "";

    if (!city) {
        return NextResponse.json({ url: null }, { status: 400 });
    }

    try {
        // Wikipedia REST API summary endpoint returns a thumbnail image
        const wikiRes = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`,
            {
                headers: { "User-Agent": "HKFirstClick/1.0 (travel app)" },
                next: { revalidate: 86400 }, // cache for 24h
            }
        );

        if (!wikiRes.ok) {
            return NextResponse.json({ url: null });
        }

        const data = await wikiRes.json();
        const url = data?.originalimage?.source || data?.thumbnail?.source || null;

        return NextResponse.json({ url });
    } catch {
        return NextResponse.json({ url: null });
    }
}
