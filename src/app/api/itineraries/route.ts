import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            // Fetch single itinerary by ID (Public Share Link enabled via unguessable UUID)
            const { data, error } = await supabase
                .from('itineraries')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
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
