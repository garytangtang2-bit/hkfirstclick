"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAppContext } from "@/components/AppContext";
import Papa from "papaparse";

declare global {
    interface Window {
        L: any;
    }
}

interface MapComponentProps {
    userTier: string | null;
    selectedRegion: string;
}

export default function MapComponent({ userTier, selectedRegion }: MapComponentProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markersClusterRef = useRef<any>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const { t } = useAppContext();
    const allCitiesRef = useRef<any[]>([]); // Store parsed CSV data
    const topCitiesRef = useRef<any[]>([]); // Top 50 subset

    // Fetch and parse CSV data once
    useEffect(() => {
        Papa.parse("/global_cities_1000.csv", {
            download: true,
            header: true,
            dynamicTyping: true, // auto convert numbers
            complete: (results) => {
                // Filter out invalid rows instantly
                const validData = results.data.filter((d: any) => d.City && d.Latitude && d.Longitude);
                allCitiesRef.current = validData;
                topCitiesRef.current = validData.slice(0, 50); // Just mock Top 50 based on order
            }
        });
    }, []);

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
        // 3. Render logic function
        const renderMarkers = (dataToRender: any[]) => {
            if (markersClusterRef.current) {
                markersClusterRef.current.clearLayers();
            } else {
                markersClusterRef.current = L.markerClusterGroup({
                    spiderfyOnMaxZoom: true,
                    showCoverageOnHover: false,
                    zoomToBoundsOnClick: true,
                    // Custom Cluster Icon to match the premium theme
                    iconCreateFunction: function (cluster: any) {
                        return L.divIcon({
                            html: `<div style="background-color: rgba(0, 210, 255, 0.2); border: 2px solid #00D2FF; color: #00D2FF; border-radius: 50%; padding: 8px; text-align: center; font-weight: bold; box-shadow: 0 0 15px rgba(0, 210, 255, 0.5);">${cluster.getChildCount()}</div>`,
                            className: 'custom-cluster-icon',
                            iconSize: L.point(40, 40)
                        });
                    }
                });
                mapInstance.current.addLayer(markersClusterRef.current);
            }

            const customIcon = L.divIcon({
                html: `<div style="width: 12px; height: 12px; background-color: #00D2FF; border-radius: 50%; box-shadow: 0 0 10px #00D2FF, 0 0 20px #00D2FF; border: 2px solid white;"></div>`,
                className: 'custom-div-icon',
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            });

            let filteredData = dataToRender;
            if (selectedRegion && selectedRegion !== "All") {
                filteredData = dataToRender.filter(city => city.Region && city.Region.includes(selectedRegion));
            }

            filteredData.forEach((city) => {
                const marker = L.marker([city.Latitude, city.Longitude], { icon: customIcon });

                marker.on('click', () => {
                    if (userTier === "TRIAL" || userTier === "Casual" || !userTier) {
                        marker.bindPopup(`<b>${city.City}</b><br/><br/><span style="font-size: 11px; color: gray;">${t.ws_upgrade_hint || "Upgrade to Premium ✨ for details & FlyTo"}</span>`).openPopup();
                    } else {
                        mapInstance.current.flyTo([city.Latitude, city.Longitude], 12, {
                            animate: true,
                            duration: 1.5
                        });

                        marker.bindPopup(`
                            <div style="min-width: 200px; padding: 4px;" class="popup-content">
                                <h3 style="margin: 0 0 10px 0; font-weight: bold; font-size: 16px; color: #00D2FF;">${city.City} ✨</h3>
                                <p style="margin: 4px 0;"><strong style="color: #666;">📌 Vibe:</strong> <span style="color: #444;">${city.Vibe}</span></p>
                                <p style="margin: 4px 0;"><strong style="color: #666;">🍜 Food:</strong> <span style="color: #444;">${city.Top_Food}</span></p>
                                <p style="margin: 4px 0 12px 0;"><strong style="color: #666;">🏛️ Spot:</strong> <span style="color: #444;">${city.Must_Visit_Spot}</span></p>
                                <a href="#" style="color: #00D2FF; text-decoration: none; font-size: 13px; font-weight: 800;">View AI City Guide &rarr;</a>
                            </div>
                        `).openPopup();
                    }
                });

                markersClusterRef.current.addLayer(marker);
            });
        };

        // 4. Initial Render based on Region or Zoom
        // Wait a tiny bit for PapaParse to finish initially (could be handled via state, but this is a lightweight approach for local CSV)
        setTimeout(() => {
            const currentZoom = mapInstance.current.getZoom();
            if (currentZoom < 4 && (!selectedRegion || selectedRegion === "All")) {
                renderMarkers(topCitiesRef.current);
            } else {
                renderMarkers(allCitiesRef.current);
            }
        }, 100);

        // 5. Semantic Lazy Loading Binding
        mapInstance.current.on('zoomend', () => {
            const currentZoom = mapInstance.current.getZoom();
            if (currentZoom < 4 && (!selectedRegion || selectedRegion === "All")) {
                renderMarkers(topCitiesRef.current);
            } else {
                renderMarkers(allCitiesRef.current);
            }
        });

    }, [mapLoaded, userTier, selectedRegion]);

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
