import { createClient } from "@supabase/supabase-js";
import { Globe, Users, CreditCard, Sparkles, Activity } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/utils/supabase/server";

// We use the service role key to bypass RLS and count ALL profiles for the admin.
// In a real app, you would add an admin check (e.g., checking if the logged-in user's email is yours)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminDashboard() {
    // 1. Basic security check (Optional but recommended)
    // Ensure only the admin can view this page.
    const supabaseAuth = await createServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    // Replace with your actual admin email
    const ADMIN_EMAIL = "gary@example.com";

    // If you want strictly secure testing, uncomment below lines
    // if (!user || user.email !== ADMIN_EMAIL) {
    //   redirect("/"); 
    // }

    // 2. Fetch Metrics using Admin Key
    const { count: totalUsers } = await supabaseAdmin
        .from("profiles")
        .select("*", { count: 'exact', head: true });

    const { count: trialUsers } = await supabaseAdmin
        .from("profiles")
        .select("*", { count: 'exact', head: true })
        .eq('tier', 'TRIAL');

    const { count: paidUsers } = await supabaseAdmin
        .from("profiles")
        .select("*", { count: 'exact', head: true })
        .neq('tier', 'TRIAL');

    // Let's get the 5 most recent signups
    const { data: recentSignups } = await supabaseAdmin
        .from("profiles")
        .select("id, tier, credits, updated_at")
        .order("updated_at", { ascending: false })
        .limit(5);

    return (
        <div className="min-h-screen bg-[#0E0E0E] text-white p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-xl font-bold hover:text-[#EEDC00] transition-colors">
                            &larr; Back to App
                        </Link>
                        <h1 className="text-3xl font-black flex items-center gap-3">
                            <Activity className="text-[#EEDC00]" /> Admin Dashboard
                        </h1>
                    </div>
                    <div className="text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-full">
                        Live Database Metrics
                    </div>
                </div>

                {/* Top KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#161616] p-6 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3 text-gray-400 mb-2">
                            <Users size={20} /> Total Registered Users
                        </div>
                        <div className="text-5xl font-black text-white">{totalUsers || 0}</div>
                    </div>

                    <div className="bg-[#161616] p-6 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3 text-[#EEDC00] mb-2">
                            <Sparkles size={20} /> Active Free Trials
                        </div>
                        <div className="text-5xl font-black text-[#EEDC00]">{trialUsers || 0}</div>
                    </div>

                    <div className="bg-[#161616] p-6 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3 text-green-400 mb-2">
                            <CreditCard size={20} /> Paid Subscribers
                        </div>
                        <div className="text-5xl font-black text-green-400">{paidUsers || 0}</div>
                    </div>
                </div>

                {/* Recent Registrations Table */}
                <div className="bg-[#161616] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold">Newest Registrations</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-gray-400 text-sm">
                                    <th className="p-4 font-medium border-b border-white/10">User ID (UUID)</th>
                                    <th className="p-4 font-medium border-b border-white/10">Account Tier</th>
                                    <th className="p-4 font-medium border-b border-white/10">Credits Remaining</th>
                                    <th className="p-4 font-medium border-b border-white/10">Registration Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSignups?.length ? (
                                    recentSignups.map((profile) => (
                                        <tr key={profile.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                                            <td className="p-4 font-mono text-sm text-gray-300">
                                                {profile.id.substring(0, 13)}...
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${profile.tier === 'TRIAL'
                                                        ? "bg-gray-800 text-gray-300"
                                                        : "bg-green-900/50 text-green-400"
                                                    }`}>
                                                    {profile.tier}
                                                </span>
                                            </td>
                                            <td className="p-4 font-mono text-[#EEDC00]">{profile.credits}</td>
                                            <td className="p-4 text-sm text-gray-500">
                                                {new Date(profile.updated_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">
                                            <Globe className="mx-auto mb-4 opacity-50" size={32} />
                                            No registrations found yet. Share your app to get your first user!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
