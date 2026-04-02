import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Use service role key to bypass RLS and update credits securely
const getSupabaseAdmin = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const supabaseAdmin = getSupabaseAdmin();
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

    // Monthly PASS renewal
    if (event.type === "invoice.paid") {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;
        if (subscriptionId && invoice.billing_reason === "subscription_cycle") {
            try {
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const userId = subscription.metadata?.user_id;
                if (userId) {
                    let newExpiry = new Date();
                    newExpiry.setMonth(newExpiry.getMonth() + 1);
                    await supabaseAdmin.from("profiles").update({
                        tier: "PASS",
                        premium_credits: 50,
                        premium_expires_at: newExpiry.toISOString(),
                    }).eq("id", userId);
                    console.log(`🔄 PASS renewed for user ${userId}`);
                }
            } catch (err) {
                console.error("❌ Error handling invoice.paid:", err);
            }
        }
        return new NextResponse(null, { status: 200 });
    }

    // PASS subscription cancelled
    if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;
        if (userId) {
            await supabaseAdmin.from("profiles").update({
                tier: "Casual",
                premium_expires_at: new Date().toISOString(),
            }).eq("id", userId);
            console.log(`❌ PASS cancelled for user ${userId}`);
        }
        return new NextResponse(null, { status: 200 });
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
                newExpiry.setMonth(newExpiry.getMonth() + 1);

                const { error: updateError } = await supabaseAdmin
                    .from("profiles")
                    .update({
                        tier: "PASS",
                        premium_credits: 50,
                        premium_expires_at: newExpiry.toISOString(),
                        stripe_subscription_id: session.subscription as string || null,
                        stripe_customer_id: session.customer as string || null,
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

            // --- Payment receipt email ---
            if (customerEmail) {
                try {
                    const resend = new Resend(process.env.RESEND_API_KEY);
                    const planName = priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PASS ? "Journey Pass (Monthly)"
                        : priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY ? "Yearly Plan"
                        : priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_TOPUP ? "Credit Top-up"
                        : "Plan";
                    const amountFormatted = session.amount_total ? `$${(session.amount_total / 100).toFixed(2)} ${session.currency?.toUpperCase()}` : "";
                    await resend.emails.send({
                        from: "HKfirstclick <onboarding@resend.dev>",
                        to: customerEmail,
                        subject: `Payment confirmed — ${planName}`,
                        text: `Hi,\n\nYour payment has been confirmed.\n\nPlan: ${planName}\nAmount: ${amountFormatted}\nOrder ID: ${session.id}\n\nYour credits have been added to your account. Start planning your trip:\n${process.env.NEXT_PUBLIC_SITE_URL}/workspace\n\nThank you,\nHKfirstclick Team`,
                    });
                    console.log(`📧 Receipt sent to ${customerEmail}`);
                } catch (emailErr) {
                    console.error("Failed to send receipt email:", emailErr);
                }
            }

            // --- Affiliate commission ---
            const refCode = session.metadata?.ref_code;
            if (refCode && session.amount_total) {
                try {
                    const { data: affiliate } = await supabaseAdmin
                        .from("affiliates")
                        .select("id, commission_pct, user_id, status, ref_code, payout_email, min_payout_usd, payout_notified_at")
                        .eq("ref_code", refCode)
                        .single();

                    if (affiliate && affiliate.status === "active" && affiliate.user_id !== userId) {
                        const { data: referral } = await supabaseAdmin
                            .from("referrals")
                            .select("id")
                            .eq("affiliate_id", affiliate.id)
                            .eq("referred_user_id", userId)
                            .single();

                        if (referral) {
                            const amountUsd = session.amount_total / 100;
                            const commissionUsd = parseFloat((amountUsd * affiliate.commission_pct / 100).toFixed(2));

                            await supabaseAdmin
                                .from("affiliate_commissions")
                                .insert({
                                    affiliate_id: affiliate.id,
                                    referral_id: referral.id,
                                    stripe_session_id: session.id,
                                    amount_paid_usd: amountUsd,
                                    commission_usd: commissionUsd,
                                })
                                .throwOnError();

                            console.log(`💸 Commission recorded: $${commissionUsd} for affiliate ${affiliate.id}`);

                            // Check if total pending earnings reached affiliate's min_payout_usd
                            const { data: pendingRows } = await supabaseAdmin
                                .from("affiliate_commissions")
                                .select("commission_usd")
                                .eq("affiliate_id", affiliate.id)
                                .eq("status", "pending");

                            const totalPending = pendingRows?.reduce((s, c) => s + Number(c.commission_usd), 0) ?? 0;
                            const minPayout = Number(affiliate.min_payout_usd) || 50;

                            // Only notify once — reset when admin marks as paid
                            const alreadyNotified = !!affiliate.payout_notified_at;
                            if (totalPending >= minPayout && affiliate.payout_email && !alreadyNotified) {
                                try {
                                    const resend = new Resend(process.env.RESEND_API_KEY);
                                    await resend.emails.send({
                                        from: "HKfirstclick <onboarding@resend.dev>",
                                        to: process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL!,
                                        subject: `[Affiliate] Payout ready: $${totalPending.toFixed(2)} USD`,
                                        text: `An affiliate has reached their payout threshold.\n\nRef Code: ${affiliate.ref_code}\nPayPal Email: ${affiliate.payout_email}\nPending Balance: $${totalPending.toFixed(2)} USD\nMin Payout Set: $${minPayout} USD\n\nPlease process the payout at: ${process.env.NEXT_PUBLIC_SITE_URL}/admin/affiliates`,
                                    });
                                    // Mark as notified so we don't send again
                                    await supabaseAdmin
                                        .from("affiliates")
                                        .update({ payout_notified_at: new Date().toISOString() })
                                        .eq("id", affiliate.id);
                                    console.log(`📧 Payout notification sent for affiliate ${affiliate.ref_code}`);
                                } catch (emailErr) {
                                    console.error("Failed to send payout notification email:", emailErr);
                                }
                            }
                        }
                    }
                } catch (err) {
                    // Silently ignore duplicate (idempotency via unique stripe_session_id)
                    console.warn("⚠️ Commission insert skipped (likely duplicate):", err);
                }
            }

        } else {
            console.warn("⚠️ No client_reference_id (userId) found in session.");
        }
    }

    return new NextResponse(null, { status: 200 });
}
