"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAppContext } from "@/components/AppContext";

declare global {
    interface Window {
        L: any;
    }
}

export default function MapComponent({ userTier }: { userTier: string | null }) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const polylineRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const [mapLoaded, setMapLoaded] = useState(false);
    const { t } = useAppContext();

    // Mock generated locations for demonstration / testing
    const demoLocations = [
        { name: "Victoria Peak (太平山頂)", lat: 22.2759, lng: 114.1455, desc: "A stunning viewpoint of the Hong Kong skyline." },
        { name: "Star Ferry Pier (天星碼頭)", lat: 22.2936, lng: 114.1687, desc: "Historic ferry service across Victoria Harbour." },
        { name: "Temple Street Night Market (廟街)", lat: 22.3089, lng: 114.1705, desc: "Famous night market with street food and shopping." },
        { name: "Hong Kong Disneyland (迪士尼樂園)", lat: 22.3130, lng: 114.0413, desc: "Magical theme park right in Lantau Island." }
    ];

    useEffect(() => {
        // Essential check to ensure 'L' (Leaflet) exists on the window object (loaded via Script tag)
        if (typeof window !== "undefined" && window.L && !mapInstance.current && mapRef.current) {

            // 1. Initialize map centered on Hong Kong
            mapInstance.current = window.L.map(mapRef.current).setView([22.3193, 114.1694], 12);

            // 2. Add OpenStreetMap Tile Layer (Dark Theme via CartoDB Dark Matter for better SaaS contrast)
            window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(mapInstance.current);

            setMapLoaded(true);
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapLoaded || !mapInstance.current) return;
        const L = window.L;

        // Clear existing markers/polylines if any
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];
        if (polylineRef.current) {
            polylineRef.current.remove();
        }

        const latlngs: any[] = [];

        // 3. Add custom markers and logic
        demoLocations.forEach((loc) => {
            const marker = L.marker([loc.lat, loc.lng]).addTo(mapInstance.current);
            markersRef.current.push(marker);
            latlngs.push([loc.lat, loc.lng]);

            // Custom interaction: Free vs Premium
            marker.on('click', () => {
                if (userTier === "TRIAL" || userTier === "Casual" || !userTier) {
                    // Free User behavior: Just standard small popup, no flyTo, no AI details
                    marker.bindPopup(`<b>${loc.name}</b><br/><br/><span style="font-size: 11px; color: gray;">${t.ws_upgrade_hint || "Upgrade to Premium ✨ for AI Insights & FlyTo"}</span>`).openPopup();
                } else {
                    // Premium User behavior: FlyTo animation and rich AI description
                    mapInstance.current.flyTo([loc.lat, loc.lng], 16, {
                        animate: true,
                        duration: 1.5 // in seconds
                    });

                    marker.bindPopup(`
                        <div style="min-width: 200px; padding: 4px;">
                            <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px;">${loc.name} ✨</h3>
                            <p style="margin: 0; color: #555;">${loc.desc}</p>
                            <br/>
                            <a href="#" style="color: #00D2FF; text-decoration: none; font-size: 12px; font-weight: bold;">View detailed AI itinerary &rarr;</a>
                        </div>
                    `).openPopup();
                }
            });
        });

        // 4. Draw Polyline (Travel Path)
        if (latlngs.length > 1) {
            polylineRef.current = L.polyline(latlngs, {
                color: '#00D2FF',
                weight: 3,
                opacity: 0.6,
                dashArray: '5, 10' // Dashed line to signify travel 
            }).addTo(mapInstance.current);

            // Optionally fit bounds to show all markers
            // mapInstance.current.fitBounds(polylineRef.current.getBounds());
        }

    }, [mapLoaded, userTier]);

    return (
        <div className="w-full h-full relative premium-glass-card overflow-hidden">
            {!mapLoaded && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0E0E0E]/80 backdrop-blur-sm text-[#00D2FF]">
                    <Loader2 className="animate-spin mb-4" size={40} />
                    <p className="font-bold tracking-widest text-sm uppercase glow-text">Initializing Global Map...</p>
                </div>
            )}
            <div id="map" ref={mapRef} style={{ height: "100%", width: "100%", zIndex: 10 }}></div>
        </div>
    );
}
