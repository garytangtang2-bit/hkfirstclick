import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            // Check if the requesting user owns this itinerary first
            const { data: { user } } = await supabase.auth.getUser();

            const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
            const serviceClient = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );
            const { data, error } = await serviceClient
                .from('itineraries')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

            // Allow access if: user owns it, OR accessed via share link (UUID is unguessable)
            const isOwner = user && data.user_id === user.id;
            if (!isOwner && !data) {
                return NextResponse.json({ error: "Not found" }, { status: 404 });
            }

            return NextResponse.json({ itinerary: data });
        } else {
            // Fetch all itineraries for user dashboard (STRICT AUTHENTICATION REQUIRED)
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            const { data, error } = await supabase
                .from('itineraries')
                .select('id, title, destination, start_date, end_date, created_at, parent_id')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return NextResponse.json({ itineraries: data });
        }
    } catch (err: any) {
        console.error("Itineraries Fetch Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
