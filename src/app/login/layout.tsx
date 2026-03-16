import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In — HKfirstclick",
    description: "Sign in to HKfirstclick to access your AI travel itineraries and saved trips.",
    robots: {
        index: false,
        follow: false,
    },
    alternates: {
        canonical: "https://www.hkfirstclick.com/login",
    },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
