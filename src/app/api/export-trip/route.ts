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

        // Export Rule: Image export is a client-side function (html2canvas).
        // The API only serves as a validation that the user is logged in.
        // We no longer deduct credits for this action to encourage sharing.

        return NextResponse.json({ success: true, message: "Export authorized." });

    } catch (err: any) {
        console.error("Export API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
