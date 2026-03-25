"use client";
import GlobalLayout from "@/components/GlobalLayout";
import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { useAppContext } from "@/components/AppContext";

export default function ContactPage() {
    return (
        <GlobalLayout>
            <ContactContent />
        </GlobalLayout>
    );
}

function ContactContent() {
    const { t } = useAppContext();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            if (res.ok) {
                setStatus("success");
                setName("");
                setEmail("");
                setMessage("");
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0F1E] text-white py-20 px-6">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block bg-purple-500/20 text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold mb-6 tracking-widest uppercase border border-purple-500/30">
                        {t.contact_us_badge}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                        {t.contact_title}
                    </h1>
                    <p className="text-gray-400 text-lg">
                        {t.contact_desc_1}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        {t.contact_desc_2}
                    </p>
                    <div className="w-24 h-1 bg-[#EEDC00] mx-auto rounded-full opacity-70 mt-8"></div>
                </div>

                {/* Success State */}
                {status === "success" ? (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-3xl p-12 text-center">
                        <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">{t.contact_success_title}</h2>
                        <p className="text-gray-400">{t.contact_success_desc}</p>
                        <button
                            onClick={() => setStatus("idle")}
                            className="mt-8 text-[#EEDC00] font-bold hover:underline text-sm uppercase tracking-widest"
                        >
                            {t.contact_send_another}
                        </button>
                    </div>
                ) : (
                    /* Form */
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                                {t.contact_label_name}
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder={t.contact_placeholder_name}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#EEDC00]/50 focus:bg-white/8 transition-colors duration-150"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                                {t.contact_label_email}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder={t.contact_placeholder_email}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#EEDC00]/50 focus:bg-white/8 transition-colors duration-150"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                                {t.contact_label_message}
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows={6}
                                placeholder={t.contact_placeholder_message}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#EEDC00]/50 focus:bg-white/8 transition-colors duration-150 resize-none"
                            />
                        </div>

                        {status === "error" && (
                            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-red-400 text-sm">
                                <AlertCircle size={18} />
                                <span>{t.contact_error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full bg-[#EEDC00] text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-300 [transition:transform_200ms_ease,background-color_200ms_ease] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {status === "loading" ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    {t.contact_btn_sending}
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    {t.contact_btn_send}
                                </>
                            )}
                        </button>
                    </form>
                )}

                <div className="mt-20 text-center text-gray-600 text-sm">
                    <p>{t.footer_copyright?.replace("{year}", new Date().getFullYear().toString()) || `© ${new Date().getFullYear()} HKfirstclick. All rights reserved.`}</p>
                </div>
            </div>
        </div>
    );
}
