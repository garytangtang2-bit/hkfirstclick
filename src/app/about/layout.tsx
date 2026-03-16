import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About HKfirstclick — Built by a Traveler, for Travelers",
    description: "Learn about HKfirstclick, the AI travel itinerary generator built by a traveler who hates planning. Our mission: make perfect trip planning effortless for everyone.",
    alternates: {
        canonical: "https://www.hkfirstclick.com/about",
    },
    openGraph: {
        title: "About HKfirstclick | AI Travel Planner",
        description: "Built by a traveler, for travelers who hate planning. Discover how HKfirstclick uses AI to generate perfect itineraries in seconds.",
        url: "https://www.hkfirstclick.com/about",
        siteName: "HKfirstclick",
        images: [{ url: "https://www.hkfirstclick.com/og-image.png", width: 1200, height: 630 }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "About HKfirstclick | AI Travel Planner",
        description: "Built by a traveler, for travelers who hate planning.",
        images: ["https://www.hkfirstclick.com/og-image.png"],
    },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
