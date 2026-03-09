"use client";

import { AppProvider, useAppContext } from "@/components/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppProvider>
            <AppContentWrapper>{children}</AppContentWrapper>
        </AppProvider>
    );
}

function AppContentWrapper({ children }: { children: React.ReactNode }) {
    const { language, setLanguage, currency, setCurrency, t } = useAppContext();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [credits, setCredits] = useState(0);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setUser(session?.user || null);
            if (session?.user) fetchProfile(session.user.id);
        };
        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user || null);
                if (session?.user) {
                    fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                }
            }
        );

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, [supabase]);

    const fetchProfile = async (userId: string) => {
        const { data } = await supabase
            .from("profiles")
            .select("tier, trial_credits, premium_credits, premium_expires_at, topup_credits, topup_expires_at")
            .eq("id", userId)
            .single();

        if (data) {
            setProfile(data);

            const now = new Date();
            let activeTotal = data.trial_credits || 0;

            if (data.premium_expires_at && new Date(data.premium_expires_at) > now) {
                activeTotal += (data.premium_credits || 0);
            }
            if (data.topup_expires_at && new Date(data.topup_expires_at) > now) {
                activeTotal += (data.topup_credits || 0);
            }

            setCredits(activeTotal);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const navigateTo = (path: string) => {
        router.push(path);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar
                user={user}
                profile={profile}
                credits={credits}
                handleSignOut={handleSignOut}
                t={t}
                language={language}
                setLanguage={setLanguage}
                currency={currency}
                setCurrency={setCurrency}
                navigateTo={navigateTo}
            />
            <div className="flex-1 pt-16 relative">{children}</div>
            <Footer t={t} />
        </div>
    );
}
