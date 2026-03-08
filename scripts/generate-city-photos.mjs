#!/usr/bin/env node
/**
 * Pre-fetch city photos from Wikipedia (with smart fallback search terms)
 * and generate a static cityPhotos.ts mapping file.
 *
 * Fallback chain: Wikipedia → Unsplash Source (no key needed)
 * Run: node scripts/generate-city-photos.mjs
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// All 54 cities from global_cities_1000.csv with English names and smart search terms
const CITIES = [
    { id: "香港", primary: "Victoria Harbour Hong Kong", fallback: ["Hong Kong skyline night", "Hong Kong"], unsplash: "hong kong" },
    { id: "曼谷", primary: "Bangkok", fallback: ["Grand Palace Bangkok", "Bangkok skyline"], unsplash: "bangkok thailand" },
    { id: "東京", primary: "Shinjuku Tokyo", fallback: ["Tokyo skyline", "Tokyo"], unsplash: "tokyo japan" },
    { id: "巴黎", primary: "Eiffel Tower", fallback: ["Paris skyline", "Paris"], unsplash: "paris eiffel tower" },
    { id: "倫敦", primary: "Tower Bridge London", fallback: ["London skyline", "London"], unsplash: "london bridge" },
    { id: "新加坡", primary: "Gardens by the Bay", fallback: ["Marina Bay Sands Singapore", "Singapore skyline"], unsplash: "singapore marina bay" },
    { id: "紐約", primary: "Manhattan skyline", fallback: ["New York City skyline", "Times Square"], unsplash: "new york city" },
    { id: "杜拜", primary: "Burj Khalifa", fallback: ["Dubai skyline", "Dubai"], unsplash: "dubai skyline" },
    { id: "羅馬", primary: "Trevi Fountain", fallback: ["Colosseum Rome", "Rome"], unsplash: "rome italy colosseum" },
    { id: "巴塞隆拿", primary: "Sagrada Família", fallback: ["Barcelona aerial", "Barcelona"], unsplash: "barcelona spain" },
    { id: "首爾", primary: "Seoul skyline", fallback: ["Gyeongbokgung Palace", "Seoul"], unsplash: "seoul korea" },
    { id: "台北", primary: "Taipei 101", fallback: ["Taipei skyline", "Taipei"], unsplash: "taipei taiwan" },
    { id: "大阪", primary: "Dotonbori", fallback: ["Osaka Castle", "Osaka skyline"], unsplash: "osaka japan" },
    { id: "京都", primary: "Fushimi Inari-taisha", fallback: ["Kinkaku-ji", "Kyoto"], unsplash: "kyoto japan temple" },
    { id: "雪梨", primary: "Sydney Opera House", fallback: ["Sydney Harbour Bridge", "Sydney"], unsplash: "sydney opera house" },
    { id: "阿姆斯特丹", primary: "Amsterdam canals", fallback: ["Herengracht Amsterdam", "Amsterdam"], unsplash: "amsterdam canals" },
    { id: "威尼斯", primary: "Grand Canal Venice", fallback: ["Piazza San Marco", "Venice"], unsplash: "venice italy" },
    { id: "布拉格", primary: "Prague", fallback: ["Charles Bridge Prague", "Prague Castle"], unsplash: "prague czech" },
    { id: "吉隆坡", primary: "Petronas Twin Towers", fallback: ["Kuala Lumpur skyline", "Kuala Lumpur"], unsplash: "kuala lumpur petronas" },
    { id: "維也納", primary: "Schönbrunn Palace", fallback: ["Vienna", "Vienna skyline"], unsplash: "vienna austria" },
    { id: "柏林", primary: "Brandenburg Gate", fallback: ["Berlin skyline", "Berlin Wall"], unsplash: "berlin germany" },
    { id: "馬德里", primary: "Puerta del Sol", fallback: ["Prado Museum", "Madrid"], unsplash: "madrid spain" },
    { id: "里斯本", primary: "Lisbon", fallback: ["Torre de Belém", "Lisbon tram"], unsplash: "lisbon portugal" },
    { id: "雅典", primary: "Acropolis of Athens", fallback: ["Parthenon", "Athens"], unsplash: "athens acropolis" },
    { id: "胡志明市", primary: "Ho Chi Minh City", fallback: ["Saigon skyline", "Ben Thanh Market"], unsplash: "ho chi minh city vietnam" },
    { id: "斯德哥爾摩", primary: "Gamla stan Stockholm", fallback: ["Stockholm", "Stockholm waterfront"], unsplash: "stockholm sweden" },
    { id: "哥本哈根", primary: "Nyhavn", fallback: ["Copenhagen", "Copenhagen harbour"], unsplash: "copenhagen nyhavn" },
    { id: "慕尼黑", primary: "Marienplatz", fallback: ["Munich", "Oktoberfest"], unsplash: "munich germany" },
    { id: "布魯塞爾", primary: "Grand Place Brussels", fallback: ["Brussels", "Atomium"], unsplash: "brussels belgium" },
    { id: "蘇黎世", primary: "Lake Zurich", fallback: ["Zurich", "Zurich old town"], unsplash: "zurich switzerland" },
    { id: "多倫多", primary: "CN Tower", fallback: ["Toronto skyline", "Toronto"], unsplash: "toronto canada cn tower" },
    { id: "洛杉磯", primary: "Hollywood Sign", fallback: ["Los Angeles skyline", "Santa Monica"], unsplash: "los angeles hollywood" },
    { id: "三藩市", primary: "Golden Gate Bridge", fallback: ["San Francisco skyline", "San Francisco"], unsplash: "san francisco golden gate" },
    { id: "里約熱內盧", primary: "Christ the Redeemer", fallback: ["Rio de Janeiro", "Copacabana Beach Rio"], unsplash: "rio de janeiro brazil" },
    { id: "布宜諾斯艾利斯", primary: "Obelisco Buenos Aires", fallback: ["Buenos Aires skyline", "La Boca Buenos Aires"], unsplash: "buenos aires argentina" },
    { id: "墨爾本", primary: "Melbourne skyline", fallback: ["Federation Square Melbourne", "Flinders Street Station"], unsplash: "melbourne australia" },
    { id: "奧克蘭", primary: "Sky Tower Auckland", fallback: ["Auckland skyline", "Waitemata Harbour"], unsplash: "auckland new zealand" },
    { id: "開普敦", primary: "Table Mountain", fallback: ["Cape Town", "Cape of Good Hope"], unsplash: "cape town table mountain" },
    { id: "馬拉喀什", primary: "Jardin Majorelle", fallback: ["Marrakesh medina", "Djemaa el-Fna"], unsplash: "marrakech morocco" },
    { id: "開羅", primary: "Giza pyramid complex", fallback: ["Sphinx Giza", "Cairo pyramids"], unsplash: "cairo pyramids egypt" },
    { id: "札幌", primary: "Sapporo", fallback: ["Odori Park Sapporo", "Sapporo Snow Festival"], unsplash: "sapporo japan" },
    { id: "福岡", primary: "Fukuoka", fallback: ["Hakata Fukuoka", "Dazaifu Tenmangu"], unsplash: "fukuoka japan" },
    { id: "箱根", primary: "Lake Ashi Hakone", fallback: ["Mount Fuji Hakone", "Hakone"], unsplash: "hakone mount fuji" },
    { id: "沖繩", primary: "Shuri Castle", fallback: ["Okinawa beach", "Churaumi Aquarium Okinawa"], unsplash: "okinawa japan" },
    { id: "拉斯維加斯", primary: "Las Vegas Strip", fallback: ["Las Vegas night", "Las Vegas skyline"], unsplash: "las vegas strip night" },
    { id: "芝加哥", primary: "Chicago skyline", fallback: ["Cloud Gate Chicago", "Chicago"], unsplash: "chicago skyline" },
    { id: "邁阿密", primary: "South Beach Miami", fallback: ["Miami skyline", "Miami Beach"], unsplash: "miami beach" },
    { id: "西雅圖", primary: "Space Needle", fallback: ["Seattle skyline", "Pike Place Market"], unsplash: "seattle space needle" },
    { id: "愛丁堡", primary: "Edinburgh Castle", fallback: ["Edinburgh skyline", "Royal Mile Edinburgh"], unsplash: "edinburgh castle scotland" },
    { id: "佛羅倫斯", primary: "Florence cathedral", fallback: ["Ponte Vecchio", "Florence Italy"], unsplash: "florence italy duomo" },
    { id: "尼斯", primary: "Promenade des Anglais", fallback: ["Nice France", "Côte d'Azur"], unsplash: "nice france riviera" },
    { id: "聖托里尼", primary: "Santorini", fallback: ["Oia Santorini", "Santorini caldera"], unsplash: "santorini greece" },
    { id: "雷克雅維克", primary: "Hallgrímskirkja", fallback: ["Reykjavik", "Northern Lights Iceland"], unsplash: "reykjavik iceland" },
    { id: "峇里島(庫塔)", primary: "Tanah Lot", fallback: ["Uluwatu Temple Bali", "Bali Indonesia"], unsplash: "bali indonesia temple" },
];

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWikipediaPhoto(searchTerm) {
    try {
        const res = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`,
            { headers: { "User-Agent": "HKFirstClick/1.0 (city-photo-generator)" } }
        );
        if (!res.ok) return null;

        const data = await res.json();
        const url = data?.originalimage?.source || data?.thumbnail?.source || null;

        if (!url) return null;

        // Skip SVG files (flags, coat of arms, etc.)
        if (url.toLowerCase().endsWith(".svg")) return null;
        // Skip files with bad keywords in name
        const filename = url.toLowerCase();
        if (
            filename.includes("flag") ||
            filename.includes("coat_of_arms") ||
            filename.includes("emblem") ||
            filename.includes("logo") ||
            filename.includes("map") ||
            filename.includes("1845") || // old drawings
            filename.includes("drawing") ||
            filename.includes("collinson") // the old HK drawing
        ) return null;

        return url;
    } catch {
        return null;
    }
}

async function fetchUnsplashPhoto(query) {
    try {
        // Unsplash Source API - no API key needed, returns redirect to a photo
        const url = `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`;
        const res = await fetch(url, { method: "HEAD", redirect: "follow" });
        if (res.ok && res.url && !res.url.includes("source.unsplash.com")) {
            return res.url;
        }
        return null;
    } catch {
        return null;
    }
}

async function getPhotoForCity(city) {
    // Try primary Wikipedia search term first
    let url = await fetchWikipediaPhoto(city.primary);
    if (url) {
        console.log(`  ✓ ${city.id} → Wikipedia primary (${city.primary}): ${url.substring(0, 70)}...`);
        return url;
    }

    // Try fallback Wikipedia terms
    for (const term of city.fallback) {
        await delay(300);
        url = await fetchWikipediaPhoto(term);
        if (url) {
            console.log(`  ✓ ${city.id} → Wikipedia fallback (${term}): ${url.substring(0, 70)}...`);
            return url;
        }
    }

    // Final fallback: Unsplash Source
    url = await fetchUnsplashPhoto(city.unsplash);
    if (url) {
        console.log(`  ✓ ${city.id} → Unsplash (${city.unsplash}): ${url.substring(0, 70)}...`);
        return url;
    }

    console.log(`  ✗ ${city.id} → NO PHOTO FOUND`);
    return null;
}

async function main() {
    console.log("🌍 Fetching city photos from Wikipedia + Unsplash...\n");

    const results = {};

    for (const city of CITIES) {
        console.log(`📍 ${city.id}`);
        const url = await getPhotoForCity(city);
        if (url) results[city.id] = url;
        await delay(500); // Be polite to APIs
    }

    // Generate TypeScript output
    const lines = [
        "// AUTO-GENERATED: run `node scripts/generate-city-photos.mjs` to refresh",
        `// Generated at: ${new Date().toISOString()}`,
        "",
        "export const cityPhotos: Record<string, string> = {",
    ];

    for (const [cityId, url] of Object.entries(results)) {
        lines.push(`    "${cityId}": "${url}",`);
    }

    lines.push("};");
    lines.push("");

    const outputPath = resolve(__dirname, "../src/data/cityPhotos.ts");
    writeFileSync(outputPath, lines.join("\n"), "utf-8");

    console.log(`\n✅ Generated ${Object.keys(results).length}/${CITIES.length} city photos`);
    console.log(`📄 Written to: ${outputPath}`);

    const missing = CITIES.filter(c => !results[c.id]).map(c => c.id);
    if (missing.length) {
        console.log(`⚠️  Missing photos for: ${missing.join(", ")}`);
    }
}

main().catch(console.error);
