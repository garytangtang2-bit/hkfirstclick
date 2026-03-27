import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const getSupabaseAdmin = () =>
    createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabaseAdmin = getSupabaseAdmin();

    const { data: affiliate } = await supabaseAdmin
        .from("affiliates")
        .select("id, ref_code, commission_pct, click_count, payout_email, payout_notes, min_payout_usd, status, created_at")
        .eq("user_id", user.id)
        .single();

    if (!affiliate) return NextResponse.json({ affiliate: null });

    const { data: referrals } = await supabaseAdmin
        .from("referrals")
        .select("id, created_at")
        .eq("affiliate_id", affiliate.id);

    const { data: commissions } = await supabaseAdmin
        .from("affiliate_commissions")
        .select("id, commission_usd, amount_paid_usd, status, created_at, stripe_session_id")
        .eq("affiliate_id", affiliate.id)
        .order("created_at", { ascending: false });

    const pendingEarnings = commissions
        ?.filter(c => c.status === "pending")
        .reduce((sum, c) => sum + Number(c.commission_usd), 0) ?? 0;

    const totalPaid = commissions
        ?.filter(c => c.status === "paid")
        .reduce((sum, c) => sum + Number(c.commission_usd), 0) ?? 0;

    return NextResponse.json({
        affiliate,
        signups: referrals?.length ?? 0,
        commissions: commissions ?? [],
        pendingEarnings: parseFloat(pendingEarnings.toFixed(2)),
        totalPaid: parseFloat(totalPaid.toFixed(2)),
    });
}
