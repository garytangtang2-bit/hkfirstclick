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
                    // Custom Cluster Icon - Amber Gold Heatmap Effect
                    iconCreateFunction: function (cluster: any) {
                        const count = cluster.getChildCount();
                        const currentZoom = mapInstance.current.getZoom();

                        if (currentZoom < 4) {
                            // Heatmap illusion for global view (No numbers, heavy blur)
                            return L.divIcon({
                                html: `<div style="width: ${20 + count / 2}px; height: ${20 + count / 2}px; background: radial-gradient(circle, rgba(245,166,35,0.8) 0%, rgba(245,166,35,0) 70%); border-radius: 50%; box-shadow: 0 0 30px rgba(245,166,35,0.6); transform: translate(-50%, -50%);"></div>`,
                                className: 'custom-heatmap-icon',
                                iconSize: L.point(0, 0)
                            });
                        } else {
                            // Standard Amber Gold cluster for closer views
                            return L.divIcon({
                                html: `<div style="background-color: rgba(245, 166, 35, 0.2); border: 2px solid #F5A623; color: #F5A623; border-radius: 50%; padding: 8px; text-align: center; font-weight: bold; box-shadow: 0 4px 15px rgba(245, 166, 35, 0.4); backdrop-filter: blur(4px);">${count}</div>`,
                                className: 'custom-cluster-icon',
                                iconSize: L.point(40, 40)
                            });
                        }
                    }
                });
                mapInstance.current.addLayer(markersClusterRef.current);
            }

            // Amber Gold individual marker
            const customIcon = L.divIcon({
                html: `<div style="width: 14px; height: 14px; background-color: #F5A623; border-radius: 50%; box-shadow: 0 4px 10px rgba(245, 166, 35, 0.6), 0 0 20px rgba(245, 166, 35, 0.4); border: 2.5px solid white;"></div>`,
                className: 'custom-div-icon',
                iconSize: [14, 14],
                iconAnchor: [7, 7]
            });

            let filteredData = dataToRender;
            if (selectedRegion && selectedRegion !== "All") {
                filteredData = dataToRender.filter(city => city.Region && city.Region.includes(selectedRegion));
            }

            filteredData.forEach((city) => {
                const marker = L.marker([city.Latitude, city.Longitude], { icon: customIcon });

                // Attach dynamic language tooltips (hover only)
                const translatedName = getTranslatedCityName(city.City, language);
                marker.bindTooltip(translatedName, {
                    direction: "top",
                    offset: [0, -10],
                    opacity: 1,
                    permanent: false,
                    className: "custom-city-label"
                });

                marker.on('click', () => {
                    // Fly to location smoothly
                    mapInstance.current.flyTo([city.Latitude, city.Longitude], 12, {
                        animate: true,
                        duration: 1.5
                    });

                    // Trigger Bottom Drawer instead of native Leaflet Popup
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
