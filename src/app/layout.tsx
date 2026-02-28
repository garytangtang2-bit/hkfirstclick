import type { Metadata } from "next";
import "./globals.css";

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
            <body className="antialiased font-sans selection:bg-[#EEDC00] selection:text-black" suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
