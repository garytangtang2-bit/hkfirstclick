"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { useAppContext } from "@/components/AppContext";
import { Mail, Shield, Database, UserCheck } from "lucide-react";

export default function PrivacyPage() {
    return (
        <GlobalLayout>
            <PrivacyContent />
        </GlobalLayout>
    );
}

function PrivacyContent() {
    const { t } = useAppContext();

    return (
        <div className="min-h-screen bg-[#0A0F1E] text-white py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold heading-premium mb-6">
                        {t.privacy_title || "Privacy Policy / 隱私權政策"}
                    </h1>
                    <div className="w-24 h-1 bg-[#EEDC00] mx-auto rounded-full opacity-70"></div>
                </div>

                <div className="space-y-12">
                    {/* Information Collection */}
                    <section className="premium-glass-card p-8 border border-white/10 hover:border-[#EEDC00]/30 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[#EEDC00]/10 rounded-xl text-[#EEDC00]">
                                <Database size={28} />
                            </div>
                            <h2 className="text-2xl font-bold">
                                {t.privacy_collect_title || "Information Collection / 收集哪些資料"}
                            </h2>
                        </div>
                        <div className="text-gray-300 leading-relaxed space-y-4">
                            <p>{t.privacy_collect_intro || "為了提供更優質的服務，我們在您使用 Google 帳號登入時會收集以下必要資料："}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400">
                                <li>{t.privacy_collect_item1 || "Google 帳號提供的 Email"}</li>
                                <li>{t.privacy_collect_item2 || "Google 帳號提供的頭像"}</li>
                                <li>{t.privacy_collect_item3 || "Google 帳號提供的姓名"}</li>
                            </ul>
                        </div>
                    </section>

                    {/* Data Usage */}
                    <section className="premium-glass-card p-8 border border-white/10 hover:border-[#EEDC00]/30 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[#EEDC00]/10 rounded-xl text-[#EEDC00]">
                                <UserCheck size={28} />
                            </div>
                            <h2 className="text-2xl font-bold">
                                {t.privacy_usage_title || "Data Usage / 資料用途"}
                            </h2>
                        </div>
                        <div className="text-gray-300 leading-relaxed space-y-4">
                            <p>{t.privacy_usage_intro || "收集的資料僅用於以下特定用途："}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400">
                                <li>{t.privacy_usage_item1 || "建立與管理您的用戶帳號"}</li>
                                <li>{t.privacy_usage_item2 || "保存您生成的旅遊行程"}</li>
                                <li>{t.privacy_usage_item3 || "透過 Stripe 處理安全的支付交易"}</li>
                            </ul>
                        </div>
                    </section>

                    {/* Data Protection */}
                    <section className="premium-glass-card p-8 border border-white/10 hover:border-[#EEDC00]/30 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[#EEDC00]/10 rounded-xl text-[#EEDC00]">
                                <Shield size={28} />
                            </div>
                            <h2 className="text-2xl font-bold">
                                {t.privacy_protect_title || "Data Protection / 資料保護"}
                            </h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            {t.privacy_protect_desc || "我們非常重視您的隱私，承諾絕對不會將您的個人資料出售或提供給任何第三方進行廣告或營銷活動。所有資料處理均符合現代安全通訊標準。"}
                        </p>
                    </section>

                    {/* Contact Us */}
                    <section className="premium-glass-card p-8 border border-white/10 hover:border-[#EEDC00]/30 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[#EEDC00]/10 rounded-xl text-[#EEDC00]">
                                <Mail size={28} />
                            </div>
                            <h2 className="text-2xl font-bold">
                                {t.privacy_contact_title || "Contact Us / 聯絡方式"}
                            </h2>
                        </div>
                        <div className="text-gray-300 leading-relaxed">
                            <p>{t.privacy_contact_intro || "如果您對本隱私權政策有任何疑問，請透過以下電子郵件聯絡我們："}</p>
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
