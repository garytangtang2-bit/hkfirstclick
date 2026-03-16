"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactPage() {
    return (
        <GlobalLayout>
            <ContactContent />
        </GlobalLayout>
    );
}

function ContactContent() {
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
                        Contact Us / 聯絡我們
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Got a question?
                    </h1>
                    <p className="text-gray-400 text-lg">
                        We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        有任何問題都可以留言，我們會盡快回覆。
                    </p>
                    <div className="w-24 h-1 bg-[#EEDC00] mx-auto rounded-full opacity-70 mt-8"></div>
                </div>

                {/* Success State */}
                {status === "success" ? (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-3xl p-12 text-center">
                        <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                        <p className="text-gray-400">We'll get back to you shortly. / 我們會盡快回覆你。</p>
                        <button
                            onClick={() => setStatus("idle")}
                            className="mt-8 text-[#EEDC00] font-bold hover:underline text-sm uppercase tracking-widest"
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    /* Form */
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                                Your Name / 你的名字
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="e.g. Gary"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#EEDC00]/50 focus:bg-white/8 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                                Your Email / 你的電郵
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#EEDC00]/50 focus:bg-white/8 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                                Message / 訊息
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows={6}
                                placeholder="Tell us how we can help..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#EEDC00]/50 focus:bg-white/8 transition-all resize-none"
                            />
                        </div>

                        {status === "error" && (
                            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-red-400 text-sm">
                                <AlertCircle size={18} />
                                <span>Something went wrong. Please try again. / 發送失敗，請稍後再試。</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full bg-[#EEDC00] text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-300 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {status === "loading" ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    Send Message / 傳送
                                </>
                            )}
                        </button>
                    </form>
                )}

                <div className="mt-20 text-center text-gray-600 text-sm">
                    <p>© {new Date().getFullYear()} HKfirstclick. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
