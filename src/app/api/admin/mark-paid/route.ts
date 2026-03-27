import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const getSupabaseAdmin = () =>
    createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
    const supabaseAuth = await createServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user || user.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { affiliate_id, commission_ids } = await req.json();
    if (!affiliate_id) return NextResponse.json({ error: "affiliate_id required" }, { status: 400 });

    const supabaseAdmin = getSupabaseAdmin();

    let query = supabaseAdmin
        .from("affiliate_commissions")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("affiliate_id", affiliate_id)
        .eq("status", "pending");

    if (commission_ids?.length) {
        query = query.in("id", commission_ids);
    }

    const { error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Fetch affiliate details for email notification
    const { data: affiliate } = await supabaseAdmin
        .from("affiliates")
        .select("ref_code, payout_email, min_payout_usd")
        .eq("id", affiliate_id)
        .single();

    // Calculate total amount just paid
    const { data: paidCommissions } = await supabaseAdmin
        .from("affiliate_commissions")
        .select("commission_usd")
        .eq("affiliate_id", affiliate_id)
        .eq("status", "paid");

    const totalPaid = paidCommissions?.reduce((s, c) => s + Number(c.commission_usd), 0) ?? 0;

    // Reset notification flag so affiliate can be notified again next time
    await supabaseAdmin
        .from("affiliates")
        .update({ payout_notified_at: null })
        .eq("id", affiliate_id);

    // Send email notification to affiliate
    if (affiliate?.payout_email) {
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const paidDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

            await resend.emails.send({
                from: "HKfirstclick <onboarding@resend.dev>",
                to: affiliate.payout_email,
                subject: `Your affiliate payout has been sent — $${totalPaid.toFixed(2)} USD`,
                text: [
                    `Hi,`,
                    ``,
                    `Great news! Your HKfirstclick affiliate commission has been transferred to your PayPal account.`,
                    ``,
                    `Payment details:`,
                    `  Amount: $${totalPaid.toFixed(2)} USD`,
                    `  PayPal: ${affiliate.payout_email}`,
                    `  Date: ${paidDate}`,
                    ``,
                    `You can view your full commission history at:`,
                    `${process.env.NEXT_PUBLIC_SITE_URL}/affiliate`,
                    ``,
                    `Thank you for promoting HKfirstclick!`,
                    ``,
                    `— HKfirstclick Team`,
                ].join("\n"),
            });
        } catch (emailErr) {
            console.error("Failed to send payout confirmation email to affiliate:", emailErr);
        }
    }

    return NextResponse.json({ success: true });
}
