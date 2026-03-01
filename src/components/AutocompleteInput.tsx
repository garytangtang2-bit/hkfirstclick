"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";

interface AirportData {
    code: string;
    city: string;
    name: string;
    country: string;
}

interface AutocompleteInputProps {
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    icon?: React.ReactNode;
}

export default function AutocompleteInput({ value, onChange, placeholder, icon }: AutocompleteInputProps) {
    const [query, setQuery] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const [airports, setAirports] = useState<AirportData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fetch the 7900+ global airports on mount
    useEffect(() => {
        fetch('/airports.json')
            .then(res => res.json())
            .then((data: AirportData[]) => {
                setAirports(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load airports data. Falling back to empty array.", err);
                setIsLoading(false);
            });
    }, []);

    // Sync external value changes
    useEffect(() => {
        setQuery(value);
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter based on Code, City, or Name
    const filteredOptions = airports.filter((airport) => {
        const searchStr = query.toLowerCase();
        return (
            airport.code.toLowerCase().includes(searchStr) ||
            airport.city.toLowerCase().includes(searchStr) ||
            airport.name.toLowerCase().includes(searchStr)
        );
    }).slice(0, 15); // limit to top 15 results for performance

    const handleSelect = (airport: AirportData) => {
        const formattedValue = `${airport.city} (${airport.code})`;
        setQuery(formattedValue);
        onChange(formattedValue);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full group">
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-white transition-colors z-10">
                        {icon}
                    </div>
                )}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        onChange(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className={`w-full bg-[#0E0E0E] min-h-[50px] border border-white/10 rounded-xl py-3 text-white focus:outline-none focus:border-[#EEDC00] focus:ring-2 focus:ring-[#EEDC00]/20 hover:border-white/30 hover:bg-[#111] transition-all relative z-0 ${icon ? 'pl-11 pr-4' : 'px-4'}`}
                />
                {isLoading && isOpen && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#EEDC00] border-t-transparent"></div>
                    </div>
                )}
            </div>

            {isOpen && query.length > 0 && !isLoading && (
                <div className="absolute z-50 w-full mt-2 bg-[#161616] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((airport) => (
                            <button
                                type="button"
                                key={airport.code}
                                onClick={() => handleSelect(airport)}
                                className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-3 transition-colors border-b border-white/5 last:border-0"
                            >
                                <div className="bg-white/10 p-2 rounded-lg shrink-0">
                                    <MapPin size={16} className="text-[#EEDC00]" />
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">
                                        {airport.city} <span className="text-gray-400 font-normal">({airport.code})</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">{airport.name}</div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-4 text-sm text-gray-500 text-center flex flex-col items-center gap-2">
                            <Search size={16} className="text-gray-600" />
                            Press enter to use "{query}" as a custom location
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
