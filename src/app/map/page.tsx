"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { AppProvider, useAppContext } from "@/components/AppContext";
import { Map, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

// Leaflet relies on the `window` object, so it MUST be dynamically imported with SSR disabled.
const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

export default function MapPage() {
    return (
        <AppProvider>
            <GlobalLayout>
                <MapContent />
            </GlobalLayout>
        </AppProvider>
    );
}

function MapContent() {
    const { t } = useAppContext();
    const [userTier, setUserTier] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchUserTier = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("tier")
                    .eq("id", session.user.id)
                    .single();
                if (profile) {
                    setUserTier(profile.tier);
                }
            }
        };
        fetchUserTier();
    }, [supabase]);

    return (
        <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-[#0A0F1E] pt-[72px]">
            {/* Map Sidebar / Info Panel */}
            <div className="w-full md:w-[400px] lg:w-[480px] h-[40vh] md:h-full bg-[#161616]/80 backdrop-blur-xl border-r border-white/5 p-8 flex flex-col justify-between z-20 shrink-0">

                <div>
                    <div className="bg-[#00D2FF]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-[#00D2FF]/20 shadow-[0_0_20px_rgba(0,210,255,0.1)]">
                        <Map className="text-[#00D2FF]" size={32} />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black mb-4 text-white heading-premium leading-tight">
                        {t.map_title_page || "Global Travel Map"}
                    </h1>

                    <p className="text-muted-premium text-base mb-8 leading-relaxed">
                        {t.map_body || "Watch your generated AI itineraries come to life on our interactive global tracking map. Premium users unlock instant FlyTo animations and rich contextual insights."}
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-2 h-2 rounded-full bg-[#EEDC00] animate-pulse"></span>
                            <span className="text-sm font-bold text-white">Your Current Status</span>
                        </div>
                        <p className="text-xs text-gray-400 font-mono tracking-wider uppercase">
                            Tier: {userTier || "Casual (Free)"} {userTier !== 'TRIAL' && userTier !== 'Casual' && userTier !== null && "✨"}
                        </p>
                    </div>

                    <Link href="/workspace">
                        <button className="w-full bg-[#00D2FF] text-[#0A0F1E] px-6 py-4 rounded-xl font-bold hover:bg-white transition-colors flex justify-center items-center gap-2 premium-btn shadow-[0_0_20px_rgba(0,210,255,0.3)]">
                            {t.map_btn || "Back to Studio"} <ArrowRight size={18} />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Interactive Map Area */}
            <div className="flex-1 h-[60vh] md:h-full relative z-10 w-full">
                <MapComponent userTier={userTier} />
            </div>
        </div>
    );
}
