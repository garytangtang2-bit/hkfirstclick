"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { AppProvider, useAppContext } from "@/components/AppContext";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Calendar, MapPin, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MyTrips() {
    return (
        <AppProvider>
            <GlobalLayout>
                <MyTripsContent />
            </GlobalLayout>
        </AppProvider>
    );
}

function MyTripsContent() {
    const { t } = useAppContext();
    const supabase = createClient();
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                const res = await fetch("/api/itineraries");
                const data = await res.json();
                if (res.ok && data.itineraries) {
                    setTrips(data.itineraries);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, [supabase]);

    return (
        <div className="min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="text-center mb-16 relative">
                <h1 className="text-4xl md:text-5xl font-black mb-6 drop-shadow-lg text-white">
                    My Itineraries
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    View, manage, and iterate on your past AI-generated travel plans.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 text-[#EEDC00] animate-spin" />
                </div>
            ) : trips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip) => (
                        <Link href={`/workspace?id=${trip.id}`} key={trip.id} className="block group">
                            <div className="bg-[#161616] border border-white/5 group-hover:border-[#EEDC00]/50 rounded-3xl p-6 transition-all duration-300 transform group-hover:-translate-y-2 h-full flex flex-col shadow-lg">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-white/5 p-3 rounded-2xl group-hover:bg-[#EEDC00]/10 transition-colors">
                                        <MapPin className="text-[#EEDC00]" size={24} />
                                    </div>
                                    <span className="text-xs font-semibold px-3 py-1 bg-white/5 rounded-full text-gray-400">
                                        {new Date(trip.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{trip.title}</h3>
                                <div className="flex items-center text-sm text-gray-400 mb-6 gap-2">
                                    <Calendar size={14} />
                                    <span>{trip.start_date} - {trip.end_date}</span>
                                </div>

                                <div className="mt-auto flex items-center text-[#EEDC00] text-sm font-bold group-hover:translate-x-2 transition-transform">
                                    View Itinerary <ArrowRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-[#161616] border border-white/5 rounded-3xl p-12 text-center max-w-2xl mx-auto">
                    <MapPin size={48} className="text-gray-700 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-white mb-4">No trips found</h3>
                    <p className="text-gray-400 mb-8">You haven't generated any itineraries yet. Let's create your first adventure!</p>
                    <Link href="/workspace">
                        <button className="bg-[#EEDC00] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#ffe600] transition-colors">
                            Create New Trip
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
