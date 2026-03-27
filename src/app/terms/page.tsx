"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { useAppContext } from "@/components/AppContext";
import { FileText, CreditCard, RefreshCw, Mail, AlertCircle, Users } from "lucide-react";

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

                    {/* Affiliate Program */}
                    <section className="premium-glass-card p-8 border border-white/10 hover:border-[#EEDC00]/30 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[#EEDC00]/10 rounded-xl text-[#EEDC00]">
                                <Users size={28} />
                            </div>
                            <h2 className="text-2xl font-bold">Affiliate Program / 聯盟推廣計劃</h2>
                        </div>
                        <div className="text-gray-300 leading-relaxed space-y-4">
                            <p>HKfirstclick operates an affiliate referral program. By joining, you agree to the following terms:</p>
                            <p className="text-gray-400">HKfirstclick 設有聯盟推廣計劃。加入即代表您同意以下條款：</p>
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3 text-sm text-gray-300">
                                <p>• <strong className="text-white">Disclosure requirement:</strong> You must clearly disclose your affiliate relationship when promoting HKfirstclick. This includes adding a statement such as <em>"This is an affiliate link — I earn a commission if you make a purchase"</em> in all promotional content, including but not limited to social media posts, blog articles, videos, and emails.</p>
                                <p className="text-gray-400">• <strong className="text-white">披露要求：</strong>推廣 HKfirstclick 時，您必須清楚聲明您與本平台的推廣夥伴關係，例如：「此為推廣連結，若您完成購買，本人將獲得佣金。」此要求適用於所有推廣內容，包括但不限於社交媒體、文章、影片及電郵。</p>

                                <p>• <strong className="text-white">Prohibited conduct:</strong> Affiliates may not use misleading, deceptive, or spam-based promotion methods. Self-referrals (referring yourself) are strictly prohibited and will result in immediate account suspension.</p>
                                <p className="text-gray-400">• <strong className="text-white">禁止行為：</strong>推廣夥伴不得使用誤導性、欺騙性或垃圾訊息方式推廣。嚴禁自我推薦（使用自己的推廣連結購買），違者將被立即暫停帳號。</p>

                                <p>• <strong className="text-white">Commission:</strong> Commissions are calculated as a percentage of the referred sale (USD) and are subject to a minimum payout threshold set by the affiliate. HKfirstclick reserves the right to adjust commission rates with 30 days notice.</p>
                                <p className="text-gray-400">• <strong className="text-white">佣金：</strong>佣金按推薦銷售額（美元）的百分比計算，並須達到推廣夥伴設定的最低出款金額方可提取。HKfirstclick 保留在提前30天通知的情況下調整佣金比率的權利。</p>

                                <p>• <strong className="text-white">Payout:</strong> Payouts are made via PayPal only. All PayPal transaction fees are covered by HKfirstclick. Payouts are processed within 14 days of reaching the minimum threshold.</p>
                                <p className="text-gray-400">• <strong className="text-white">出款：</strong>僅支援 PayPal 出款，所有 PayPal 手續費由 HKfirstclick 承擔。達到最低出款門檻後，將於14個工作天內處理。</p>

                                <p>• <strong className="text-white">Termination:</strong> HKfirstclick reserves the right to terminate any affiliate account that violates these terms, engages in fraudulent activity, or causes reputational harm to HKfirstclick. Pending commissions from fraudulent activity will be forfeited.</p>
                                <p className="text-gray-400">• <strong className="text-white">終止：</strong>HKfirstclick 保留終止任何違反條款、從事欺詐行為或損害 HKfirstclick 聲譽的推廣夥伴帳號之權利。欺詐行為所產生的待付佣金將被沒收。</p>

                                <p>• <strong className="text-white">Compliance:</strong> Affiliates are responsible for complying with all applicable laws and regulations in their jurisdiction, including FTC guidelines (US), ASA rules (UK), and GDPR (EU) where applicable.</p>
                                <p className="text-gray-400">• <strong className="text-white">合規：</strong>推廣夥伴須自行遵守所在地區的所有適用法律法規，包括美國 FTC 指引、英國 ASA 規則及歐盟 GDPR 等。</p>
                            </div>
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
                                href="mailto:itsmiravale115@gmail.com"
                                className="inline-block mt-4 text-[#EEDC00] font-bold hover:underline text-lg"
                            >
                                itsmiravale115@gmail.com
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
