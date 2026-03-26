"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { AppProvider, useAppContext } from "@/components/AppContext";
import { useState, useEffect } from "react";
import { ArrowRight, Calendar, CheckCircle2, DollarSign, Globe2, Loader2, MapPin, Sparkles, Ticket, Download, Lightbulb, Target, Route, Luggage, Info, PlaneTakeoff, PlaneLanding, Clock, ChevronDown, Building2, Plus, Minus, Maximize, Image as ImageIcon, Coins, Camera, ShoppingBag, UtensilsCrossed, Waves, TreePine, Landmark, QrCode, X, MessageCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@/utils/supabase/client";
import AutocompleteInput from "@/components/AutocompleteInput";
import { LANG_NAME_TO_CODE } from "@/utils/langMapping";

export default function Workspace() {
    return (
        <AppProvider>
            <GlobalLayout>
                <WorkspaceContent />
            </GlobalLayout>
        </AppProvider>
    );
}

function LoadingOverlay({ t }: { t: Record<string, string> }) {
    const [step, setStep] = useState(0);
    const steps = [
        t.ws_loading_step1 || "✈️ Checking flight routes...",
        t.ws_loading_step2 || "🗺️ Mapping the best spots...",
        t.ws_loading_step3 || "🤖 AI is crafting your itinerary...",
        t.ws_loading_step4 || "✨ Adding local tips & hidden gems...",
    ];
    useEffect(() => {
        const timings = [800, 2500, 5000, 9000];
        const timers = timings.map((delay, i) => setTimeout(() => setStep(i + 1), delay));
        return () => timers.forEach(clearTimeout);
    }, []);
    const progress = [10, 30, 65, 90][Math.min(step, 3)];
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-sm text-center">
                <div className="w-14 h-14 border-4 border-[#EEDC00] border-t-transparent rounded-full animate-spin mx-auto mb-5"></div>
                <h3 className="text-xl font-bold text-white mb-1">{t.ws_loading_title || "AI 正在為您規劃專屬行程"}</h3>
                <p className="text-gray-500 mb-5 text-xs">{t.ws_loading_eta || "通常需要 15-30 秒"}</p>
                <div className="space-y-2 mb-6 text-left">
                    {steps.map((s, i) => (
                        <div key={i} className={`flex items-center gap-2 text-sm transition-all duration-500 ${i < step ? "text-[#EEDC00]" : i === step ? "text-white animate-pulse" : "text-gray-600"}`}>
                            <span className="text-base">{i < step ? "✓" : i === step ? "›" : "○"}</span>
                            {s}
                        </div>
                    ))}
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#EEDC00] rounded-full shadow-[0_0_10px_rgba(238,220,0,0.5)] transition-all duration-700" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
    );
}

function WorkspaceContent() {
    const { t, currency, language } = useAppContext();
    const supabase = createClient();

    // Time Dropdown Options (Hours & Minutes)
    const hourOptions = Array.from({ length: 24 }).map((_, i) => i.toString().padStart(2, '0'));
    const minuteOptions = Array.from({ length: 12 }).map((_, i) => (i * 5).toString().padStart(2, '0'));

    // Helper to extract hour and minute from the state string (e.g. "14:00")
    const parseTime = (timeStr: string) => {
        if (!timeStr || !timeStr.includes(':')) return { h: "00", m: "00" };
        const [h, m] = timeStr.split(':');
        return { h, m };
    };

    // Helper to strip markdown links [label](url) -> label
    const stripMarkdownLinks = (text: string) => {
        if (!text) return "";
        return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    };

    // Format Date string aesthetically e.g. "10月15日 (週二)" or "Oct 15 (Tue)"
    const formatDateString = (dateString: string) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            const localeMap: Record<string, string> = {
                "English": "en-US",
                "繁體中文": "zh-TW",
                "日本語": "ja-JP",
                "한국어": "ko-KR",
                "Français": "fr-FR",
                "Español": "es-ES",
                "Bahasa Indonesia": "id-ID",
                "हिन्दी": "hi-IN",
                "Português": "pt-PT",
                "العربية": "ar-SA",
                "বাংলা": "bn-BD",
                "Русский": "ru-RU",
            };
            const locale = localeMap[language] || "en-US";
            const options: Intl.DateTimeFormatOptions = {
                year: "numeric",
                month: "short",
                day: "numeric",
            };
            return new Intl.DateTimeFormat(locale, options).format(date);
        } catch {
            return dateString;
        }
    };

    // Form States (Base Constraints)
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [dates, setDates] = useState({ start: "", end: "" });
    const [flightTimes, setFlightTimes] = useState({ arrival: "14:00", departure: "18:00" });
    const [hotelInfo, setHotelInfo] = useState("");

    // Group Composition States
    const [groupSize, setGroupSize] = useState({ adults: 2, children: 0 });
    const [hasElders, setHasElders] = useState(false);
    const [accessibility, setAccessibility] = useState(false);

    // Personal Preferences States  
    const [style, setStyle] = useState("balanced"); // Pace
    const [transportation, setTransportation] = useState("public");
    const [purposes, setPurposes] = useState<string[]>([]);
    const [budget, setBudget] = useState("");
    const [dietaryTags, setDietaryTags] = useState<string[]>([]);
    const [dietaryOther, setDietaryOther] = useState("");
    const [mustVisit, setMustVisit] = useState("");
    const [requests, setRequests] = useState("");

    const [loading, setLoading] = useState(false);
    const [activeDayIndex, setActiveDayIndex] = useState(-1);
    const [wizardStep, setWizardStep] = useState(1); // 1, 2, or 3
    const [error, setError] = useState("");
    const [showFieldErrors, setShowFieldErrors] = useState(false);
    const [itinerary, setItinerary] = useState<any>(null);
    const [itineraryId, setItineraryId] = useState<string | null>(null);
    const [chatMessage, setChatMessage] = useState("");

    // Tier State for paid features
    const [userTier, setUserTier] = useState<string | null>(null);

    // Image Caching States
    const [activityImages, setActivityImages] = useState<Record<string, string>>({});
    const [imageSources, setImageSources] = useState<Record<string, string>>({});
    const [fetchingImages, setFetchingImages] = useState<Record<string, boolean>>({});
    const [showQR, setShowQR] = useState(false);

    const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=500&auto=format&fit=crop";

    const fetchActivityImage = async (cityName: string, keyword: string, fallbackKeyword: string, activityId: string) => {
        if (activityImages[activityId] || fetchingImages[activityId]) return;
        setFetchingImages(prev => ({ ...prev, [activityId]: true }));

        const setImageData = (url: string, source: string) => {
            setActivityImages(prev => ({ ...prev, [activityId]: url }));
            setImageSources(prev => ({ ...prev, [activityId]: source }));
        };

        try {
            const res = await fetch(`/api/activity-photo?keyword=${encodeURIComponent(keyword)}&city=${encodeURIComponent(cityName)}`);
            const data = await res.json();
            setImageData(data.url || DEFAULT_IMAGE, data.url ? "API" : "Default");
        } catch (e) {
            console.error("Failed to fetch image for " + keyword, e);
            setImageData(DEFAULT_IMAGE, "Default");
        } finally {
            setFetchingImages(prev => ({ ...prev, [activityId]: false }));
        }
    };

    // Trigger image fetches when the day changes
    useEffect(() => {
        if (activeDayIndex >= 0 && itinerary?.days?.[activeDayIndex]?.activities) {
            const cityName = itinerary.destination || destination || "";
            itinerary.days[activeDayIndex].activities.forEach((act: any, idx: number) => {
                const activityId = `${activeDayIndex}-${idx}-${act.title}`;
                // Skip if it is hotel or flight departure
                if (act.title.includes('航班') || act.title.includes('出發') || act.title.includes('住宿') || act.title.includes('入住') || act.title.includes('機場')) {
                    return;
                }
                const primaryKeyword = act.imageSearchKeyword || act.location || act.title;
                const fallbackKeyword = `${cityName} ${primaryKeyword}`;
                fetchActivityImage(cityName, primaryKeyword, fallbackKeyword, activityId);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeDayIndex, itinerary]);

    const SP_PURPOSES = [
        { id: "sightseeing", label: t.purp_sight, icon: "Camera" },
        { id: "shopping", label: t.purp_shop, icon: "ShoppingBag" },
        { id: "food", label: t.purp_food, icon: "UtensilsCrossed" },
        { id: "relax", label: t.purp_relax, icon: "Waves" },
        { id: "nature", label: t.purp_nature, icon: "TreePine" },
        { id: "history", label: t.purp_hist, icon: "Landmark" },
    ];

    const getPromptLanguage = (lang: string) => {
        // Return BCP-47 language code to match backend nativeLanguagePrompts keys
        return LANG_NAME_TO_CODE[lang] || "en";
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const id = queryParams.get("id");
        const destParam = queryParams.get("dest");
        const mustVisitParam = queryParams.get("mustVisit");

        // Pre-fill destination from food/attractions/catalog page
        if (destParam) setDestination(destParam);
        // Pre-fill must-visit spots from food/attractions page
        if (mustVisitParam) setMustVisit(mustVisitParam);

        if (id) {
            const fetchItinerary = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`/api/itineraries?id=${id}`);
                    const data = await res.json();
                    if (res.ok && data.itinerary) {
                        setItinerary(data.itinerary.itinerary_data);
                        setItineraryId(data.itinerary.id);
                        if (data.itinerary.destination) setDestination(data.itinerary.destination);
                        if (data.itinerary.start_date) setDates(prev => ({ ...prev, start: data.itinerary.start_date }));
                        if (data.itinerary.end_date) setDates(prev => ({ ...prev, end: data.itinerary.end_date }));
                    }
                } catch (err) {
                    console.error("Failed to load itinerary", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchItinerary();
        }

        const fetchTier = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (session?.user?.id) {
                const { data } = await supabase
                    .from("profiles")
                    .select("tier")
                    .eq("id", session.user.id)
                    .single();
                if (data?.tier) setUserTier(data.tier);
            }
        };
        fetchTier();

    }, [supabase]);

    const handleGenerate = async () => {
        if (!origin || !destination || !dates.start || !dates.end) {
            setError(t.err_empty);
            return;
        }

        // 🚨 Frontend Limitation Check: 5 Days for Free Users
        const startDate = new Date(dates.start);
        const endDate = new Date(dates.end);
        const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;

        if ((!userTier || userTier === "TRIAL" || userTier === "Casual") && tripDays > 5) {
            setError(t.ws_trip_limit || "Free users are limited to 5-day itineraries. Upgrade to unlock longer trips!");
            // Scroll to top to see error
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setError("");
        setLoading(true);

        try {
            // Getting the current auth session to pass to the backend
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            // Step 2: Call the backend Next.js API route that handles logic securely
            const res = await fetch("/api/generate-trip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` })
                },
                body: JSON.stringify({
                    origin,
                    destination,
                    dates,
                    flightTimes,
                    hotelInfo,
                    preferences: {
                        style,
                        transportation,
                        purposes,
                        budget,
                        requests,
                        mustVisit,
                        groupSize,
                        hasElders,
                        accessibility,
                        dietary: dietaryTags.length > 0 || dietaryOther ? `${dietaryTags.join(', ')} ${dietaryOther ? `(${dietaryOther})` : ''}` : "無"
                    },
                    currency,
                    uiLanguage: getPromptLanguage(language),
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Generation failed");

            setItinerary(data.itinerary);
            if (data.itineraryId) setItineraryId(data.itineraryId);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const togglePurpose = (id: string) => {
        if (purposes.includes(id)) {
            setPurposes(purposes.filter((p) => p !== id));
        } else {
            if (purposes.length < 3) setPurposes([...purposes, id]);
        }
    };

    const calculateTotalBudget = (itineraryData: any) => {
        if (!itineraryData) return 0;
        let total = 0;

        // Add flights
        if (itineraryData.flights?.outbound?.estCostNumber) total += itineraryData.flights.outbound.estCostNumber;
        if (itineraryData.flights?.return?.estCostNumber) total += itineraryData.flights.return.estCostNumber;

        // Add hotel
        if (itineraryData.hotel?.estCostNumber) total += itineraryData.hotel.estCostNumber;

        // Add activities
        if (itineraryData.days) {
            itineraryData.days.forEach((day: any) => {
                if (day.activities) {
                    day.activities.forEach((act: any) => {
                        if (act.costNumber) total += act.costNumber;
                    });
                }
            });
        }

        return total;
    };

    const handleUpdateItinerary = async () => {
        if (!chatMessage.trim() || !itinerary) return;

        setLoading(true);
        setError("");

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch("/api/update-trip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` })
                },
                body: JSON.stringify({
                    currentItinerary: itinerary,
                    itineraryId,
                    userMessage: chatMessage,
                    uiLanguage: getPromptLanguage(language),
                    currency
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Update failed");

            setItinerary(data.itinerary);
            if (data.itineraryId) setItineraryId(data.itineraryId);
            setChatMessage(""); // clear chat after success
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="workspace-container">
            {loading && <LoadingOverlay t={t} />}
            <div className="max-w-7xl mx-auto px-6 py-12 md:px-12 min-h-screen">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left Form / Chat Panel */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-8 lg:sticky lg:top-6 lg:h-max z-20 print:hidden">
                        {/* Promotional / Affiliate Block */}
                        {!itinerary && (
                            <div className="bg-[#121212] border border-[#2A2A35] rounded-2xl p-6 relative overflow-hidden group hover:border-[#3A3A45] transition-colors shadow-lg shadow-black/50">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#EEDC00]/10 to-transparent rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none group-hover:from-[#EEDC00]/20 transition-colors"></div>
                                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2 heading-premium">
                                    <Luggage size={18} className="text-[#EEDC00]" /> {t.banner_title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6 text-muted-premium">
                                    {t.banner_desc}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <a
                                        href="https://kiwi.tpo.mx/KwEXKMTT?erid=2VtzquYMmhE"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-white hover:bg-gray-100 text-black font-bold py-3 px-4 rounded-xl text-sm transition-colors text-center"
                                    >
                                        {t.banner_btn_flight}
                                    </a>
                                    <a
                                        href="https://klook.tpo.mx/CUx1vPPs?erid=2Vtzqw6jKWc"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-[#FF5A5F] hover:bg-[#FF4A4F] text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors text-center"
                                    >
                                        {t.banner_btn_hotel}
                                    </a>
                                </div>
                            </div>
                        )}
                        {!itinerary ? (
                            <>
                                <div>
                                    {/* --- WIZARD PROGRESS BAR --- */}
                                    <div className="flex items-center justify-between mb-8 px-2 relative">
                                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -z-10 -translate-y-1/2"></div>
                                        <div className="absolute top-1/2 left-0 h-[2px] bg-[#EEDC00] -z-10 -translate-y-1/2 transition-[width] duration-500" style={{ width: `${(wizardStep - 1) * 50}%` }}></div>

                                        {[1, 2, 3].map((step) => (
                                            <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors border-2 ${wizardStep >= step ? 'bg-[#EEDC00] text-black border-[#EEDC00] shadow-[0_0_15px_rgba(238,220,0,0.3)]' : 'bg-[#161616] text-gray-500 border-white/10'}`}>
                                                {step}
                                            </div>
                                        ))}
                                    </div>

                                    {/* --- STEP 1: BASE CONSTRAINTS --- */}
                                    {wizardStep === 1 && (
                                        <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 md:p-8 space-y-8 premium-glass-card animate-in fade-in slide-in-from-right-4 duration-500">
                                            <div>
                                                <h3 className="font-extrabold text-[#F8F9FA] text-2xl heading-premium mb-1">
                                                    {t.ws_section1 || "1. Base Constraints"}
                                                </h3>
                                                <p className="text-[#A0A0A0] text-sm">{t.ws_where_when || "Where and when are we going?"}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2 text-muted-premium">
                                                    <Globe2 size={14} /> {t.input_origin}
                                                    <span className="text-red-500">*</span>
                                                    {showFieldErrors && !origin && <span className="text-red-400 text-xs font-normal normal-case tracking-normal ml-1">{t.err_required || "Required"}</span>}
                                                </label>
                                                <div className={showFieldErrors && !origin ? "ring-2 ring-red-500/60 rounded-xl" : ""}>
                                                <AutocompleteInput
                                                    value={origin}
                                                    onChange={setOrigin}
                                                    placeholder={t.input_origin_ph}
                                                    icon={<PlaneTakeoff size={18} />}
                                                    popularLabel={t.ws_popular_airports}
                                                    customLocationLabel={t.ws_custom_location}
                                                />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2 text-muted-premium">
                                                    <MapPin size={14} /> {t.input_dest}
                                                    <span className="text-red-500">*</span>
                                                    {showFieldErrors && !destination && <span className="text-red-400 text-xs font-normal normal-case tracking-normal ml-1">{t.err_required || "Required"}</span>}
                                                </label>
                                                <div className={showFieldErrors && !destination ? "ring-2 ring-red-500/60 rounded-xl" : ""}>
                                                <AutocompleteInput
                                                    value={destination}
                                                    onChange={setDestination}
                                                    placeholder={t.input_dest_ph}
                                                    icon={<PlaneLanding size={18} />}
                                                    popularLabel={t.ws_popular_airports}
                                                    customLocationLabel={t.ws_custom_location}
                                                />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2 text-muted-premium">
                                                        <Calendar size={14} /> {t.date_start}
                                                        <span className="text-red-500">*</span>
                                                        {showFieldErrors && !dates.start && <span className="text-red-400 text-xs font-normal normal-case tracking-normal ml-1">{t.err_required || "Required"}</span>}
                                                    </label>
                                                    <div className="relative group">
                                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10 text-gray-400 group-hover:text-white transition-colors text-muted-premium">
                                                            <Calendar size={18} />
                                                        </div>
                                                        <input
                                                            type="date"
                                                            value={dates.start}
                                                            onChange={(e) => setDates({ ...dates, start: e.target.value })}
                                                            className={`w-full bg-[#0E0E0E] min-h-[50px] border rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] focus:ring-2 focus:ring-[#EEDC00]/20 hover:border-white/30 hover:bg-[#111] transition-colors duration-150 relative z-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit]:text-transparent ${showFieldErrors && !dates.start ? 'border-red-500/60' : 'border-white/10'}`}
                                                        />
                                                        <div className={`absolute left-11 top-1/2 -translate-y-1/2 pointer-events-none z-0 font-medium ${dates.start ? 'text-white' : 'text-gray-400'}`}>
                                                            <span>{formatDateString(dates.start) || t.date_ph}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2 text-muted-premium">
                                                        <Calendar size={14} /> {t.date_end}
                                                        <span className="text-red-500">*</span>
                                                        {showFieldErrors && !dates.end && <span className="text-red-400 text-xs font-normal normal-case tracking-normal ml-1">{t.err_required || "Required"}</span>}
                                                    </label>
                                                    <div className="relative group">
                                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10 text-gray-400 group-hover:text-white transition-colors text-muted-premium">
                                                            <Calendar size={18} />
                                                        </div>
                                                        <input
                                                            type="date"
                                                            value={dates.end}
                                                            min={dates.start}
                                                            onChange={(e) => setDates({ ...dates, end: e.target.value })}
                                                            className={`w-full bg-[#0E0E0E] min-h-[50px] border rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] focus:ring-2 focus:ring-[#EEDC00]/20 hover:border-white/30 hover:bg-[#111] transition-colors duration-150 relative z-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit]:text-transparent ${showFieldErrors && !dates.end ? 'border-red-500/60' : 'border-white/10'}`}
                                                        />
                                                        <div className={`absolute left-11 top-1/2 -translate-y-1/2 pointer-events-none z-0 font-medium ${dates.end ? 'text-white' : 'text-gray-400'}`}>
                                                            <span>{formatDateString(dates.end) || t.date_ph}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2 text-muted-premium">
                                                        <Clock size={14} /> {t.input_arrival || "Day 1 Arrival Time"}
                                                    </label>
                                                    <div className="relative group grid grid-cols-2 gap-2">
                                                        <div className="relative">
                                                            <select
                                                                value={parseTime(flightTimes.arrival).h}
                                                                onChange={(e) => setFlightTimes({ ...flightTimes, arrival: `${e.target.value}:${parseTime(flightTimes.arrival).m}` })}
                                                                className="w-full bg-[#0E0E0E] min-h-[50px] border border-white/10 rounded-xl pl-4 pr-8 py-3 text-white font-medium focus:outline-none focus:border-[#EEDC00] focus:ring-2 focus:ring-[#EEDC00]/20 hover:border-white/30 hover:bg-[#111] transition-colors duration-150 appearance-none cursor-pointer text-center"
                                                            >
                                                                {hourOptions.map(h => <option key={`arr-h-${h}`} value={h} className="bg-[#161616] premium-glass-card">{h}</option>)}
                                                            </select>
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-white transition-colors text-muted-premium">
                                                                <span className="text-xs">{t.ws_hour}</span>
                                                            </div>
                                                        </div>
                                                        <div className="relative">
                                                            <select
                                                                value={parseTime(flightTimes.arrival).m}
                                                                onChange={(e) => setFlightTimes({ ...flightTimes, arrival: `${parseTime(flightTimes.arrival).h}:${e.target.value}` })}
                                                                className="w-full bg-[#0E0E0E] min-h-[50px] border border-white/10 rounded-xl pl-4 pr-8 py-3 text-white font-medium focus:outline-none focus:border-[#EEDC00] focus:ring-2 focus:ring-[#EEDC00]/20 hover:border-white/30 hover:bg-[#111] transition-colors duration-150 appearance-none cursor-pointer text-center"
                                                            >
                                                                {minuteOptions.map(m => <option key={`arr-m-${m}`} value={m} className="bg-[#161616] premium-glass-card">{m}</option>)}
                                                            </select>
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-white transition-colors text-muted-premium">
                                                                <span className="text-xs">{t.ws_minute}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2 text-muted-premium">
                                                        <Clock size={14} /> {t.input_departure || "Last Day Departure"}
                                                    </label>
                                                    <div className="relative group grid grid-cols-2 gap-2">
                                                        <div className="relative">
                                                            <select
                                                                value={parseTime(flightTimes.departure).h}
                                                                onChange={(e) => setFlightTimes({ ...flightTimes, departure: `${e.target.value}:${parseTime(flightTimes.departure).m}` })}
                                                                className="w-full bg-[#0E0E0E] min-h-[50px] border border-white/10 rounded-xl pl-4 pr-8 py-3 text-white font-medium focus:outline-none focus:border-[#EEDC00] focus:ring-2 focus:ring-[#EEDC00]/20 hover:border-white/30 hover:bg-[#111] transition-colors duration-150 appearance-none cursor-pointer text-center"
                                                            >
                                                                {hourOptions.map(h => <option key={`dep-h-${h}`} value={h} className="bg-[#161616] premium-glass-card">{h}</option>)}
                                                            </select>
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-white transition-colors text-muted-premium">
                                                                <span className="text-xs">{t.ws_hour}</span>
                                                            </div>
                                                        </div>
                                                        <div className="relative">
                                                            <select
                                                                value={parseTime(flightTimes.departure).m}
                                                                onChange={(e) => setFlightTimes({ ...flightTimes, departure: `${parseTime(flightTimes.departure).h}:${e.target.value}` })}
                                                                className="w-full bg-[#0E0E0E] min-h-[50px] border border-white/10 rounded-xl pl-4 pr-8 py-3 text-white font-medium focus:outline-none focus:border-[#EEDC00] focus:ring-2 focus:ring-[#EEDC00]/20 hover:border-white/30 hover:bg-[#111] transition-colors duration-150 appearance-none cursor-pointer text-center"
                                                            >
                                                                {minuteOptions.map(m => <option key={`dep-m-${m}`} value={m} className="bg-[#161616] premium-glass-card">{m}</option>)}
                                                            </select>
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-white transition-colors text-muted-premium">
                                                                <span className="text-xs">{t.ws_minute}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2 text-muted-premium">
                                                    <MapPin size={14} /> {t.input_hotel || "Exact Hotel Name or Address"}
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10 text-gray-400 group-hover:text-white transition-colors text-muted-premium">
                                                        <MapPin size={18} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={hotelInfo}
                                                        onChange={(e) => setHotelInfo(e.target.value)}
                                                        placeholder={t.input_hotel_ph || "e.g., APA Hotel Shinjuku..."}
                                                        className="w-full bg-[#0E0E0E] min-h-[50px] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] focus:ring-2 focus:ring-[#EEDC00]/20 hover:border-white/30 hover:bg-[#111] transition-colors duration-150 relative z-0 text-ellipsis overflow-hidden whitespace-nowrap"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* --- STEP 2: GROUP & VIBE --- */}
                                    {wizardStep === 2 && (
                                        <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 md:p-8 space-y-8 premium-glass-card animate-in fade-in slide-in-from-right-4 duration-500">
                                            <div>
                                                <h3 className="font-extrabold text-[#F8F9FA] text-2xl heading-premium mb-1">
                                                    {t.q_group_title || "2. Group & Vibe"}
                                                </h3>
                                                <p className="text-[#A0A0A0] text-sm">{t.ws_who_travel || "Who is coming and how do we travel?"}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center justify-between bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3">
                                                    <span className="text-gray-300 text-sm font-medium">{t.q_group_adults || "Adults"}</span>
                                                    <input type="number" min="1" max="20" value={groupSize.adults} onChange={(e) => setGroupSize({ ...groupSize, adults: parseInt(e.target.value) || 1 })} className="bg-transparent text-[#EEDC00] w-12 outline-none text-right font-bold" />
                                                </div>
                                                <div className="flex items-center justify-between bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3">
                                                    <span className="text-gray-300 text-sm font-medium">{t.q_group_kids || "Children"}</span>
                                                    <input type="number" min="0" max="20" value={groupSize.children} onChange={(e) => setGroupSize({ ...groupSize, children: parseInt(e.target.value) || 0 })} className="bg-transparent text-[#EEDC00] w-12 outline-none text-right font-bold" />
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-2">
                                                <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#0E0E0E] cursor-pointer hover:border-white/30 transition-colors">
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-200">{t.ws_elders_title}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5 text-muted-premium">{t.ws_elders_desc}</div>
                                                    </div>
                                                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                                        <input type="checkbox" checked={hasElders} onChange={(e) => setHasElders(e.target.checked)} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-[#0E0E0E] appearance-none cursor-pointer scale-110 checked:border-[#EEDC00] checked:right-0 right-6 transition-colors z-10" />
                                                        <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${hasElders ? 'bg-[#EEDC00]' : 'bg-gray-600'}`}></div>
                                                    </div>
                                                </label>

                                                <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#0E0E0E] cursor-pointer hover:border-white/30 transition-colors">
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-200">{t.ws_access_title}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5 text-muted-premium">{t.ws_access_desc}</div>
                                                    </div>
                                                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                                        <input type="checkbox" checked={accessibility} onChange={(e) => setAccessibility(e.target.checked)} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-[#0E0E0E] appearance-none cursor-pointer scale-110 checked:border-[#EEDC00] checked:right-0 right-6 transition-colors z-10" />
                                                        <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${accessibility ? 'bg-[#EEDC00]' : 'bg-gray-600'}`}></div>
                                                    </div>
                                                </label>
                                            </div>

                                            <div className="pt-4 border-t border-white/5">
                                                <label className="text-sm font-bold text-[#F8F9FA] mb-3 block">{t.ws_pace_label}</label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {[
                                                        { id: "relaxed", title: t.ws_pace_relaxed },
                                                        { id: "balanced", title: t.ws_pace_balanced },
                                                        { id: "packed", title: t.ws_pace_packed }
                                                    ].map(s => (
                                                        <button
                                                            key={s.id}
                                                            onClick={() => setStyle(s.id)}
                                                            className={`p-3 rounded-xl border text-sm font-bold transition-colors shadow-sm ${style === s.id
                                                                ? "bg-[#EEDC00]/10 border-[#EEDC00] text-[#EEDC00]"
                                                                : "bg-[#0E0E0E] border-white/10 text-gray-400 hover:border-white/30"
                                                                }`}
                                                        >
                                                            {s.title}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <label className="text-sm font-bold text-[#F8F9FA] mb-3 block">{t.ws_transport_label}</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[
                                                        { id: "public", title: t.ws_transport_public },
                                                        { id: "taxi", title: t.ws_transport_taxi }
                                                    ].map(t_pref => (
                                                        <button
                                                            key={t_pref.id}
                                                            onClick={() => setTransportation(t_pref.id)}
                                                            className={`p-3 rounded-xl border text-sm font-bold transition-colors shadow-sm ${transportation === t_pref.id
                                                                ? "bg-[#EEDC00]/10 border-[#EEDC00] text-[#EEDC00]"
                                                                : "bg-[#0E0E0E] border-white/10 text-gray-400 hover:border-white/30"
                                                                }`}
                                                        >
                                                            {t_pref.title}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <label className="text-sm font-bold text-[#F8F9FA] mb-3 block">{t.q2_title}</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {SP_PURPOSES.map(p => (
                                                        <button
                                                            key={p.id}
                                                            onClick={() => togglePurpose(p.id)}
                                                            className={`px-4 py-2 rounded-full border text-sm font-bold transition-colors flex items-center gap-2 shadow-sm ${purposes.includes(p.id)
                                                                ? "bg-[#EEDC00] border-[#EEDC00] text-black"
                                                                : "bg-[#0E0E0E] border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                                                                }`}
                                                        >
                                                            {p.id === "sightseeing" && <Camera size={14} />}
                                            {p.id === "shopping" && <ShoppingBag size={14} />}
                                            {p.id === "food" && <UtensilsCrossed size={14} />}
                                            {p.id === "relax" && <Waves size={14} />}
                                            {p.id === "nature" && <TreePine size={14} />}
                                            {p.id === "history" && <Landmark size={14} />}
                                            {p.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* --- STEP 3: PREFERENCES & SUBMIT --- */}
                                    {wizardStep === 3 && (
                                        <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 md:p-8 space-y-8 premium-glass-card animate-in fade-in slide-in-from-right-4 duration-500">
                                            <div>
                                                <h3 className="font-extrabold text-[#F8F9FA] text-2xl heading-premium mb-1 flex items-center gap-2">
                                                    <Sparkles size={24} className="text-[#EEDC00]" /> {t.pref_title || "3. Strict Preferences"}
                                                </h3>
                                                <p className="text-[#A0A0A0] text-sm">{t.ws_diet_must || "Any dietary restrictions or absolute must-haves?"}</p>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-300 mb-3 block">{t.ws_diet_label || t.q_diet_title}</label>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {(t.diet_tags ? t.diet_tags.split(',') : ["不吃牛", "全素", "蛋奶素", "不吃生食", "海鮮過敏", "不喝酒", "清真飲食"]).map((tag: string) => (
                                                        <button
                                                            key={tag}
                                                            onClick={() => setDietaryTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                                                            className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-colors flex items-center gap-1.5 ${dietaryTags.includes(tag)
                                                                ? "bg-red-500/20 border-red-500 text-red-400"
                                                                : "bg-[#0E0E0E] border-white/10 text-gray-400 hover:border-white/30"
                                                                }`}
                                                        >
                                                            {tag.trim()}
                                                        </button>
                                                    ))}
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder={t.ws_diet_other_ph || t.q_diet_ph}
                                                    value={dietaryOther}
                                                    onChange={(e) => setDietaryOther(e.target.value)}
                                                    className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#EEDC00] transition-colors"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-300 mb-3 block">{t.ws_must_label}</label>
                                                <textarea
                                                    placeholder={t.ws_must_ph}
                                                    value={mustVisit}
                                                    onChange={(e) => setMustVisit(e.target.value)}
                                                    rows={2}
                                                    className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] transition-colors resize-none text-sm"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* --- WIZARD NAVIGATION BUTTONS --- */}
                                    <div className="pt-8 flex gap-4">
                                        {wizardStep > 1 && (
                                            <button
                                                onClick={() => { setError(""); setWizardStep(wizardStep - 1); }}
                                                className="px-6 py-4 rounded-xl font-bold bg-[#161616] text-[#A0A0A0] hover:text-white hover:bg-white/5 border border-white/10 transition-colors w-1/3 text-center"
                                            >
                                                {t.ws_back || "Back"}
                                            </button>
                                        )}

                                        {wizardStep < 3 ? (
                                            <button
                                                onClick={() => {
                                                    if (wizardStep === 1 && (!origin || !destination || !dates.start || !dates.end)) {
                                                        setShowFieldErrors(true);
                                                        setError(t.err_empty || "Please fill in all required fields.");
                                                        return;
                                                    }
                                                    setShowFieldErrors(false);
                                                    setError("");
                                                    setWizardStep(wizardStep + 1);
                                                }}
                                                className={`py-4 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-colors flex justify-center items-center ${wizardStep === 1 ? 'w-full' : 'w-2/3'}`}
                                            >
                                                {t.ws_next_step || "Next Step"} <ArrowRight size={18} className="ml-2" />
                                            </button>
                                        ) : (() => {
                                            const calculateDeductCredits = (start: string, end: string) => {
                                                if (!start || !end) return 5;
                                                try {
                                                    const startDate = new Date(start);
                                                    const endDate = new Date(end);
                                                    const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
                                                    if (tripDays <= 10) return 5;
                                                    return 5 + Math.max(0, tripDays - 10);
                                                } catch {
                                                    return 5;
                                                }
                                            };
                                            const points = calculateDeductCredits(dates.start, dates.end);
                                            return (
                                                <button
                                                    onClick={handleGenerate}
                                                    disabled={loading}
                                                    className="w-2/3 py-4 rounded-xl font-bold bg-[#EEDC00] text-black hover:bg-[#ffe800] transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(238,220,0,0.3)] disabled:opacity-50"
                                                >
                                                    {loading ? (
                                                        <><Loader2 size={18} className="animate-spin" /> {t.gen_title}</>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-0.5 py-1">
                                                            <span className="flex items-center gap-2 text-sm md:text-base font-black tracking-tight leading-tight">
                                                                <CheckCircle2 size={18} className="shrink-0" /> {t.btn_start_gen}
                                                            </span>
                                                            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/10 border border-black/5 shadow-inner">
                                                                <Coins size={12} className="text-black/60" />
                                                                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-black/70">
                                                                    {t.ws_credit_deduction?.replace('{points}', points.toString())}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })()}
                                    </div>

                                    {error && <p className="text-red-400 text-sm mt-4 text-center font-medium bg-red-500/10 py-2 rounded-lg">{error}</p>}

                                </div>
                            </>
                        ) : (
                            <div className="sticky top-24">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2 text-white">{t.ws_tweak_title || "Fine-tune Your Itinerary"}</h1>
                                    <p className="text-gray-400 text-sm mb-6 text-muted-premium">{t.ws_tweak_desc || "Don't like a spot? Want to wake up later? Tell AI to edit your itinerary."}</p>
                                </div>
                                <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 premium-glass-card">
                                    <textarea
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        placeholder={t.ws_tweak_ph || "e.g., Change Day 1 afternoon to a wheelchair-friendly spot, want seafood for dinner..."}
                                        rows={5}
                                        className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] transition-colors resize-none"
                                    />
                                    {error && <p className="text-red-400 text-sm">{error}</p>}
                                    <button
                                        onClick={handleUpdateItinerary}
                                        disabled={loading || !chatMessage.trim() || userTier === "TRIAL" || userTier === "Casual"}
                                        className="w-full py-3 rounded-xl font-bold border border-[#EEDC00] text-[#EEDC00] hover:bg-[#EEDC00] hover:text-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-gray-500 disabled:border-gray-500 premium-btn text-muted-premium"
                                    >
                                        {loading ? <><Loader2 size={16} className="animate-spin" /> {t.ws_tweak_loading || "Processing..."}</> : ((t.ws_tweak_btn || "Update Itinerary") + " ✨")}
                                    </button>
                                    {(userTier === "TRIAL" || userTier === "Casual") && (
                                        <div className="text-center text-xs text-gray-500 mt-1 cursor-pointer hover:text-[#EEDC00] transition-colors text-muted-premium" onClick={() => window.location.href = '/pricing'}>
                                            {t.ws_upgrade_hint || "免費用戶無法修改行程，請升級方案 ✨"}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setItinerary(null)}
                                        className="w-full py-3 rounded-xl font-bold text-gray-500 hover:text-white transition-colors text-muted-premium"
                                    >
                                        {t.ws_tweak_reset || "Reset to Plan New Trip"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Preview Panel */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-4 pb-16 print:w-full print:block">
                        {itinerary ? (
                            <>
                                <div className="flex justify-end gap-3 mb-4 print:hidden">
                                    <button
                                        onClick={async () => {
                                            try {
                                                const res = await fetch("/api/deduct-export", {
                                                    method: "POST"
                                                });

                                                if (res.status === 401) {
                                                    alert(t.err_auth || "請先登入才能匯出 PDF / Please log in to export PDF.");
                                                    return;
                                                }

                                                if (res.status === 402) {
                                                    alert("點數不足以匯出 PDF。請至定價頁面購買點數 / Not enough credits to export PDF. Please purchase more.");
                                                    window.location.href = '/pricing';
                                                    return;
                                                }

                                                if (!res.ok) {
                                                    alert("匯出失敗，請稍後再試 / Export failed, please try again.");
                                                    return;
                                                }

                                                const originalTitle = document.title;
                                                document.title = `${itinerary.destination || 'Trip'}_Itinerary`;

                                                setTimeout(() => {
                                                    window.print();
                                                    document.title = originalTitle;
                                                }, 300);
                                            } catch (e) {
                                                console.error(e);
                                                alert("發生錯誤 / An error occurred.");
                                            }
                                        }}
                                        className="relative group overflow-hidden bg-gradient-to-r from-[#2A2A35] to-[#1A1A25] hover:from-[#3A3A45] hover:to-[#2A2A35] text-white border border-white/10 px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-3 [transition:background-image_200ms_ease,transform_200ms_ease] shadow-lg active:scale-95"
                                    >
                                        <div className="absolute inset-0 bg-[#EEDC00]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <Download size={18} className="text-[#EEDC00]" />
                                        <span className="relative z-10">{t.ws_save_pdf || "Save as PDF"}</span>
                                        <span className="bg-[#EEDC00] text-black text-[10px] px-1.5 py-0.5 rounded-md font-black ml-1 shadow-[0_0_10px_rgba(238,220,0,0.3)]">
                                            1 點
                                        </span>
                                    </button>
                                    <button
                                        onClick={async () => {
                                            const shareUrl = `${window.location.origin}/share?id=${itineraryId}&lang=${encodeURIComponent(language)}`;
                                            if (navigator.share) {
                                                try {
                                                    await navigator.share({
                                                        title: `${destination} | HKfirstclick AI`,
                                                        text: t.ws_share || destination,
                                                        url: shareUrl,
                                                    });
                                                } catch (err) {
                                                    console.error("Error sharing", err);
                                                }
                                            } else {
                                                navigator.clipboard.writeText(shareUrl);
                                                alert(t.ws_link_copied || "Link copied!");
                                            }
                                        }}
                                        className="bg-[#EEDC00]/10 hover:bg-[#EEDC00] text-[#EEDC00] hover:text-black border border-[#EEDC00]/30 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                                    >
                                        <Globe2 size={16} />
                                        {t.ws_share}
                                    </button>
                                    {/* WhatsApp Share */}
                                    <a
                                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent((t.share_text || '來看看我的專屬 AI 旅遊行程！') + ' ' + (typeof window !== 'undefined' ? `${window.location.origin}/share?id=${itineraryId}&lang=${encodeURIComponent(language)}` : ''))}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors print:hidden"
                                    >
                                        <MessageCircle size={16} />
                                        WhatsApp
                                    </a>
                                    {/* QR Code Button */}
                                    <button
                                        onClick={() => setShowQR(true)}
                                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors print:hidden"
                                    >
                                        <QrCode size={16} />
                                        {t.qr_send_to_phone || "Send to Phone"}
                                    </button>
                                </div>

                                {/* QR Code Modal */}
                                {showQR && (
                                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowQR(false)}>
                                        <div className="bg-[#161616] border border-white/10 rounded-3xl p-8 max-w-sm w-full flex flex-col items-center gap-5 shadow-2xl" onClick={e => e.stopPropagation()}>
                                            <div className="flex items-center justify-between w-full">
                                                <h3 className="text-white font-black text-lg">{t.qr_title || "Scan to Open on Phone"}</h3>
                                                <button onClick={() => setShowQR(false)} className="text-gray-400 hover:text-white transition-colors">
                                                    <X size={20} />
                                                </button>
                                            </div>
                                            <div className="bg-white p-4 rounded-2xl">
                                                <QRCodeSVG
                                                    value={typeof window !== 'undefined' ? `${window.location.origin}/share?id=${itineraryId}&lang=${encodeURIComponent(language)}` : ''}
                                                    size={200}
                                                    bgColor="#ffffff"
                                                    fgColor="#000000"
                                                    level="M"
                                                />
                                            </div>
                                            <p className="text-gray-400 text-sm text-center">{t.qr_desc || "Use your phone camera to scan — opens your itinerary instantly"}</p>
                                            <a
                                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent((t.share_text || '來看看我的專屬 AI 旅遊行程！') + ' ' + (typeof window !== 'undefined' ? `${window.location.origin}/share?id=${itineraryId}&lang=${encodeURIComponent(language)}` : ''))}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-[#25D366] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#20bc5a] transition-colors text-sm"
                                            >
                                                <MessageCircle size={16} />
                                                {t.qr_whatsapp || "Send via WhatsApp"}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div id="exportable-itinerary" className="bg-[#111111] border border-white/10 rounded-3xl pb-8 overflow-hidden min-h-full shadow-2xl premium-glass-card">
                                    {/* Hero Summary Section */}
                                    <div className="pt-8 px-6 sm:px-8 pb-6 bg-[#161616] premium-glass-card">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="text-xs font-bold bg-[#EEDC00] text-black px-2 py-0.5 rounded tracking-widest flex items-center gap-1.5">
                                                <Sparkles size={12} /> {t.rev_ai_tag || "AI PRO GENERATED"}
                                            </div>
                                        </div>
                                        <h2 className="text-4xl font-black text-white glow-text mb-1 heading-premium">{itinerary.destination || destination}</h2>
                                        <p className="text-gray-300 font-medium text-lg mb-6">{dates.start} — {dates.end}</p>

                                        {/* Flight and Hotel Cards */}
                                        {(itinerary.flights || itinerary.hotel) && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {itinerary.flights && (
                                                    <div className="bg-[#1A1A1A] border border-[#333] hover:border-[#555] rounded-2xl p-4 flex flex-col justify-between transition-colors relative overflow-hidden group premium-glass-card">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-[#EEDC00]/0 via-[#EEDC00]/5 to-[#EEDC00]/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                                        <div>
                                                            <div className="flex items-center justify-between text-sm text-gray-300 font-bold mb-1">
                                                                <div className="flex items-center gap-2">
                                                                    <PlaneTakeoff size={16} className="text-[#EEDC00]" />
                                                                    {t.ws_flight_out || "去程航班"} <span className="text-gray-400 text-muted-premium">({origin} ➔ {destination})</span>
                                                                </div>
                                                                <span className="text-gray-500 font-normal text-xs uppercase text-muted-premium">{itinerary.flights.outbound?.airline}</span>
                                                            </div>
                                                            <div className="text-white font-bold text-lg leading-tight mb-2 flex items-center gap-2">
                                                                <span>{t.ws_arrival_label}</span> <span className="text-[#EEDC00] font-mono">{itinerary.flights.outbound?.arrivalTime || flightTimes.arrival}</span>
                                                            </div>
                                                            <div className="text-xs text-gray-400 mb-3 bg-white/5 rounded p-2 flex items-start gap-1.5 text-muted-premium">
                                                                <span className="text-[#EEDC00] mt-0.5">⚠️</span> <span>{itinerary.flights.outbound?.airportArrivalInstruction || t.ws_flight_warn || "Based on provided data. We recommend arriving at least 2 hours early."}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {itinerary.hotel && (
                                                    <div className="bg-[#1A1A1A] border border-[#333] hover:border-[#555] rounded-2xl p-4 flex flex-col justify-between transition-colors relative overflow-hidden group premium-glass-card">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5A5F]/0 via-[#FF5A5F]/5 to-[#FF5A5F]/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                                        <div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-300 font-bold mb-1">
                                                                <Building2 size={16} className="text-[#FF5A5F]" />
                                                                {t.ws_hotel_rec || "推薦住宿"}
                                                            </div>
                                                            <div className="text-white font-bold text-lg leading-tight mb-2">
                                                                {stripMarkdownLinks(itinerary.hotel.name)}
                                                            </div>
                                                            <div className="text-xs text-gray-400 flex flex-col gap-0.5 text-muted-premium">
                                                                <span>{t.ws_hotel_checkin} <span className="text-gray-300 font-medium">{itinerary.hotel.checkIn}</span></span>
                                                                <span>{t.ws_hotel_checkout} <span className="text-gray-300 font-medium">{itinerary.hotel.checkOut}</span></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Day Navigation Bar */}
                                    <div className="sticky top-0 z-30 bg-[#161616] border-y border-white/10 px-4 sm:px-8 flex items-center overflow-x-auto hide-scrollbar shadow-md premium-glass-card">
                                        <div className="flex items-center gap-6 min-w-max">
                                            <button onClick={() => setActiveDayIndex(-1)} className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeDayIndex === -1 ? "border-[#EEDC00] text-[#EEDC00]" : "border-transparent text-gray-400 hover:text-white"}`}>
                                                [{t.ws_day_overview}]
                                            </button>
                                            {itinerary.days?.map((day: any, i: number) => (
                                                <button key={i} onClick={() => setActiveDayIndex(i)} className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeDayIndex === i ? "border-[#EEDC00] text-[#EEDC00]" : "border-transparent text-gray-400 hover:text-white"}`}>
                                                    [{t.ws_day_label ? t.ws_day_label.replace('{n}', String(i + 1)) : `Day ${i + 1}`}]
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Views Container */}
                                    <div>
                                        {/* Overview Render */}
                                        <div className={activeDayIndex === -1 ? "block" : "hidden print:block"}>
                                            {/* Budget Summary Box */}
                                            <div className="m-8 bg-[#0E0E0E] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#EEDC00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10 heading-premium">
                                                    <DollarSign size={18} className="text-[#EEDC00]" /> {t.ws_budget_title || "Budget Tracker"}
                                                </h3>
                                                <div className="space-y-3 relative z-10">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-400 text-muted-premium">{t.ws_budget_set || "Current Budget Set"}</span>
                                                        <span className="text-white font-mono">{currency} {budget || t.ws_empty || "Not set"}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-400 text-muted-premium">{t.ws_budget_est || "Total Est. Cost (Flight + Hotel + Acts)"}</span>
                                                        <span className="text-[#EEDC00] font-mono font-bold text-lg">
                                                            {currency} {calculateTotalBudget(itinerary).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {budget && !isNaN(Number(budget)) && (
                                                        <div className="flex justify-between items-center text-sm mt-4 pt-4 border-t border-white/10">
                                                            <span className="text-gray-400 text-muted-premium">{t.ws_budget_remain || "Budget Remaining"}</span>
                                                            <span className={`font-mono font-bold ${Number(budget) - calculateTotalBudget(itinerary) >= 0 ? "text-green-400" : "text-red-400"}`}>
                                                                {Number(budget) - calculateTotalBudget(itinerary) >= 0 ? "+" : ""}{currency} {(Number(budget) - calculateTotalBudget(itinerary)).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Days Render */}
                                        {itinerary.days?.map((day: any, dayIndex: number) => (
                                            <div key={dayIndex} className={`bg-[#111111] pb-12 pt-6 ${activeDayIndex === dayIndex ? "block" : "hidden print:block"}`}>
                                                <div className="pt-8 px-4 sm:px-8">
                                                    {/* Day Summary / Theme */}
                                                    {day?.daySummary && (
                                                        <div className="mb-8 p-4 sm:px-5 bg-gradient-to-r from-[#1A1A1A] to-[#161616] border border-white/5 rounded-2xl relative overflow-hidden flex items-start gap-4">
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#EEDC00]"></div>
                                                            <div className="mt-0.5 shrink-0">
                                                                <Sparkles size={18} className="text-[#EEDC00]" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-white font-bold text-sm mb-1 tracking-wide heading-premium">{t.ws_daily_theme}</h4>
                                                                <p className="text-gray-400 text-[13px] leading-relaxed text-muted-premium">
                                                                    {day.daySummary}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="space-y-0">
                                                        {day?.activities?.map((act: any, j: number) => (
                                                            <div key={j} className="relative">
                                                                {/* Time and Marker */}
                                                                <div className="flex gap-4 items-start break-inside-avoid">
                                                                    {/* Left Time Column */}
                                                                    <div className="w-16 shrink-0 text-right pt-1">
                                                                        <div className="text-white font-bold text-sm leading-tight">{act.time.split(' ')[0]}</div>
                                                                        <div className="text-gray-500 text-xs font-medium text-muted-premium">{act.time.split(' ').slice(1).join(' ') || ''}</div>
                                                                    </div>

                                                                    {/* Center Line & Node */}
                                                                    <div className="flex flex-col items-center shrink-0 relative w-8 min-h-[100px] -ml-2">
                                                                        {/* Node Circle */}
                                                                        <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center z-10 border-2 border-[#111]">
                                                                            <div className="w-2 h-2 rounded-full bg-[#FF7B89]"></div>
                                                                        </div>
                                                                        {/* Connecting Line to next activity */}
                                                                        {j < (day.activities.length - 1) && (
                                                                            <div className="w-[2px] h-full bg-[#333] absolute top-8 bottom-0"></div>
                                                                        )}
                                                                    </div>

                                                                    {/* Right Content */}
                                                                    <div className="flex-1 pb-8 w-full overflow-hidden">
                                                                        <div className="bg-transparent mb-1 flex flex-col lg:flex-row items-start gap-4 lg:gap-5 w-full">
                                                                            {/* Image Container */}
                                                                            {!(act.title.includes('航班') || act.title.includes('出發') || act.title.includes('住宿') || act.title.includes('入住') || act.title.includes('機場')) && (
                                                                                <div className="w-full lg:w-[240px] shrink-0 rounded-xl overflow-hidden aspect-video bg-[#1A1A1A] border border-white/5 relative group premium-glass-card">
                                                                                    {fetchingImages[`${dayIndex}-${j}-${act.title}`] || !activityImages[`${dayIndex}-${j}-${act.title}`] ? (
                                                                                        <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A] animate-pulse premium-glass-card">
                                                                                            <ImageIcon size={24} className="text-gray-600" />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <>
                                                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                                            <img
                                                                                                src={activityImages[`${dayIndex}-${j}-${act.title}`]}
                                                                                                alt={act.title}
                                                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cinematic-img"
                                                                                                loading="lazy"
                                                                                                crossOrigin="anonymous"
                                                                                            />

                                                                                            {imageSources[`${dayIndex}-${j}-${act.title}`] !== "Default" && (
                                                                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-6 pb-1 px-2 text-[9px] text-white/50 text-right z-10 pointer-events-none print:hidden">
                                                                                                    Photo via {imageSources[`${dayIndex}-${j}-${act.title}`] || "Wikimedia"}
                                                                                                </div>
                                                                                            )}
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                            )}

                                                                            <div className="flex-1 flex flex-col sm:flex-row items-start justify-between gap-4 w-full">
                                                                                <div>
                                                                                    <h4 className="font-bold text-white text-[17px] flex items-center gap-2 heading-premium break-words overflow-hidden">
                                                                                        {act.title.includes('航班') || act.title.includes('出發') ? <PlaneTakeoff size={18} className="text-gray-400 text-muted-premium shrink-0" /> : null}
                                                                                        {act.title.includes('住宿') || act.title.includes('入住') ? <Building2 size={18} className="text-gray-400 text-muted-premium shrink-0" /> : null}
                                                                                        {stripMarkdownLinks(act.title)}
                                                                                    </h4>

                                                                                    {/* Location/Address if any */}
                                                                                    {act.location && (
                                                                                        <a
                                                                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${act.location} ${itinerary.destination || destination || ""}`)}`}
                                                                                            target="_blank"
                                                                                            rel="noreferrer"
                                                                                            className="inline-flex text-blue-400 hover:text-blue-300 text-xs mt-1.5 items-center gap-1.5 hover:underline transition-colors w-max"
                                                                                        >
                                                                                            <MapPin size={14} /> {act.location}
                                                                                        </a>
                                                                                    )}

                                                                                    {/* Description */}
                                                                                    <p className="text-gray-500 text-sm mt-2 leading-relaxed max-w-lg text-muted-premium">
                                                                                        {act.description}
                                                                                    </p>
                                                                                </div>

                                                                                <div className="flex flex-col items-start sm:items-end gap-2 shrink-0 print:hidden mt-2 lg:mt-0">
                                                                                    {((act.needsTicket === true) || (act.bookingUrl && act.bookingUrl !== "#")) && !act.isFood ? (
                                                                                        <div className="flex flex-col items-start sm:items-end w-full gap-1.5">
                                                                                            {act.cost && act.cost !== "0" && act.cost.toLowerCase() !== "free" && (
                                                                                                <span className="text-gray-400 text-xs bg-white/5 px-2 py-1 rounded self-start sm:self-end text-muted-premium">
                                                                                                    {act.cost}
                                                                                                </span>
                                                                                            )}
                                                                                            <a href={act.bookingUrl && act.bookingUrl !== "#" ? act.bookingUrl : `https://tp.media/r?campaign_id=137&erid=2Vtzqw6jKWc&marker=706940&p=4110&trs=503142&u=${encodeURIComponent(`https://www.klook.com/en-US/search/result/?query=${act.title}&sort=most_relevant&start=1&tab_key=2`)}`} target="_blank" rel="noreferrer" className="bg-[#EEDC00] hover:bg-[#ffe800] text-black text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors shadow-lg mt-0.5 w-[95px] text-center shrink-0 flex justify-center items-center">
                                                                                                {t.ws_book_klook || '預訂 Klook'}
                                                                                            </a>
                                                                                        </div>
                                                                                    ) : null}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/* Transit Info between activities (Skip after last activity) */}
                                                                {j < (day.activities.length - 1) && act.transitToNext && (
                                                                    <div className="flex gap-4 items-start relative -mt-4 mb-4 break-inside-avoid">
                                                                        <div className="w-16 shrink-0"></div>
                                                                        <div className="w-8 shrink-0 flex justify-center -ml-2 relative z-10">
                                                                            <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center premium-glass-card shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                                                                                <Route size={12} className="text-[#EEDC00]" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-1 border-t border-b border-white/5 py-3 -ml-2 text-xs text-gray-400 flex items-center justify-between px-2 group/transit hover:bg-white/5 rounded-lg transition-colors">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-gray-300 font-bold">{act.transitToNext.mode}</span>
                                                                                    <span className="text-gray-500 text-[10px] font-mono">{act.transitToNext.duration}</span>
                                                                                </div>
                                                                            </div>
                                                                            <ArrowRight size={14} className="text-gray-600 group-hover/transit:translate-x-1 transition-transform" />
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
                            </>
                        ) : (
                            <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-start pt-32 border border-white/5 rounded-2xl bg-[#161616]/50 relative overflow-hidden shadow-2xl premium-glass-card">
                                {/* Beautiful blurred travel background */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105"
                                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1600&auto=format&fit=crop')` }}
                                ></div>
                                {/* Dark gradient overlay to ensure text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/80 to-[#161616]/40"></div>

                                <div className="relative z-10 px-8 text-center max-w-lg mt-12">
                                    <Globe2 size={56} className="text-[#EEDC00] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(238,220,0,0.5)]" />
                                    <h3 className="text-3xl font-black text-white mb-4 tracking-tight heading-premium">{t.ws_ready_title || "Ready to explore?"}</h3>
                                    <p className="text-gray-300 max-w-sm mx-auto leading-relaxed">
                                        {t.ws_ready_desc || "Fill out your travel details on the left. Our AI will instantly craft a perfect, personalized daily itinerary for your next adventure."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
