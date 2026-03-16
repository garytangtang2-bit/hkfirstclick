import { NextRequest, NextResponse } from "next/server";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY!;

const BAD_IMAGE_PATTERNS = ["map", "locator", "logo", "symbol", "flag", ".svg"];

// Rate limiter: max 60 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
        return false;
    }
    if (entry.count >= RATE_LIMIT) return true;
    entry.count++;
    return false;
}

export async function GET(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
        return NextResponse.json({ url: null }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword") || "";
    const city = searchParams.get("city") || "";

    if (!keyword) {
        return NextResponse.json({ url: null }, { status: 400 });
    }

    // Tier 1: Wikipedia
    try {
        const wikiRes = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(keyword)}&gsrlimit=1&prop=pageimages&pithumbsize=600&format=json&origin=*`,
            { next: { revalidate: 86400 } }
        );
        if (wikiRes.ok) {
            const data = await wikiRes.json();
            const pages = data.query?.pages;
            const pageId = Object.keys(pages || {})[0];
            let url: string | null = pages?.[pageId]?.thumbnail?.source || null;

            if (url) {
                const lower = url.toLowerCase();
                const isBad = BAD_IMAGE_PATTERNS.some(p => lower.includes(p));
                if (!isBad) {
                    return NextResponse.json({ url }, { headers: { "Cache-Control": "public, max-age=86400" } });
                }
            }
        }
    } catch { /* fall through */ }

    // Tier 2: Unsplash
    try {
        const query = city ? `${city} ${keyword}` : keyword;
        const unsplashRes = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=1`,
            {
                headers: { "Authorization": `Client-ID ${UNSPLASH_ACCESS_KEY}` },
                next: { revalidate: 86400 },
            }
        );
        if (unsplashRes.ok) {
            const data = await unsplashRes.json();
            if (data.results?.length > 0) {
                return NextResponse.json(
                    { url: data.results[0].urls.regular },
                    { headers: { "Cache-Control": "public, max-age=86400" } }
                );
            }
        }
    } catch { /* fall through */ }

    // Tier 3: Pexels
    try {
        const query = city ? `${city} ${keyword}` : keyword;
        const pexelsRes = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
            {
                headers: { "Authorization": PEXELS_API_KEY },
                next: { revalidate: 86400 },
            }
        );
        if (pexelsRes.ok) {
            const data = await pexelsRes.json();
            if (data.photos?.length > 0) {
                const url = data.photos[0].src.landscape || data.photos[0].src.large;
                return NextResponse.json(
                    { url },
                    { headers: { "Cache-Control": "public, max-age=86400" } }
                );
            }
        }
    } catch { /* fall through */ }

    return NextResponse.json({ url: null });
}
