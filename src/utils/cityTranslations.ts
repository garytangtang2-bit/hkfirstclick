export const cityTranslations: Record<string, Record<string, string>> = {
    "東京": {
        "English": "Tokyo",
        "日本語": "東京",
        "繁體中文": "東京",
        "한국어": "도쿄"
    },
    "曼谷": {
        "English": "Bangkok",
        "日本語": "バンコク",
        "繁體中文": "曼谷",
        "한국어": "방콕"
    },
    "巴黎": {
        "English": "Paris",
        "日本語": "パリ",
        "繁體中文": "巴黎",
        "한국어": "파리"
    },
    "倫敦": {
        "English": "London",
        "日本語": "ロンドン",
        "繁體中文": "倫敦",
        "한국어": "런던"
    },
    "紐約": {
        "English": "New York",
        "日本語": "ニューヨーク",
        "繁體中文": "紐約",
        "한국어": "뉴욕"
    },
    "台北": {
        "English": "Taipei",
        "日本語": "台北",
        "繁體中文": "台北",
        "한국어": "타이베이"
    },
    "首爾": {
        "English": "Seoul",
        "日本語": "ソウル",
        "繁體中文": "首爾",
        "한국어": "서울"
    }
};

export const getTranslatedCityName = (originalName: string, currentLang: string): string => {
    // If the city exists in our dictionary, return the translated version. 
    // Fall back to the original name if the translation or city doesn't exist.
    if (cityTranslations[originalName] && cityTranslations[originalName][currentLang]) {
        return cityTranslations[originalName][currentLang];
    }
    return originalName;
};
