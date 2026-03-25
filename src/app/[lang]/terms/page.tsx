"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { useAppContext } from "@/components/AppContext";
import { FileText, CreditCard, RefreshCw, Mail, AlertCircle } from "lucide-react";

export default function TermsPage() {
    return (
        <GlobalLayout>
            <TermsContent />
        </GlobalLayout>
    );
}

function TermsContent() {
    const { t } = useAppContext();

    return (
        <div className="min-h-screen bg-[#0A0F1E] text-white py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold heading-premium mb-6">
                        Terms of Service
                    </h1>
                    <p className="text-gray-400 text-lg">服務條款</p>
                    <div className="w-24 h-1 bg-[#EEDC00] mx-auto rounded-full opacity-70 mt-6"></div>
                    <p className="text-gray-500 text-sm mt-6">Last updated: March 2026</p>
                </div>

                <div className="space-y-12">

                    {/* Free Trial */}
                    <section className="premium-glass-card p-8 border border-white/10 hover:border-[#EEDC00]/30 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[#EEDC00]/10 rounded-xl text-[#EEDC00]">
                                <FileText size={28} />
                            </div>
                            <h2 className="text-2xl font-bold">Free Trial / 免費試用</h2>
                        </div>
                        <div className="text-gray-300 leading-relaxed space-y-4">
                            <p>Every new account receives <span className="text-[#EEDC00] font-bold">6 trial Credits</span> upon registration — no credit card required.</p>
                            <p>每個新帳號在完成註冊後，將自動獲得 <span className="text-[#EEDC00] font-bold">6 點體驗點數</span>，無需綁定信用卡。</p>
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-2 text-sm text-gray-400">
                                <p>• Generating an itinerary costs <strong className="text-white">5 Credits</strong></p>
                                <p>• Editing an existing itinerary costs <strong className="text-white">1 Credit</strong></p>
                                <p>• Free users can preview generated results but cannot make edits without upgrading</p>
                                <p className="border-t border-white/10 pt-2 mt-2">
                                    • 產生行程消耗 <strong className="text-white">5 點</strong>，修改行程消耗 <strong className="text-white">1 點</strong>
                                </p>
                                <p>• 免費用戶可預覽生成結果，如需修改需升級方案</p>
                            </div>
                        </div>
                    </section>

                    {/* Pricing & Credits */}
                    <section className="premium-glass-card p-8 border border-white/10 hover:border-[#EEDC00]/30 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[#EEDC00]/10 rounded-xl text-[#EEDC00]">
                                <CreditCard size={28} />
                            </div>
                            <h2 className="text-2xl font-bold">Pricing & Credits / 定價與點數</h2>
                        </div>
                        <div className="text-gray-300 leading-relaxed space-y-6">
                            <p>We offer the following plans. All prices are in US Dollars (USD).</p>
                            <p>所有方案價格以美元（USD）計算。</p>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-center">
                                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Travel Pass</p>
                                    <p className="text-3xl font-black text-[#EEDC00]">$7.99</p>
                                    <p className="text-gray-500 text-xs mt-1">USD · one-time</p>
                                    <p className="text-gray-400 text-sm mt-3">Credit pack for casual travelers</p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-5 border border-purple-500/30 text-center">
                                    <p className="text-purple-400 text-xs uppercase tracking-widest mb-2">Travel Expert</p>
                                    <p className="text-3xl font-black text-purple-300">$46.99</p>
                                    <p className="text-gray-500 text-xs mt-1">USD · one-time</p>
                                    <p className="text-gray-400 text-sm mt-3">Large Credit pack — best value</p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-center">
                                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Top-Up Pack</p>
                                    <p className="text-3xl font-black text-white">$1.99</p>
                                    <p className="text-gray-500 text-xs mt-1">USD · one-time</p>
                                    <p className="text-gray-400 text-sm mt-3">Small Credit top-up</p>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-sm text-gray-400 space-y-2">
                                <p className="text-white font-bold mb-3">Credit Rules / 點數規則</p>
                                <p>• All purchases are one-time payments — no subscription, no auto-renewal.</p>
                                <p>• Credits are non-transferable and tied to your account.</p>
                                <p>• 所有購買均為一次性付款，無訂閱、無自動續費。</p>
                                <p>• 點數不可轉讓，與您的帳號綁定。</p>
                            </div>
                        </div>
                    </section>

                    {/* Refund Policy */}
                    <section className="premium-glass-card p-8 border border-white/10 hover:border-[#EEDC00]/30 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[#EEDC00]/10 rounded-xl text-[#EEDC00]">
                                <RefreshCw size={28} />
                            </div>
                            <h2 className="text-2xl font-bold">Refund Policy / 退款政策</h2>
                        </div>
                        <div className="text-gray-300 leading-relaxed space-y-4">
                            <p>All purchases are <strong className="text-white">one-time and non-refundable</strong>. Credits are delivered immediately upon payment and are ready to use.</p>
                            <p>所有購買均為<strong className="text-white">一次性消費，恕不退款</strong>。點數於付款後立即生效，可直接使用。</p>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-sm text-gray-400">
                                <p>• We encourage you to use the free trial Credits before purchasing to ensure the service meets your needs.</p>
                                <p>• 我們建議您先使用免費體驗點數，確認服務符合需求後再進行購買。</p>
                            </div>
                        </div>
                    </section>

                    {/* Acceptable Use */}
                    <section className="premium-glass-card p-8 border border-white/10 hover:border-[#EEDC00]/30 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[#EEDC00]/10 rounded-xl text-[#EEDC00]">
                                <AlertCircle size={28} />
                            </div>
                            <h2 className="text-2xl font-bold">Acceptable Use / 使用規範</h2>
                        </div>
                        <div className="text-gray-300 leading-relaxed space-y-4">
                            <p>HKfirstclick is intended for personal travel planning. You agree not to:</p>
                            <p>本服務僅供個人旅遊規劃用途，您同意不得：</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400 text-sm">
                                <li>Resell or commercially redistribute generated itineraries without permission / 未經許可轉售或商業轉發生成的行程</li>
                                <li>Attempt to reverse-engineer or abuse the AI system / 嘗試逆向工程或濫用 AI 系統</li>
                                <li>Create multiple accounts to circumvent the free trial limits / 建立多個帳號以規避試用限制</li>
                            </ul>
                            <p className="text-sm text-gray-500">We reserve the right to suspend accounts that violate these terms. 違反條款的帳號將被暫停服務。</p>
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="premium-glass-card p-8 border border-white/10 hover:border-[#EEDC00]/30 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[#EEDC00]/10 rounded-xl text-[#EEDC00]">
                                <Mail size={28} />
                            </div>
                            <h2 className="text-2xl font-bold">Contact Us / 聯絡我們</h2>
                        </div>
                        <div className="text-gray-300 leading-relaxed">
                            <p>Questions about these terms? Reach us at:</p>
                            <p className="text-gray-400 mt-1">如對本條款有任何疑問，請聯絡：</p>
                            <a
                                href="mailto:garytangtang2@gmail.com"
                                className="inline-block mt-4 text-[#EEDC00] font-bold hover:underline text-lg"
                            >
                                garytangtang2@gmail.com
                            </a>
                        </div>
                    </section>

                </div>

                <div className="mt-20 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} HKfirstclick. All rights reserved.</p>
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
