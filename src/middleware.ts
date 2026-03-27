import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';
import { updateSession } from '@/utils/supabase/middleware';

// BCP 47 locale codes that map to the app's 12 supported languages
const SUPPORTED_LOCALES = [
    'en', // English
    'zh', // 繁體中文
    'ja', // 日本語
    'ko', // 한국어
    'fr', // Français
    'es', // Español
    'id', // Bahasa Indonesia
    'hi', // हिन्दी
    'pt', // Português
    'ar', // العربية
    'bn', // বাংলা
    'ru', // Русский
] as const;

const DEFAULT_LOCALE = 'en';

// Existing routes that are NOT under /[lang]/ — bypass locale redirect
const BYPASS_PREFIXES = [
    '/',          // exact root — home page stays at /
    '/api',
    '/workspace',
    '/catalog',
    '/destinations', // has its own Accept-Language redirect in page.tsx
    '/login',
    '/my-trips',
    '/map',
    '/admin',
    '/auth',
    '/pricing',
    '/privacy',
    '/share',
    '/flights',
    '/food',
    '/attractions',
];

function getPreferredLocale(request: NextRequest): string {
    // Build a plain headers object for Negotiator
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => { headers[key] = value; });

    try {
        const languages = new Negotiator({ headers }).languages();
        return match(languages, [...SUPPORTED_LOCALES], DEFAULT_LOCALE);
    } catch {
        return DEFAULT_LOCALE;
    }
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl;

    // Capture referral code from ?ref= and store in cookie (30 days)
    const refCode = request.nextUrl.searchParams.get("ref");
    if (refCode && /^[A-Z0-9]{6,10}$/.test(refCode) && !request.cookies.get("hkfc_ref")) {
        const response = await updateSession(request);
        response.cookies.set("hkfc_ref", refCode, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30,
            path: "/",
        });
        fetch(`${request.nextUrl.origin}/api/affiliate/track?code=${refCode}`).catch(() => {});
        return response;
    }

    // 1. Skip static files (images, fonts, icons, etc.)
    if (/\.[a-z0-9]+$/i.test(pathname)) {
        return NextResponse.next();
    }

    // 2. Skip exact root and all existing route prefixes
    if (
        pathname === '/' ||
        BYPASS_PREFIXES.slice(1).some(prefix => pathname.startsWith(prefix))
    ) {
        // Still run Supabase session refresh for auth-protected routes
        return updateSession(request);
    }

    // 3. If path already has a valid locale prefix, pass through (+ refresh session)
    const hasLocalePrefix = SUPPORTED_LOCALES.some(
        locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    );
    if (hasLocalePrefix) {
        return updateSession(request);
    }

    // 4. Detect preferred locale and redirect to /[locale]/...
    const locale = getPreferredLocale(request);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(redirectUrl, { status: 307 });
}

export const config = {
    matcher: [
        // Run on all paths except Next.js internals and pure static assets
        '/((?!_next/static|_next/image|favicon\\.ico).*)',
    ],
};
