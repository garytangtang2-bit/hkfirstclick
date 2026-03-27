import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, DollarSign, MousePointerClick } from "lucide-react";
import MarkPaidButton from "./_components/MarkPaidButton";

const getSupabaseAdmin = () =>
    createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function AdminAffiliatesPage() {
    const supabaseAuth = await createServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user || user.email !== process.env.ADMIN_EMAIL) redirect("/");

    const supabaseAdmin = getSupabaseAdmin();

    const { data: affiliates } = await supabaseAdmin
        .from("affiliates")
        .select("id, user_id, ref_code, commission_pct, click_count, payout_email, payout_notes, status, created_at")
        .order("created_at", { ascending: false });

    const { data: commissions } = await supabaseAdmin
        .from("affiliate_commissions")
        .select("affiliate_id, commission_usd, status");

    const { data: referrals } = await supabaseAdmin
        .from("referrals")
        .select("affiliate_id");

    const refCounts: Record<string, number> = {};
    referrals?.forEach(r => { refCounts[r.affiliate_id] = (refCounts[r.affiliate_id] || 0) + 1; });

    const enriched = (affiliates ?? []).map(a => {
        const ac = commissions?.filter(c => c.affiliate_id === a.id) ?? [];
        return {
            ...a,
            signups: refCounts[a.id] ?? 0,
            pendingEarnings: parseFloat(ac.filter(c => c.status === "pending").reduce((s, c) => s + Number(c.commission_usd), 0).toFixed(2)),
            totalPaid: parseFloat(ac.filter(c => c.status === "paid").reduce((s, c) => s + Number(c.commission_usd), 0).toFixed(2)),
        };
    });

    const totalPending = enriched.reduce((s, a) => s + a.pendingEarnings, 0);
    const totalPaid = enriched.reduce((s, a) => s + a.totalPaid, 0);

    return (
        <div className="min-h-screen bg-[#0E0E0E] text-white p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div>
                        <Link href="/admin" className="text-sm text-gray-400 hover:text-white mb-2 block">&larr; Back to Admin</Link>
                        <h1 className="text-3xl font-black flex items-center gap-3"><Users className="text-[#EEDC00]" /> Affiliates</h1>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-[#161616] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-2 text-gray-400 mb-2"><Users size={18} /> Total Affiliates</div>
                        <div className="text-4xl font-black">{enriched.length}</div>
                    </div>
                    <div className="bg-[#161616] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-2 text-[#EEDC00] mb-2"><DollarSign size={18} /> Pending Payout</div>
                        <div className="text-4xl font-black text-[#EEDC00]">${totalPending.toFixed(2)}</div>
                    </div>
                    <div className="bg-[#161616] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-2 text-green-400 mb-2"><DollarSign size={18} /> Total Paid Out</div>
                        <div className="text-4xl font-black text-green-400">${totalPaid.toFixed(2)}</div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-[#161616] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="font-bold text-xl">All Affiliates</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
                                    <th className="p-4 font-medium">Ref Code</th>
                                    <th className="p-4 font-medium">Clicks</th>
                                    <th className="p-4 font-medium">Signups</th>
                                    <th className="p-4 font-medium">Pending $</th>
                                    <th className="p-4 font-medium">Paid $</th>
                                    <th className="p-4 font-medium">Payout Info</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enriched.map(a => (
                                    <tr key={a.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono text-[#EEDC00] font-bold">{a.ref_code}</td>
                                        <td className="p-4">{a.click_count}</td>
                                        <td className="p-4">{a.signups}</td>
                                        <td className="p-4 text-[#EEDC00] font-bold">${a.pendingEarnings}</td>
                                        <td className="p-4 text-green-400">${a.totalPaid}</td>
                                        <td className="p-4 text-xs text-gray-400 max-w-[180px]">
                                            <div>{a.payout_email || "—"}</div>
                                            {a.payout_notes && <div className="truncate text-gray-600">{a.payout_notes}</div>}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${a.status === "active" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                                                {a.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {a.pendingEarnings > 0 && (
                                                <MarkPaidButton affiliateId={a.id} />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {enriched.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="p-10 text-center text-gray-500">No affiliates yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
