export type SupportedLang = 'TW' | 'EN' | 'JP' | 'KR' | 'FR' | 'ES' | 'ID' | 'HI' | 'PT' | 'AR' | 'RU';

export const cityDataTranslations: Record<string, { name: Partial<Record<SupportedLang, string>>, description: Partial<Record<SupportedLang, string>> }> = {
    "首爾": {
        name: {
            TW: "首爾", EN: "Seoul", JP: "ソウル", KR: "서울",
            FR: "Séoul", ES: "Seúl", ID: "Seoul", HI: "सियोल",
            PT: "Seul", AR: "سيول", RU: "Сеул"
        },
        description: {
            TW: "K-pop聖地，融合傳統與現代的動態都市",
            EN: "K-pop mecca, a dynamic city blending tradition and modernity",
            FR: "Mecque de la K-pop, ville dynamique mêlant tradition et modernité"
        }
    },
    "東京": {
        name: {
            TW: "東京", EN: "Tokyo", JP: "東京", KR: "도쿄",
            FR: "Tokyo", ES: "Tokio", ID: "Tokyo", HI: "टोक्यो",
            PT: "Tóquio", AR: "طوكيو", RU: "Токио"
        },
        description: {
            TW: "極致秩序，動漫天堂與潮流聖地",
            EN: "Ultimate order, anime paradise and trend mecca",
            FR: "Ordre ultime, paradis des anime et de la tendance",
            JP: "究極の秩序、アニメの楽園とトレンドの聖地"
        }
    },
    "曼谷": {
        name: {
            TW: "曼谷", EN: "Bangkok", JP: "バンコク", KR: "방콕",
            FR: "Bangkok", ES: "Bangkok", ID: "Bangkok", HI: "बैंकॉक",
            PT: "Bangkok", AR: "بانكوك", RU: "Бангкок"
        },
        description: {
            TW: "街頭活力，高CP值按摩與佛教文化",
            EN: "Street vitality, high CP value massage & Buddhist culture",
            FR: "Vitalité de la rue, massage et culture bouddhiste",
            JP: "ストリートの活気、高コスパマッサージと仏教文化"
        }
    },
    "香港": {
        name: {
            TW: "香港", EN: "Hong Kong", JP: "香港", KR: "홍콩",
            FR: "Hong Kong", ES: "Hong Kong", ID: "Hong Kong", HI: "हाँगकाँग",
            PT: "Hong Kong", AR: "هونغ كونغ", RU: "Гонконг"
        },
        description: {
            TW: "中西合璧，璀璨夜景與金融中心",
            EN: "East meets West, stunning skyline & financial hub",
            FR: "L'Orient rencontre l'Occident, horizon magnifique et centre financier",
            JP: "東洋と西洋の融合、見事なスカイラインと金融センター"
        }
    },
    "台北": {
        name: {
            TW: "台北", EN: "Taipei", JP: "台北", KR: "타이베이",
            FR: "Taipei", ES: "Taipéi", ID: "Taipei", HI: "ताइपे",
            PT: "Taipé", AR: "تايبيه", RU: "Тайбэй"
        },
        description: {
            TW: "夜市美食，人文氣息與便利生活",
            EN: "Night market food, culture and convenient living",
            FR: "Cuisine de marché nocturne, culture et vie pratique"
        }
    },
    "新加坡": {
        name: {
            TW: "新加坡", EN: "Singapore", JP: "シンガポール", KR: "싱가포르",
            FR: "Singapour", ES: "Singapur", ID: "Singapura", HI: "सिंगापुर",
            PT: "Singapura", AR: "سنغافورة", RU: "Сингапур"
        },
        description: {
            TW: "花園城市，多元種族與極致綠化",
            EN: "Garden city, multiracial and extreme greening",
            FR: "Cité-jardin, multiraciale et verdissement extrême"
        }
    },
    "雪梨": {
        name: {
            TW: "雪梨", EN: "Sydney", JP: "シドニー", KR: "시드니",
            FR: "Sydney", ES: "Sídney", ID: "Sydney", HI: "सिडनी",
            PT: "Sydney", AR: "سيدني", RU: "Сидней"
        },
        description: {
            TW: "歌劇院與陽光沙灘的完美結合",
            EN: "Perfect blend of Opera House and sunny beaches",
            FR: "Mélange parfait de l'Opéra et de plages ensoleillées"
        }
    },
    "巴黎": {
        name: {
            TW: "巴黎", EN: "Paris", JP: "パリ", KR: "파리",
            FR: "Paris", ES: "París", ID: "Paris", HI: "पेरिस",
            PT: "Paris", AR: "باريس", RU: "Париж"
        },
        description: {
            TW: "浪漫之都，藝術畫廊與咖啡文化",
            EN: "City of Romance, art galleries & cafe culture",
            FR: "Ville de la Romance, galeries d'art et culture des cafés"
        }
    },
    "倫敦": {
        name: {
            TW: "倫敦", EN: "London", JP: "ロンドン", KR: "런던",
            FR: "Londres", ES: "Londres", ID: "London", HI: "लंदन",
            PT: "Londres", AR: "لندن", RU: "Лондон"
        },
        description: {
            TW: "皇室優雅，歷史博物館與大笨鐘",
            EN: "Royal elegance, history museums & Big Ben",
            FR: "Élégance royale, musées d'histoire et Big Ben",
            RU: "Королевская элегантность, исторические музеи и Биг-Бен"
        }
    },
    "開普敦": {
        name: {
            TW: "開普敦", EN: "Cape Town", JP: "ケープタウン", KR: "케이프타운",
            FR: "Le Cap", ES: "Ciudad del Cabo", RU: "Кейптаун"
        },
        description: {
            TW: "壯麗的桌山與企鵝，自然人文交織",
            EN: "Magnificent Table Mountain & penguins, nature meets culture",
            FR: "Magnifique montagne de la Table et pingouins, la nature rencontre la culture",
            RU: "Великолепная Столовая гора и пингвины"
        }
    }
};

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
    const normalizedId = cityId.toLowerCase().replace(/\s/g, '');
    const city = cityDataTranslations[normalizedId];

    if (!city || !city[type]) return fallbackText || cityId;

    const langKey = mapLangToSupported(currentLangName);

    return city[type][langKey] || city[type]['EN'] || city[type]['TW'] || fallbackText || cityId;
};

// Aliased for backward compatibility in MapComponent
export const getTranslatedCityName = (cityId: string, currentLangName: string): string => {
    return getTranslatedData(cityId, 'name', currentLangName, cityId);
};
