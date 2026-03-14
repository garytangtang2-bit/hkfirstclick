import { Noto_Sans, Noto_Sans_Bengali, Noto_Sans_Arabic } from 'next/font/google';
import { notFound } from 'next/navigation';
import LangSetup from './_components/LangSetup';

// ─── Supported locale codes ───────────────────────────────────────────────────
const SUPPORTED_LOCALES = [
    'en', 'zh', 'ja', 'ko', 'fr', 'es', 'id', 'hi', 'pt', 'ar', 'bn', 'ru',
];

// ─── Per-script Noto Sans fonts ───────────────────────────────────────────────
// next/font/google keeps font loading in separate CSS chunks per variant,
// so we import one family per script rather than one family with all subsets.

/** Devanagari — हिन्दी (Hindi) */
const notoSansDevanagari = Noto_Sans({
    subsets: ['latin', 'devanagari'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-noto-devanagari',
});

/** Bengali — বাংলা */
const notoSansBengali = Noto_Sans_Bengali({
    subsets: ['latin', 'bengali'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-noto-bengali',
});

/** Arabic — العربية (RTL) */
const notoSansArabic = Noto_Sans_Arabic({
    subsets: ['arabic'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-noto-arabic',
});

// ─── Static params (for SSG) ─────────────────────────────────────────────────
export function generateStaticParams() {
    return SUPPORTED_LOCALES.map(lang => ({ lang }));
}

// ─── Layout ──────────────────────────────────────────────────────────────────
interface LangLayoutProps {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
    const { lang } = await params;

    // 404 for unknown locale codes so bots/users can't probe arbitrary paths
    if (!SUPPORTED_LOCALES.includes(lang)) notFound();

    return (
        <>
            {/*
             * LangSetup is a zero-render client component that sets
             *   document.documentElement.lang  (e.g. "zh-TW", "ar", "hi")
             *   document.documentElement.dir   ("ltr" | "rtl" for Arabic)
             * after hydration, since the root layout owns the <html> element
             * and nested server layouts cannot mutate it directly.
             */}
            <LangSetup lang={lang} />

            {/*
             * Re-declare the Noto CSS variables here so they are available
             * within this subtree even if globals.css hasn't applied them yet
             * (e.g. during first SSR paint of a [lang] page).
             */}
            <div
                className={[
                    notoSansDevanagari.variable,
                    notoSansBengali.variable,
                    notoSansArabic.variable,
                ].join(' ')}
            >
                {children}
            </div>
        </>
    );
}
