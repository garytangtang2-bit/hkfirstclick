"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { AppProvider, useAppContext } from "@/components/AppContext";
import { cityPhotos } from "@/data/cityPhotos";
import { getTranslatedCityName, getTranslatedData } from "@/utils/cityTranslations";
import { Navigation, Sparkles, Utensils, Landmark, Calendar } from "lucide-react";
import Link from "next/link";

interface Props {
    cityId: string;
}

export default function DestinationClientPage({ cityId }: Props) {
    return (
        <AppProvider>
            <GlobalLayout>
                <DestinationContent cityId={cityId} />
            </GlobalLayout>
        </AppProvider>
    );
}

function DestinationContent({ cityId }: Props) {
    const { t, language } = useAppContext();
    const photoUrl = cityPhotos[cityId] || "https://images.unsplash.com/photo-1488085061387-422e29b40080";
    
    const cityName = getTranslatedCityName(cityId, language);
    const description = getTranslatedData(cityId, "description", language);
    const topFood = getTranslatedData(cityId, "top_food", language);
    const mustVisit = getTranslatedData(cityId, "must_visit_spot", language);

    return (
        <div className="min-h-screen bg-[#0A0A0A] pb-24">
            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh] w-full flex items-end justify-center pb-16 px-4">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${photoUrl}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
                
                <div className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center">
                    <div className="bg-purple-500/20 text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold mb-6 tracking-widest uppercase border border-purple-500/30 backdrop-blur-md">
                        3 {t.landing_days || "Days Itinerary"}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
                        {cityName}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-medium drop-shadow-md">
                        {description}
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                
                {/* Highlights Bar */}
                <div className="bg-[#161616]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row gap-6 justify-between items-center shadow-2xl mb-12">
                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-purple-400 mb-2">
                            <Utensils size={18} />
                            <span className="text-xs uppercase font-bold tracking-widest">{t.map_must_try_food || "Must Try Food"}</span>
                        </div>
                        <h3 className="text-white font-bold text-lg">{topFood}</h3>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-white/10"></div>
                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-purple-400 mb-2">
                            <Landmark size={18} />
                            <span className="text-xs uppercase font-bold tracking-widest">{t.map_top_spot || "Top Spot"}</span>
                        </div>
                        <h3 className="text-white font-bold text-lg">{mustVisit}</h3>
                    </div>
                </div>

                {/* Call To Action */}
                <div className="bg-gradient-to-br from-purple-900/40 to-[#161616] border border-purple-500/20 rounded-3xl p-8 md:p-12 text-center shadow-2xl mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10">
                        {(t.landing_cta_title || "Create Your Own {cityName} Trip").replace("{cityName}", cityName)}
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto relative z-10 leading-relaxed">
                        {t.landing_cta_desc || "Clone this itinerary template to your workspace, adjust the dates, and let our AI personalize the perfect schedule for you."}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10 w-full">
                        <Link href={`/workspace?dest=${encodeURIComponent(cityId)}`} className="w-full sm:w-auto">
                            <button className="w-full bg-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-500 transition-transform hover:scale-105 active:scale-95 flex justify-center items-center gap-2 shadow-[0_10px_30px_rgba(168,85,247,0.3)]">
                                <Sparkles size={18} /> 
                                {t.map_actions_generate || "1-Click Generate"}
                            </button>
                        </Link>
                        <Link href={`/catalog`} className="w-full sm:w-auto">
                            <button className="w-full bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-transform hover:scale-105 active:scale-95 flex justify-center items-center gap-2">
                                <Navigation size={18} /> 
                                {t.btn_back || "Back to Catalog"}
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Placeholder for future detailed itinerary */}
                <div className="border border-dashed border-white/10 rounded-3xl p-12 text-center bg-[#161616]/50">
                    <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Calendar className="text-gray-500" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-300 mb-3">
                        {t.landing_detailed_coming_soon || "Detailed 3-Day Itinerary Coming Soon"}
                    </h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                        {t.landing_detailed_desc || "We are preparing a fully detailed hour-by-hour schedule for this destination. Check back later!"}
                    </p>
                </div>

            </div>
        </div>
    );
}
