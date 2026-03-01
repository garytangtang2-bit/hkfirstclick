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

    const POPULAR_AIRPORTS = [
        { code: "NRT", city: "Tokyo", name: "Narita International Airport", country: "Japan" },
        { code: "HND", city: "Tokyo", name: "Haneda Airport", country: "Japan" },
        { code: "TPE", city: "Taipei", name: "Taoyuan International Airport", country: "Taiwan" },
        { code: "KIX", city: "Osaka", name: "Kansai International Airport", country: "Japan" },
        { code: "ICN", city: "Seoul", name: "Incheon International Airport", country: "South Korea" },
        { code: "BKK", city: "Bangkok", name: "Suvarnabhumi Airport", country: "Thailand" },
        { code: "HKG", city: "Hong Kong", name: "Hong Kong International Airport", country: "Hong Kong" },
    ];

    // Fetch the 7900+ global airports on mount
    useEffect(() => {
        fetch('/airports.json')
            .then(res => res.json())
            .then((data: AirportData[]) => {
                if (Array.isArray(data) && data.length > 0) {
                    setAirports(data);
                } else {
                    setAirports(POPULAR_AIRPORTS);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load airports data. Falling back to popular airports.", err);
                setAirports(POPULAR_AIRPORTS);
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

    // Multi-Language Alias Map for Asian/Popular Airports
    const ALIAS_MAP: Record<string, string[]> = {
        "nrt": ["東京", "成田", "tokyo", "narita", "dongjing", "日本", "japan", "riben"],
        "hnd": ["東京", "羽田", "tokyo", "haneda", "dongjing", "日本", "japan", "riben"],
        "kix": ["大阪", "關西", "osaka", "kansai", "daban", "日本", "japan", "riben"],
        "tpe": ["台北", "桃園", "taipei", "taoyuan", "taibei", "台灣", "taiwan"],
        "tsa": ["台北", "松山", "taipei", "songshan", "taibei", "台灣", "taiwan"],
        "khh": ["高雄", "小港", "kaohsiung", "gaoxiong", "台灣", "taiwan"],
        "rmq": ["台中", "清泉崗", "taichung", "taizhong", "台灣", "taiwan"],
        "hkg": ["香港", "赤鱲角", "hong kong", "xianggang"],
        "mfm": ["澳門", "macau", "aomen"],
        "icn": ["首爾", "仁川", "seoul", "incheon", "shouer", "韓國", "korea", "hanguo"],
        "gmp": ["首爾", "金浦", "seoul", "gimpo", "shouer", "韓國", "korea", "hanguo"],
        "pus": ["釜山", "金海", "busan", "gimhae", "fushan", "韓國", "korea", "hanguo"],
        "cju": ["濟州", "jeju", "jizhou", "韓國", "korea", "hanguo"],
        "bkk": ["曼谷", "蘇凡納布", "bangkok", "suvarnabhumi", "mangu", "泰國", "thailand", "taiguo"],
        "dmk": ["曼谷", "廊曼", "bangkok", "don mueang", "mangu", "泰國", "thailand", "taiguo"],
        "cnx": ["清邁", "chiang mai", "qingmai", "泰國", "thailand", "taiguo"],
        "sin": ["新加坡", "樟宜", "singapore", "changi", "xinjiapo"],
        "kul": ["吉隆坡", "kuala lumpur", "jilongpo", "馬來西亞", "malaysia"],
        "sgn": ["胡志明市", "新山一", "ho chi minh", "huzhiming", "越南", "vietnam"],
        "han": ["河內", "內排", "hanoi", "henei", "越南", "vietnam"],
        "dad": ["峴港", "da nang", "xiangang", "越南", "vietnam"],
        "dps": ["峇里島", "登巴薩", "bali", "denpasar", "balidao", "印尼", "indonesia"],
        "mnl": ["馬尼拉", "尼諾伊", "manila", "manila", "菲律賓", "philippines"],
        "ceb": ["宿霧", "cebu", "suwu", "菲律賓", "philippines"],
        "syd": ["雪梨", "悉尼", "sydney", "xueli", "xini", "澳洲", "australia"],
        "mel": ["墨爾本", "melbourne", "moerben", "澳洲", "australia"],
        "bne": ["布里斯本", "brisbane", "bulisiben", "澳洲", "australia"],
        "per": ["伯斯", "珀斯", "perth", "bosi"],
        "akl": ["奧克蘭", "auckland", "aokelan", "紐西蘭", "new zealand"],
        "lhr": ["倫敦", "希斯洛", "london", "heathrow", "lundun", "英國", "uk", "united kingdom"],
        "cdg": ["巴黎", "戴高樂", "paris", "bali", "法國", "france"],
        "fra": ["法蘭克福", "frankfurt", "falankefu", "德國", "germany"],
        "muc": ["慕尼黑", "munich", "munihei", "德國", "germany"],
        "ams": ["阿姆斯特丹", "史基浦", "amsterdam", "amusitedan", "荷蘭", "netherlands"],
        "mad": ["馬德里", "madrid", "madeli", "西班牙", "spain"],
        "bcn": ["巴塞隆納", "barcelona", "basailongna", "西班牙", "spain"],
        "fco": ["羅馬", "達文西", "rome", "luoma", "義大利", "italy"],
        "mxp": ["米蘭", "馬爾彭薩", "milan", "milan", "義大利", "italy"],
        "vie": ["維也納", "vienna", "weiyena", "奧地利", "austria"],
        "zrh": ["蘇黎世", "zurich", "sulishi", "瑞士", "switzerland"],
        "prg": ["布拉格", "prague", "bulage", "捷克", "czech"],
        "bud": ["布達佩斯", "budapest", "budapeisi", "匈牙利", "hungary"],
        "ath": ["雅典", "athens", "yadian", "希臘", "greece"],
        "jfk": ["紐約", "甘迺迪", "new york", "niuyue", "美國", "usa", "us", "america"],
        "ewr": ["紐約", "紐華克", "new york", "niuyue", "美國", "usa", "us", "america"],
        "lax": ["洛杉磯", "los angeles", "luoshanji", "美國", "usa", "us", "america"],
        "sfo": ["舊金山", "三藩市", "san francisco", "jiujinshan", "美國", "usa", "us", "america"],
        "sea": ["西雅圖", "seattle", "xiyatu", "美國", "usa", "us", "america"],
        "ord": ["芝加哥", "歐海爾", "chicago", "zhijiage", "美國", "usa", "us", "america"],
        "yvr": ["溫哥華", "vancouver", "wengehua", "加拿大", "canada"],
        "yyz": ["多倫多", "toronto", "duolunduo", "加拿大", "canada"],
        "dxb": ["杜拜", "迪拜", "dubai", "dubai", "阿聯酋", "uae"],
        "ist": ["伊斯坦堡", "istanbul", "yisitanbao", "土耳其", "turkey"]
    };

    // Filter based on Code, City, Name or ALIAS_MAP
    const filteredOptions = airports.filter((airport) => {
        if (!query || !query.trim()) return false;
        const searchStr = query.toLowerCase().trim();

        // Check for aliases
        const aliases = ALIAS_MAP[airport.code.toLowerCase()] || [];
        const hasAliasMatch = aliases.some(alias => alias.toLowerCase().includes(searchStr));

        return (
            airport.code.toLowerCase().includes(searchStr) ||
            airport.city.toLowerCase().includes(searchStr) ||
            airport.name.toLowerCase().includes(searchStr) ||
            (airport.country && airport.country.toLowerCase().includes(searchStr)) ||
            hasAliasMatch
        );
    }).sort((a, b) => {
        // Boost exact IATA code matches to the top
        const searchStr = query.toLowerCase().trim();
        const aExact = a.code.toLowerCase() === searchStr;
        const bExact = b.code.toLowerCase() === searchStr;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return 0;
    }).slice(0, 15); // limit to top 15 results for performance

    const displayOptions = query.trim().length === 0 ? POPULAR_AIRPORTS : filteredOptions;

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

            {isOpen && !isLoading && (
                <div className="absolute z-50 w-full mt-2 bg-[#161616] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                    {query.trim().length === 0 && (
                        <div className="px-4 py-2 bg-white/5 text-xs font-bold text-gray-400 tracking-widest uppercase sticky top-0 backdrop-blur-md z-10 border-b border-white/5">
                            熱門機場 (Popular Airports)
                        </div>
                    )}
                    {displayOptions.length > 0 ? (
                        displayOptions.map((airport: AirportData) => (
                            <button
                                type="button"
                                key={airport.code}
                                onClick={() => handleSelect(airport as AirportData)}
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
