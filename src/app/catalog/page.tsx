"use client";

import { useState } from "react";
import GlobalLayout from "@/components/GlobalLayout";
import { AppProvider, useAppContext } from "@/components/AppContext";
import { MapPin, Navigation, Search } from "lucide-react";
import Link from "next/link";
import { cityPhotos } from "@/data/cityPhotos";
import { getTranslatedCityName, getCitySlug, getRecommendedDays } from "@/utils/cityTranslations";

export default function CatalogPage() {
    return (
        <AppProvider>
            <GlobalLayout>
                <CatalogContent />
            </GlobalLayout>
        </AppProvider>
    );
}

function CatalogContent() {
    const { t, language } = useAppContext();
    const [searchTerm, setSearchTerm] = useState("");
    const allCities = Object.keys(cityPhotos);

    const filteredCities = allCities.filter((cityId) => {
        const cityName = getTranslatedCityName(cityId, language).toLowerCase();
        return cityName.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="min-h-screen pt-24 pb-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center">
            
            {/* Search Section */}
            <div className="w-full max-w-3xl mx-auto mb-16 relative">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Search className="text-gray-400 group-focus-within:text-purple-400 transition-colors" size={24} />
                    </div>
                    <input
                        type="text"
                        placeholder={t.search_placeholder || "Search destinations..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#161616]/80 backdrop-blur-md text-white border border-white/10 rounded-full py-5 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all shadow-lg text-lg placeholder:text-gray-500"
                    />
                </div>
            </div>

            {/* Grid of Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {filteredCities.map((cityId, idx) => (
                    <Link href={`/catalog/${getCitySlug(cityId)}`} key={idx} className="group relative h-64 md:h-72 rounded-3xl overflow-hidden block border border-white/5 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-[0_10px_40px_rgba(168,85,247,0.2)]">
                        {/* Background Image */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url('${cityPhotos[cityId]}')` }}
                        />
                        {/* Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        
                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end h-full">
                            <h3 className="text-2xl font-black text-white mb-1 flex items-center gap-2 drop-shadow-lg">
                                <MapPin size={20} className="text-purple-400" />
                                {getTranslatedCityName(cityId, language)}
                            </h3>
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs">
                                    {t.itinerary_label_dynamic ? t.itinerary_label_dynamic.replace('{days}', getRecommendedDays(cityId).toString()) : `${getRecommendedDays(cityId)} ${t.landing_days || "Days"}`}
                                </span>
                            </div>
                        </div>

                        {/* Hover Overlay Icon */}
                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/10">
                            <Navigation size={18} />
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
}
