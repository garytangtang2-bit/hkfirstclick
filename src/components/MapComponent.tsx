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

    // Base simulated cluster locations (representing the 1000 items from backend)
    const cityData = [
        { name: "Bangkok (曼谷)", lat: 13.7563, lng: 100.5018, feature: "Vibrancy, Temples & Modernity", food: "Tom Yum Goong, Pad Thai", spot: "Grand Palace, Wat Arun" },
        { name: "Hong Kong (香港)", lat: 22.3193, lng: 114.1694, feature: "Shopping Paradise, Skyscrapers", food: "Dim Sum, Roast Goose", spot: "Victoria Harbour, The Peak" },
        { name: "London (倫敦)", lat: 51.5074, lng: -0.1278, feature: "History & Royal Culture", food: "Afternoon Tea, Fish & Chips", spot: "Big Ben, Tower Bridge" },
        { name: "Paris (巴黎)", lat: 48.8566, lng: 2.3522, feature: "Romance, Fashion, Arts", food: "Croissant, Macaron", spot: "Eiffel Tower, Louvre" },
        { name: "Tokyo (東京)", lat: 35.6895, lng: 139.6917, feature: "Futurism, Anime, Politeness", food: "Sushi, Ramen, Wagyu", spot: "Shibuya Crossing, Senso-ji" },
        { name: "Dubai (杜拜)", lat: 25.2048, lng: 55.2708, feature: "Luxury, Desert Miracles", food: "Camel Meat, Arabic BBQ", spot: "Burj Khalifa, Burj Al Arab" },
        { name: "Rome (羅馬)", lat: 41.9028, lng: 12.4964, feature: "Eternal City, Ruins & Museums", food: "Pasta, Gelato", spot: "Colosseum, Trevi Fountain" },
        { name: "Istanbul (伊斯坦堡)", lat: 41.0082, lng: 28.9784, feature: "Eurasian Crossroads, Turkish Vibes", food: "Kebab, Turkish Coffee", spot: "Hagia Sophia" },
        { name: "New York (紐約)", lat: 40.7128, lng: -74.0060, feature: "The Big Apple, City Never Sleeps", food: "NY Pizza, Cheesecake", spot: "Times Square, Statue of Liberty" },
        { name: "Barcelona (巴塞隆拿)", lat: 41.3851, lng: 2.1734, feature: "Gaudí Architecture, Med. Sunshine", food: "Tapas, Paella", spot: "Sagrada Familia, Park Güell" }
    ];

    useEffect(() => {
        // Essential check to ensure 'L' (Leaflet) exists on the window object (loaded via Script tag)
        if (typeof window !== "undefined" && window.L && !mapInstance.current && mapRef.current) {

            // 1. Initialize map centered globally to show off clusters
            mapInstance.current = window.L.map(mapRef.current).setView([20, 0], 2);

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

        // 3. Initialize the "Antigravity" Cluster Layer
        const markersClusterGroup = L.markerClusterGroup({
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true
        });

        // Track layers to clear them if deps change (or keep them attached)
        markersRef.current.push(markersClusterGroup);

        const latlngs: any[] = [];

        // 4. Populate clusters and logic
        cityData.forEach((city) => {
            const marker = L.marker([city.lat, city.lng]);
            latlngs.push([city.lat, city.lng]);

            // Custom interaction: Free vs Premium
            marker.on('click', () => {
                if (userTier === "TRIAL" || userTier === "Casual" || !userTier) {
                    // Free User behavior: Just standard small popup, no flyTo, no AI details
                    marker.bindPopup(`<b>${city.name}</b><br/><br/><span style="font-size: 11px; color: gray;">${t.ws_upgrade_hint || "Upgrade to Premium ✨ for details & FlyTo"}</span>`).openPopup();
                } else {
                    // Premium User behavior: FlyTo animation and rich AI description
                    mapInstance.current.flyTo([city.lat, city.lng], 12, {
                        animate: true,
                        duration: 1.5 // in seconds
                    });

                    marker.bindPopup(`
                        <div style="min-width: 200px; padding: 4px;" class="popup-content">
                            <h3 style="margin: 0 0 10px 0; font-weight: bold; font-size: 16px; color: #00D2FF;">${city.name} ✨</h3>
                            <p style="margin: 4px 0;"><strong style="color: #666;">📌 Vibe:</strong> <span style="color: #444;">${city.feature}</span></p>
                            <p style="margin: 4px 0;"><strong style="color: #666;">🍜 Food:</strong> <span style="color: #444;">${city.food}</span></p>
                            <p style="margin: 4px 0 12px 0;"><strong style="color: #666;">🏛️ Spot:</strong> <span style="color: #444;">${city.spot}</span></p>
                            <a href="#" style="color: #00D2FF; text-decoration: none; font-size: 13px; font-weight: 800;">View AI City Guide &rarr;</a>
                        </div>
                    `).openPopup();
                }
            });

            // Add marker to cluster group rather than map directly
            markersClusterGroup.addLayer(marker);
        });

        // 5. Add all clustered markers to map at once
        mapInstance.current.addLayer(markersClusterGroup);

        // Optional: Draw polyline (if you still want paths between them, though with thousands it might look crazy. We'll leave it out for a pure city cluster view, or you can restore it.)
        /*
        if (latlngs.length > 1) {
            polylineRef.current = L.polyline(latlngs, {
                color: '#00D2FF',
                weight: 2,
                opacity: 0.3,
                dashArray: '5, 10'
            }).addTo(mapInstance.current);
        }
        */

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
