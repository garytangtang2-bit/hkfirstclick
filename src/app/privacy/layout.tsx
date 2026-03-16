import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy — HKfirstclick",
    description: "Read HKfirstclick's privacy policy. We explain how we collect, use, and protect your personal data when you use our AI travel itinerary service.",
    alternates: {
        canonical: "https://www.hkfirstclick.com/privacy",
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "Privacy Policy | HKfirstclick",
        description: "How we collect, use, and protect your personal data.",
        url: "https://www.hkfirstclick.com/privacy",
        siteName: "HKfirstclick",
        type: "website",
    },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
