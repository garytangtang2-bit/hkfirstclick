"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Users, MousePointerClick, DollarSign, Banknote, ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useAppContext } from "@/components/AppContext";

const MIN_PAYOUT_USD = 50;

interface AffiliateStats {
    affiliate: {
        id: string;
        ref_code: string;
        commission_pct: number;
        click_count: number;
        payout_email: string | null;
        payout_notes: string | null;
        min_payout_usd?: number;
        status: string;
    } | null;
    signups: number;
    commissions: Array<{
        id: string;
        commission_usd: number;
        amount_paid_usd: number;
        status: string;
        created_at: string;
    }>;
    pendingEarnings: number;
    totalPaid: number;
}

export default function AffiliateContent() {
    const { t } = useAppContext();
    const [stats, setStats] = useState<AffiliateStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [joining, setJoining] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [copied, setCopied] = useState(false);
    const [payoutEmail, setPayoutEmail] = useState("");
    const [minPayout, setMinPayout] = useState("100");
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const fetchStats = async () => {
        const res = await fetch("/api/affiliate/stats");
        if (res.ok) {
            const data = await res.json();
            setStats(data);
            if (data.affiliate?.payout_email) setPayoutEmail(data.affiliate.payout_email);
            if (data.affiliate?.min_payout_usd) setMinPayout(String(data.affiliate.min_payout_usd));
        }
        setLoading(false);
    };

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            setLoggedIn(!!user);
            if (user) fetchStats();
            else setLoading(false);
        });
    }, []);

    const handleJoin = async () => {
        setJoining(true);
        const res = await fetch("/api/affiliate/join", { method: "POST" });
        if (res.ok) await fetchStats();
        setJoining(false);
    };

    const handleCopy = () => {
        const link = `${window.location.origin}?ref=${stats?.affiliate?.ref_code}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSavePayout = async () => {
        if (!payoutEmail) return alert("Please enter your PayPal email.");
        setSaving(true);
        await fetch("/api/affiliate/update-payout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ payout_email: payoutEmail, min_payout_usd: parseFloat(minPayout) }),
        });
        setSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
    };

    const referralLink = typeof window !== "undefined"
        ? `${window.location.origin}?ref=${stats?.affiliate?.ref_code}`
        : "";

    const pendingEarnings = stats?.pendingEarnings ?? 0;
    const effectiveMinPayout = Number(stats?.affiliate?.min_payout_usd ?? MIN_PAYOUT_USD);
    const canRequestPayout = pendingEarnings >= effectiveMinPayout;
    const commissionPct = stats?.affiliate?.commission_pct ?? 30;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#EEDC00] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!loggedIn) {
        return (
            <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center p-6">
                <div className="bg-[#161616] border border-white/10 rounded-2xl p-10 text-center max-w-md w-full">
                    <div className="text-5xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-white mb-2">{t.aff_login_required}</h2>
                    <p className="text-gray-400 mb-6">{t.aff_login_desc}</p>
                    <Link href="/login" className="bg-[#EEDC00] text-black font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 transition-colors inline-block">
                        {t.aff_login_btn}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0E0E0E] text-white p-6 md:p-10">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="border-b border-white/10 pb-6">
                    <Link href="/" className="text-sm text-gray-400 hover:text-white mb-2 block">{t.aff_back}</Link>
                    <h1 className="text-3xl font-black">{t.aff_title}</h1>
                    <p className="text-gray-400 mt-1">
                        {t.aff_subtitle ? (
                            <>Earn <span className="text-[#EEDC00] font-bold">{commissionPct}%</span> {t.aff_subtitle}</>
                        ) : (
                            <>Earn <span className="text-[#EEDC00] font-bold">{commissionPct}%</span> commission on every sale you refer. All amounts in <span className="text-white font-bold">USD</span>.</>
                        )}
                    </p>
                </div>

                {/* Terms banner */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4">
                    <Info size={20} className="text-[#EEDC00] shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-300 space-y-1">
                        <p><span className="text-white font-bold">{t.aff_terms_commission}:</span> {commissionPct}{t.aff_terms_commission_val}</p>
                        <p><span className="text-white font-bold">{t.aff_terms_min_payout}:</span> {t.aff_terms_min_payout_val}</p>
                        <p><span className="text-white font-bold">{t.aff_terms_method}:</span> {t.aff_terms_method_val}</p>
                        <p><span className="text-white font-bold">{t.aff_terms_fees}:</span> {t.aff_terms_fees_val}</p>
                        <p><span className="text-white font-bold">{t.aff_terms_processing}:</span> {t.aff_terms_processing_val}</p>
                    </div>
                </div>

                {/* Not joined yet */}
                {!stats?.affiliate && (
                    <div className="bg-[#161616] border border-white/10 rounded-2xl p-10 text-center">
                        <div className="text-5xl mb-4">🤝</div>
                        <h2 className="text-2xl font-bold mb-2">{t.aff_join_title}</h2>
                        <p className="text-gray-400 mb-2 max-w-md mx-auto">{t.aff_join_desc}</p>
                        <p className="text-gray-500 text-sm mb-6">{t.aff_join_min}</p>

                        {/* Disclosure requirement */}
                        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 text-left mb-6 text-sm text-gray-300">
                            <p className="font-bold text-yellow-400 mb-2">{t.aff_disclosure_title}</p>
                            <p>{t.aff_disclosure_desc}</p>
                            <p className="bg-black/30 rounded-lg px-3 py-2 mt-2 text-gray-400 italic">&ldquo;{t.aff_disclosure_example}&rdquo;</p>
                            <p className="mt-2">{t.aff_disclosure_required}</p>
                        </div>

                        <label className="flex items-start gap-3 mb-6 cursor-pointer text-left">
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={e => setAgreedToTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 accent-[#EEDC00] shrink-0"
                            />
                            <span className="text-sm text-gray-400">
                                {t.aff_agree}{" "}
                                <Link href="/terms" target="_blank" className="text-[#EEDC00] underline">→ Terms</Link>
                            </span>
                        </label>

                        <button
                            onClick={handleJoin}
                            disabled={joining || !agreedToTerms}
                            className="bg-[#EEDC00] text-black font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {joining ? t.aff_btn_setup : t.aff_btn_get_link}
                        </button>
                    </div>
                )}

                {/* Joined — dashboard */}
                {stats?.affiliate && (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-[#161616] border border-white/10 rounded-2xl p-5">
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2"><MousePointerClick size={16} /> {t.aff_stat_clicks}</div>
                                <div className="text-3xl font-black">{stats.affiliate.click_count}</div>
                            </div>
                            <div className="bg-[#161616] border border-white/10 rounded-2xl p-5">
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2"><Users size={16} /> {t.aff_stat_signups}</div>
                                <div className="text-3xl font-black">{stats.signups}</div>
                            </div>
                            <div className="bg-[#161616] border border-white/10 rounded-2xl p-5">
                                <div className="flex items-center gap-2 text-[#EEDC00] text-sm mb-2"><DollarSign size={16} /> {t.aff_stat_pending}</div>
                                <div className="text-3xl font-black text-[#EEDC00]">${pendingEarnings.toFixed(2)}</div>
                                {!canRequestPayout && pendingEarnings > 0 && (
                                    <div className="text-xs text-gray-500 mt-1">${(effectiveMinPayout - pendingEarnings).toFixed(2)} {t.aff_stat_more} ${effectiveMinPayout}</div>
                                )}
                            </div>
                            <div className="bg-[#161616] border border-white/10 rounded-2xl p-5">
                                <div className="flex items-center gap-2 text-green-400 text-sm mb-2"><Banknote size={16} /> {t.aff_stat_paid}</div>
                                <div className="text-3xl font-black text-green-400">${(stats.totalPaid ?? 0).toFixed(2)}</div>
                            </div>
                        </div>

                        {/* Payout eligibility banner */}
                        {canRequestPayout && (
                            <div className="bg-green-900/30 border border-green-500/30 rounded-2xl p-5 flex items-center gap-4">
                                <div className="text-3xl">🎉</div>
                                <div>
                                    <div className="font-bold text-green-400">{t.aff_eligible_title}</div>
                                    <div className="text-sm text-gray-400">
                                        Your balance is <span className="text-white font-bold">${pendingEarnings.toFixed(2)} USD</span>. {t.aff_eligible_desc}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Referral link */}
                        <div className="bg-[#161616] border border-white/10 rounded-2xl p-6">
                            <h2 className="font-bold text-lg mb-4">{t.aff_link_title}</h2>
                            <div className="flex gap-3">
                                <div className="flex-1 bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 font-mono truncate">
                                    {referralLink}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="bg-[#EEDC00] text-black font-bold px-5 py-3 rounded-xl hover:bg-yellow-300 transition-colors flex items-center gap-2 shrink-0"
                                >
                                    {copied ? <><Check size={16} /> {t.aff_link_copied}</> : <><Copy size={16} /> {t.aff_link_copy}</>}
                                </button>
                            </div>
                            <p className="text-gray-500 text-xs mt-3">
                                {t.aff_link_desc?.replace("%", `${commissionPct}%`)}
                            </p>
                        </div>

                        {/* PayPal payout */}
                        <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 space-y-5">
                            <div>
                                <h2 className="font-bold text-lg mb-1">{t.aff_payout_title}</h2>
                                <p className="text-gray-400 text-sm">{t.aff_payout_desc}</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">{t.aff_payout_email_label}</label>
                                <input
                                    type="email"
                                    value={payoutEmail}
                                    onChange={e => setPayoutEmail(e.target.value)}
                                    placeholder="your-paypal@email.com"
                                    className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">{t.aff_payout_min_label}</label>
                                <p className="text-gray-500 text-xs mb-3">{t.aff_payout_min_desc}</p>
                                <div className="flex gap-2 flex-wrap">
                                    {[50, 100, 200, 500].map(amt => (
                                        <button
                                            key={amt}
                                            onClick={() => setMinPayout(String(amt))}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${minPayout === String(amt) ? "bg-[#EEDC00] text-black border-[#EEDC00]" : "bg-white/5 text-gray-300 border-white/10 hover:border-white/30"}`}
                                        >
                                            ${amt}
                                        </button>
                                    ))}
                                    <input
                                        type="number"
                                        value={minPayout}
                                        onChange={e => setMinPayout(e.target.value)}
                                        min={100}
                                        placeholder={t.aff_payout_custom}
                                        className="w-28 bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#EEDC00] transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSavePayout}
                                disabled={saving}
                                className="bg-[#EEDC00] text-black font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50"
                            >
                                {saveSuccess ? t.aff_payout_saved : saving ? t.aff_payout_saving : t.aff_payout_save}
                            </button>

                            {stats.affiliate.payout_email && (
                                <p className="text-xs text-gray-500">
                                    {t.aff_payout_current}: <span className="text-gray-300">{stats.affiliate.payout_email}</span> · {t.aff_payout_current_min}: <span className="text-gray-300">${effectiveMinPayout} USD</span>
                                </p>
                            )}
                        </div>

                        {/* Commission history */}
                        <div className="bg-[#161616] border border-white/10 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <h2 className="font-bold text-lg">{t.aff_history_title}</h2>
                                <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">{t.aff_history_all_usd}</span>
                            </div>
                            {stats.commissions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
                                                <th className="p-4 font-medium">{t.aff_history_date}</th>
                                                <th className="p-4 font-medium">{t.aff_history_sale}</th>
                                                <th className="p-4 font-medium">{t.aff_history_commission}</th>
                                                <th className="p-4 font-medium">{t.aff_history_status}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.commissions.map(c => (
                                                <tr key={c.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-4 text-sm text-gray-400">
                                                        {new Date(c.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                                    </td>
                                                    <td className="p-4 font-mono text-gray-300">${Number(c.amount_paid_usd).toFixed(2)}</td>
                                                    <td className="p-4 font-mono text-[#EEDC00] font-bold">${Number(c.commission_usd).toFixed(2)}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.status === "paid" ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-400"}`}>
                                                            {c.status === "paid" ? t.aff_history_paid : t.aff_history_pending}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-10 text-center text-gray-500">
                                    <ExternalLink className="mx-auto mb-3 opacity-30" size={32} />
                                    <p>{t.aff_history_empty}</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
