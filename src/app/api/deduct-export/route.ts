import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUserCredits, deductCredits } from "@/utils/credits";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();

        // 1. Authenticate user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { error: "You must be logged in to export a PDF. Please log in first." },
                { status: 401 }
            );
        }

        // 2. Fetch user profile
        const { tier, activeCredits: credits } = await getUserCredits(user.id);

        // 3. Evaluate export rules
        if (tier === "PASS" || tier === "YEARLY") {
            // Free exports for active premium users
            return NextResponse.json({ success: true, message: "Export approved" }, { status: 200 });
        }

        // User is TRIAL or Casual (or expired premium falling back to Casual)
        if (credits <= 0) {
            return NextResponse.json(
                { error: "You don't have enough credits to export this PDF. Please upgrade or top up." },
                { status: 402 }
            );
        }

        // Deduct 1 credit for export
        const deductResult = await deductCredits(user.id, 1);

        if (!deductResult.success) {
            return NextResponse.json(
                { error: deductResult.error || "Failed to deduct credit. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: "1 credit deducted for export." }, { status: 200 });

    } catch (err: any) {
        console.error("Export deduction error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
