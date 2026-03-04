"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { AppProvider, useAppContext } from "@/components/AppContext";
import { Map, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

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
    return (
        <div className="min-h-screen pt-24 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
            <div className="bg-[#161616] border border-white/10 rounded-3xl p-12 max-w-2xl w-full shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-500 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

                <div className="bg-green-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10">
                    <Map className="text-green-500" size={40} />
                </div>

                <h1 className="text-4xl md:text-5xl font-black mb-4 text-white relative z-10">
                    {t.map_title_page}
                </h1>

                <div className="bg-green-500/20 text-green-400 text-sm font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-8 mx-auto relative z-10">
                    <AlertCircle size={16} /> {t.map_status}
                </div>

                <p className="text-gray-400 text-lg mb-10 leading-relaxed relative z-10">
                    {t.map_body}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                    <Link href="/workspace">
                        <button className="bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-500 transition-colors flex items-center gap-2">
                            {t.map_btn} <ArrowRight size={18} />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
