import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Travel Itinerary Generator — Build Your Perfect Trip",
    description: "Create a personalized travel itinerary in seconds with AI. Input your destination, dates, and preferences — get a complete day-by-day plan with real flight prices, hotel picks, and local tips.",
    keywords: ["AI itinerary generator", "trip planner", "travel planning", "AI travel assistant", "vacation planner", "custom itinerary"],
    alternates: {
        canonical: "https://www.hkfirstclick.com/workspace",
        languages: {
            en: 'https://www.hkfirstclick.com/workspace',
            zh: 'https://www.hkfirstclick.com/workspace?lang=zh',
            ja: 'https://www.hkfirstclick.com/workspace?lang=ja',
            ko: 'https://www.hkfirstclick.com/workspace?lang=ko',
            fr: 'https://www.hkfirstclick.com/workspace?lang=fr',
            es: 'https://www.hkfirstclick.com/workspace?lang=es',
            id: 'https://www.hkfirstclick.com/workspace?lang=id',
            hi: 'https://www.hkfirstclick.com/workspace?lang=hi',
            pt: 'https://www.hkfirstclick.com/workspace?lang=pt',
            ar: 'https://www.hkfirstclick.com/workspace?lang=ar',
            bn: 'https://www.hkfirstclick.com/workspace?lang=bn',
            ru: 'https://www.hkfirstclick.com/workspace?lang=ru',
            'x-default': 'https://www.hkfirstclick.com/workspace',
        },
    },
    openGraph: {
        title: "AI Travel Itinerary Generator | HKfirstclick",
        description: "Create a personalized travel itinerary in seconds. Real flight prices, hotel picks, and local tips — powered by AI.",
        url: "https://www.hkfirstclick.com/workspace",
        siteName: "HKfirstclick",
        images: [{ url: "https://www.hkfirstclick.com/og-image.png", width: 1200, height: 630 }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Travel Itinerary Generator | HKfirstclick",
        description: "Create a personalized travel itinerary in seconds with AI.",
        images: ["https://www.hkfirstclick.com/og-image.png"],
    },
};

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "HKfirstclick AI Itinerary Generator",
        "applicationCategory": "TravelApplication",
        "operatingSystem": "Web",
        "description": "AI-powered travel itinerary generator. Create personalized day-by-day trip plans with real flight prices, hotel picks, and local tips for 54+ destinations in 12 languages.",
        "url": "https://www.hkfirstclick.com/workspace",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "description": "Free tier with 6 credits. Premium plans available.",
        },
        "publisher": {
            "@type": "Organization",
            "name": "HKfirstclick",
            "url": "https://www.hkfirstclick.com",
        },
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
