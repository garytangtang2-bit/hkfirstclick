"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { AppProvider, useAppContext } from "@/components/AppContext";
import { useState, useEffect } from "react";
import { Calendar, CheckCircle2, DollarSign, Globe2, Loader2, MapPin, Sparkles, Ticket, Download, Lightbulb, Target, Route, Luggage, Info, PlaneTakeoff, PlaneLanding, Clock, ChevronDown, Building2, Plus, Minus, Maximize } from "lucide-react";
import html2canvas from "html2canvas";
import { createClient } from "@/utils/supabase/client";
import AutocompleteInput from "@/components/AutocompleteInput";

export default function Workspace() {
    return (
        <AppProvider>
            <GlobalLayout>
                <WorkspaceContent />
            </GlobalLayout>
        </AppProvider>
    );
}

function LoadingOverlay() {
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-full max-w-md px-8 text-center">
                <div className="w-16 h-16 border-4 border-[#EEDC00] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-2xl font-bold text-white mb-2 glow-text">AI 正在為您規劃專屬行程</h3>
                <p className="text-gray-400 mb-6 text-sm">正在從全球資料庫抓取即時航班與景點資訊，請稍候約 10-15 秒...</p>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#EEDC00] rounded-full animate-pulse shadow-[0_0_15px_rgba(238,220,0,0.5)]" style={{ width: '80%', transition: 'width 10s ease-out' }}></div>
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

    // Format Date string aesthetically e.g. "10月15日 (週二)" or "Oct 15 (Tue)"
    const formatDateString = (dateString: string) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            const locales = language?.includes("中文") ? "zh-TW" : "en-US";
            const options: Intl.DateTimeFormatOptions = {
                month: "short",
                day: "numeric",
                weekday: "short"
            };
            return new Intl.DateTimeFormat(locales, options).format(date);
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
    const [exporting, setExporting] = useState(false);
    const [activeDayIndex, setActiveDayIndex] = useState(-1);
    const [error, setError] = useState("");
    const [itinerary, setItinerary] = useState<any>(null);
    const [itineraryId, setItineraryId] = useState<string | null>(null);
    const [chatMessage, setChatMessage] = useState("");

    const SP_PURPOSES = [
        { id: "sightseeing", label: t.purp_sight, icon: "📸" },
        { id: "shopping", label: t.purp_shop, icon: "🛍️" },
        { id: "food", label: t.purp_food, icon: "🍜" },
        { id: "relax", label: t.purp_relax, icon: "💆" },
        { id: "nature", label: t.purp_nature, icon: "🏔️" },
        { id: "history", label: t.purp_hist, icon: "🏛️" },
    ];

    const getPromptLanguage = (lang: string) => {
        const map: Record<string, string> = {
            "English": "English",
            "繁體中文": "Traditional Chinese",
            "日本語": "Japanese",
            "한국어": "Korean",
            "Français": "French",
            "Español": "Spanish",
            "Bahasa Indonesia": "Indonesian",
            "हिन्दी": "Hindi",
            "Português": "Portuguese",
            "العربية": "Arabic",
            "বাংলা": "Bengali",
            "Русский": "Russian",
        };
        return map[lang] || "English";
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const id = queryParams.get("id");
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
    }, []);

    const handleGenerate = async () => {
        if (!origin || !destination || !dates.start || !dates.end) {
            setError(t.err_empty);
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

    const handleExportImage = async () => {
        setExporting(true);
        try {
            // 1. Credit Check & Deduction API
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                alert("請先登入 (Please login first)");
                return;
            }

            const res = await fetch("/api/export-trip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ itineraryId })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Export failed from server");

            // 2. Render Image
            const element = document.getElementById('exportable-itinerary');
            if (!element) return;

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#161616',
            });

            const image = canvas.toDataURL("image/png", 1.0);
            const link = document.createElement('a');
            link.download = `${itinerary.destination || 'trip'}-itinerary.png`;
            link.href = image;
            link.click();

        } catch (err: any) {
            console.error("Export failed", err);
            alert(`匯出失敗：${err.message || '請稍後再試。'}`);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="workspace-container">
            {loading && <LoadingOverlay />}
            <div className="max-w-7xl mx-auto px-6 py-12 md:px-12 min-h-screen">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left Form / Chat Panel */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-8 lg:sticky lg:top-6 lg:h-max z-20">
                        {/* Promotional / Affiliate Block */}
                        {!itinerary && (
                            <div className="bg-[#121212] border border-[#2A2A35] rounded-2xl p-6 relative overflow-hidden group hover:border-[#3A3A45] transition-colors shadow-lg shadow-black/50">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#EEDC00]/10 to-transparent rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none group-hover:from-[#EEDC00]/20 transition-all"></div>
                                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                                    <Luggage size={18} className="text-[#EEDC00]" /> 還沒有訂機票跟飯店嗎？
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                    建議您先完成預訂！有了確切的班機時間與飯店地址，AI 才能為您精算點對點的交通距離，打造不浪費時間的完美行程。
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <a
                                        href="https://kiwi.tpo.mx/KwEXKMTT?erid=2VtzquYMmhE"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-white hover:bg-gray-100 text-black font-bold py-3 px-4 rounded-xl text-sm transition-all text-center"
                                    >
                                        搜尋最便宜機票
                                    </a>
                                    <a
                                        href="https://klook.tpo.mx/CUx1vPPs?erid=2Vtzqw6jKWc"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-[#FF5A5F] hover:bg-[#FF4A4F] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all text-center"
                                    >
                                        找尋 Klook 推薦住宿
                                    </a>
                                </div>
                            </div>
                        )}
                        {!itinerary ? (
                            <>
                                <div>
                                    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 space-y-6">
                                        <h3 className="font-bold flex items-center gap-2 text-white text-lg">
                                            <span className="bg-[#EEDC00] w-6 h-6 rounded-full flex items-center justify-center text-xs text-black">1</span>
                                            基礎限制資訊 (Base Constraints)
                                        </h3>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <Globe2 size={14} /> {t.input_origin}
                                            </label>
                                            <AutocompleteInput
                                                value={origin}
                                                onChange={setOrigin}
                                                placeholder={t.input_origin_ph}
                                                icon={<PlaneTakeoff size={18} />}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <MapPin size={14} /> {t.input_dest}
                                            </label>
                                            <AutocompleteInput
                                                value={destination}
                                                onChange={setDestination}
                                                placeholder={t.input_dest_ph}
                                                icon={<PlaneLanding size={18} />}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <Calendar size={14} /> {t.date_start}
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10 text-gray-400 group-hover:text-white transition-colors">
                                                        <Calendar size={18} />
                                                    </div>
                                                    <input
                                                        type="date"
                                                        value={dates.start}
                                                        onChange={(e) => setDates({ ...dates, start: e.target.value })}
                                                        className="w-full bg-[#0E0E0E] min-h-[50px] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] focus:ring-2 focus:ring-[#EEDC00]/20 hover:border-white/30 hover:bg-[#111] transition-all relative z-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit]:text-transparent"
                                                    />
                                                    <div className={`absolute left-11 top-1/2 -translate-y-1/2 pointer-events-none z-0 font-medium ${dates.start ? 'text-white' : 'text-gray-400'}`}>
                                                        <span>{formatDateString(dates.start) || t.date_ph}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <Calendar size={14} /> {t.date_end}
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10 text-gray-400 group-hover:text-white transition-colors">
                                                        <Calendar size={18} />
                                                    </div>
                                                    <input
                                                        type="date"
                                                        value={dates.end}
                                                        min={dates.start} // Ensure end date cannot be before start date
                                                        onChange={(e) => setDates({ ...dates, end: e.target.value })}
                                                        className="w-full bg-[#0E0E0E] min-h-[50px] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] focus:ring-2 focus:ring-[#EEDC00]/20 hover:border-white/30 hover:bg-[#111] transition-all relative z-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit]:text-transparent"
                                                    />
                                                    <div className={`absolute left-11 top-1/2 -translate-y-1/2 pointer-events-none z-0 font-medium ${dates.end ? 'text-white' : 'text-gray-400'}`}>
                                                        <span>{formatDateString(dates.end) || t.date_ph}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <Clock size={14} /> {t.input_arrival || "Day 1 Arrival Time"}
                                                </label>
                                                <div className="relative group grid grid-cols-2 gap-2">
                                                    <div className="relative">
                                                        <select
                                                            value={parseTime(flightTimes.arrival).h}
                                                            onChange={(e) => setFlightTimes({ ...flightTimes, arrival: `${e.target.value}:${parseTime(flightTimes.arrival).m}` })}
                                                            className="w-full bg-[#0E0E0E] min-h-[50px] border border-white/10 rounded-xl pl-4 pr-8 py-3 text-white font-medium focus:outline-none focus:border-[#EEDC00] focus:ring-2 focus:ring-[#EEDC00]/20 hover:border-white/30 hover:bg-[#111] transition-all appearance-none cursor-pointer text-center"
                                                        >
                                                            {hourOptions.map(h => <option key={`arr-h-${h}`} value={h} className="bg-[#161616]">{h}</option>)}
                                                        </select>
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-white transition-colors">
                                                            <span className="text-xs">時</span>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <select
                                                            value={parseTime(flightTimes.arrival).m}
                                                            onChange={(e) => setFlightTimes({ ...flightTimes, arrival: `${parseTime(flightTimes.arrival).h}:${e.target.value}` })}
                                                            className="w-full bg-[#0E0E0E] min-h-[50px] border border-white/10 rounded-xl pl-4 pr-8 py-3 text-white font-medium focus:outline-none focus:border-[#EEDC00] focus:ring-2 focus:ring-[#EEDC00]/20 hover:border-white/30 hover:bg-[#111] transition-all appearance-none cursor-pointer text-center"
                                                        >
                                                            {minuteOptions.map(m => <option key={`arr-m-${m}`} value={m} className="bg-[#161616]">{m}</option>)}
                                                        </select>
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-white transition-colors">
                                                            <span className="text-xs">分</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <Clock size={14} /> {t.input_departure || "Last Day Departure"}
                                                </label>
                                                <div className="relative group grid grid-cols-2 gap-2">
                                                    <div className="relative">
                                                        <select
                                                            value={parseTime(flightTimes.departure).h}
                                                            onChange={(e) => setFlightTimes({ ...flightTimes, departure: `${e.target.value}:${parseTime(flightTimes.departure).m}` })}
                                                            className="w-full bg-[#0E0E0E] min-h-[50px] border border-white/10 rounded-xl pl-4 pr-8 py-3 text-white font-medium focus:outline-none focus:border-[#EEDC00] focus:ring-2 focus:ring-[#EEDC00]/20 hover:border-white/30 hover:bg-[#111] transition-all appearance-none cursor-pointer text-center"
                                                        >
                                                            {hourOptions.map(h => <option key={`dep-h-${h}`} value={h} className="bg-[#161616]">{h}</option>)}
                                                        </select>
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-white transition-colors">
                                                            <span className="text-xs">時</span>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <select
                                                            value={parseTime(flightTimes.departure).m}
                                                            onChange={(e) => setFlightTimes({ ...flightTimes, departure: `${parseTime(flightTimes.departure).h}:${e.target.value}` })}
                                                            className="w-full bg-[#0E0E0E] min-h-[50px] border border-white/10 rounded-xl pl-4 pr-8 py-3 text-white font-medium focus:outline-none focus:border-[#EEDC00] focus:ring-2 focus:ring-[#EEDC00]/20 hover:border-white/30 hover:bg-[#111] transition-all appearance-none cursor-pointer text-center"
                                                        >
                                                            {minuteOptions.map(m => <option key={`dep-m-${m}`} value={m} className="bg-[#161616]">{m}</option>)}
                                                        </select>
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-white transition-colors">
                                                            <span className="text-xs">分</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <MapPin size={14} /> {t.input_hotel || "Exact Hotel Name or Address"}
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10 text-gray-400 group-hover:text-white transition-colors">
                                                    <MapPin size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={hotelInfo}
                                                    onChange={(e) => setHotelInfo(e.target.value)}
                                                    placeholder={t.input_hotel_ph || "e.g., APA Hotel Shinjuku..."}
                                                    className="w-full bg-[#0E0E0E] min-h-[50px] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] focus:ring-2 focus:ring-[#EEDC00]/20 hover:border-white/30 hover:bg-[#111] transition-all relative z-0 text-ellipsis overflow-hidden whitespace-nowrap"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 space-y-6 mt-6">
                                        <h3 className="font-bold flex items-center gap-2 text-white text-lg">
                                            <span className="bg-[#EEDC00] w-6 h-6 rounded-full flex items-center justify-center text-xs text-black">2</span>
                                            {t.q_group_title || "Group Composition"}
                                        </h3>
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
                                                    <div className="text-sm font-bold text-gray-200">長輩同行 (Elders)</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">減少步行距離與爬坡景點</div>
                                                </div>
                                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                                    <input type="checkbox" checked={hasElders} onChange={(e) => setHasElders(e.target.checked)} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-[#0E0E0E] appearance-none cursor-pointer scale-110 checked:border-[#EEDC00] checked:right-0 right-6 transition-all z-10" />
                                                    <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${hasElders ? 'bg-[#EEDC00]' : 'bg-gray-600'}`}></div>
                                                </div>
                                            </label>

                                            <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#0E0E0E] cursor-pointer hover:border-white/30 transition-colors">
                                                <div>
                                                    <div className="text-sm font-bold text-gray-200">無障礙/推車友善 (Wheelchair/Stroller)</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">優先安排平緩友善的動線</div>
                                                </div>
                                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                                    <input type="checkbox" checked={accessibility} onChange={(e) => setAccessibility(e.target.checked)} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-[#0E0E0E] appearance-none cursor-pointer scale-110 checked:border-[#EEDC00] checked:right-0 right-6 transition-all z-10" />
                                                    <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${accessibility ? 'bg-[#EEDC00]' : 'bg-gray-600'}`}></div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 space-y-6 mt-6">
                                        <h3 className="font-bold flex items-center gap-2 text-white text-lg">
                                            <span className="bg-[#EEDC00] w-6 h-6 rounded-full flex items-center justify-center text-xs text-black">3</span>
                                            <Sparkles size={16} className="text-[#EEDC00]" /> {t.pref_title}
                                        </h3>

                                        <div>
                                            <label className="text-sm font-medium text-gray-300 mb-3 block">飲食禁忌 (Dietary Restrictions)</label>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {["不吃牛", "全素", "蛋奶素", "不吃生食", "海鮮過敏", "不喝酒", "清真飲食"].map(tag => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => setDietaryTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                                                        className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 ${dietaryTags.includes(tag)
                                                            ? "bg-red-500/20 border-red-500 text-red-400"
                                                            : "bg-[#0E0E0E] border-white/10 text-gray-400 hover:border-white/30"
                                                            }`}
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="其他特殊飲食需求 (Other dietary needs)..."
                                                value={dietaryOther}
                                                onChange={(e) => setDietaryOther(e.target.value)}
                                                className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#EEDC00] transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-300 mb-3 block">必去清單 (Must-Visit/Booked)</label>
                                            <textarea
                                                placeholder="e.g., 已訂好週三中午米其林餐廳、一定要去清水寺..."
                                                value={mustVisit}
                                                onChange={(e) => setMustVisit(e.target.value)}
                                                rows={2}
                                                className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] transition-colors resize-none text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-300 mb-3 block">步調節奏 (Pace)</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { id: "relaxed", title: "輕鬆慢活" },
                                                    { id: "balanced", title: t.style_bal },
                                                    { id: "packed", title: "充實踩點" }
                                                ].map(s => (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => setStyle(s.id)}
                                                        className={`p-3 rounded-xl border text-xs font-bold transition-all ${style === s.id
                                                            ? "bg-[#EEDC00]/10 border-[#EEDC00] text-[#EEDC00]"
                                                            : "bg-[#0E0E0E] border-white/10 text-gray-400 hover:border-white/30"
                                                            }`}
                                                    >
                                                        {s.title}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-300 mb-3 block">交通偏好 (Transportation)</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { id: "public", title: "大眾運輸為主" },
                                                    { id: "taxi", title: "計程車/包車為主" }
                                                ].map(t_pref => (
                                                    <button
                                                        key={t_pref.id}
                                                        onClick={() => setTransportation(t_pref.id)}
                                                        className={`p-3 rounded-xl border text-xs font-bold transition-all ${transportation === t_pref.id
                                                            ? "bg-[#EEDC00]/10 border-[#EEDC00] text-[#EEDC00]"
                                                            : "bg-[#0E0E0E] border-white/10 text-gray-400 hover:border-white/30"
                                                            }`}
                                                    >
                                                        {t_pref.title}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-300 mb-3 block">{t.q2_title}</label>
                                            <div className="flex flex-wrap gap-2">
                                                {SP_PURPOSES.map(p => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => togglePurpose(p.id)}
                                                        className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 ${purposes.includes(p.id)
                                                            ? "bg-[#EEDC00] border-[#EEDC00] text-black"
                                                            : "bg-[#0E0E0E] border-white/10 text-gray-400 hover:border-white/30"
                                                            }`}
                                                    >
                                                        <span>{p.icon}</span> {p.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                                                <DollarSign size={16} className="text-gray-400" /> {t.q3_title}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={t.q3_ph + currency + " 15000"}
                                                value={budget}
                                                onChange={(e) => setBudget(e.target.value)}
                                                className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] transition-colors text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-300 mb-3 block">{t.q4_title}</label>
                                            <textarea
                                                placeholder={t.q4_ph}
                                                value={requests}
                                                onChange={(e) => setRequests(e.target.value)}
                                                rows={2}
                                                className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] transition-colors resize-none text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-4">
                                        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                                        <button
                                            onClick={handleGenerate}
                                            disabled={loading}
                                            className="w-full py-4 rounded-xl font-bold bg-[#EEDC00] text-black hover:bg-[#ffe800] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <><Loader2 size={18} className="animate-spin" /> {t.gen_title}</>
                                            ) : (
                                                <><CheckCircle2 size={18} /> {t.btn_start_gen}</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="sticky top-24">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2 text-white">{t.ws_tweak_title || "Fine-tune Your Itinerary"}</h1>
                                    <p className="text-gray-400 text-sm mb-6">{t.ws_tweak_desc || "Don't like a spot? Want to wake up later? Tell AI to edit your itinerary."}</p>
                                </div>
                                <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
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
                                        disabled={loading || !chatMessage.trim()}
                                        className="w-full py-3 rounded-xl font-bold border border-[#EEDC00] text-[#EEDC00] hover:bg-[#EEDC00] hover:text-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? <><Loader2 size={16} className="animate-spin" /> {t.ws_tweak_loading || "Processing..."}</> : (t.ws_tweak_btn || "Update Itinerary")}
                                    </button>
                                    <button
                                        onClick={() => setItinerary(null)}
                                        className="w-full py-3 rounded-xl font-bold text-gray-500 hover:text-white transition-colors"
                                    >
                                        {t.ws_tweak_reset || "Reset to Plan New Trip"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Preview Panel */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-4 pb-16">
                        {itinerary ? (
                            <>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleExportImage}
                                        disabled={exporting}
                                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                        {t.ws_export_img || "Save as Image"}
                                    </button>
                                </div>
                                <div id="exportable-itinerary" className="bg-[#111111] border border-white/10 rounded-3xl pb-8 overflow-hidden min-h-full shadow-2xl">
                                    {/* Hero Summary Section */}
                                    <div className="pt-8 px-6 sm:px-8 pb-6 bg-[#161616]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="text-xs font-bold bg-[#EEDC00] text-black px-2 py-0.5 rounded tracking-widest flex items-center gap-1.5">
                                                <Sparkles size={12} /> {t.rev_ai_tag || "AI PRO GENERATED"}
                                            </div>
                                        </div>
                                        <h2 className="text-4xl font-black text-white glow-text mb-1">{itinerary.destination || destination}</h2>
                                        <p className="text-gray-300 font-medium text-lg mb-6">{dates.start} — {dates.end}</p>

                                        {/* Flight and Hotel Cards */}
                                        {(itinerary.flights || itinerary.hotel) && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {itinerary.flights && (
                                                    <div className="bg-[#1A1A1A] border border-[#333] hover:border-[#555] rounded-2xl p-4 flex flex-col justify-between transition-colors relative overflow-hidden group">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-[#EEDC00]/0 via-[#EEDC00]/5 to-[#EEDC00]/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                                        <div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-300 font-bold mb-1">
                                                                <PlaneTakeoff size={16} className="text-[#EEDC00]" />
                                                                {t.ws_flight_out || "去程航班"}
                                                                <span className="text-gray-500 font-normal text-xs ml-1 uppercase">{itinerary.flights.outbound?.airline}</span>
                                                            </div>
                                                            <div className="text-xs text-gray-400 mb-3 bg-white/5 rounded p-2 flex items-start gap-1.5">
                                                                <span className="text-[#EEDC00] mt-0.5">⚠️</span> <span>{itinerary.flights.outbound?.airportArrivalInstruction || t.ws_flight_warn || "Based on provided data. We recommend arriving at least 2 hours early."}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                                                            <span className="text-white font-bold">{itinerary.flights.outbound?.estCost || "Included"}</span>
                                                            <a href={itinerary.flights.outbound?.bookingUrl || "#"} target="_blank" rel="noreferrer" className="bg-[#EEDC00]/10 hover:bg-[#EEDC00]/20 text-[#EEDC00] border border-[#EEDC00]/30 text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                                                                {t.ws_btn_flight || "查看機票"}
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}

                                                {itinerary.hotel && (
                                                    <div className="bg-[#1A1A1A] border border-[#333] hover:border-[#555] rounded-2xl p-4 flex flex-col justify-between transition-colors relative overflow-hidden group">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5A5F]/0 via-[#FF5A5F]/5 to-[#FF5A5F]/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                                        <div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-300 font-bold mb-1">
                                                                <Building2 size={16} className="text-[#FF5A5F]" />
                                                                {t.ws_hotel_rec || "推薦住宿"}
                                                            </div>
                                                            <div className="text-white font-bold text-lg leading-tight mb-2">
                                                                {itinerary.hotel.name}
                                                            </div>
                                                            <div className="text-xs text-gray-400 flex flex-col gap-0.5">
                                                                <span>In: <span className="text-gray-300 font-medium">{itinerary.hotel.checkIn}</span></span>
                                                                <span>Out: <span className="text-gray-300 font-medium">{itinerary.hotel.checkOut}</span></span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                                                            <div className="flex items-center gap-1 opacity-80 h-6">
                                                                <span className="text-[#FF5A5F] font-black italic text-sm tracking-tighter">klook</span>
                                                            </div>
                                                            <a href={itinerary.hotel.bookingUrl || "#"} target="_blank" rel="noreferrer" className="bg-[#FF5A5F]/10 hover:bg-[#FF5A5F]/20 text-[#FF5A5F] border border-[#FF5A5F]/30 text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                                                                {t.ws_btn_hotel || "預訂飯店"}
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Day Navigation Bar */}
                                    <div className="sticky top-0 z-30 bg-[#161616] border-y border-white/10 px-4 sm:px-8 flex items-center overflow-x-auto hide-scrollbar shadow-md">
                                        <div className="flex items-center gap-6 min-w-max">
                                            <button onClick={() => setActiveDayIndex(-1)} className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeDayIndex === -1 ? "border-[#EEDC00] text-[#EEDC00]" : "border-transparent text-gray-400 hover:text-white"}`}>
                                                [總覽]
                                            </button>
                                            {itinerary.days?.map((day: any, i: number) => (
                                                <button key={i} onClick={() => setActiveDayIndex(i)} className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeDayIndex === i ? "border-[#EEDC00] text-[#EEDC00]" : "border-transparent text-gray-400 hover:text-white"}`}>
                                                    [第 {i + 1} 天]
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Conditional Render Based on activeDayIndex */}
                                    {activeDayIndex === -1 ? (
                                        <>


                                            {/* Budget Summary Box */}
                                            <div className="m-8 bg-[#0E0E0E] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#EEDC00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                                                    <DollarSign size={18} className="text-[#EEDC00]" /> {t.ws_budget_title || "Budget Tracker"}
                                                </h3>
                                                <div className="space-y-3 relative z-10">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-400">{t.ws_budget_set || "Current Budget Set"}</span>
                                                        <span className="text-white font-mono">{currency} {budget || t.ws_empty || "Not set"}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-400">{t.ws_budget_est || "Total Est. Cost (Flight + Hotel + Acts)"}</span>
                                                        <span className="text-[#EEDC00] font-mono font-bold text-lg">
                                                            {currency} {calculateTotalBudget(itinerary).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {budget && !isNaN(Number(budget)) && (
                                                        <div className="flex justify-between items-center text-sm mt-4 pt-4 border-t border-white/10">
                                                            <span className="text-gray-400">{t.ws_budget_remain || "Budget Remaining"}</span>
                                                            <span className={`font-mono font-bold ${Number(budget) - calculateTotalBudget(itinerary) >= 0 ? "text-green-400" : "text-red-400"}`}>
                                                                {Number(budget) - calculateTotalBudget(itinerary) >= 0 ? "+" : ""}{currency} {(Number(budget) - calculateTotalBudget(itinerary)).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>


                                            {/* Vertical Timeline Section for Active Day */}
                                            <div className="bg-[#111111] pb-12 pt-6">
                                                <div className="pt-8 px-4 sm:px-8">
                                                    <div className="space-y-0">
                                                        {itinerary.days[activeDayIndex]?.activities?.map((act: any, j: number) => (
                                                            <div key={j} className="relative">
                                                                {/* Time and Marker */}
                                                                <div className="flex gap-4 items-start">
                                                                    {/* Left Time Column */}
                                                                    <div className="w-16 shrink-0 text-right pt-1">
                                                                        <div className="text-white font-bold text-sm leading-tight">{act.time.split(' ')[0]}</div>
                                                                        <div className="text-gray-500 text-xs font-medium">{act.time.split(' ').slice(1).join(' ') || ''}</div>
                                                                    </div>

                                                                    {/* Center Line & Node */}
                                                                    <div className="flex flex-col items-center shrink-0 relative w-8 min-h-[100px] -ml-2">
                                                                        {/* Node Circle */}
                                                                        <div className="w-8 h-8 rounded-full bg-[#FF7B89] flex items-center justify-center text-white font-bold text-sm z-10 shadow-[0_0_10px_rgba(255,123,137,0.3)] border-2 border-[#111]">
                                                                            {j + 1}
                                                                        </div>
                                                                        {/* Connecting Line to next activity */}
                                                                        {j < (itinerary.days[activeDayIndex].activities.length - 1) && (
                                                                            <div className="w-[2px] h-full bg-[#333] absolute top-8 bottom-0"></div>
                                                                        )}
                                                                    </div>

                                                                    {/* Right Content */}
                                                                    <div className="flex-1 pb-8">
                                                                        <div className="bg-transparent mb-1 flex flex-col sm:flex-row items-start justify-between gap-4">
                                                                            <div>
                                                                                <h4 className="font-bold text-white text-[17px] flex items-center gap-2">
                                                                                    {act.title.includes('航班') || act.title.includes('出發') ? <PlaneTakeoff size={18} className="text-gray-400" /> : null}
                                                                                    {act.title.includes('住宿') || act.title.includes('入住') ? <Building2 size={18} className="text-gray-400" /> : null}
                                                                                    {act.title}
                                                                                </h4>

                                                                                {/* Location/Address if any */}
                                                                                {act.location && (
                                                                                    <a
                                                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.location)}`}
                                                                                        target="_blank"
                                                                                        rel="noreferrer"
                                                                                        className="inline-flex text-blue-400 hover:text-blue-300 text-xs mt-1.5 items-center gap-1.5 hover:underline transition-colors w-max"
                                                                                    >
                                                                                        <MapPin size={14} /> {act.location}
                                                                                    </a>
                                                                                )}

                                                                                {/* Description */}
                                                                                <p className="text-gray-500 text-sm mt-2 leading-relaxed max-w-lg">
                                                                                    {act.description}
                                                                                </p>
                                                                            </div>

                                                                            {/* Actions/Cost */}
                                                                            <div className="flex flex-col items-end gap-2 shrink-0">
                                                                                {act.cost && act.cost !== "0" && act.cost.toLowerCase() !== "free" && (
                                                                                    <span className="text-gray-400 text-xs bg-white/5 px-2 py-1 rounded">
                                                                                        {act.cost}
                                                                                    </span>
                                                                                )}
                                                                                {act.bookingUrl && act.bookingUrl !== "#" && (
                                                                                    <a href={act.bookingUrl} target="_blank" rel="noreferrer" className="text-[#EEDC00] hover:text-[#ffe800] text-xs font-bold underline underline-offset-2">
                                                                                        {act.bookingUrl.includes('klook') ? '預訂 (Klook)' : t.ws_act_book || 'Book'}
                                                                                    </a>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>


                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-start pt-32 border border-white/5 rounded-2xl bg-[#161616]/50 relative overflow-hidden shadow-2xl">
                                {/* Beautiful blurred travel background */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105"
                                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1600&auto=format&fit=crop')` }}
                                ></div>
                                {/* Dark gradient overlay to ensure text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/80 to-[#161616]/40"></div>

                                <div className="relative z-10 px-8 text-center max-w-lg mt-12">
                                    <Globe2 size={56} className="text-[#EEDC00] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(238,220,0,0.5)]" />
                                    <h3 className="text-3xl font-black text-white mb-4 tracking-tight">{t.ws_ready_title || "Ready to explore?"}</h3>
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
