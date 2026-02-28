"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { AppProvider, useAppContext } from "@/components/AppContext";
import { useState, useEffect } from "react";
import { Calendar, CheckCircle2, DollarSign, Globe2, Loader2, MapPin, Sparkles, Ticket, Download, Lightbulb, Target, Route, Luggage, Info } from "lucide-react";
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

    // Form States
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [dates, setDates] = useState({ start: "", end: "" });

    // Preferences States  
    const [style, setStyle] = useState("balanced");
    const [purposes, setPurposes] = useState<string[]>([]);
    const [budget, setBudget] = useState("");
    const [requests, setRequests] = useState("");

    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
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
                    preferences: { style, purposes, budget, requests },
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
                    <div className="w-full lg:w-1/3 flex flex-col gap-8">
                        {!itinerary ? (
                            <>
                                <div>
                                    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 space-y-6">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <Globe2 size={14} /> {t.input_origin}
                                            </label>
                                            <AutocompleteInput
                                                value={origin}
                                                onChange={setOrigin}
                                                placeholder={t.input_origin_ph}
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
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <Calendar size={14} /> {t.date_start}
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        value={dates.start}
                                                        onChange={(e) => setDates({ ...dates, start: e.target.value })}
                                                        className="w-full bg-[#0E0E0E] min-h-[50px] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] transition-colors relative z-10 bg-transparent [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit]:text-transparent [&::-webkit-datetime-edit]:selection:bg-transparent"
                                                    />
                                                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 pointer-events-none z-0 text-white font-medium flex items-center justify-between">
                                                        <span>{dates.start || t.date_ph}</span>
                                                        <Calendar size={18} className="text-gray-500" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <Calendar size={14} /> {t.date_end}
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        value={dates.end}
                                                        onChange={(e) => setDates({ ...dates, end: e.target.value })}
                                                        className="w-full bg-[#0E0E0E] min-h-[50px] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] transition-colors relative z-10 bg-transparent [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit]:text-transparent [&::-webkit-datetime-edit]:selection:bg-transparent"
                                                    />
                                                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 pointer-events-none z-0 text-white font-medium flex items-center justify-between">
                                                        <span>{dates.end || t.date_ph}</span>
                                                        <Calendar size={18} className="text-gray-500" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 space-y-6 mt-6">
                                        <h3 className="font-bold flex items-center gap-2 text-white">
                                            <Sparkles size={16} className="text-[#EEDC00]" /> {t.pref_title}
                                        </h3>

                                        <div>
                                            <label className="text-sm font-medium text-gray-300 mb-3 block">{t.q1_title}</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { id: "backpacker", title: t.style_bp },
                                                    { id: "balanced", title: t.style_bal },
                                                    { id: "luxury", title: t.style_lux }
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
                                                className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-300 mb-3 block">{t.q4_title}</label>
                                            <textarea
                                                placeholder={t.q4_ph}
                                                value={requests}
                                                onChange={(e) => setRequests(e.target.value)}
                                                rows={3}
                                                className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] transition-colors resize-none"
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
                                    <h1 className="text-3xl font-bold mb-2 text-white">微調您的行程</h1>
                                    <p className="text-gray-400 text-sm mb-6">不喜歡某個景點？想晚點起床？告訴 AI 編輯您的專屬行程。</p>
                                </div>
                                <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                                    <textarea
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        placeholder="例如：把第一天下午的行程改成適合帶長輩去的無障礙景點，晚上想吃海鮮..."
                                        rows={5}
                                        className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] transition-colors resize-none"
                                    />
                                    {error && <p className="text-red-400 text-sm">{error}</p>}
                                    <button
                                        onClick={handleUpdateItinerary}
                                        disabled={loading || !chatMessage.trim()}
                                        className="w-full py-3 rounded-xl font-bold border border-[#EEDC00] text-[#EEDC00] hover:bg-[#EEDC00] hover:text-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? <><Loader2 size={16} className="animate-spin" /> 處理中...</> : "更新行程"}
                                    </button>
                                    <button
                                        onClick={() => setItinerary(null)}
                                        className="w-full py-3 rounded-xl font-bold text-gray-500 hover:text-white transition-colors"
                                    >
                                        重新規劃全新行程
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Preview Panel */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-4">
                        {itinerary ? (
                            <>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleExportImage}
                                        disabled={exporting}
                                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                        儲存為長截圖 (Save Image)
                                    </button>
                                </div>
                                <div id="exportable-itinerary" className="bg-[#161616] border border-white/10 rounded-3xl pb-8 overflow-hidden min-h-full shadow-2xl">
                                    {/* Hero Image */}
                                    <div
                                        className="w-full h-80 bg-cover bg-center relative"
                                        style={{ backgroundImage: `url('https://image.pollinations.ai/prompt/beautiful%20scenic%20photo%20of%20${encodeURIComponent(itinerary.destination || itinerary.heroImageKeyword || destination)}?width=1600&height=500&nologo=true')` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/40 to-transparent"></div>
                                        <div className="absolute bottom-6 left-8 right-8">
                                            <div className="text-xs font-bold bg-[#EEDC00] text-black px-2 py-1 rounded w-max tracking-widest mb-3 flex items-center gap-2">
                                                <Sparkles size={14} /> {t.rev_ai_tag}
                                            </div>
                                            <h2 className="text-5xl font-black text-white glow-text">{itinerary.destination || destination}</h2>
                                            <p className="text-gray-200 mt-2 text-lg">{dates.start} — {dates.end}</p>
                                        </div>
                                    </div>

                                    <div className="px-8 mt-8">
                                        {/* Booking Suggestions Section */}
                                        {(itinerary.flights || itinerary.hotel) && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                                                {itinerary.flights && (
                                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                                                        <div className="flex items-center gap-2 text-sm text-gray-400 font-bold uppercase tracking-wider">
                                                            ✈️ 去程航班 {itinerary.flights.outbound?.airline}
                                                        </div>
                                                        <div className="flex justify-between items-center text-white">
                                                            <span className="text-xl font-bold">{itinerary.flights.outbound?.departureTime}</span>
                                                            <div className="h-[1px] flex-1 bg-white/20 mx-4 relative">
                                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-4 border-t-transparent border-l-[6px] border-l-white/40 border-b-4 border-b-transparent"></div>
                                                            </div>
                                                            <span className="text-xl font-bold">{itinerary.flights.outbound?.arrivalTime}</span>
                                                        </div>
                                                        <div className="bg-red-500/10 text-red-300 text-xs p-2 rounded-lg mt-1 border border-red-500/20">
                                                            ⚠️ {itinerary.flights.outbound?.airportArrivalInstruction || "建議至少提早2小時到達機場"}
                                                        </div>
                                                        <div className="flex justify-between items-center mt-2 pt-3 border-t border-white/5">
                                                            <span className="text-[#EEDC00] font-bold">{itinerary.flights.outbound?.estCost}</span>
                                                            <a href={itinerary.flights.outbound?.bookingUrl || "#"} target="_blank" rel="noreferrer" className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
                                                                查看機票
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}

                                                {itinerary.hotel && (
                                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                                                        <div className="flex items-center gap-2 text-sm text-gray-400 font-bold uppercase tracking-wider">
                                                            🏨 推薦住宿
                                                        </div>
                                                        <div className="text-lg font-bold text-white mt-1">
                                                            {itinerary.hotel.name}
                                                        </div>
                                                        <div className="text-gray-400 text-sm mt-1 flex justify-between">
                                                            <span>In: {itinerary.hotel.checkIn}</span>
                                                            <span>Out: {itinerary.hotel.checkOut}</span>
                                                        </div>
                                                        <div className="mt-auto flex justify-between items-center pt-3 border-t border-white/5">
                                                            <span className="text-[#EEDC00] font-bold">{itinerary.hotel.estCost}</span>
                                                            <a href={itinerary.hotel.bookingUrl || "#"} target="_blank" rel="noreferrer" className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
                                                                預訂飯店
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Render AI Generate Itinerary Output here */}
                                        <div className="space-y-12">
                                            {itinerary.days?.map((day: any, i: number) => (
                                                <div key={i} className="relative">
                                                    {/* Timeline Line */}
                                                    <div className="absolute left-6 top-16 bottom-0 w-[2px] bg-white/5"></div>

                                                    <div className="sticky top-16 bg-[#161616]/95 backdrop-blur z-10 py-4 border-b border-white/5 mb-6">
                                                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                                            <span className="bg-[#EEDC00] w-8 h-8 rounded-full flex items-center justify-center text-sm text-black shadow-lg shadow-[#EEDC00]/20">
                                                                {i + 1}
                                                            </span>
                                                            <span className="text-[#EEDC00]">Day {i + 1}</span>
                                                        </h3>
                                                    </div>

                                                    <div className="space-y-6">
                                                        {day.activities?.map((act: any, j: number) => (
                                                            <div key={j} className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group ml-[52px]">
                                                                {/* Timeline Dot */}
                                                                <div className="absolute left-[21px] w-3 h-3 rounded-full bg-gray-500 border-4 border-[#161616] -translate-x-1/2 mt-1 z-10 group-hover:bg-[#EEDC00] transition-colors"></div>

                                                                <div className="flex gap-4">
                                                                    <div className="w-20 text-sm text-[#EEDC00] font-mono pt-0.5 shrink-0 font-bold">
                                                                        {act.time}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h4 className="font-bold text-white text-lg">{act.title}</h4>
                                                                        <p className="text-gray-400 text-sm mt-2 mb-3 leading-relaxed">{act.description}</p>
                                                                        <div className="flex flex-wrap items-center gap-2">
                                                                            {act.location && (
                                                                                <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 hover:underline cursor-pointer bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                                                                                    <MapPin size={12} /> {act.location}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right shrink-0 flex flex-col items-end gap-2">
                                                                        {act.cost && act.cost !== "0" && act.cost.toLowerCase() !== "free" && (
                                                                            <span className="font-mono text-gray-500 font-medium bg-[#111] px-2 py-1 rounded text-xs border border-white/5">
                                                                                {act.cost}
                                                                            </span>
                                                                        )}
                                                                        {act.bookingUrl && act.bookingUrl !== "#" && (
                                                                            <a href={act.bookingUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center bg-transparent border border-[#EEDC00]/50 text-[#EEDC00] hover:bg-[#EEDC00]/10 text-xs px-3 py-1.5 rounded-md mt-1 transition-colors h-full max-h-8">
                                                                                <Ticket size={12} className="mr-1.5" /> 預訂活動
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Budget Summary Box */}
                                        <div className="mt-16 bg-[#0E0E0E] border border-white/10 rounded-2xl p-6">
                                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                <DollarSign size={18} className="text-[#EEDC00]" /> 預算追蹤清單
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-400">當前設定總預算</span>
                                                    <span className="text-white font-mono">{currency} {budget || "未設定"}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-400">總計預估花費 (機票+住宿+當地活動)</span>
                                                    <span className="text-[#EEDC00] font-mono font-bold text-lg">
                                                        {currency} {calculateTotalBudget(itinerary).toLocaleString()}
                                                    </span>
                                                </div>
                                                {budget && !isNaN(Number(budget)) && (
                                                    <div className="flex justify-between items-center text-sm mt-4 pt-4 border-t border-white/10">
                                                        <span className="text-gray-400">預算結餘</span>
                                                        <span className={`font-mono font-bold ${Number(budget) - calculateTotalBudget(itinerary) >= 0 ? "text-green-400" : "text-red-400"}`}>
                                                            {Number(budget) - calculateTotalBudget(itinerary) >= 0 ? "+" : ""}{currency} {(Number(budget) - calculateTotalBudget(itinerary)).toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-[#161616] border border-white/5 rounded-3xl h-full min-h-[600px] flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
                                {/* Beautiful blurred travel background */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105"
                                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1600&auto=format&fit=crop')` }}
                                ></div>
                                {/* Dark gradient overlay to ensure text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/80 to-[#161616]/40"></div>

                                <div className="relative z-10 px-8">
                                    <Globe2 size={56} className="text-[#EEDC00] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(238,220,0,0.5)]" />
                                    <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Ready to explore?</h3>
                                    <p className="text-gray-300 max-w-sm mx-auto leading-relaxed">
                                        Fill out your travel details on the left. Our AI will instantly craft a perfect, personalized daily itinerary for your next adventure.
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
