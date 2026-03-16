import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing — Free AI Travel Planner & Premium Plans",
    description: "Start free with 6 credits. Upgrade to Journey Pass for unlimited AI itineraries, AI tweaking, PDF export, and premium Gemini AI. Plans from affordable monthly rates.",
    keywords: ["travel planner pricing", "AI itinerary cost", "free travel planner", "Journey Pass", "travel app subscription"],
    alternates: {
        canonical: "https://www.hkfirstclick.com/pricing",
        languages: {
            en: 'https://www.hkfirstclick.com/pricing',
            zh: 'https://www.hkfirstclick.com/pricing?lang=zh',
            ja: 'https://www.hkfirstclick.com/pricing?lang=ja',
            ko: 'https://www.hkfirstclick.com/pricing?lang=ko',
            fr: 'https://www.hkfirstclick.com/pricing?lang=fr',
            es: 'https://www.hkfirstclick.com/pricing?lang=es',
            id: 'https://www.hkfirstclick.com/pricing?lang=id',
            hi: 'https://www.hkfirstclick.com/pricing?lang=hi',
            pt: 'https://www.hkfirstclick.com/pricing?lang=pt',
            ar: 'https://www.hkfirstclick.com/pricing?lang=ar',
            bn: 'https://www.hkfirstclick.com/pricing?lang=bn',
            ru: 'https://www.hkfirstclick.com/pricing?lang=ru',
            'x-default': 'https://www.hkfirstclick.com/pricing',
        },
    },
    openGraph: {
        title: "Pricing | HKfirstclick AI Travel Planner",
        description: "Start free with 6 credits. Upgrade for unlimited AI itineraries and premium features.",
        url: "https://www.hkfirstclick.com/pricing",
        siteName: "HKfirstclick",
        images: [{ url: "https://www.hkfirstclick.com/og-image.png", width: 1200, height: 630 }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Pricing | HKfirstclick AI Travel Planner",
        description: "Start free with 6 credits. Upgrade for unlimited AI itineraries.",
        images: ["https://www.hkfirstclick.com/og-image.png"],
    },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
