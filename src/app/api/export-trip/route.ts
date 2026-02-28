import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key to bypass RLS and update credits securely
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.replace("Bearer ", "");
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

        if (!user || error) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: profile, error: profileError } = await supabaseAdmin
            .from("profiles")
            .select("tier, credits")
            .eq("id", user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        const { tier, credits } = profile;

        // Export Rule: "Member (Pass/Yearly) 0 Credits; Casual (Free/Top-up) -1 Credit/Time"
        if (tier === "PASS" || tier === "YEARLY") {
            // Free export for premium members
            return NextResponse.json({ success: true, message: "Free export for members." });
        } else {
            // Costs 1 credit for TRIAL and TOPUP
            if (credits < 1) {
                return NextResponse.json(
                    { error: "Insufficient credits to export." },
                    { status: 402 }
                );
            }

            // Deduct 1 credit
            const { error: updateError } = await supabaseAdmin
                .from("profiles")
                .update({ credits: credits - 1 })
                .eq("id", user.id);

            if (updateError) {
                throw updateError;
            }

            return NextResponse.json({ success: true, message: "1 credit deducted." });
        }

    } catch (err: any) {
        console.error("Export API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
