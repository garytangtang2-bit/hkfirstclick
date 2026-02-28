"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { AppProvider, useAppContext } from "@/components/AppContext";
import { Plane, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Flights() {
    return (
        <AppProvider>
            <GlobalLayout>
                <FlightsContent />
            </GlobalLayout>
        </AppProvider>
    );
}

function FlightsContent() {
    const { t } = useAppContext();

    return (
        <div className="min-h-screen pt-24 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
            <div className="bg-[#161616] border border-white/10 rounded-3xl p-12 max-w-2xl w-full shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#EEDC00] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

                <div className="bg-[#EEDC00]/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10">
                    <Plane className="text-[#EEDC00]" size={40} />
                </div>

                <h1 className="text-4xl md:text-5xl font-black mb-4 text-white relative z-10">
                    航班預訂
                </h1>

                <div className="bg-[#EEDC00]/20 text-[#EEDC00] text-sm font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-8 mx-auto relative z-10">
                    <AlertCircle size={16} /> 即將推出 (Coming Soon)
                </div>

                <p className="text-gray-400 text-lg mb-10 leading-relaxed relative z-10">
                    我們正在整合全球各大航空公司的即時票價系統。未來您將能直接在這裡尋找、比較並無縫預訂 AI 為您推薦的最佳航班組合。敬請期待！
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                    <Link href="/workspace">
                        <button className="bg-[#EEDC00] text-black px-8 py-3.5 rounded-xl font-bold hover:bg-[#ffe600] transition-colors flex items-center gap-2">
                            先去規劃行程 <ArrowRight size={18} />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
