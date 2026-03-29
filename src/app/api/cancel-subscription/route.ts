import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

const getSupabaseAdmin = () => createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { reason } = await req.json();

        const supabaseAdmin = getSupabaseAdmin();
        const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("stripe_subscription_id, tier")
            .eq("id", user.id)
            .single();

        if (!profile?.stripe_subscription_id) {
            return NextResponse.json({ error: "No active subscription found" }, { status: 400 });
        }

        if (profile.tier !== "PASS") {
            return NextResponse.json({ error: "No active subscription" }, { status: 400 });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-02-24.acacia" });

        // Cancel at period end so user keeps access until billing cycle ends
        await stripe.subscriptions.update(profile.stripe_subscription_id, {
            cancel_at_period_end: true,
            metadata: { cancel_reason: reason || "user_requested" },
        });

        // Mark in DB that cancellation is pending
        await supabaseAdmin
            .from("profiles")
            .update({ stripe_subscription_id: profile.stripe_subscription_id + ":cancel_pending" })
            .eq("id", user.id);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
