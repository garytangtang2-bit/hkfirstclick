"use client";
import GlobalLayout from "@/components/GlobalLayout";
import { LandingContent } from "@/components/LandingContent";
import { useAppContext } from "@/components/AppContext";

export default function Home() {
    return (
        <GlobalLayout>
            <HomeContent />
        </GlobalLayout>
    );
}

function HomeContent() {
    const { t } = useAppContext();

    // Dummy user and navigation for now until fully hooked into AppContext
    const user = null;
    const navigateTo = (path: string) => {
        window.location.href = path; // basic navigation for the landing page placeholder
    };

    return <LandingContent t={t} user={user} navigateTo={navigateTo} />;
}
