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
    hoveredCityName: string | null;
    onCitySelect: (city: any) => void;
    onVisibleCitiesChange: (cities: any[]) => void;
    flyToCityRef?: React.MutableRefObject<((city: any) => void) | null>;
}

export default function MapComponent({ userTier, selectedRegion, hoveredCityName, onCitySelect, onVisibleCitiesChange, flyToCityRef }: MapComponentProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markersClusterRef = useRef<any>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const { t, language } = useAppContext();
    const allCitiesRef = useRef<any[]>([]);

    // Fetch and parse CSV data once
    useEffect(() => {
        Papa.parse("/global_cities_1000.csv", {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                const validData = results.data.filter((d: any) => d.City && d.Latitude && d.Longitude);
                allCitiesRef.current = validData;
                setDataLoaded(true);
            }
        });
    }, []);

    useEffect(() => {
        let pollInterval: ReturnType<typeof setInterval>;

        const initMap = () => {
            if (typeof window === "undefined" || !window.L || mapInstance.current || !mapRef.current) return false;

            mapInstance.current = window.L.map(mapRef.current, {
                zoomControl: false,
                maxZoom: 18
            }).setView([20, 0], 2);

            window.L.control.zoom({
                position: 'bottomright'
            }).addTo(mapInstance.current);

            window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(mapInstance.current);

            setMapLoaded(true);

            if (flyToCityRef) {
                flyToCityRef.current = (city: any) => {
                    if (mapInstance.current && city.Latitude && city.Longitude) {
                        mapInstance.current.flyTo([city.Latitude, city.Longitude], 10, {
                            animate: true,
                            duration: 1.5
                        });
                    }
                };
            }
            return true;
        };

        // Try immediately, then poll every 100ms until Leaflet is ready
        if (!initMap()) {
            pollInterval = setInterval(() => {
                if (initMap()) clearInterval(pollInterval);
            }, 100);
        }

        return () => {
            clearInterval(pollInterval);
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
                markersClusterRef.current = null;
            }
        };
    }, []);

    // This effect only runs on initial load or when region/language changes
    useEffect(() => {
        if (!mapLoaded || !dataLoaded || !mapInstance.current) return;
        const L = window.L;

        // Remove old cluster if any
        if (markersClusterRef.current) {
            mapInstance.current.removeLayer(markersClusterRef.current);
            markersClusterRef.current = null;
        }

        // Create a brand new MarkerClusterGroup
        const clusterGroup = L.markerClusterGroup({
            maxClusterRadius: 60,
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: true,
            disableClusteringAtZoom: 10,
            iconCreateFunction: (cluster: any) => {
                const count = cluster.getChildCount();
                let size = 40;
                if (count > 10) size = 50;
                if (count > 20) size = 60;
                return L.divIcon({
                    html: `<div>${count}</div>`,
                    className: 'custom-cluster-icon',
                    iconSize: L.point(size, size, true),
                });
            }
        });

        // Filter by region
        let filteredData = allCitiesRef.current;
        if (selectedRegion && selectedRegion !== "All") {
            filteredData = allCitiesRef.current.filter(city => city.Region && city.Region.includes(selectedRegion));
        }

        // Create all markers
        filteredData.forEach((city) => {
            const translatedName = getTranslatedCityName(city.City, language);
            const isActive = hoveredCityName === city.City;
            const pureGlowIcon = L.divIcon({
                className: 'clear-leaflet-bg',
                html: `<div class="pure-glow-dot ${isActive ? 'active-glow-dot' : ''}"></div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });

            const marker = L.marker([city.Latitude, city.Longitude], { icon: pureGlowIcon });
            (marker as any).cityData = city;

            marker.bindTooltip(translatedName, {
                permanent: false,
                direction: 'top',
                className: 'leaflet-tooltip-premium',
                offset: [0, -10]
            });

            marker.on('click', () => {
                mapInstance.current.flyTo([city.Latitude, city.Longitude], 12, {
                    animate: true,
                    duration: 1.5
                });
                onCitySelect(city);
            });

            clusterGroup.addLayer(marker);
        });

        mapInstance.current.addLayer(clusterGroup);
        markersClusterRef.current = clusterGroup;

        // Update visible cities on map move (debounced)
        let moveTimer: ReturnType<typeof setTimeout>;
        const handleMoveEnd = () => {
            clearTimeout(moveTimer);
            moveTimer = setTimeout(() => {
                if (!mapInstance.current) return;
                try {
                    const bounds = mapInstance.current.getBounds();
                    const visible = allCitiesRef.current.filter((city: any) =>
                        bounds.contains([city.Latitude, city.Longitude])
                    );
                    onVisibleCitiesChange(visible.slice(0, 15));
                } catch (e) { }
            }, 200);
        };

        mapInstance.current.off('moveend', handleMoveEnd);
        mapInstance.current.on('moveend', handleMoveEnd);
        setTimeout(handleMoveEnd, 300);

    }, [mapLoaded, dataLoaded, selectedRegion, language]);

    // Hover state: only update the 2 affected markers (previous + current)
    const prevHoveredRef = useRef<string | null>(null);
    useEffect(() => {
        if (!mapLoaded || !markersClusterRef.current || !window.L) return;
        const L = window.L;
        const prev = prevHoveredRef.current;
        prevHoveredRef.current = hoveredCityName;

        markersClusterRef.current.eachLayer((marker: any) => {
            const city = marker.cityData;
            if (!city) return;
            // Only update markers that changed state
            if (city.City !== prev && city.City !== hoveredCityName) return;
            const isActive = hoveredCityName === city.City;
            marker.setIcon(L.divIcon({
                className: 'clear-leaflet-bg',
                html: `<div class="pure-glow-dot ${isActive ? 'active-glow-dot' : ''}"></div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            }));
        });
    }, [hoveredCityName, mapLoaded]);

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
