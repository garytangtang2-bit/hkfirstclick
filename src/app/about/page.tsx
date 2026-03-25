"use client";

import GlobalLayout from "@/components/GlobalLayout";
import Link from "next/link";

const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Gary Tang",
    "jobTitle": "Founder & Developer",
    "worksFor": {
        "@type": "Organization",
        "name": "HKfirstclick",
        "url": "https://www.hkfirstclick.com",
    },
    "description": "Hong Kong-based indie developer and frequent traveler. Built HKfirstclick to solve the frustration of manual trip planning with AI-powered itinerary generation.",
    "url": "https://www.hkfirstclick.com/about",
    "knowsAbout": ["Travel Planning", "AI Technology", "Hong Kong Travel", "Asia Travel Itineraries"],
    "sameAs": [
        "https://www.instagram.com/hkfirstclick",
        "https://www.facebook.com/hkfirstclick",
    ],
};

export default function AboutPage() {
    return (
        <GlobalLayout>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
            />
            <AboutContent />
        </GlobalLayout>
    );
}

function AboutContent() {
    return (
        <div className="min-h-screen bg-[#0A0F1E] text-white">

            {/* Hero */}
            <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden flex items-end">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/60 to-transparent" />
                <div className="relative z-10 px-6 md:px-16 pb-14 max-w-4xl">
                    <div className="inline-block bg-[#EEDC00]/20 text-[#EEDC00] px-3 py-1 rounded-full text-xs font-bold mb-4 tracking-widest uppercase border border-[#EEDC00]/30">
                        關於我們
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                        讓規劃行程<br />不再是一件麻煩事
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 md:px-8 py-16 space-y-14">

                {/* Origin story */}
                <section className="space-y-5">
                    <h2 className="text-xl font-bold text-[#EEDC00]">為什麼會有這個網站</h2>
                    <div className="text-gray-300 leading-relaxed space-y-4 text-base md:text-lg">
                        <p>
                            旅行應該是開心的事，但規劃行程通常不是。
                        </p>
                        <p>
                            訂機票之後，才是最頭痛的開始——哪些景點值得去？順序怎麼排？幾點出發比較合理？附近有什麼好吃的？交通要怎麼走？光是把這些問題搞清楚，就已經花掉大半個週末。
                        </p>
                        <p>
                            HKfirstclick 就是為了解決這個問題而建立的。我們希望讓規劃行程這件事，變得快一點、簡單一點。
                        </p>
                    </div>
                </section>

                <div className="border-t border-white/10" />

                {/* What it does */}
                <section className="space-y-5">
                    <h2 className="text-xl font-bold text-[#EEDC00]">怎麼用</h2>
                    <div className="text-gray-300 leading-relaxed space-y-4 text-base md:text-lg">
                        <p>
                            你只需要填入出發地、目的地、日期，以及你這次旅行的主要目的——想輕鬆還是想玩得充實、喜歡文化還是美食——剩下的交給我們。
                        </p>
                        <p>
                            系統會根據你填的資料，生成一份每日行程，包括景點安排、時間規劃和交通建議，讓你有一個可以直接參考的出發點。
                        </p>
                        <p className="text-gray-400">
                            目前支援超過 50 個熱門城市、12 種語言，持續增加中。
                        </p>
                    </div>
                </section>

                <div className="border-t border-white/10" />

                {/* Who */}
                <section className="space-y-5">
                    <h2 className="text-xl font-bold text-[#EEDC00]">我們是誰</h2>
                    <div className="text-gray-300 leading-relaxed space-y-4 text-base md:text-lg">
                        <p>
                            HKfirstclick 是一個香港獨立開發項目，由 Gary Tang 建立。他是一位旅遊愛好者兼軟體開發者，走訪過亞洲、歐洲、中東超過 30 個城市，深知規劃行程有多耗時。
                        </p>
                        <p>
                            沒有大團隊，沒有投資方。目的地內容由 AI 生成後，經過人工審核確保資訊準確，並定期根據用戶反饋更新。
                        </p>
                        <p className="text-gray-400">
                            如果你有任何建議、反饋，或者只是想說說你的旅行體驗，我們很樂意聽。
                        </p>
                    </div>

                    {/* Author card - E-E-A-T signal */}
                    <div className="mt-6 flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#EEDC00] to-yellow-300 flex items-center justify-center text-black font-black text-lg shrink-0">G</div>
                        <div>
                            <p className="text-white font-bold text-sm">Gary Tang</p>
                            <p className="text-gray-400 text-xs">Founder · Hong Kong · 旅遊 &amp; 技術開發者</p>
                            <p className="text-gray-500 text-xs mt-0.5">走訪 30+ 城市 · 內容最後審核：{new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })}</p>
                        </div>
                    </div>
                </section>

                <div className="border-t border-white/10" />

                {/* Trust signals */}
                <section className="space-y-5">
                    <h2 className="text-xl font-bold text-[#EEDC00]">內容品質保證</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { icon: "🗺️", title: "54+ 目的地", desc: "涵蓋亞洲、歐洲、美洲、中東" },
                            { icon: "🌐", title: "12 種語言", desc: "繁中、日、韓、阿拉伯語等" },
                            { icon: "✅", title: "人工審核", desc: "AI 生成內容經過人工驗證" },
                        ].map((item) => (
                            <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                <div className="text-2xl mb-2">{item.icon}</div>
                                <p className="text-white font-bold text-sm">{item.title}</p>
                                <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                    <Link href="/workspace">
                        <button className="bg-[#EEDC00] text-black px-8 py-4 rounded-xl font-black hover:bg-yellow-300 transition-colors text-sm uppercase tracking-widest">
                            立即生成行程
                        </button>
                    </Link>
                    <Link href="/contact">
                        <button className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors text-sm uppercase tracking-widest">
                            聯絡我們
                        </button>
                    </Link>
                </div>

                <div className="pt-8 text-gray-600 text-sm">
                    <p>© {new Date().getFullYear()} HKfirstclick. Made in Hong Kong</p>
                </div>
            </div>
        </div>
    );
}
