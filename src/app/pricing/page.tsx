"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { useAppContext } from "@/components/AppContext";
import { YellowButton } from "@/components/ui/YellowButton";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Pricing() {
    return (
        <GlobalLayout>
            <PricingContent />
        </GlobalLayout>
    );
}

export function PricingContent() {
    const { t, currency } = useAppContext();
    const [profile, setProfile] = useState<any>(null);
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const navigateTo = (path: string) => router.push(path);

    useEffect(() => {
        const fetchProfile = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setLoggedIn(!!session?.user);
            if (session?.user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("tier")
                    .eq("id", session.user.id)
                    .single();
                setProfile(data);
            }
        };
        fetchProfile();
    }, [supabase]);

    const plans = [
        {
            name: t.tier1_name,
            price: { HKD: 0, TWD: 0, JPY: 0, USD: 0 },
            credits: t.tier1_credits,
            tripLimit: t.tier1_trips,
            valid: t.tier1_exp,
            exportCost: t.tier1_export,
            desc: t.tier1_desc,
            features: [t.tier1_feature1, t.tier1_feature2],
            tierEnum: "TRIAL",
        },
        {
            name: t.tier2_name,
            price: { HKD: 59.99, TWD: 240, JPY: 1100, USD: 7.99 },
            credits: t.tier2_credits,
            tripLimit: t.tier2_trips,
            valid: t.tier2_exp,
            exportCost: t.tier2_export,
            desc: t.tier2_desc,
            features: [t.tier2_feature1, t.tier2_feature2, t.tier2_feature3, t.tier2_feature4, t.tier2_feature5],
            isPopular: true,
            tierEnum: "PASS",
            stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PASS || "price_1PASS_MOCK",
        },
        {
            name: t.tier3_name,
            price: { HKD: 359.99, TWD: 1480, JPY: 6800, USD: 46.99 },
            credits: t.tier3_credits,
            tripLimit: t.tier3_trips,
            valid: t.tier3_exp,
            exportCost: t.tier3_export,
            desc: t.tier3_desc,
            features: [t.tier3_feature1, t.tier3_feature2, t.tier3_feature3, t.tier3_feature4, t.tier3_feature5, t.tier3_feature6],
            tierEnum: "YEARLY",
            stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || "price_1YEARLY_MOCK",
        },
        {
            name: t.tier4_name,
            price: { HKD: 15.99, TWD: 65, JPY: 300, USD: 1.99 },
            credits: t.tier4_credits,
            tripLimit: t.tier4_trips,
            valid: t.tier4_exp,
            exportCost: t.tier4_export,
            desc: t.tier4_desc,
            features: [t.tier4_feature1, t.tier4_feature2, t.tier4_feature3],
            tierEnum: "TOPUP",
            stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_TOPUP || "price_1TOPUP_MOCK",
        },
    ];

    const handleCheckout = async (priceId: string, tier: string) => {
        if (!loggedIn) {
            setShowLoginPrompt(true);
            return;
        }
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId, tier }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else if (data.error) {
                alert(t.err_checkout || `Checkout Error: ${data.error}`);
            }
        } catch (err) {
            console.error(err);
            alert(t.err_checkout || "Checkout failed. Please try again.");
        }
    };

    const getCurrencySymbol = (cur: string) => {
        switch (cur) {
            case "TWD":
                return "NT$";
            case "JPY":
                return "¥";
            case "USD":
                return "$";
            case "HKD":
            default:
                return "HK$";
        }
    };

    const pricingFaqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Is HKfirstclick a subscription?",
                "acceptedAnswer": { "@type": "Answer", "text": "No. HKfirstclick uses one-time purchases with no hidden subscriptions. You buy credits or a pass and use them at your own pace." },
            },
            {
                "@type": "Question",
                "name": "What is the free trial plan?",
                "acceptedAnswer": { "@type": "Answer", "text": "The free trial gives you limited credits to generate your first AI itinerary. No credit card required — just sign up and start planning." },
            },
            {
                "@type": "Question",
                "name": "What does the Journey Pass include?",
                "acceptedAnswer": { "@type": "Answer", "text": "The Journey Pass is our most popular plan. It includes credits for multiple itinerary generations, map access, and PDF export." },
            },
            {
                "@type": "Question",
                "name": "Can I top up credits without buying a full plan?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. The Credit Top-up option lets you purchase extra credits at any time without upgrading your plan." },
            },
            {
                "@type": "Question",
                "name": "What currencies are supported?",
                "acceptedAnswer": { "@type": "Answer", "text": "Prices are displayed in HKD, TWD, JPY, and USD. All charges are processed in USD as the base currency." },
            },
        ],
    };

    return (
        <>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqSchema) }}
        />
        <div className="min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
            {showLoginPrompt && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowLoginPrompt(false)}>
                    <div className="bg-[#161616] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="text-4xl mb-4">🔒</div>
                        <h3 className="text-xl font-bold text-white mb-2">{t.price_login_required || "Login Required"}</h3>
                        <p className="text-gray-400 text-sm mb-6">{t.price_login_prompt || "Please log in to purchase a plan."}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLoginPrompt(false)}
                                className="flex-1 py-3 px-4 border border-white/20 rounded-xl text-white text-sm font-bold hover:bg-white/5 transition-colors"
                            >
                                {t.cancel || "Cancel"}
                            </button>
                            <button
                                onClick={() => router.push("/login?redirect=/pricing")}
                                className="flex-1 py-3 px-4 bg-[#EEDC00] text-black rounded-xl text-sm font-bold hover:bg-yellow-300 transition-colors"
                            >
                                {t.nav_login || "Login"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {loggedIn === false && (
                <div className="mb-8 bg-[#EEDC00]/10 border border-[#EEDC00]/30 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-300">{t.price_login_prompt || "Please log in to purchase a plan."}</p>
                    <button
                        onClick={() => router.push("/login?redirect=/pricing")}
                        className="bg-[#EEDC00] text-black font-bold px-6 py-2 rounded-xl text-sm hover:bg-yellow-300 transition-colors shrink-0"
                    >
                        {t.nav_login || "Login"}
                    </button>
                </div>
            )}
            <div className="text-center mb-16 relative">
                <h1 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-lg text-white">
                    {t.price_title || "Pricing Plans"}
                </h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                    {t.price_desc || "Choose the best plan for your travel needs."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {plans.map((plan, i) => {
                    const isCurrent = profile?.tier === plan.tierEnum;
                    return (
                        <div
                            key={i}
                            className={`bg-[#1E1E1E] rounded-3xl p-8 flex flex-col transition-[transform,box-shadow,border-color] duration-300 premium-glass-card ${plan.isPopular
                                ? "border-2 border-[#EEDC00] shadow-[0_0_30px_rgba(238,220,0,0.2)] transform md:-translate-y-4"
                                : "border border-white/10 hover:border-white/20 shadow-2xl"
                                }`}
                        >
                            {plan.isPopular && (
                                <div className="bg-[#EEDC00] text-black text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full self-start mb-6 inline-block">
                                    {t.price_most_popular}
                                </div>
                            )}
                            {!plan.isPopular && <div className="h-[26px] mb-6"></div>}

                            <h2 className="text-2xl font-bold mb-2 text-white">
                                {plan.name}
                            </h2>
                            <div className="flex flex-col items-start gap-1 mb-6">
                                {plan.price[currency as keyof typeof plan.price] > 0 && (() => {
                                    const orig = Math.round(plan.price[currency as keyof typeof plan.price] * 2.8);
                                    const discPct = Math.round((1 - plan.price[currency as keyof typeof plan.price] / orig) * 100);
                                    return (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-[#9CA3AF] line-through">
                                                {getCurrencySymbol(currency)}{orig}
                                            </span>
                                            <span className="text-xs font-bold bg-[#EF4444] text-white px-2 py-1 rounded-full tracking-wide">
                                                -{discPct}% OFF
                                            </span>
                                        </div>
                                    );
                                })()}
                                <span className="text-4xl font-black text-white tracking-tighter">
                                    {plan.price[currency as keyof typeof plan.price] === 0
                                        ? t.free_credit
                                        : `${getCurrencySymbol(currency)}${plan.price[currency as keyof typeof plan.price]}`}
                                </span>
                                {plan.tierEnum === "PASS" && (
                                    <span className="text-sm text-gray-400 ml-1">{t.per_month || "/mo"}</span>
                                )}
                            </div>

                            <div className="space-y-4 mb-8 flex-1">
                                <div className="flex justify-between text-sm pb-3 border-b border-white/5">
                                    <span className="text-gray-400">{t.price_total_credits}</span>
                                    <span className="font-bold text-[#EEDC00]">
                                        {plan.credits}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm pb-3 border-b border-white/5">
                                    <span className="text-gray-400">{t.price_validity}</span>
                                    <span className="font-bold text-white">{plan.valid}</span>
                                </div>
                                <div className="flex justify-between text-sm pb-3 border-b border-white/5">
                                    <span className="text-gray-400">{t.price_gen_limit}</span>
                                    <span className="font-bold text-white">
                                        {plan.tripLimit}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 pb-3">{plan.exportCost}</p>
                                <p className="text-sm text-gray-300 leading-relaxed min-h-[60px]">
                                    {plan.desc}
                                </p>

                                <ul className="space-y-3 mt-6">
                                    {plan.features.map((feat, j) => (
                                        <li
                                            key={j}
                                            className="flex items-start gap-3 text-sm text-gray-300"
                                        >
                                            <svg
                                                className="w-5 h-5 text-[#EEDC00] shrink-0"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {isCurrent ? (
                                <button
                                    disabled
                                    className="w-full py-4 rounded-xl font-bold text-[#EEDC00] bg-[#EEDC00]/10 border border-[#EEDC00]/30 uppercase tracking-wider text-sm cursor-default"
                                >
                                    {t.btn_current || "Current Plan"}
                                </button>
                            ) : plan.tierEnum === "TRIAL" ? (
                                <button
                                    disabled={!!profile}
                                    onClick={() => !profile && navigateTo("/login")}
                                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider text-sm [transition:background-color_300ms_ease,color_300ms_ease,box-shadow_300ms_ease] ${profile
                                        ? "text-gray-500 bg-white/5 border border-white/10 cursor-default"
                                        : "text-[#EEDC00] bg-[#EEDC00]/10 border border-[#EEDC00]/30 hover:bg-[#EEDC00] hover:text-black shadow-[0_0_15px_rgba(238,220,0,0.1)] hover:shadow-[0_0_25px_rgba(238,220,0,0.3)]"
                                        }`}
                                >
                                    {profile ? (t.btn_claimed || "已經領取") : (t.price_signup_claim || "Sign up to claim")}
                                </button>
                            ) : (
                                <>
                                    <YellowButton
                                        onClick={() => handleCheckout(plan.stripePriceId!, plan.tierEnum)}
                                        className="w-full py-4 rounded-xl uppercase tracking-wider text-sm"
                                    >
                                        {t.btn_buy}
                                    </YellowButton>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Full-width payment notice between grid and rules */}
            <div className="flex items-center justify-center gap-3 -mt-8 mb-12 text-sm text-gray-400 text-center">
                <span className="text-base">💳</span>
                <span>{t.price_payment_notice || "單次付費，無隱藏訂閱。為確保價格公平，本地報價僅供參考，扣款將以美元 (USD) 定價為準。"}</span>
            </div>

            <div className="bg-[#161616] border border-white/5 rounded-3xl p-8 md:p-12 mb-16">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    {t.rule_title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-gray-300">
                    <div>
                        <h4 className="font-bold text-white text-base mb-4 border-b border-white/10 pb-2 inline-block">
                            {t.rule_1_title}
                        </h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-start gap-4">
                                <span className="font-medium">{t.rule_1_p1}</span>
                                <span className="text-[#EEDC00] text-right">
                                    {t.rule_1_p1_v}
                                </span>
                            </div>
                            <div className="flex justify-between items-start gap-4">
                                <span className="font-medium">{t.rule_1_p2}</span>
                                <span className="text-[#EEDC00] text-right">
                                    {t.rule_1_p2_v}
                                </span>
                            </div>
                            <div className="flex justify-between items-start gap-4 flex-col lg:flex-row border-t border-white/5 pt-4">
                                <span className="font-medium">{t.rule_1_p3}</span>
                                <span className="text-gray-400 lg:text-right">
                                    {t.rule_1_p3_v}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-base mb-4 border-b border-white/10 pb-2 inline-block">
                            {t.rule_2_title}
                        </h4>
                        <div className="space-y-6">
                            <div>
                                <span className="font-medium text-white block mb-1">
                                    {t.rule_2_p1}
                                </span>
                                <p className="text-gray-400 leading-relaxed">{t.rule_2_p1_v}</p>
                            </div>
                            <div>
                                <span className="font-medium text-white block mb-1">
                                    {t.rule_2_p2}
                                </span>
                                <p className="text-gray-400 leading-relaxed">{t.rule_2_p2_v}</p>
                            </div>
                            <div>
                                <span className="font-medium text-white block mb-1">
                                    {t.rule_2_p3}
                                </span>
                                <p className="text-gray-400 leading-relaxed">{t.rule_2_p3_v}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rule 3 — Extended itinerary pricing */}
                <div className="mt-10 pt-8 border-t border-white/5">
                    <h4 className="font-bold text-white text-base mb-4 border-b border-white/10 pb-2 inline-block">
                        {t.rule_3_title}
                    </h4>
                    <p className="text-gray-300 leading-relaxed mb-3">{t.rule_3_intro}</p>
                    <div className="bg-[#EEDC00]/5 border border-[#EEDC00]/20 rounded-xl px-5 py-3 text-sm text-[#EEDC00] font-medium">
                        {t.rule_3_example}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
