import type { Metadata } from "next";
import Script from "next/script";
import { Outfit, Noto_Sans, Noto_Sans_Bengali, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
    variable: "--font-outfit",
});

/**
 * Three Noto Sans variants cover the scripts Outfit does not include,
 * preventing garbled characters when the language switcher is used:
 *   Noto_Sans          → Devanagari  (हिन्दी / Hindi)
 *   Noto_Sans_Bengali  → Bengali     (বাংলা)
 *   Noto_Sans_Arabic   → Arabic RTL  (العربية)
 * All three expose CSS variables that are referenced in globals.css as
 * fallbacks after Outfit in the font-family stack.
 */
const notoSansDevanagari = Noto_Sans({
    subsets: ["latin", "devanagari"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-noto-devanagari",
});

const notoSansBengali = Noto_Sans_Bengali({
    subsets: ["latin", "bengali"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-noto-bengali",
});

const notoSansArabic = Noto_Sans_Arabic({
    subsets: ["arabic"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-noto-arabic",
});

const OG_IMAGE = "https://www.hkfirstclick.com/og-image.png";

export const metadata: Metadata = {
    metadataBase: new URL("https://www.hkfirstclick.com"),
    title: {
        default: "HKfirstclick | AI Travel Itinerary Generator",
        template: "%s | HKfirstclick"
    },
    description: "Generate perfect AI travel itineraries in seconds. Plan trips to 54+ world destinations with real-time flight prices, hotel recommendations, and day-by-day schedules. Free to try.",
    keywords: [
        "AI travel planner", "itinerary generator", "trip planner AI",
        "travel itinerary", "AI vacation planner", "Hong Kong travel",
        "Tokyo itinerary", "Paris itinerary", "travel planning tool",
        "AI travel assistant", "free trip planner", "travel SaaS"
    ],
    authors: [{ name: "HKfirstclick Team" }],
    creator: "HKfirstclick",
    publisher: "HKfirstclick",
    formatDetection: { email: false, address: false, telephone: false },
    alternates: {
        canonical: "https://www.hkfirstclick.com",
        languages: {
            "en": "https://www.hkfirstclick.com",
            "zh": "https://www.hkfirstclick.com/?lang=zh",
            "ja": "https://www.hkfirstclick.com/?lang=ja",
            "ko": "https://www.hkfirstclick.com/?lang=ko",
            "fr": "https://www.hkfirstclick.com/?lang=fr",
            "es": "https://www.hkfirstclick.com/?lang=es",
            "id": "https://www.hkfirstclick.com/?lang=id",
            "hi": "https://www.hkfirstclick.com/?lang=hi",
            "pt": "https://www.hkfirstclick.com/?lang=pt",
            "ar": "https://www.hkfirstclick.com/?lang=ar",
            "bn": "https://www.hkfirstclick.com/?lang=bn",
            "ru": "https://www.hkfirstclick.com/?lang=ru",
            "x-default": "https://www.hkfirstclick.com",
        },
    },
    openGraph: {
        title: "HKfirstclick | AI Travel Itinerary Generator",
        description: "Generate perfect AI travel itineraries in seconds. Plan trips to 54+ destinations with real-time prices and day-by-day schedules.",
        url: "https://www.hkfirstclick.com",
        siteName: "HKfirstclick",
        images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "HKfirstclick - AI Travel Planner" }],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "HKfirstclick | AI Travel Itinerary Generator",
        description: "Generate perfect AI travel itineraries in seconds. 54+ destinations, 12 languages.",
        images: [OG_IMAGE],
    },
    icons: {
        icon: [
            { url: "/icon.png" },
            { url: "/icon.png", sizes: "32x32", type: "image/png" },
        ],
        apple: [{ url: "/icon.png" }],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Google Analytics */}
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-KPVK1BWBG1" strategy="afterInteractive" />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-KPVK1BWBG1');
                    `}
                </Script>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />
                
                {/* Structured Data for Sitelinks */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@graph": [
                                {
                                    "@type": "WebSite",
                                    "@id": "https://www.hkfirstclick.com/#website",
                                    "url": "https://www.hkfirstclick.com",
                                    "name": "HKfirstclick",
                                    "description": "AI Itinerary Generation SaaS",
                                    "potentialAction": [
                                        {
                                            "@type": "SearchAction",
                                            "target": {
                                                "@type": "EntryPoint",
                                                "urlTemplate": "https://www.hkfirstclick.com/catalog/en?q={search_term_string}"
                                            },
                                            "query-input": "required name=search_term_string"
                                        }
                                    ]
                                },
                                {
                                    "@type": "Organization",
                                    "@id": "https://www.hkfirstclick.com/#organization",
                                    "name": "HKfirstclick",
                                    "url": "https://www.hkfirstclick.com",
                                    "logo": {
                                        "@type": "ImageObject",
                                        "url": "https://www.hkfirstclick.com/icon.png",
                                        "width": 512,
                                        "height": 512
                                            }
                                        },
                                        {
                                            "@type": "ItemList",
                                            "name": "Main Navigation",
                                            "itemListElement": [
                                                {
                                                    "@type": "SiteNavigationElement",
                                                    "position": 1,
                                                    "name": "AI Itinerary Workspace",
                                                    "url": "https://www.hkfirstclick.com/workspace"
                                                },
                                                {
                                                    "@type": "SiteNavigationElement",
                                                    "position": 2,
                                                    "name": "My Trips",
                                                    "url": "https://www.hkfirstclick.com/my-trips"
                                                },
                                                {
                                                    "@type": "SiteNavigationElement",
                                                    "position": 3,
                                                    "name": "AI Travel Map",
                                                    "url": "https://www.hkfirstclick.com/map"
                                                },
                                                {
                                                    "@type": "SiteNavigationElement",
                                                    "position": 4,
                                                    "name": "Inspiration Catalog",
                                                    "url": "https://www.hkfirstclick.com/catalog"
                                                },
                                                {
                                                    "@type": "SiteNavigationElement",
                                                    "position": 5,
                                                    "name": "Pricing Plans",
                                                    "url": "https://www.hkfirstclick.com/pricing"
                                                }
                                            ]
                                        }
                                    ]
                                })
                            }}
                        />
                    </head>
                    <body
                        className={[
                            outfit.variable,
                            notoSansDevanagari.variable,
                            notoSansBengali.variable,
                            notoSansArabic.variable,
                            "font-[family-name:var(--font-outfit)]",
                            "antialiased selection:bg-[#EEDC00] selection:text-black",
                        ].join(" ")}
                        suppressHydrationWarning
                    >
                <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossOrigin="" strategy="beforeInteractive" />
                <Script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js" strategy="beforeInteractive" />
                <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" strategy="beforeInteractive" />
                <Script id="gsap-init" strategy="lazyOnload">
                    {`
                        if (typeof gsap !== "undefined") {
                            // Liquid Wipe Entry Animation
                            gsap.to(".liquid-wipe", {
                                scaleY: 0,
                                duration: 1.2,
                                ease: "power4.inOut",
                                delay: 0.1
                            });

                            // Dashboard entry animations
                            gsap.fromTo(".premium-glass-card", 
                                { y: 40, opacity: 0 }, 
                                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.8 }
                            );

                            gsap.fromTo(".heading-premium", 
                                { y: 20, opacity: 0 }, 
                                { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.6 }
                            );
                        }
                    `}
                </Script>

                {/* Global Decorative Layers */}
                <div className="liquid-wipe"></div>

                {children}
            </body>
        </html>
    );
}
