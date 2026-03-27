import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const getSupabaseAdmin = () =>
    createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
    const supabaseAuth = await createServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user || user.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data: affiliates } = await supabaseAdmin
        .from("affiliates")
        .select("id, user_id, ref_code, commission_pct, click_count, payout_email, payout_notes, status, created_at")
        .order("created_at", { ascending: false });

    if (!affiliates) return NextResponse.json([]);

    // Aggregate commissions per affiliate
    const { data: commissions } = await supabaseAdmin
        .from("affiliate_commissions")
        .select("affiliate_id, commission_usd, status");

    const result = affiliates.map(a => {
        const aCommissions = commissions?.filter(c => c.affiliate_id === a.id) ?? [];
        const pending = aCommissions.filter(c => c.status === "pending").reduce((s, c) => s + Number(c.commission_usd), 0);
        const paid = aCommissions.filter(c => c.status === "paid").reduce((s, c) => s + Number(c.commission_usd), 0);
        const { data: referrals } = { data: null }; // fetched separately below
        return { ...a, pendingEarnings: parseFloat(pending.toFixed(2)), totalPaid: parseFloat(paid.toFixed(2)) };
    });

    // Get referral counts
    const { data: referrals } = await supabaseAdmin
        .from("referrals")
        .select("affiliate_id");

    const refCounts: Record<string, number> = {};
    referrals?.forEach(r => { refCounts[r.affiliate_id] = (refCounts[r.affiliate_id] || 0) + 1; });

    const final = result.map(a => ({ ...a, signups: refCounts[a.id] ?? 0 }));

    return NextResponse.json(final);
}
