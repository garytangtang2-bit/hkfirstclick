"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { MapPin, Zap, Heart } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <GlobalLayout>
            <AboutContent />
        </GlobalLayout>
    );
}

function AboutContent() {
    return (
        <div className="min-h-screen bg-[#0A0F1E] text-white py-20 px-6">
            <div className="max-w-3xl mx-auto">

                {/* Hero */}
                <div className="text-center mb-20">
                    <div className="inline-block bg-purple-500/20 text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold mb-6 tracking-widest uppercase border border-purple-500/30">
                        Our Story / 我們的故事
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        Built by a traveler,<br />
                        <span className="text-[#EEDC00]">for travelers who hate planning.</span>
                    </h1>
                    <div className="w-24 h-1 bg-[#EEDC00] mx-auto rounded-full opacity-70"></div>
                </div>

                {/* Story */}
                <div className="space-y-12">

                    <section className="premium-glass-card p-8 border border-white/10 hover:border-[#EEDC00]/30 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[#EEDC00]/10 rounded-xl text-[#EEDC00]">
                                <MapPin size={28} />
                            </div>
                            <h2 className="text-2xl font-bold">The Problem / 痛點</h2>
                        </div>
                        <div className="text-gray-300 leading-relaxed space-y-4 text-lg">
                            <p>
                                I love traveling. I hate planning trips.
                            </p>
                            <p>
                                Every time I wanted to go somewhere new, I'd spend hours — sometimes days — jumping between Google Maps, travel blogs, YouTube videos, and forum threads. Copying hotel addresses. Cross-referencing opening hours. Trying to figure out if two attractions were even close to each other.
                            </p>
                            <p className="text-gray-400">
                                我喜歡旅行，但我很討厭規劃行程。每次出發前，都要花好幾個小時在不同網頁之間跳來跳去——查景點、查交通、查住宿、排路線。明明是為了放鬆出發，卻先把自己搞得筋疲力盡。
                            </p>
                        </div>
                    </section>

                    <section className="premium-glass-card p-8 border border-white/10 hover:border-[#EEDC00]/30 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[#EEDC00]/10 rounded-xl text-[#EEDC00]">
                                <Zap size={28} />
                            </div>
                            <h2 className="text-2xl font-bold">The Solution / 解決方案</h2>
                        </div>
                        <div className="text-gray-300 leading-relaxed space-y-4 text-lg">
                            <p>
                                So I built HKfirstclick — a tool that does the heavy lifting for you.
                            </p>
                            <p>
                                You tell it where you're going and when you land. It figures out the rest: which neighborhoods to hit, in what order, at what time, with real transit tips built in. No more tab-switching. No more second-guessing.
                            </p>
                            <p className="text-gray-400">
                                所以我做了 HKfirstclick。你只需要告訴它目的地和到達時間，它會幫你把剩下的全部搞定——哪些景點值得去、怎麼排順序、搭什麼交通、幾點出發。從此不用再在一堆網頁之間浪費時間。
                            </p>
                        </div>
                    </section>

                    <section className="premium-glass-card p-8 border border-white/10 hover:border-[#EEDC00]/30 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[#EEDC00]/10 rounded-xl text-[#EEDC00]">
                                <Heart size={28} />
                            </div>
                            <h2 className="text-2xl font-bold">Our Belief / 我們相信</h2>
                        </div>
                        <div className="text-gray-300 leading-relaxed space-y-4 text-lg">
                            <p>
                                Good travel planning shouldn't require expertise. It shouldn't take a weekend. And it definitely shouldn't feel like a second job.
                            </p>
                            <p>
                                Every traveler deserves a great itinerary — whether it's your first solo trip or your fiftieth.
                            </p>
                            <p className="text-gray-400">
                                好的行程規劃不應該需要專業知識，不應該花掉你整個週末，更不應該讓你在出發前就感到精疲力竭。無論是第一次獨自旅行，還是第五十次出走，每個旅人都值得擁有一份好行程。
                            </p>
                        </div>
                    </section>

                </div>

                {/* CTA */}
                <div className="mt-20 text-center">
                    <p className="text-gray-400 mb-8 text-lg">
                        Try it yourself — your first itinerary is on us.
                        <br />
                        <span className="text-gray-500 text-base">免費試用，無需信用卡。</span>
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/login">
                            <button className="bg-[#EEDC00] text-black px-8 py-4 rounded-xl font-black hover:bg-yellow-300 transition-all hover:scale-105 active:scale-95 text-sm uppercase tracking-widest">
                                Start Free Trial
                            </button>
                        </Link>
                        <Link href="/catalog/en">
                            <button className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all hover:scale-105 active:scale-95 text-sm uppercase tracking-widest">
                                Browse Destinations
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="mt-20 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} HKfirstclick. Made in Hong Kong 🇭🇰</p>
                </div>
            </div>
            <LayoutAnimations />
        </div>
    );
}

function LayoutAnimations() {
    return (
        <script dangerouslySetInnerHTML={{
            __html: `
                if (typeof gsap !== 'undefined') {
                    gsap.from(".premium-glass-card", {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                        stagger: 0.2,
                        ease: "power3.out"
                    });
                }
            `
        }} />
    );
}
