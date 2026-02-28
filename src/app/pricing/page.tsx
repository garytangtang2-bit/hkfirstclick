"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { AppProvider, useAppContext } from "@/components/AppContext";
import { YellowButton } from "@/components/ui/YellowButton";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function Pricing() {
    return (
        <AppProvider>
            <GlobalLayout>
                <PricingContent />
            </GlobalLayout>
        </AppProvider>
    );
}

function PricingContent() {
    const { t, currency } = useAppContext();
    const [profile, setProfile] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchProfile = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
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
            price: { HKD: 199, TWD: 750, JPY: 3500, USD: 25 },
            credits: t.tier2_credits,
            tripLimit: t.tier2_trips,
            valid: t.tier2_exp,
            exportCost: t.tier2_export,
            desc: t.tier2_desc,
            features: [t.tier2_feature1, t.tier2_feature2, t.tier2_feature3],
            isPopular: true,
            tierEnum: "PASS",
            stripePriceId: "price_1PASS_MOCK", // To be updated
        },
        {
            name: t.tier3_name,
            price: { HKD: 1599, TWD: 6000, JPY: 28000, USD: 200 },
            credits: t.tier3_credits,
            tripLimit: t.tier3_trips,
            valid: t.tier3_exp,
            exportCost: t.tier3_export,
            desc: t.tier3_desc,
            features: [t.tier3_feature1, t.tier3_feature2, t.tier3_feature3],
            tierEnum: "YEARLY",
            stripePriceId: "price_1YEARLY_MOCK", // To be updated
        },
        {
            name: t.tier4_name,
            price: { HKD: 49, TWD: 180, JPY: 850, USD: 6 },
            credits: t.tier4_credits,
            tripLimit: t.tier4_trips,
            valid: t.tier4_exp,
            exportCost: t.tier4_export,
            desc: t.tier4_desc,
            features: [t.tier4_feature1, t.tier4_feature2, t.tier4_feature3],
            tierEnum: "TOPUP",
            stripePriceId: "price_1TOPUP_MOCK", // To be updated
        },
    ];

    const handleCheckout = async (priceId: string) => {
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error(err);
            alert("Checkout failed. Please ensure Stripe is configured.");
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

    return (
        <div className="min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="text-center mb-16 relative">
                <h1 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-lg text-white">
                    {t.price_title}
                </h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                    {t.price_desc}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {plans.map((plan, i) => {
                    const isCurrent = profile?.tier === plan.tierEnum;
                    return (
                        <div
                            key={i}
                            className={`bg-[#161616] rounded-3xl p-8 flex flex-col transition-all duration-300 ${plan.isPopular
                                ? "border-2 border-[#EEDC00] shadow-[0_0_30px_rgba(238,220,0,0.15)] transform md:-translate-y-4"
                                : "border border-white/5 hover:border-white/20"
                                }`}
                        >
                            {plan.isPopular && (
                                <div className="bg-[#EEDC00] text-black text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full self-start mb-6 inline-block">
                                    Most Popular
                                </div>
                            )}
                            {!plan.isPopular && <div className="h-[26px] mb-6"></div>}

                            <h2 className="text-2xl font-bold mb-2 text-white">
                                {plan.name}
                            </h2>
                            <div className="flex items-end gap-2 mb-6">
                                <span className="text-4xl font-black text-white">
                                    {plan.price[currency as keyof typeof plan.price] === 0
                                        ? t.free_credit
                                        : `${getCurrencySymbol(currency)}${plan.price[currency as keyof typeof plan.price]}`}
                                </span>
                                {plan.price[currency as keyof typeof plan.price] > 0 && (
                                    <span className="text-gray-500 text-sm mb-1 line-through">
                                        {getCurrencySymbol(currency)}
                                        {Math.round(plan.price[currency as keyof typeof plan.price] * 1.5)}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4 mb-8 flex-1">
                                <div className="flex justify-between text-sm pb-3 border-b border-white/5">
                                    <span className="text-gray-400">Total Credits</span>
                                    <span className="font-bold text-[#EEDC00]">
                                        {plan.credits}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm pb-3 border-b border-white/5">
                                    <span className="text-gray-400">Validity</span>
                                    <span className="font-bold text-white">{plan.valid}</span>
                                </div>
                                <div className="flex justify-between text-sm pb-3 border-b border-white/5">
                                    <span className="text-gray-400">Gen Limit</span>
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
                                    className="w-full py-4 rounded-xl font-bold text-gray-400 bg-white/5 border border-white/10 uppercase tracking-wider text-sm cursor-not-allowed"
                                >
                                    {t.btn_current}
                                </button>
                            ) : plan.price[currency as keyof typeof plan.price] === 0 ? (
                                <button
                                    disabled
                                    className="w-full py-4 rounded-xl font-bold text-gray-400 bg-white/5 border border-white/10 uppercase tracking-wider text-sm cursor-not-allowed"
                                >
                                    Sign up to claim
                                </button>
                            ) : (
                                <YellowButton
                                    onClick={() => handleCheckout(plan.stripePriceId!)}
                                    className="w-full py-4 rounded-xl uppercase tracking-wider text-sm"
                                >
                                    {t.btn_buy}
                                </YellowButton>
                            )}
                        </div>
                    );
                })}
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
            </div>
        </div>
    );
}
