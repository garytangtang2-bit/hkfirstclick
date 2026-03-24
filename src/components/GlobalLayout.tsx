"use client";

import { AppProvider, useAppContext } from "@/components/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LANG_NAME_TO_CODE } from "@/utils/langMapping";

export default function GlobalLayout({
    children,
    onLanguageChange,
    initialLanguage,
}: {
    children: React.ReactNode;
    onLanguageChange?: (langCode: string) => void;
    initialLanguage?: string;
}) {
    return (
        <AppProvider initialLanguage={initialLanguage}>
            <AppContentWrapper onLanguageChange={onLanguageChange}>
                {children}
            </AppContentWrapper>
        </AppProvider>
    );
}

function AppContentWrapper({
    children,
    onLanguageChange,
}: {
    children: React.ReactNode;
    onLanguageChange?: (langCode: string) => void;
}) {
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
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("tier, trial_credits, premium_credits, premium_expires_at, topup_credits, topup_expires_at")
                .eq("id", userId)
                .single();

            if (error) throw error;

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
        } catch (err) {
            console.error("Error fetching profile:", err);
            // Default fallback to prevent infinite loader
            setProfile({ tier: "casual" });
            setCredits(0);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const navigateTo = (path: string) => {
        // Special handling for catalog links - preserve language in URL
        if (path === "/catalog") {
            const langCode = LANG_NAME_TO_CODE[language] || "en";
            router.push(`/catalog/${langCode}`);
            return;
        }
        router.push(path);
    };

    // Wrapper for language changes - always updates the URL
    const handleSetLanguage = (langName: string) => {
        setLanguage(langName);
        const langCode = LANG_NAME_TO_CODE[langName] || "en";

        // If parent page provides a custom handler (e.g. catalog), use that
        if (onLanguageChange) {
            onLanguageChange(langCode);
            return;
        }

        // Otherwise, update the URL automatically based on current path
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const params = new URLSearchParams(currentSearch);

        // /catalog/[oldLang]/... → /catalog/[newLang]/...
        const catalogMatch = currentPath.match(/^\/catalog\/([a-z]{2})(\/.*)?$/);
        if (catalogMatch) {
            const rest = catalogMatch[2] || "";
            router.push(`/catalog/${langCode}${rest}`);
            return;
        }

        // /destinations/[slug]/[oldLang] → /destinations/[slug]/[newLang]
        const destMatch = currentPath.match(/^\/destinations\/([^/]+)\/([a-z]{2})$/);
        if (destMatch) {
            router.push(`/destinations/${destMatch[1]}/${langCode}`);
            return;
        }

        // /[oldLang]/... → /[newLang]/... (only for known lang codes)
        const LANG_CODES = ['en','zh','ja','ko','fr','es','id','hi','pt','ar','bn','ru'];
        const langPathMatch = currentPath.match(/^\/([a-z]{2})(\/.*)?$/);
        if (langPathMatch && LANG_CODES.includes(langPathMatch[1])) {
            const rest = langPathMatch[2] || "";
            router.push(`/${langCode}${rest}`);
            return;
        }

        // All other pages: add/replace ?lang= query param
        params.set("lang", langCode);
        const newUrl = `${currentPath}?${params.toString()}`;
        // Use replaceState so the URL updates without a full navigation/re-render
        window.history.replaceState(null, "", newUrl);
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
                setLanguage={handleSetLanguage}
                currency={currency}
                setCurrency={setCurrency}
                navigateTo={navigateTo}
            />
            <div className="flex-1 pt-16 relative">{children}</div>
            <Footer t={t} />
        </div>
    );
}
