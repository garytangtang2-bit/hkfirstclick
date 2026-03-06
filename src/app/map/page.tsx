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
    const [selectedRegion, setSelectedRegion] = useState<string>("All");
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
        <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-gray-100 pt-[72px]">
            {/* Map Sidebar / Info Panel - Bright Theme */}
            <div className="w-full md:w-[400px] lg:w-[480px] h-[40vh] md:h-full bg-white border-r border-gray-200 p-8 flex flex-col justify-between z-20 shrink-0 shadow-xl relative">

                <div>
                    <div className="bg-[#FF5A5F]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-[#FF5A5F]/20 shadow-[0_0_20px_rgba(255,90,95,0.1)]">
                        <Map className="text-[#FF5A5F]" size={32} />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 leading-tight tracking-tight">
                        {t.map_title_page || "Global Travel Map"}
                    </h1>

                    <p className="text-gray-600 text-base mb-8 leading-relaxed">
                        {t.map_body || "Watch your generated AI itineraries come to life on our interactive global tracking map. Premium users unlock instant FlyTo animations and rich contextual insights."}
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Region Filters - Bright Theme */}
                    <div className="flex flex-wrap gap-2 mb-2">
                        {["All", "亞洲", "歐洲", "美洲", "中東", "大洋洲", "非洲"].map((region) => (
                            <button
                                key={region}
                                onClick={() => setSelectedRegion(region)}
                                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${selectedRegion === region
                                        ? "bg-[#FF5A5F] text-white shadow-[0_4px_14px_0_rgba(255,90,95,0.39)]"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 border border-gray-200"
                                    }`}
                            >
                                {region === "All" ? "全球 (Global)" : region}
                            </button>
                        ))}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-2 h-2 rounded-full bg-[#EEDC00] animate-pulse"></span>
                            <span className="text-sm font-bold text-gray-800">Your Current Status</span>
                        </div>
                        <p className="text-xs text-gray-500 font-mono tracking-wider uppercase">
                            Tier: {userTier || "Casual (Free)"} {userTier !== 'TRIAL' && userTier !== 'Casual' && userTier !== null && "✨"}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                        <Link href="/workspace">
                            <button className="w-full bg-[#FF5A5F] text-white px-6 py-4 rounded-xl font-bold hover:bg-[#E34A4F] transition-colors flex justify-center items-center gap-2 shadow-[0_4px_14px_0_rgba(255,90,95,0.39)]">
                                ✨ {t.header_generate || "Generate AI Itinerary"} <ArrowRight size={18} />
                            </button>
                        </Link>
                        <Link href="/catalog">
                            <button className="w-full bg-white text-gray-800 border-2 border-gray-200 px-6 py-4 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition-colors flex justify-center items-center gap-2">
                                🌍 {t.header_catalog || "Explore Inspirations"} <ArrowRight size={18} />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Interactive Map Area */}
            <div className="flex-1 h-[60vh] md:h-full relative z-10 w-full">
                <MapComponent userTier={userTier} selectedRegion={selectedRegion} />
            </div>
        </div>
    );
}
