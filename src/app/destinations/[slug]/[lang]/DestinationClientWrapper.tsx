"use client";

import { useState, useEffect } from "react";
import { AppProvider, useAppContext } from "@/components/AppContext";
import GlobalLayout from "@/components/GlobalLayout";
import { ArrowRight, PlaneTakeoff, Building2, MapPin, Route, Sparkles, Image as ImageIcon } from "lucide-react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

export default function DestinationClientWrapper({ itinerary, lang, slug }: { itinerary: any, lang: string, slug: string }) {
    return (
        <AppProvider>
            <GlobalLayout>
                <DestinationContent itinerary={itinerary} injectedLang={lang} slug={slug} />
            </GlobalLayout>
        </AppProvider>
    );
}

function DestinationContent({ itinerary, injectedLang, slug }: { itinerary: any, injectedLang: string, slug: string }) {
    const { t, currency, setLanguage } = useAppContext();
    const [activeDayIndex, setActiveDayIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    // Sync the context language to the SSG language route
    useEffect(() => {
        setLanguage(injectedLang === 'zh' ? '繁體中文' : injectedLang === 'ja' ? '日本語' : injectedLang === 'ko' ? '한국어' : 'English');
        setMounted(true);
    }, [injectedLang, setLanguage]);

    const stripMarkdownLinks = (text: string) => {
        if (!text) return "";
        return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    };

    if (!mounted || !itinerary) return <div className="min-h-screen bg-[#0E0E0E]" />;

    // Collect all activities for map pins
    const mapPins = itinerary.days?.flatMap((day: any, dIndex: number) =>
        (day.activities || []).map((act: any, aIndex: number) => ({
            id: `${dIndex}-${aIndex}`,
            title: act.title,
            location: act.location,
            dayIndex: dIndex,
            activityIndex: aIndex
        }))
    ).filter((pin: any) => pin.location) || [];

    return (
        <div className="bg-[#0E0E0E] min-h-screen w-full flex flex-col md:flex-row p-0 md:p-4 gap-4 overflow-hidden relative">
            {/* Left side: Scrollable Itinerary Timeline */}
            <div className="w-full md:w-[60%] lg:w-[50%] h-full flex flex-col bg-[#111111] md:rounded-[2rem] border-0 md:border md:border-white/5 overflow-hidden shadow-2xl relative premium-glass-card">

                {/* Hero Header */}
                <div className="relative h-64 md:h-80 w-full shrink-0">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://source.unsplash.com/1600x900/?${encodeURIComponent(itinerary.heroImageKeyword || slug || "city")}')` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent" />
                    <div className="absolute bottom-6 left-8 right-8">
                        <h1 className="text-4xl md:text-5xl font-black text-white glow-text mb-2 heading-premium">{itinerary.destination}</h1>
                        <p className="text-gray-300 font-medium">{itinerary.days?.length} {t.ws_days_duration || "Days"} • AI Curated Plan</p>
                    </div>
                </div>

                {/* Day Navigation Bar */}
                <div className="sticky top-0 z-30 bg-[#161616]/90 backdrop-blur-xl border-y border-white/10 px-6 flex items-center overflow-x-auto hide-scrollbar premium-glass-card">
                    <div className="flex items-center gap-6 min-w-max">
                        {itinerary.days?.map((day: any, i: number) => (
                            <button key={i} onClick={() => setActiveDayIndex(i)} className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeDayIndex === i ? "border-[#EEDC00] text-[#EEDC00]" : "border-transparent text-gray-400 hover:text-white"}`}>
                                {day.date || `Day ${i + 1}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Timeline Content */}
                <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
                    {itinerary.days?.map((day: any, dayIndex: number) => (
                        <div key={dayIndex} className={`pt-6 ${activeDayIndex === dayIndex ? "block" : "hidden"}`}>
                            <div className="px-6 sm:px-8">
                                {day?.daySummary && (
                                    <div className="mb-8 p-4 bg-gradient-to-r from-[#1A1A1A] to-[#161616] border border-white/5 rounded-2xl flex items-start gap-4">
                                        <div className="w-1 bg-[#EEDC00] self-stretch rounded-full" />
                                        <Sparkles size={18} className="text-[#EEDC00] mt-0.5 shrink-0" />
                                        <div>
                                            <h4 className="text-white font-bold text-sm mb-1">{t.ws_daily_theme || "Daily Theme"}</h4>
                                            <p className="text-gray-400 text-[13px] leading-relaxed">{day.daySummary}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-0">
                                    {day?.activities?.map((act: any, j: number) => (
                                        <div key={j} className="relative group">
                                            {/* Time and Marker */}
                                            <div className="flex gap-4 items-start break-inside-avoid">
                                                <div className="w-16 shrink-0 text-right pt-1">
                                                    <div className="text-white font-bold text-sm">{act.time?.split(' ')[0]}</div>
                                                </div>

                                                {/* Center Node */}
                                                <div className="flex flex-col items-center shrink-0 relative w-8 min-h-[100px] -ml-2">
                                                    <div className="w-8 h-8 rounded-full bg-[#FF7B89] flex items-center justify-center text-white font-bold text-sm z-10 shadow-[0_0_10px_rgba(255,123,137,0.3)] border-2 border-[#111]">
                                                        {j + 1}
                                                    </div>
                                                    {j < (day.activities.length - 1) && (
                                                        <div className="w-[2px] h-full bg-[#333] absolute top-8 bottom-0" />
                                                    )}
                                                </div>

                                                {/* Card Content */}
                                                <div className="flex-1 pb-8 w-full overflow-hidden">
                                                    <div className="bg-transparent mb-1 flex flex-col lg:flex-row items-start gap-5 w-full">
                                                        <div className="flex-1 flex flex-col items-start gap-3 w-full">
                                                            <h4 className="font-bold text-white text-lg flex items-center gap-2">
                                                                {act.title.includes('航班') || act.title.includes('出發') ? <PlaneTakeoff size={18} className="text-gray-400" /> : null}
                                                                {stripMarkdownLinks(act.title)}
                                                            </h4>
                                                            {act.location && (
                                                                <span className="inline-flex text-blue-400 text-xs items-center gap-1.5"><MapPin size={14} /> {act.location}</span>
                                                            )}
                                                            <p className="text-gray-400 text-sm leading-relaxed max-w-lg">{act.description}</p>

                                                            {((act.needsTicket === true) || (act.bookingUrl && act.bookingUrl !== "#")) && !act.isFood ? (
                                                                <div className="flex items-center gap-3 mt-2">
                                                                    {act.cost && act.cost !== "0" && act.cost.toLowerCase() !== "free" && (
                                                                        <span className="text-gray-400 text-xs bg-white/5 px-2 py-1 rounded">{act.cost}</span>
                                                                    )}
                                                                    <a href={act.bookingUrl && act.bookingUrl !== "#" ? act.bookingUrl : `https://tp.media/r?campaign_id=137&erid=2Vtzqw6jKWc&marker=706940&p=4110&trs=503142&u=${encodeURIComponent(`https://www.klook.com/en-US/search/result/?query=${act.title}&sort=most_relevant&start=1&tab_key=2`)}`}
                                                                        target="_blank" rel="noreferrer"
                                                                        className="bg-[#EEDC00] hover:bg-[#ffe800] text-black text-xs font-bold px-4 py-2 rounded-md shadow-lg transition-colors">
                                                                        {t.ws_book_klook || '預訂 Klook'}
                                                                    </a>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {j < (day.activities.length - 1) && act.transitToNext && (
                                                <div className="flex gap-4 items-start relative -mt-4 mb-4">
                                                    <div className="w-16 shrink-0" />
                                                    <div className="w-8 shrink-0 flex justify-center -ml-2 relative z-10">
                                                        <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center">
                                                            <Route size={12} className="text-[#EEDC00]" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 border-t border-b border-white/5 py-3 -ml-2 px-3 text-xs text-gray-400 flex items-center justify-between">
                                                        <span className="font-bold text-gray-300">{act.transitToNext.mode} <span className="font-mono text-[10px] ml-1 text-gray-500">{act.transitToNext.duration}</span></span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right side: Borderless Glowing Map */}
            <div className="hidden md:block md:w-[40%] lg:w-[50%] h-full rounded-[2rem] overflow-hidden relative shadow-[0_0_30px_rgba(238,220,0,0.1)] border border-white/5">
                <MapComponent
                    userTier="YEARLY"
                    selectedRegion="All"
                    hoveredCityName={null}
                    onCitySelect={() => { }}
                    onVisibleCitiesChange={() => { }}
                    flyToCityRef={{ current: () => { } }}
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0E0E0E] to-transparent pointer-events-none z-10" />
            </div>
        </div>
    );
}
