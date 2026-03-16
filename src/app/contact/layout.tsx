import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us — HKfirstclick",
    description: "Get in touch with the HKfirstclick team. We're here to help with questions about your AI travel itinerary, account, or partnership opportunities.",
    alternates: {
        canonical: "https://www.hkfirstclick.com/contact",
    },
    openGraph: {
        title: "Contact HKfirstclick",
        description: "Get in touch with our team for support, feedback, or partnership inquiries.",
        url: "https://www.hkfirstclick.com/contact",
        siteName: "HKfirstclick",
        images: [{ url: "https://www.hkfirstclick.com/og-image.png", width: 1200, height: 630 }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact HKfirstclick",
        description: "Get in touch with our team for support, feedback, or partnership inquiries.",
        images: ["https://www.hkfirstclick.com/og-image.png"],
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
