import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Trips — Your AI-Generated Itineraries",
    description: "View, manage, and export all your AI-generated travel itineraries. Access your saved trips, tweak schedules with AI, and download PDF travel guides anytime.",
    keywords: ["my trips", "saved itineraries", "travel dashboard", "trip management", "PDF travel guide"],
    alternates: {
        canonical: "https://www.hkfirstclick.com/my-trips",
    },
    openGraph: {
        title: "My Trips | HKfirstclick",
        description: "View and manage all your AI-generated travel itineraries.",
        url: "https://www.hkfirstclick.com/my-trips",
        siteName: "HKfirstclick",
        images: [{ url: "https://www.hkfirstclick.com/og-image.png", width: 1200, height: 630 }],
        type: "website",
    },
    robots: {
        index: false, // private user page - should not be indexed
        follow: false,
    },
};

export default function MyTripsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
