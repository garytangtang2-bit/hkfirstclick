import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Travel Map — Explore Top Destinations Worldwide | HKfirstclick",
    description: "Explore an interactive AI-powered travel map. Click any city to instantly generate a free day-by-day itinerary with curated spots, local tips, and travel insights. Available in 12 languages.",
    keywords: ["AI travel map", "interactive world map", "travel itinerary map", "destination explorer", "trip planner map", "free travel planner"],
    alternates: {
        canonical: "https://www.hkfirstclick.com/map",
        languages: {
            en: 'https://www.hkfirstclick.com/map',
            'zh-TW': 'https://www.hkfirstclick.com/map?lang=zh',
            ja: 'https://www.hkfirstclick.com/map?lang=ja',
            ko: 'https://www.hkfirstclick.com/map?lang=ko',
            fr: 'https://www.hkfirstclick.com/map?lang=fr',
            es: 'https://www.hkfirstclick.com/map?lang=es',
            id: 'https://www.hkfirstclick.com/map?lang=id',
            hi: 'https://www.hkfirstclick.com/map?lang=hi',
            'pt-BR': 'https://www.hkfirstclick.com/map?lang=pt',
            ar: 'https://www.hkfirstclick.com/map?lang=ar',
            bn: 'https://www.hkfirstclick.com/map?lang=bn',
            ru: 'https://www.hkfirstclick.com/map?lang=ru',
            'x-default': 'https://www.hkfirstclick.com/map',
        },
    },
    openGraph: {
        title: "AI Travel Map | HKfirstclick — Free Day-by-Day Itineraries",
        description: "Interactive AI travel map. Click any city to generate a free day-by-day itinerary instantly.",
        url: "https://www.hkfirstclick.com/map",
        siteName: "HKfirstclick",
        images: [{ url: "https://www.hkfirstclick.com/og-image.png", width: 1200, height: 630 }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Travel Map | HKfirstclick",
        description: "Interactive AI travel map. Click any city for a free day-by-day itinerary.",
        images: ["https://www.hkfirstclick.com/og-image.png"],
    },
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
