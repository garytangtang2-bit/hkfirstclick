"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer({ t }: { t: any }) {
    return (
        <footer className="w-full py-12 px-6 border-t border-white/5 bg-[#0A0F1E] relative z-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start gap-2">
                    <Link href="/" className="text-xl font-bold text-[#EEDC00] tracking-tighter">
                        HKfirstclick
                    </Link>
                    <p className="text-gray-500 text-sm font-medium">
                        {t.footer_copyright?.replace("{year}", new Date().getFullYear().toString()) || `© ${new Date().getFullYear()} All rights reserved.`}
                    </p>
                    <p className="text-purple-400 text-xs font-semibold">
                        <span className="flex items-center gap-1.5"><Sparkles size={12} />{t.footer_free_trial || "Free trial included — no credit card needed"}</span>
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 text-sm font-bold uppercase tracking-widest">
                    <Link href="/about" className="text-gray-400 hover:text-[#EEDC00] transition-colors">
                        {t.footer_about || "About"}
                    </Link>
                    <Link href="/privacy" className="text-gray-400 hover:text-[#EEDC00] transition-colors">
                        {t.footer_privacy}
                    </Link>
                    <Link href="/terms" className="text-gray-400 hover:text-[#EEDC00] transition-colors">
                        {t.footer_terms}
                    </Link>
                    <Link href="/pricing" className="text-gray-400 hover:text-[#EEDC00] transition-colors">
                        {t.nav_pricing}
                    </Link>
                    <Link href="/contact" className="text-gray-400 hover:text-[#EEDC00] transition-colors">
                        {t.footer_contact}
                    </Link>
                </div>

                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-gray-400 hover:text-[#EEDC00] cursor-pointer transition-all">
                        <i className="fab fa-facebook-f text-xs"></i>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-gray-400 hover:text-[#EEDC00] cursor-pointer transition-all">
                        <i className="fab fa-instagram text-xs"></i>
                    </div>
                </div>
            </div>
        </footer>
    );
}
