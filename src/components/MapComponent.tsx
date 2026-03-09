"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAppContext } from "@/components/AppContext";
import Papa from "papaparse";
import { getTranslatedCityName } from "@/utils/cityTranslations";

declare global {
    interface Window {
        L: any;
    }
}

interface MapComponentProps {
    userTier: string | null;
    selectedRegion: string;
    onCitySelect: (city: any) => void;
    onVisibleCitiesChange: (cities: any[]) => void;
}

export default function MapComponent({ userTier, selectedRegion, onCitySelect, onVisibleCitiesChange }: MapComponentProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markersClusterRef = useRef<any>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const { t, language } = useAppContext();
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
            mapInstance.current = window.L.map(mapRef.current, {
                zoomControl: false // Disable default top-left zoom
            }).setView([20, 0], 2);

            // Add zoom control to bottom right
            window.L.control.zoom({
                position: 'bottomright'
            }).addTo(mapInstance.current);

            // 2. Add OpenStreetMap Tile Layer (Dark Theme No Labels via CartoDB to support dynamic text rendering)
            window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
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
                    maxClusterRadius: 80, // Slightly more spread out clusters
                    // Custom Cluster Icon - Shows a summary or "City Name +"
                    iconCreateFunction: function (cluster: any) {
                        const count = cluster.getChildCount();
                        const currentZoom = mapInstance.current.getZoom();
                        const childMarkers = cluster.getAllChildMarkers();

                        // Pick the first child's name as the representative
                        const repCity = childMarkers[0]?.cityData;
                        const translatedRepName = repCity ? getTranslatedCityName(repCity.City, language) : "";

                        if (currentZoom < 4) {
                            // Global view: Heatmap illusion
                            return L.divIcon({
                                html: `<div style="width: ${22 + Math.min(count, 50) / 2}px; height: ${22 + Math.min(count, 50) / 2}px; background: radial-gradient(circle, rgba(238,220,0,0.7) 0%, rgba(238,220,0,0) 70%); border-radius: 50%; box-shadow: 0 0 40px rgba(238,220,0,0.5); transform: translate(-50%, -50%);"></div>`,
                                className: 'custom-heatmap-icon',
                                iconSize: L.point(0, 0)
                            });
                        } else {
                            // Mid-zoom: Show Representative City + Count
                            return L.divIcon({
                                html: `
                                    <div class="flex items-center gap-2 bg-[#161616]/90 backdrop-blur-md border border-[#EEDC00]/30 py-1.5 px-3 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap">
                                        <div class="w-1.5 h-1.5 rounded-full bg-[#EEDC00]"></div>
                                        <span class="text-white text-[11px] font-black tracking-wide">${translatedRepName}</span>
                                        <span class="bg-[#EEDC00] text-black text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">${count}</span>
                                    </div>
                                `,
                                className: 'custom-cluster-label-icon',
                                iconSize: L.point(0, 0),
                                iconAnchor: [50, 15]
                            });
                        }
                    }
                });
                mapInstance.current.addLayer(markersClusterRef.current);
            }

            let filteredData = dataToRender;
            if (selectedRegion && selectedRegion !== "All") {
                filteredData = dataToRender.filter(city => city.Region && city.Region.includes(selectedRegion));
            }

            filteredData.forEach((city) => {
                const translatedName = getTranslatedCityName(city.City, language);

                // Individual Label Marker - Matching Premium Design
                const labelIcon = L.divIcon({
                    html: `
                        <div class="group flex flex-col items-center">
                            <div class="bg-[#161616]/95 backdrop-blur-xl border border-white/20 py-1.5 px-3 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] group-hover:border-[#EEDC00]/50 transition-all duration-300 flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full bg-[#EEDC00] shadow-[0_0_10px_rgba(238,220,0,0.8)]"></div>
                                <span class="text-white text-xs font-black tracking-tight whitespace-nowrap">${translatedName}</span>
                            </div>
                            <div class="w-px h-2 bg-gradient-to-b from-white/30 to-transparent"></div>
                        </div>
                    `,
                    className: 'custom-city-label-icon',
                    iconSize: [0, 0],
                    iconAnchor: [60, 35]
                });

                const marker = L.marker([city.Latitude, city.Longitude], { icon: labelIcon });
                (marker as any).cityData = city; // Store for cluster identification

                marker.on('click', () => {
                    // Fly to location smoothly
                    mapInstance.current.flyTo([city.Latitude, city.Longitude], 12, {
                        animate: true,
                        duration: 1.5
                    });

                    // Trigger Bottom Drawer
                    onCitySelect(city);
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

        // 5. Semantic Lazy Loading & Bounds Binding
        const handleMapMovement = () => {
            if (!mapInstance.current) return;

            const currentZoom = mapInstance.current.getZoom();
            if (currentZoom < 4 && (!selectedRegion || selectedRegion === "All")) {
                renderMarkers(topCitiesRef.current);
            } else {
                renderMarkers(allCitiesRef.current);
            }

            // Calculate visible cities in current bounds
            try {
                const bounds = mapInstance.current.getBounds();
                const visible = allCitiesRef.current.filter((city: any) =>
                    bounds.contains([city.Latitude, city.Longitude])
                );
                // Return max 15 to keep UI responsive
                onVisibleCitiesChange(visible.slice(0, 15));
            } catch (e) {
                // Ignore initial bounds errors
            }
        };

        mapInstance.current.off('zoomend');
        mapInstance.current.off('moveend');

        mapInstance.current.on('zoomend', handleMapMovement);
        mapInstance.current.on('moveend', handleMapMovement);

        // Initial bounds calculation
        setTimeout(handleMapMovement, 300);

    }, [mapLoaded, userTier, selectedRegion, language]);

    return (
        <div className="w-full h-full relative overflow-hidden bg-gray-100">
            {!mapLoaded && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm text-[#F5A623]">
                    <Loader2 className="animate-spin mb-4" size={40} />
                    <p className="font-bold tracking-widest text-sm uppercase">{t.map_initializing || "Initializing Global Map..."}</p>
                </div>
            )}
            <div id="map" ref={mapRef} style={{ height: "100%", width: "100%", zIndex: 10 }}></div>
        </div>
    );
}
