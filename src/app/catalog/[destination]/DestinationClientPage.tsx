"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { AppProvider, useAppContext } from "@/components/AppContext";
import { cityPhotos } from "@/data/cityPhotos";
import { getTranslatedCityName, getTranslatedData, getRecommendedDays } from "@/utils/cityTranslations";
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
                        {t.itinerary_label_dynamic ? t.itinerary_label_dynamic.replace('{days}', getRecommendedDays(cityId).toString()) : `${getRecommendedDays(cityId)} ${t.landing_days || "Days Itinerary"}`}
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

                {/* Dynamic Preview Itinerary */}
                <div className="space-y-6 mb-16">
                    {Array.from({ length: getRecommendedDays(cityId) }, (_, i) => {
                        const dayNum = i + 1;
                        let themeKey = "itinerary_theme_4";
                        if (dayNum === 1) themeKey = "itinerary_theme_1";
                        else if (dayNum === 2) themeKey = "itinerary_theme_2";
                        else if (dayNum === 3) themeKey = "itinerary_theme_3";

                        const theme = t[themeKey] || "Daily Highlights";
                        const highlight = dayNum === 2 ? mustVisit : (dayNum === 3 ? topFood : (dayNum === 1 ? description : cityName));

                        return (
                            <div key={dayNum} className="group relative bg-[#161616]/40 hover:bg-[#161616]/60 border border-white/5 hover:border-purple-500/30 rounded-3xl p-6 transition-all duration-300">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                                            <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">DAY</span>
                                            <span className="text-xl font-black">{dayNum}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Sparkles size={14} className="text-purple-400 opacity-60" />
                                            <h4 className="text-purple-300/80 text-xs font-bold uppercase tracking-widest">
                                                {theme}
                                            </h4>
                                        </div>
                                        <h3 className="text-white text-xl font-bold mb-3 group-hover:text-purple-200 transition-colors">
                                            {highlight}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 italic opacity-60 group-hover:opacity-100 transition-opacity">
                                            {t.itinerary_highlights || "Highlights"}: {dayNum === 2 ? `Explore the iconic ${mustVisit}.` : (dayNum === 3 ? `Savor the best local ${topFood}.` : `Immerse yourself in ${cityName}.`)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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

            </div>
        </div>
    );
}
