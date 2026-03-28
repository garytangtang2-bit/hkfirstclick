import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: "2025-02-24.acacia",
        });

        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { priceId } = body;

        const cookieStore = await cookies();
        const refCode = cookieStore.get("hkfc_ref")?.value ?? "";

        const passPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_PASS;
        const isSubscription = priceId === passPriceId;

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ["card"],
            mode: isSubscription ? "subscription" : "payment",
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/workspace?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
            client_reference_id: user.id,
            customer_email: user.email,
        };

        // metadata only supported on payment mode; use subscription_data for subscriptions
        if (isSubscription) {
            sessionParams.subscription_data = { metadata: { ref_code: refCode, user_id: user.id } };
        } else {
            sessionParams.metadata = { ref_code: refCode };
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
