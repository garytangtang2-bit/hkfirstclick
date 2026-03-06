import type { Metadata } from "next";
import Script from "next/script";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "HKfirstclick | AI Itinerary Generation SaaS",
    description: "Turn any idea into a perfect actionable itinerary with Data-Driven Planning.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
            </head>
            <body className={`${outfit.className} antialiased selection:bg-[#EEDC00] selection:text-black`} suppressHydrationWarning>
                <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossOrigin="" strategy="beforeInteractive" />
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
