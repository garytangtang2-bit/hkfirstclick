import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Use service role key to bypass RLS and update credits securely
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;

        if (userId) {
            // Retrieve session with line_items to identify WHAT they bought
            let lineItems;
            try {
                const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
                    expand: ['line_items'],
                });
                lineItems = fullSession.line_items?.data;
            } catch (err) {
                console.error("Error retrieving line items", err);
                return new NextResponse("Error retrieving line items", { status: 500 });
            }

            const priceId = lineItems?.[0]?.price?.id;

            if (!priceId) {
                console.error("No price ID found in generic webhook.");
                return new NextResponse("No price ID found", { status: 400 });
            }

            // Fetch current profile
            const { data: currentProfile } = await supabaseAdmin
                .from("profiles")
                .select("tier, premium_credits, premium_expires_at, topup_credits, topup_expires_at")
                .eq("id", userId)
                .single();

            const passPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_PASS;
            const yearlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY;
            const topupPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_TOPUP;

            if (priceId === passPriceId || process.env.NODE_ENV === 'development' && priceId === 'price_1PASS_MOCK') {
                // PASS Logics (180 days)
                let newExpiry = new Date();
                newExpiry.setDate(newExpiry.getDate() + 180);

                await supabaseAdmin
                    .from("profiles")
                    .update({
                        tier: "PASS",
                        premium_credits: 50,
                        premium_expires_at: newExpiry.toISOString()
                    })
                    .eq("id", userId);

            } else if (priceId === yearlyPriceId || process.env.NODE_ENV === 'development' && priceId === 'price_1YEARLY_MOCK') {
                // YEARLY Logic (365 days)
                let newExpiry = new Date();
                newExpiry.setDate(newExpiry.getDate() + 365);

                await supabaseAdmin
                    .from("profiles")
                    .update({
                        tier: "YEARLY",
                        premium_credits: 500,
                        premium_expires_at: newExpiry.toISOString()
                    })
                    .eq("id", userId);

            } else if (priceId === topupPriceId || process.env.NODE_ENV === 'development' && priceId === 'price_1TOPUP_MOCK') {
                // TOP UP Logic. Add 10 points to topup_credits. 
                const currentCredits = currentProfile?.topup_credits || 0;

                // Top-ups always expire in 365 days
                let newExpiry = new Date();
                newExpiry.setDate(newExpiry.getDate() + 365);

                // Determine if we need to drop the tier
                let currentTier = currentProfile?.tier || "TRIAL";

                // If they are currently premium but it has expired, downgrade to Casual.
                // But don't downgrade TRIAL.
                if (currentTier === "PASS" || currentTier === "YEARLY") {
                    if (!currentProfile?.premium_expires_at || new Date(currentProfile.premium_expires_at) < new Date()) {
                        currentTier = "Casual";
                    }
                } else if (currentTier === "TRIAL") {
                    // Buying top-up graduates TRIAL to Casual
                    currentTier = "Casual";
                }

                await supabaseAdmin
                    .from("profiles")
                    .update({
                        tier: currentTier,
                        topup_credits: currentCredits + 10,
                        topup_expires_at: newExpiry.toISOString()
                    })
                    .eq("id", userId);
            }
        }
    }

    return new NextResponse(null, { status: 200 });
}
