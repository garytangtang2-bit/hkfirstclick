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
        <div className="h-[calc(100vh-64px)] w-full relative overflow-hidden bg-[#0A0A0A]">

            {/* The Actual Map Component (Full Screen Background) */}
            <div className="absolute inset-0 z-[100]">
                <MapComponent
                    userTier={userTier}
                    selectedRegion={selectedRegion}
                    onCitySelect={(city) => setSelectedCity(city)}
                    onVisibleCitiesChange={(cities) => setVisibleCities(cities)}
                />
            </div>

            {/* Floating Control Panel (Top Left) */}
            <div className="absolute top-20 md:top-4 left-4 z-[400] w-[calc(100%-32px)] md:w-[320px] bg-[#161616]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl premium-glass-card pointer-events-auto flex flex-col gap-4">
                <div className="hidden md:block">
                    <h1 className="text-xl font-extrabold text-[#F8F9FA] flex items-center gap-2 heading-premium mb-1">
                        <Map size={24} className="text-[#EEDC00]" />
                        {t.map_title_page || "Global Travel Map"}
                    </h1>
                    <p className="text-[#A0A0A0] text-xs leading-relaxed hidden lg:block">Watch your generated AI itineraries come to life on our interactive global tracking map.</p>
                </div>

                {/* Region Filters */}
                <div className="flex flex-wrap gap-2">
                    {["All", "亞洲", "歐洲", "美洲", "中東", "大洋洲", "非洲"].map((region) => (
                        <button
                            key={region}
                            onClick={() => setSelectedRegion(region)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${selectedRegion === region
                                ? "bg-[#EEDC00] text-black shadow-[0_0_15px_rgba(238,220,0,0.3)]"
                                : "bg-[#0A0A0A] text-[#A0A0A0] hover:text-white border border-white/10 hover:border-white/30"
                                }`}
                        >
                            {region === "All" ? "全球" : region}
                        </button>
                    ))}
                </div>

                <div className="flex gap-3 mt-1">
                    <Link href="/workspace" className="flex-1">
                        <button className="w-full bg-[#EEDC00] text-black px-4 py-3 rounded-xl text-sm font-bold hover:bg-[#ffe800] transition-colors flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(238,220,0,0.3)]">
                            ✨ {t.header_generate || "Generate AI Itinerary"}
                        </button>
                    </Link>
                </div>
            </div>

            {/* 🔍 1. Floating Search Box */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] w-[90%] md:w-[400px]">
                <div className="bg-[#161616]/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-2 flex items-center pr-4 premium-glass-card">
                    <div className="bg-[#0A0A0A] text-[#EEDC00] p-2.5 rounded-xl mr-3 border border-white/5">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="你想去哪裡獲取靈感？"
                        className="flex-1 bg-transparent border-none outline-none font-medium text-white placeholder-gray-500 text-sm md:text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* 🗺️ 2. Contextual Idea Cards (Horizontal Scroll at Bottom) */}
            {visibleCities.length > 0 && !selectedCity && (
                <div className="absolute bottom-6 left-0 right-0 z-[400] px-4 md:px-8">
                    <div className="flex gap-3 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {visibleCities.map((city, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedCity(city)}
                                className="snap-center shrink-0 w-[240px] bg-[#161616]/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/10 cursor-pointer hover:-translate-y-1 transition-transform group premium-glass-card"
                            >
                                <h3 className="font-bold text-white truncate mb-1 flex items-center gap-1.5">
                                    <MapPin size={14} className="text-[#EEDC00]" />
                                    {city.City}
                                </h3>
                                <p className="text-xs text-[#A0A0A0] truncate">{city.Vibe}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 📱 3. Bottom Drawer UI (Replaces small Popups) */}
            <div className={`absolute bottom-0 left-0 right-0 z-[500] bg-[#121212] rounded-t-3xl shadow-[0_-20px_40px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out border-t border-white/10 ${selectedCity ? "translate-y-0" : "translate-y-full"
                }`}>
                {selectedCity && (
                    <div className="p-6 md:p-8 max-w-4xl mx-auto relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedCity(null)}
                            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                            {/* Details Content */}
                            <div className="flex-1">
                                <div className="inline-block px-3 py-1 bg-[#EEDC00]/10 text-[#EEDC00] rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
                                    {selectedCity.Region || "Global"}
                                </div>
                                <h2 className="text-3xl font-black text-white mb-2">{selectedCity.City}</h2>
                                <p className="text-[#A0A0A0] mb-6 font-medium leading-relaxed">{selectedCity.Vibe}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/5 shadow-inner">
                                        <div className="text-sm text-gray-500 font-bold mb-1">🍜 Must Try Food</div>
                                        <div className="text-white font-medium">{selectedCity.Top_Food}</div>
                                    </div>
                                    <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/5 shadow-inner">
                                        <div className="text-sm text-gray-500 font-bold mb-1">🏛️ Top Spot</div>
                                        <div className="text-white font-medium">{selectedCity.Must_Visit_Spot}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="w-full md:w-[320px] flex flex-col gap-3 justify-center shrink-0">
                                <div className="text-center mb-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                        Actions
                                    </span>
                                </div>

                                <Link href={`/workspace?dest=${encodeURIComponent(selectedCity.City)}`} className="w-full">
                                    <button className="w-full bg-[#1A1A1A] text-white border border-white/10 px-6 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors flex justify-center items-center gap-2">
                                        <Navigation size={18} /> Modify & Build Iterinary
                                    </button>
                                </Link>

                                <Link href={`/workspace?dest=${encodeURIComponent(selectedCity.City)}`} className="w-full">
                                    <button className="w-full bg-[#EEDC00] text-black px-6 py-4 rounded-xl font-bold hover:bg-[#ffe800] transition-colors flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(238,220,0,0.3)]">
                                        <Sparkles size={18} /> ✨ 一鍵生成行程 <span className="text-black/60 font-normal text-sm ml-1">(僅需 5 點)</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
