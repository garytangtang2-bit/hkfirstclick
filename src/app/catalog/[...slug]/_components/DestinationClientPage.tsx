"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { useAppContext } from "@/components/AppContext";
import { cityPhotos } from "@/data/cityPhotos";
import { 
    getTranslatedCityName, 
    getTranslatedData, 
    getRecommendedDays, 
    getCitySlug, 
    getOtherDestinations 
} from "@/utils/cityTranslations";
import { Navigation, Sparkles, ChevronRight, MapPin, Footprints, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LANG_NAME_TO_CODE } from "@/utils/langMapping";

interface Props {
    cityId: string;
    richData?: any;
    initialLang?: string;
    langCode?: string;
}

export default function DestinationClientPage({ cityId, richData, initialLang, langCode }: Props) {
    const router = useRouter();
    const citySlug = getCitySlug(cityId);

    const handleLanguageChange = (code: string) => {
        router.push(`/catalog/${code}/${citySlug}`);
    };

    return (
        <GlobalLayout initialLanguage={initialLang} onLanguageChange={handleLanguageChange}>
            <DestinationContent cityId={cityId} richData={richData} initialLang={initialLang} langCode={langCode} />
        </GlobalLayout>
    );
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=500&auto=format&fit=crop";

function DestinationContent({ cityId, richData, initialLang, langCode }: Props) {
    const { t, language, setLanguage } = useAppContext();
    const [activityImages, setActivityImages] = useState<Record<string, string>>({});
    const [fetchingImages, setFetchingImages] = useState<Record<string, boolean>>({});

    // Sync initial language from URL on mount
    useEffect(() => {
        if (initialLang && initialLang !== language) {
            setLanguage(initialLang);
        }
    }, [initialLang, language, setLanguage]);

    const fetchActivityImage = useCallback(async (cityName: string, keyword: string, activityId: string) => {
        if (activityImages[activityId] || fetchingImages[activityId]) return;
        setFetchingImages(prev => ({ ...prev, [activityId]: true }));

        try {
            const res = await fetch(`/api/activity-photo?keyword=${encodeURIComponent(keyword)}&city=${encodeURIComponent(cityName)}`);
            const data = await res.json();
            setActivityImages(prev => ({ ...prev, [activityId]: data.url || DEFAULT_IMAGE }));
        } catch {
            setActivityImages(prev => ({ ...prev, [activityId]: DEFAULT_IMAGE }));
        } finally {
            setFetchingImages(prev => ({ ...prev, [activityId]: false }));
        }
    }, [activityImages, fetchingImages]);
    
    // Default data from basic translations
    const basicPhotoUrl = cityPhotos[cityId] || "https://images.unsplash.com/photo-1508932924048-4165f60f6816";
    const basicCityName = getTranslatedCityName(cityId, language);
    const basicDescription = getTranslatedData(cityId, "description", language);
    const basicTopFood = getTranslatedData(cityId, "top_food", language);
    const basicMustVisit = getTranslatedData(cityId, "must_visit_spot", language);

    // Use translated rich data if available for the current language
    // Prioritize selected language, then original Chinese richData (no English fallback)
    const currentLangCode = langCode || LANG_NAME_TO_CODE[language] || 'en';
    const translatedRich = richData?.translations?.[currentLangCode] || null;
    // Only use translatedRich if it has daily_itinerary (full content), otherwise fall back to root
    const activeRich = (translatedRich?.daily_itinerary ? translatedRich : null) || richData;

    // Rich data overrides - ensure we use localized name/title if possible
    const cityName = basicCityName;
    
    // Logic: prefer translatedRich.seo_meta.title, then activeRich.seo_meta.title, then generated title
    const heroTitle = (translatedRich?.seo_meta?.title)
        ? translatedRich.seo_meta.title
        : (activeRich?.seo_meta?.title && activeRich !== richData)
            ? activeRich.seo_meta.title
            : (language === "繁體中文" || language === "TW")
                ? `${cityName} ${getRecommendedDays(cityId)}日完美行程攻略`
                : (t.guide_title_dynamic ? t.guide_title_dynamic.replace('{days}', getRecommendedDays(cityId).toString()) : `${getRecommendedDays(cityId)} ${t.landing_days || "Days Itinerary"}`).replace('{cityName}', cityName);

    const heroIntro = activeRich?.hero_section?.hook_intro || basicDescription;
    
    // Normalize cityId for photo lookup (matches keys in cityPhotos.ts)
    const normalizedCityId = getCitySlug(cityId).replace(/-/g, '');
    
    // Use static photo as primary if available, otherwise use a higher-relevance search format
    const heroPhotoUrl = cityPhotos[normalizedCityId] 
        ? cityPhotos[normalizedCityId]
        : (activeRich?.hero_section?.hero_image_keyword 
            ? `https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=1600&h=900&sig=${encodeURIComponent(activeRich.hero_section.hero_image_keyword)}` 
            : "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1600&h=900");

    const otherDestinations = getOtherDestinations(cityId, 6);

    // Trigger image fetching for all activities whenever richData changes
    useEffect(() => {
        if (!activeRich?.daily_itinerary) return;
        activeRich.daily_itinerary.forEach((dayData: any, dIdx: number) => {
            dayData.activities?.forEach((act: any, aIdx: number) => {
                if (act.image_search_keyword) {
                    const activityId = `${dIdx}-${aIdx}`;
                    fetchActivityImage(cityName, act.image_search_keyword, activityId);
                }
            });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeRich]);

    // Klook locale mapping
    const klookLocale: Record<string, string> = {
        en: 'en-US', zh: 'zh-TW', ja: 'ja', ko: 'ko',
        fr: 'fr', es: 'es', id: 'id', hi: 'en-US',
        pt: 'pt', ar: 'en-US', bn: 'en-US', ru: 'ru',
    };
    const klookLang = klookLocale[currentLangCode] || 'en-US';
    const klookBase = `https://tp.media/r?campaign_id=137&erid=2Vtzqw6jKWc&marker=706940&p=4110&trs=503142&u=`;
    const klookCity = klookBase + encodeURIComponent(`https://www.klook.com/${klookLang}/search/result/?query=${encodeURIComponent(cityName)}&sort=most_relevant&start=1&tab_key=2`);
    const klookHotelUrl = klookBase + encodeURIComponent(`https://www.klook.com/${klookLang}/hotels/?query=${encodeURIComponent(cityName)}`);
    const klookSimUrl = klookBase + encodeURIComponent(`https://www.klook.com/${klookLang}/search/result/?query=${encodeURIComponent(cityName + ' SIM card')}&sort=most_relevant&tab_key=0&start=1`);

    return (
        <div className="min-h-screen bg-[#0a0a0a] pb-24 text-white">

            {/* FULL-WIDTH HERO IMAGE with text overlay */}
            <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
                <img
                    src={heroPhotoUrl}
                    alt={cityName}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark gradients for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

                {/* Text overlaid on photo */}
                <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 pb-10 md:pb-16 max-w-[1120px] mx-auto left-0 right-0">
                    {/* Tags */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1.5 bg-purple-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-widest">
                            <MapPin size={13} /> <span>{cityName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/60 text-xs font-bold uppercase tracking-widest">
                            <Footprints size={13} /> <span>{t.guide_tag || "旅遊指南"}</span>
                        </div>
                    </div>

                    {/* Big Title */}
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight mb-5 text-white drop-shadow-2xl">
                        {heroTitle}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/60 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span>{t.cat_publish_date || "發布日期"}: {new Date().toLocaleDateString(
                                (() => {
                                    const localeMap: Record<string, string> = {
                                        'en': 'en-US', 'zh': 'zh-TW', 'ja': 'ja-JP', 'ko': 'ko-KR',
                                        'fr': 'fr-FR', 'es': 'es-ES', 'id': 'id-ID', 'hi': 'hi-IN',
                                        'pt': 'pt-BR', 'ar': 'ar-SA', 'bn': 'bn-BD', 'ru': 'ru-RU'
                                    };
                                    return localeMap[currentLangCode] || 'en-US';
                                })(),
                                { year: 'numeric', month: 'short', day: 'numeric' }
                            )}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-[8px] text-white font-bold">HK</div>
                            <span>HKfirstclick AI</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two-column layout: article | sidebar */}
            <div className="max-w-[1120px] mx-auto px-4 pt-12 flex gap-8 items-start">

            {/* Main Article Container */}
            <div className="flex-1 min-w-0 px-5 sm:px-8">

                <header className="mb-12">
                    {/* Intro Text */}
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium mb-0 opacity-90">
                        {heroIntro}
                    </p>
                </header>

                {/* Call to Action - Workspace Generation (Integrated into flow) */}
                <div className="bg-[#161616] border border-purple-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_15px_40px_rgba(168,85,247,0.1)] mb-20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] group-hover:bg-purple-600/20 transition-colors" />
                    <div>
                        <h3 className="text-2xl font-black mb-2 text-white">{t.cat_cta_title || "想根據這份行程微調嗎？"}</h3>
                        <p className="text-gray-400 font-medium">{t.cat_cta_desc || "複製這份範本到您的工作室，讓 AI 幫您客製化專屬的完美旅程。"}</p>
                    </div>
                    <Link href={`/workspace?dest=${encodeURIComponent(cityId)}`} className="shrink-0 w-full sm:w-auto">
                        <button className="w-full bg-purple-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-purple-500 transition-colors shadow-lg flex items-center justify-center gap-2">
                            <Sparkles size={20} /> 
                            {t.map_actions_generate || "1-Click Generate"}
                        </button>
                    </Link>
                </div>

                {/* Table of Contents */}
                {activeRich?.daily_itinerary && (
                    <div className="mb-20">
                        <h2 className="text-3xl font-black mb-6 border-b border-white/10 pb-4 inline-block">{t.cat_toc || "目錄"}</h2>
                        <ul className="space-y-3">
                            {activeRich.daily_itinerary.map((dayData: any, i: number) => {
                                const cleanTitle = dayData.day_title.replace(new RegExp(`^[^:：\\-]*?${dayData.day}[^:：\\-]*?[:：\\-]\\s*`), '');
                                return (
                                <li key={i}>
                                    <a
                                        href={`#day-${dayData.day}`}
                                        className="flex items-center gap-3 text-lg font-medium text-purple-400 hover:text-purple-300 transition-colors"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById(`day-${dayData.day}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }}
                                    >
                                        <div className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
                                        DAY {dayData.day}：{cleanTitle}
                                    </a>
                                </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {/* Itinerary Body */}
                <div className="space-y-24 mb-32">
                    {activeRich?.daily_itinerary ? (
                        activeRich.daily_itinerary.map((dayData: any, dIdx: number) => (
                            <section key={dIdx} id={`day-${dayData.day}`} style={{ scrollMarginTop: '100px' }}>
                                {/* Day Header */}
                                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-12 flex items-center gap-4 border-b border-white/5 pb-6">
                                    <span className="text-purple-500 inline-block">DAY {dayData.day}</span>
                                    <span>{dayData.day_title.replace(new RegExp(`^[^:：\\-]*?${dayData.day}[^:：\\-]*?[:：\\-]\\s*`), '')}</span>
                                </h2>

                                <div className="space-y-16">
                                    {dayData.activities.map((act: any, aIdx: number) => (
                                        <div key={aIdx} className="relative group">
                                            {/* Vertical Bar Title */}
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-2 h-8 lg:h-10 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                                                <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                                                    {act.spot_name}
                                                </h3>
                                            </div>

                                            {/* Location Image */}
                                            {act.image_search_keyword && (
                                                <div className="w-full aspect-[16/9] md:aspect-[3/1] rounded-2xl overflow-hidden border border-white/10 shadow-lg mb-8 bg-[#161616]">
                                                    {activityImages[`${dIdx}-${aIdx}`] ? (
                                                        <img
                                                            src={activityImages[`${dIdx}-${aIdx}`]}
                                                            alt={act.spot_name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <div className="w-10 h-10 border-2 border-purple-500/40 border-t-purple-500 rounded-full animate-spin" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Description Text */}
                                            <p className="text-gray-300 leading-relaxed mb-8 text-lg font-medium opacity-90">
                                                {act.rich_description}
                                            </p>

                                            {/* Details Table */}
                                            <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden mt-8 shadow-inner">
                                                <table className="w-full text-left text-sm md:text-base">
                                                    <tbody className="divide-y divide-white/5">
                                                        <tr className="hover:bg-white/5 transition-colors">
                                                            <th className="w-1/3 md:w-1/4 p-4 md:p-6 text-gray-400 font-bold bg-white/[0.02]">
                                                                {t.itinerary_time || "時間 / Time"}
                                                            </th>
                                                            <td className="p-4 md:p-6 text-white font-bold text-purple-300">{act.time_slot}</td>
                                                        </tr>
                                                        <tr className="hover:bg-white/5 transition-colors">
                                                            <th className="w-1/3 md:w-1/4 p-4 md:p-6 text-gray-400 font-bold bg-white/[0.02] whitespace-nowrap">
                                                                {t.itinerary_tip || "實用建議 / Tip"}
                                                            </th>
                                                            <td className="p-4 md:p-6 text-white leading-relaxed font-medium">
                                                                {act.practical_tip}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Klook ticket button — only for activities that require a purchased ticket */}
                                            {act.needsTicket && (
                                                <div className="mt-4">
                                                    <a
                                                        href={klookBase + encodeURIComponent(`https://www.klook.com/${klookLang}/search/result/?query=${encodeURIComponent(act.klookQuery || act.spot_name)}&sort=most_relevant&tab_key=0&start=1`)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 bg-[#EEDC00] hover:bg-[#ffe800] text-black font-bold text-sm px-5 py-3 rounded-xl transition-colors"
                                                    >
                                                        {t.aff_ticket || 'Buy Ticket'} — {act.spot_name}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))
                    ) : (
                        // Fallback to basic Preview Itinerary
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Array.from({ length: getRecommendedDays(cityId) }, (_, i) => {
                                const dayNum = i + 1;
                                let themeKey = "itinerary_theme_4";
                                if (dayNum === 1) themeKey = "itinerary_theme_1";
                                else if (dayNum === 2) themeKey = "itinerary_theme_2";
                                else if (dayNum === 3) themeKey = "itinerary_theme_3";

                                const theme = t[themeKey] || "Daily Highlights";
                                const highlight = dayNum === 2 ? basicMustVisit : (dayNum === 3 ? basicTopFood : (dayNum === 1 ? basicDescription : basicCityName));

                                return (
                                    <div key={dayNum} className="group relative bg-[#161616]/40 hover:bg-[#161616]/80 border border-white/5 hover:border-purple-500/30 rounded-[2rem] p-8 transition-all duration-300 shadow-xl overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors" />
                                        <div className="flex gap-6">
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-lg">
                                                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">DAY</span>
                                                    <span className="text-2xl font-black">{dayNum}</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Sparkles size={16} className="text-purple-400 opacity-60" />
                                                    <h4 className="text-purple-300/80 text-[10px] font-black uppercase tracking-[0.2em]">
                                                        {theme}
                                                    </h4>
                                                </div>
                                                <h3 className="text-white text-xl font-bold mb-3 group-hover:text-purple-200 transition-colors tracking-tight">
                                                    {highlight}
                                                </h3>
                                                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 italic opacity-60 group-hover:opacity-100 transition-opacity">
                                                    {t.itinerary_highlights || "Highlights"}: {dayNum === 2 ? `Explore the iconic ${basicMustVisit}.` : (dayNum === 3 ? `Savor the best local ${basicTopFood}.` : `Immerse yourself in ${basicCityName}.`)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* FAQ Section */}
                {activeRich?.daily_itinerary && (() => {
                    const days = activeRich.daily_itinerary.length;
                    const topSpots = activeRich.daily_itinerary
                        .flatMap((day: any) => day.activities?.slice(0, 1).map((a: any) => a.spot_name) ?? [])
                        .slice(0, 5)
                        .join(', ');

                    const faqs = [
                        { q: (t.cat_faq_q1 || '').replace('{cityName}', cityName), a: (t.cat_faq_a1 || '').replace(/{cityName}/g, cityName).replace(/{days}/g, String(days)) },
                        { q: (t.cat_faq_q2 || '').replace('{cityName}', cityName), a: (t.cat_faq_a2 || '').replace(/{cityName}/g, cityName).replace(/{days}/g, String(days)).replace('{spots}', topSpots) },
                        { q: (t.cat_faq_q3 || '').replace('{cityName}', cityName), a: (t.cat_faq_a3 || '').replace(/{cityName}/g, cityName) },
                        { q: (t.cat_faq_q4 || '').replace('{cityName}', cityName), a: (t.cat_faq_a4 || '').replace(/{cityName}/g, cityName) },
                        { q: (t.cat_faq_q5 || '').replace('{cityName}', cityName), a: (t.cat_faq_a5 || '').replace(/{cityName}/g, cityName) },
                    ];

                    return (
                        <section className="mb-32">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-10 tracking-tight">
                                {t.cat_faq_title || 'Frequently Asked Questions'}
                            </h2>
                            <div className="space-y-4">
                                {faqs.map((item, i) => (
                                    <FaqItem key={i} q={item.q} a={item.a} />
                                ))}
                            </div>
                        </section>
                    );
                })()}

                {/* Call To Action */}
                <div className="bg-gradient-to-br from-purple-900/60 via-[#161616] to-[#0A0A0A] border border-purple-500/30 rounded-[3rem] p-10 md:p-20 text-center shadow-[0_30px_100px_rgba(168,85,247,0.15)] mb-32 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full blur-[120px] opacity-10 pointer-events-none" />
                    
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight leading-tight">
                            {(t.landing_cta_title || "Create Your Own {cityName} Trip").replace("{cityName}", cityName)}
                        </h2>
                        <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto leading-relaxed opacity-80">
                            {t.landing_cta_desc || "Clone this itinerary template to your workspace, adjust the dates, and let our AI personalize the perfect schedule for you."}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-lg mx-auto">
                            <Link href={`/workspace?dest=${encodeURIComponent(cityId)}`} className="flex-1">
                                <button className="w-full bg-purple-600 text-white px-8 py-5 rounded-2xl font-black text-lg hover:bg-purple-500 transition-all hover:scale-105 active:scale-95 flex justify-center items-center gap-3 shadow-[0_15px_40px_rgba(168,85,247,0.4)]">
                                    <Sparkles size={22} /> 
                                    {t.map_actions_generate || "1-Click Generate"}
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Explore More Section - New Footer Navigation */}
                <section className="mb-24">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                        <div>
                            <h2 className="text-white text-3xl md:text-5xl font-black tracking-tight mb-4">
                                {t.cat_explore_more || "Explore More Destinations"}
                            </h2>
                            <p className="text-gray-400 text-lg max-w-xl font-medium">
                                {t.cat_explore_desc || "Discover other world-class cities and their perfectly planned itineraries."}
                            </p>
                        </div>
                        <Link href={`/catalog/${currentLangCode}`} className="group flex items-center gap-2 text-purple-400 font-bold hover:text-purple-300 transition-colors">
                            <span>{t.cat_view_all || "View All Catalog"}</span>
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {otherDestinations.map((destId) => {
                            const destName = getTranslatedCityName(destId, language);
                            const destSlug = getCitySlug(destId);
                            const normalizedDestId = destSlug.replace(/-/g, '');
                            const destPhoto = cityPhotos[normalizedDestId] || "https://images.unsplash.com/photo-1508932924048-4165f60f6816";
                            return (
                                <Link 
                                    key={destId} 
                                    href={`/catalog/${currentLangCode}/${destSlug}`}
                                    className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 shadow-xl"
                                >
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                                        style={{ backgroundImage: `url('${destPhoto}')` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:via-black/40 transition-all" />
                                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                                        <h4 className="text-white text-xl md:text-2xl font-black tracking-tight group-hover:text-purple-300 transition-colors">
                                            {destName}
                                        </h4>
                                        <div className="mt-2 flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                            <span>{t.cat_view_plan || "View Plan"}</span>
                                            <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Back Link */}
                <div className="text-center pt-8 border-t border-white/5">
                    <Link href={`/catalog/${currentLangCode}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-medium">
                        <Navigation size={16} />
                        <span>{t.btn_back || "Back to Catalog"}</span>
                    </Link>
                </div>

            </div>{/* end article */}

            {/* RIGHT SIDEBAR — sticky affiliate widgets */}
            <aside className="hidden xl:flex flex-col gap-4 w-[220px] shrink-0 sticky top-24 self-start">
                {/* Klook Activities */}
                <a href={klookCity} target="_blank" rel="noopener noreferrer"
                    className="block bg-[#161616] border border-white/10 rounded-2xl p-5 hover:border-yellow-500/40 transition-all group text-center">
                    <div className="text-white font-bold text-sm mb-1">{t.aff_activities || 'Activities & Tickets'}</div>
                    <div className="text-gray-400 text-xs mb-3">{cityName}</div>
                    <div className="bg-[#EEDC00] group-hover:bg-[#ffe800] text-black text-xs font-bold py-2 px-3 rounded-xl transition-colors">{t.aff_book || 'Book on Klook'}</div>
                </a>
                {/* Hotels */}
                <a href={klookHotelUrl} target="_blank" rel="noopener noreferrer"
                    className="block bg-[#161616] border border-white/10 rounded-2xl p-5 hover:border-red-500/40 transition-all group text-center">
                    <div className="text-white font-bold text-sm mb-1">{t.aff_hotels || 'Hotels'}</div>
                    <div className="text-gray-400 text-xs mb-3">{t.aff_hotels_desc || 'Best-price guarantee on every stay'}</div>
                    <div className="bg-[#FF5A5F] group-hover:bg-[#FF4A4F] text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors">{t.aff_book || 'Book on Klook'}</div>
                </a>
                {/* SIM Card */}
                <a href={klookSimUrl} target="_blank" rel="noopener noreferrer"
                    className="block bg-[#161616] border border-white/10 rounded-2xl p-5 hover:border-green-500/40 transition-all group text-center">
                    <div className="text-white font-bold text-sm mb-1">{t.aff_sim || 'Travel SIM Card'}</div>
                    <div className="text-gray-400 text-xs mb-3">{t.aff_sim_desc || 'Stay connected from day one'}</div>
                    <div className="bg-green-600 group-hover:bg-green-500 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors">{t.aff_search || 'Search Now'}</div>
                </a>
            </aside>

            </div>{/* end three-column flex */}

            {/* MOBILE — horizontal scroll banner (shown below xl) */}
            <div className="xl:hidden px-4 pb-8 -mt-8">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                    {[
                        { href: klookCity, label: t.aff_activities || 'Activities', color: 'bg-[#EEDC00] text-black' },
                        { href: klookHotelUrl, label: t.aff_hotels || 'Hotels', color: 'bg-[#FF5A5F] text-white' },
                        { href: klookSimUrl, label: t.aff_sim || 'SIM Card', color: 'bg-green-600 text-white' },
                    ].map(({ href, label, color }) => (
                        <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                            className={`shrink-0 ${color} font-bold text-sm px-4 py-3 rounded-2xl whitespace-nowrap`}>
                            {label}
                        </a>
                    ))}
                </div>
            </div>

        </div>
    );
}

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#111]">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/5 transition-colors"
            >
                <span className="text-white font-bold text-base md:text-lg leading-snug">{q}</span>
                <span className={`shrink-0 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-gray-400 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
                    +
                </span>
            </button>
            {open && (
                <div className="px-6 pb-6 text-gray-400 leading-relaxed text-base border-t border-white/5 pt-4">
                    {a}
                </div>
            )}
        </div>
    );
}
