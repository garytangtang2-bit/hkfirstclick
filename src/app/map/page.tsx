"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { AppProvider, useAppContext } from "@/components/AppContext";
import { Map, ArrowRight, Search, X, Navigation, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
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

    // Phase 4 UI States
    const [selectedCity, setSelectedCity] = useState<any>(null);
    const [visibleCities, setVisibleCities] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

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
            <div className="w-full md:w-[400px] lg:w-[420px] h-auto md:h-full bg-white border-r border-gray-200 p-6 md:p-8 flex flex-col justify-between z-20 shrink-0 shadow-xl relative overflow-y-auto">

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

            {/* Interactive Map Area with Overlay UI */}
            <div className="flex-1 h-[60vh] md:h-full relative z-10 w-full flex flex-col">

                {/* 🔍 1. Floating Search Box */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] w-[90%] md:w-[400px]">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-2 flex items-center pr-4">
                        <div className="bg-gray-100 text-gray-500 p-2.5 rounded-xl mr-3">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="你想去哪裡獲取靈感？"
                            className="flex-1 bg-transparent border-none outline-none font-medium text-gray-800 placeholder-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* The Actual Map Component */}
                <div className="flex-1 relative w-full h-full z-[100]">
                    <MapComponent
                        userTier={userTier}
                        selectedRegion={selectedRegion}
                        onCitySelect={(city) => setSelectedCity(city)}
                        onVisibleCitiesChange={(cities) => setVisibleCities(cities)}
                    />
                </div>

                {/* 🗺️ 2. Contextual Idea Cards (Horizontal Scroll at Bottom) */}
                {visibleCities.length > 0 && !selectedCity && (
                    <div className="absolute bottom-6 left-0 right-0 z-[400] px-4 md:px-8">
                        <div className="flex gap-3 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {visibleCities.map((city, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedCity(city)}
                                    className="snap-center shrink-0 w-[240px] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-200 cursor-pointer hover:-translate-y-1 transition-transform group"
                                >
                                    <h3 className="font-bold text-gray-900 truncate mb-1 flex items-center gap-1.5">
                                        <MapPin size={14} className="text-[#F5A623]" />
                                        {city.City}
                                    </h3>
                                    <p className="text-xs text-gray-500 truncate">{city.Vibe}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 📱 3. Bottom Drawer UI (Replaces small Popups) */}
                <div className={`absolute bottom-0 left-0 right-0 z-[500] bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out border-t border-gray-100 ${selectedCity ? "translate-y-0" : "translate-y-full"
                    }`}>
                    {selectedCity && (
                        <div className="p-6 md:p-8 max-w-4xl mx-auto relative">
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedCity(null)}
                                className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                                {/* Details Content */}
                                <div className="flex-1">
                                    <div className="inline-block px-3 py-1 bg-[#F5A623]/10 text-[#F5A623] rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
                                        {selectedCity.Region || "Global"}
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900 mb-2">{selectedCity.City}</h2>
                                    <p className="text-gray-600 mb-6 font-medium leading-relaxed">{selectedCity.Vibe}</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <div className="text-sm text-gray-500 font-bold mb-1">🍜 Must Try Food</div>
                                            <div className="text-gray-900 font-medium">{selectedCity.Top_Food}</div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <div className="text-sm text-gray-500 font-bold mb-1">🏛️ Top Spot</div>
                                            <div className="text-gray-900 font-medium">{selectedCity.Must_Visit_Spot}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="w-full md:w-[320px] flex flex-col gap-3 justify-center shrink-0">
                                    <div className="text-center mb-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
                                            Actions
                                        </span>
                                    </div>

                                    <Link href={`/catalog?search=${encodeURIComponent(selectedCity.City)}`} className="w-full">
                                        <button className="w-full bg-white text-gray-800 border-2 border-gray-200 px-6 py-4 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition-colors flex justify-center items-center gap-2">
                                            <Navigation size={18} /> View AI City Guide
                                        </button>
                                    </Link>

                                    <Link href={`/workspace?dest=${encodeURIComponent(selectedCity.City)}`} className="w-full">
                                        <button className="w-full bg-[#F5A623] text-white px-6 py-4 rounded-xl font-bold hover:bg-[#E0931B] transition-colors flex justify-center items-center gap-2 shadow-[0_4px_14px_0_rgba(245,166,35,0.39)]">
                                            <Sparkles size={18} /> ✨ 一鍵生成行程 <span className="text-white/80 font-normal text-sm ml-1">(僅需 5 點)</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
