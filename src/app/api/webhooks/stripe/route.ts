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

    console.log("🔔 Webhook received!");

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
        console.log(`✅ Event verified: ${event.type} [${event.id}]`);
    } catch (err: any) {
        console.error(`❌ Webhook Signature Error: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const customerEmail = session.customer_details?.email;

        console.log(`📦 Processing Checkout Session: ${session.id}`);
        console.log(`👤 User ID: ${userId}, Email: ${customerEmail}`);

        if (userId) {
            // Retrieve session with line_items to identify WHAT they bought
            let lineItems: Stripe.LineItem[] = [];
            try {
                const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
                    expand: ['line_items'],
                });
                lineItems = fullSession.line_items?.data || [];
                console.log(`🛒 Line items retrieved: ${lineItems.length} items`);
            } catch (err) {
                console.error("❌ Error retrieving line items", err);
                return new NextResponse("Error retrieving line items", { status: 500 });
            }

            const priceId = lineItems?.[0]?.price?.id;
            console.log(`💰 Price ID detected: ${priceId}`);

            if (!priceId) {
                console.error("❌ No price ID found in line items.");
                return new NextResponse("No price ID found", { status: 400 });
            }

            // Fetch current profile
            const { data: currentProfile, error: profileError } = await supabaseAdmin
                .from("profiles")
                .select("tier, premium_credits, premium_expires_at, topup_credits, topup_expires_at")
                .eq("id", userId)
                .single();

            if (profileError) {
                console.error(`❌ Error fetching profile for ${userId}:`, profileError);
            } else {
                console.log(`📄 Current Tier: ${currentProfile?.tier}, Topup Credits: ${currentProfile?.topup_credits}`);
            }

            const passPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_PASS;
            const yearlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY;
            const topupPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_TOPUP;

            console.log(`🔍 Comparing: ${priceId} vs [${passPriceId}, ${yearlyPriceId}, ${topupPriceId}]`);

            if (priceId === passPriceId || (process.env.NODE_ENV === 'development' && priceId === 'price_1PASS_MOCK')) {
                console.log("✨ Matching PASS plan...");
                let newExpiry = new Date();
                newExpiry.setDate(newExpiry.getDate() + 180);

                const { error: updateError } = await supabaseAdmin
                    .from("profiles")
                    .update({
                        tier: "PASS",
                        premium_credits: 50,
                        premium_expires_at: newExpiry.toISOString()
                    })
                    .eq("id", userId);

                if (updateError) console.error("❌ DB Update Error (PASS):", updateError);
                else console.log("✅ DB Update Success (PASS)");

            } else if (priceId === yearlyPriceId || (process.env.NODE_ENV === 'development' && priceId === 'price_1YEARLY_MOCK')) {
                console.log("✨ Matching YEARLY plan...");
                let newExpiry = new Date();
                newExpiry.setDate(newExpiry.getDate() + 365);

                const { error: updateError } = await supabaseAdmin
                    .from("profiles")
                    .update({
                        tier: "YEARLY",
                        premium_credits: 500,
                        premium_expires_at: newExpiry.toISOString()
                    })
                    .eq("id", userId);

                if (updateError) console.error("❌ DB Update Error (YEARLY):", updateError);
                else console.log("✅ DB Update Success (YEARLY)");

            } else if (priceId === topupPriceId || (process.env.NODE_ENV === 'development' && priceId === 'price_1TOPUP_MOCK')) {
                console.log("✨ Matching TOPUP plan...");
                const currentCredits = currentProfile?.topup_credits || 0;
                let newExpiry = new Date();
                newExpiry.setDate(newExpiry.getDate() + 365);

                let currentTier = currentProfile?.tier || "TRIAL";
                if (currentTier === "PASS" || currentTier === "YEARLY") {
                    if (!currentProfile?.premium_expires_at || new Date(currentProfile.premium_expires_at) < new Date()) {
                        currentTier = "Casual";
                    }
                } else if (currentTier === "TRIAL") {
                    currentTier = "Casual";
                }

                const { error: updateError } = await supabaseAdmin
                    .from("profiles")
                    .update({
                        tier: currentTier,
                        topup_credits: currentCredits + 10,
                        topup_expires_at: newExpiry.toISOString()
                    })
                    .eq("id", userId);

                if (updateError) console.error("❌ DB Update Error (TOPUP):", updateError);
                else console.log("✅ DB Update Success (TOPUP)");
            } else {
                console.warn(`⚠️ Price ID ${priceId} did not match any known plans.`);
            }
        } else {
            console.warn("⚠️ No client_reference_id (userId) found in session.");
        }
    }

    return new NextResponse(null, { status: 200 });
}
