import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const getSupabaseAdmin = () =>
    createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) return NextResponse.json({ ok: false }, { status: 400 });

    try {
        const supabaseAdmin = getSupabaseAdmin();
        const { data: affiliate } = await supabaseAdmin
            .from("affiliates")
            .select("id, click_count")
            .eq("ref_code", code)
            .single();

        if (affiliate) {
            await supabaseAdmin
                .from("affiliates")
                .update({ click_count: (affiliate.click_count || 0) + 1 })
                .eq("id", affiliate.id);
        }
    } catch {
        // Ignore — click tracking is best-effort
    }

    return NextResponse.json({ ok: true });
}
