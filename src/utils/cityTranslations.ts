export type SupportedLang = 'TW' | 'EN' | 'JP' | 'KR' | 'FR' | 'ES' | 'ID' | 'HI' | 'PT' | 'AR' | 'RU';

export const cityTranslations: Record<string, Record<SupportedLang, string>> = {
    "seoul": {
        TW: "首爾", EN: "Seoul", JP: "ソウル", KR: "서울",
        FR: "Séoul", ES: "Seúl", ID: "Seoul", HI: "सियोल",
        PT: "Seul", AR: "سيول", RU: "Сеул"
    },
    "tokyo": {
        TW: "東京", EN: "Tokyo", JP: "東京", KR: "도쿄",
        FR: "Tokyo", ES: "Tokio", ID: "Tokyo", HI: "टोक्यो",
        PT: "Tóquio", AR: "طوكيو", RU: "Токио"
    },
    "bangkok": {
        TW: "曼谷", EN: "Bangkok", JP: "バンコク", KR: "방콕",
        FR: "Bangkok", ES: "Bangkok", ID: "Bangkok", HI: "बैंकॉक",
        PT: "Bangkok", AR: "بانكوك", RU: "Бангкок"
    },
    "hongkong": {
        TW: "香港", EN: "Hong Kong", JP: "香港", KR: "홍콩",
        FR: "Hong Kong", ES: "Hong Kong", ID: "Hong Kong", HI: "हाँगकाँग",
        PT: "Hong Kong", AR: "هونغ كونغ", RU: "Гонконг"
    },
    "taipei": {
        TW: "台北", EN: "Taipei", JP: "台北", KR: "타이베이",
        FR: "Taipei", ES: "Taipéi", ID: "Taipei", HI: "ताइपे",
        PT: "Taipé", AR: "تايبيه", RU: "Тайбэй"
    },
    "singapore": {
        TW: "新加坡", EN: "Singapore", JP: "シンガポール", KR: "싱가포르",
        FR: "Singapour", ES: "Singapur", ID: "Singapura", HI: "सिंगापुर",
        PT: "Singapura", AR: "سنغافورة", RU: "Сингапур"
    },
    "sydney": {
        TW: "雪梨", EN: "Sydney", JP: "シドニー", KR: "시드니",
        FR: "Sydney", ES: "Sídney", ID: "Sydney", HI: "सिडनी",
        PT: "Sydney", AR: "سيدني", RU: "Сидней"
    },
    "paris": {
        TW: "巴黎", EN: "Paris", JP: "パリ", KR: "파리",
        FR: "Paris", ES: "París", ID: "Paris", HI: "पेरिस",
        PT: "Paris", AR: "باريس", RU: "Париж"
    },
    "london": {
        TW: "倫敦", EN: "London", JP: "ロンドン", KR: "런던",
        FR: "Londres", ES: "Londres", ID: "London", HI: "लंदन",
        PT: "Londres", AR: "لندن", RU: "Лондон"
    }
};

const mapLangToSupported = (langName: string): SupportedLang => {
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

export const getTranslatedCityName = (cityId: string, currentLangName: string): string => {
    if (!cityId) return cityId;
    const normalizedId = cityId.toLowerCase().replace(/\s/g, ''); // Ensure 'Hong Kong' maps to 'hongkong' if ID is just string name in CSV
    const city = cityTranslations[normalizedId];

    if (!city) return cityId;

    const langKey = mapLangToSupported(currentLangName);

    return city[langKey] || city['EN'];
};
