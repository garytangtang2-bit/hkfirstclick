import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { generateRefCode } from "@/utils/refCode";

const getSupabaseAdmin = () =>
    createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabaseAdmin = getSupabaseAdmin();

    // Return existing affiliate row if already joined
    const { data: existing } = await supabaseAdmin
        .from("affiliates")
        .select("id, ref_code, commission_pct, click_count, status")
        .eq("user_id", user.id)
        .single();

    if (existing) return NextResponse.json(existing);

    // Generate unique ref_code (retry once on collision)
    let refCode = generateRefCode();
    const { data: collision } = await supabaseAdmin
        .from("affiliates")
        .select("id")
        .eq("ref_code", refCode)
        .single();
    if (collision) refCode = generateRefCode();

    const { data, error } = await supabaseAdmin
        .from("affiliates")
        .insert({ user_id: user.id, ref_code: refCode })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
}
