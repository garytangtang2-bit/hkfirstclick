const fs = require('fs');
const papa = require('papaparse');
const translate = require('google-translate-api-x');

// Config
const CSV_FILE = 'public/global_cities_1000.csv';
const OUTPUT_FILE = 'src/utils/cityTranslations.ts';

// We map the "SupportedLang" keys to "google-translate-api" language codes
const LANG_MAP = {
    'EN': 'en',
    'JP': 'ja',
    'KR': 'ko',
    'FR': 'fr',
    'ES': 'es',
    'ID': 'id',
    'HI': 'hi',
    'PT': 'pt',
    'AR': 'ar',
    'RU': 'ru'
};

async function generateTranslations() {
    console.log('Loading CSV...');
    const csvData = fs.readFileSync(CSV_FILE, 'utf8');
    const parsed = papa.parse(csvData, { header: true, skipEmptyLines: true });

    const cities = parsed.data.filter(row => row.City && row.Vibe);
    console.log(`Found ${cities.length} cities to translate.`);

    let dictionarySrc = `export type SupportedLang = 'TW' | 'EN' | 'JP' | 'KR' | 'FR' | 'ES' | 'ID' | 'HI' | 'PT' | 'AR' | 'RU';

export const cityDataTranslations: Record<string, { name: Partial<Record<SupportedLang, string>>, description: Partial<Record<SupportedLang, string>> }> = {\n`;

    for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        const cityNameTW = city.City.trim();
        const cityVibeTW = city.Vibe.trim();

        console.log(`[${i + 1}/${cities.length}] Translating: ${cityNameTW}...`);

        let cityBlock = `  "${cityNameTW}": {\n    name: {\n      TW: "${cityNameTW.replace(/"/g, '\\"')}",`;
        let descBlock = `\n    description: {\n      TW: "${cityVibeTW.replace(/"/g, '\\"')}",`;

        for (const [appLang, gLang] of Object.entries(LANG_MAP)) {
            try {
                // We use forced delay to avoid rate limits
                await new Promise(r => setTimeout(r, 600));

                const resName = await translate(cityNameTW, { from: 'zh-CN', to: gLang });
                const resVibe = await translate(cityVibeTW, { from: 'zh-CN', to: gLang });

                cityBlock += ` ${appLang}: "${resName.text.replace(/"/g, '\\"')}",`;
                descBlock += ` ${appLang}: "${resVibe.text.replace(/"/g, '\\"')}",`;
            } catch (e) {
                console.error(`Failed to translate ${cityNameTW} to ${appLang}:`, e.message);
                // Fallback gracefully on failed individual translation
                cityBlock += ` ${appLang}: "${cityNameTW.replace(/"/g, '\\"')}",`;
                descBlock += ` ${appLang}: "${cityVibeTW.replace(/"/g, '\\"')}",`;
            }
        }

        cityBlock += `\n    },`;
        descBlock += `\n    }`;

        dictionarySrc += cityBlock + descBlock + `\n  }${i < cities.length - 1 ? ',' : ''}\n`;
    }

    dictionarySrc += `};\n
export const mapLangToSupported = (langName: string): SupportedLang => {
    switch (langName) {
        case "繁體中文": return "TW";
        case "English": return "EN";
        case "日本語": return "JP";
        case "한국어": return "KR";
        case "Français": return "FR";
        case "Español": return "ES";
        case "Bahasa Indonesia": return "ID";
        case "हिन्दी": return "HI";
        case "Português": return "PT";
        case "العربية": return "AR";
        case "Русский": return "RU";
        default: return "EN";
    }
}

export const getTranslatedData = (cityId: string, type: 'name' | 'description', currentLangName: string, fallbackText?: string): string => {
    if (!cityId) return fallbackText || cityId;
    const normalizedId = cityId.toLowerCase().replace(/\\s/g, ''); 
    const city = cityDataTranslations[normalizedId];

    if (!city || !city[type]) return fallbackText || cityId;

    const langKey = mapLangToSupported(currentLangName);

    return city[type][langKey] || city[type]['EN'] || city[type]['TW'] || fallbackText || cityId;
};

export const getTranslatedCityName = (cityId: string, currentLangName: string): string => {
    return getTranslatedData(cityId, 'name', currentLangName, cityId);
};\n`;

    fs.writeFileSync(OUTPUT_FILE, dictionarySrc, 'utf8');
    console.log('✅ Finished building comprehensive city dictionary.');
}

generateTranslations();
