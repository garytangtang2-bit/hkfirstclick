import { createClient } from "@supabase/supabase-js";

const getSupabaseAdmin = () =>
    createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

export async function attributeReferral(newUserId: string, refCode: string): Promise<void> {
    try {
        const supabaseAdmin = getSupabaseAdmin();

        // Find affiliate by ref_code
        const { data: affiliate, error } = await supabaseAdmin
            .from("affiliates")
            .select("id, user_id, status")
            .eq("ref_code", refCode)
            .single();

        if (error || !affiliate) return;
        if (affiliate.status !== "active") return;
        if (affiliate.user_id === newUserId) return; // prevent self-referral

        // Insert referral row (ignore if already exists)
        await supabaseAdmin
            .from("referrals")
            .insert({ affiliate_id: affiliate.id, referred_user_id: newUserId })
            .throwOnError();
    } catch {
        // Silently ignore duplicate referral (unique constraint violation)
    }
}
