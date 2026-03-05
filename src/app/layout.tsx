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
            <body className={`${outfit.className} antialiased selection:bg-[#EEDC00] selection:text-black`} suppressHydrationWarning>
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

                            // Custom Cursor Logic
                            const cursorDot = document.querySelector('.custom-cursor-dot');
                            const cursorRing = document.querySelector('.custom-cursor-ring');
                            
                            if (cursorDot && cursorRing && matchMedia('(pointer:fine)').matches) {
                                let mouseX = window.innerWidth / 2;
                                let mouseY = window.innerHeight / 2;
                                let ringX = mouseX;
                                let ringY = mouseY;
                                
                                window.addEventListener('mousemove', (e) => {
                                    mouseX = e.clientX;
                                    mouseY = e.clientY;
                                    
                                    // Immediate dot update
                                    gsap.set(cursorDot, { x: mouseX, y: mouseY });
                                });
                                
                                // Smooth ring follow
                                gsap.ticker.add(() => {
                                    ringX += (mouseX - ringX) * 0.15;
                                    ringY += (mouseY - ringY) * 0.15;
                                    gsap.set(cursorRing, { x: ringX, y: ringY });
                                });

                                // Hover effects for cursor
                                const links = document.querySelectorAll('a, button, input, textarea, select, .premium-btn');
                                links.forEach(link => {
                                    link.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
                                    link.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
                                });
                            }

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
                <div className="global-noise"></div>
                <div className="vertical-guides"></div>
                <div className="liquid-wipe"></div>

                {/* Custom Cursor */}
                <div className="custom-cursor-dot" />
                <div className="custom-cursor-ring" />

                {children}
            </body>
        </html>
    );
}
