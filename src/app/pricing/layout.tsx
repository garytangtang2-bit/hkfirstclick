import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing — Free AI Travel Planner & Premium Plans",
    description: "Start free with 6 credits. Upgrade to Journey Pass for unlimited AI itineraries, AI tweaking, PDF export, and premium Gemini AI. Plans from affordable monthly rates.",
    keywords: ["travel planner pricing", "AI itinerary cost", "free travel planner", "Journey Pass", "travel app subscription"],
    alternates: {
        canonical: "https://www.hkfirstclick.com/pricing",
        languages: {
            en: 'https://www.hkfirstclick.com/pricing',
            'zh-TW': 'https://www.hkfirstclick.com/pricing?lang=zh',
            ja: 'https://www.hkfirstclick.com/pricing?lang=ja',
            ko: 'https://www.hkfirstclick.com/pricing?lang=ko',
            fr: 'https://www.hkfirstclick.com/pricing?lang=fr',
            es: 'https://www.hkfirstclick.com/pricing?lang=es',
            id: 'https://www.hkfirstclick.com/pricing?lang=id',
            hi: 'https://www.hkfirstclick.com/pricing?lang=hi',
            'pt-BR': 'https://www.hkfirstclick.com/pricing?lang=pt',
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
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Product",
                "name": "HKfirstclick AI Travel Itinerary Generator",
                "description": "AI-powered travel itinerary generator for 54+ destinations in 12 languages. Generate day-by-day plans with real flight prices, hotel picks, and local tips.",
                "url": "https://www.hkfirstclick.com/workspace",
                "brand": { "@type": "Brand", "name": "HKfirstclick" },
                "offers": [
                    {
                        "@type": "Offer",
                        "name": "Free Plan",
                        "price": "0",
                        "priceCurrency": "USD",
                        "description": "6 free credits on signup. Generate up to 3 itineraries.",
                        "availability": "https://schema.org/InStock",
                        "url": "https://www.hkfirstclick.com/pricing",
                    },
                    {
                        "@type": "Offer",
                        "name": "Journey Pass",
                        "price": "9.90",
                        "priceCurrency": "USD",
                        "description": "Unlimited AI itineraries, AI tweaking, PDF export, and premium Gemini AI.",
                        "availability": "https://schema.org/InStock",
                        "url": "https://www.hkfirstclick.com/pricing",
                    },
                ],
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "reviewCount": "120",
                    "bestRating": "5",
                },
            },
        ],
    };
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
