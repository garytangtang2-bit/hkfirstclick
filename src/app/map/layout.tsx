import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Travel Map — Explore 1,000+ Destinations Worldwide",
    description: "Explore an interactive AI-powered travel map with 1,000+ cities worldwide. Click any destination to instantly generate a custom itinerary with local tips, attractions, and travel insights.",
    keywords: ["travel map", "interactive world map", "AI travel map", "destination explorer", "world cities map", "travel inspiration"],
    alternates: {
        canonical: "https://www.hkfirstclick.com/map",
        languages: {
            en: 'https://www.hkfirstclick.com/map',
            zh: 'https://www.hkfirstclick.com/map?lang=zh',
            ja: 'https://www.hkfirstclick.com/map?lang=ja',
            ko: 'https://www.hkfirstclick.com/map?lang=ko',
            fr: 'https://www.hkfirstclick.com/map?lang=fr',
            es: 'https://www.hkfirstclick.com/map?lang=es',
            id: 'https://www.hkfirstclick.com/map?lang=id',
            hi: 'https://www.hkfirstclick.com/map?lang=hi',
            pt: 'https://www.hkfirstclick.com/map?lang=pt',
            ar: 'https://www.hkfirstclick.com/map?lang=ar',
            bn: 'https://www.hkfirstclick.com/map?lang=bn',
            ru: 'https://www.hkfirstclick.com/map?lang=ru',
            'x-default': 'https://www.hkfirstclick.com/map',
        },
    },
    openGraph: {
        title: "AI Travel Map | HKfirstclick — Explore 1,000+ Destinations",
        description: "Interactive AI-powered travel map. Click any city to generate a custom itinerary instantly.",
        url: "https://www.hkfirstclick.com/map",
        siteName: "HKfirstclick",
        images: [{ url: "https://www.hkfirstclick.com/og-image.png", width: 1200, height: 630 }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Travel Map | HKfirstclick",
        description: "Explore 1,000+ destinations on an interactive AI travel map.",
        images: ["https://www.hkfirstclick.com/og-image.png"],
    },
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
