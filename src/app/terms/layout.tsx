import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service — HKfirstclick",
    description: "Read HKfirstclick's terms of service. Understand the rules and guidelines for using our AI travel itinerary generator platform.",
    alternates: {
        canonical: "https://www.hkfirstclick.com/terms",
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "Terms of Service | HKfirstclick",
        description: "Rules and guidelines for using HKfirstclick's AI travel planning platform.",
        url: "https://www.hkfirstclick.com/terms",
        siteName: "HKfirstclick",
        type: "website",
    },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
