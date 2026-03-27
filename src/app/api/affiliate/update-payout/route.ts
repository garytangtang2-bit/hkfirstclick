import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const getSupabaseAdmin = () =>
    createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payout_email, min_payout_usd } = await req.json();

    // Validate min_payout_usd
    const minPayout = parseFloat(min_payout_usd);
    if (isNaN(minPayout) || minPayout < 50) {
        return NextResponse.json({ error: "Minimum payout must be at least $50." }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
        .from("affiliates")
        .update({ payout_email, payout_notes: "PayPal", min_payout_usd: minPayout })
        .eq("user_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
}
