"use client";
import GlobalLayout from "@/components/GlobalLayout";
import { LandingContent } from "@/components/LandingContent";
import { useAppContext } from "@/components/AppContext";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
    return (
        <GlobalLayout>
            <HomeContent />
        </GlobalLayout>
    );
}

function HomeContent() {
    const { t } = useAppContext();
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        fetchUser();
    }, [supabase.auth]);

    const navigateTo = async (path: string) => {
        if (path === '/workspace-check') {
            const { data: { session } } = await supabase.auth.getSession();
            window.location.href = session?.user ? "/workspace" : "/login";
            return;
        }
        window.location.href = path; // basic navigation for the landing page placeholder
    };

    return <LandingContent t={t} user={user} navigateTo={navigateTo} />;
}
