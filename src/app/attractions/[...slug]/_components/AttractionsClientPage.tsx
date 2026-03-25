"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { useAppContext } from "@/components/AppContext";
import { LANG_NAME_TO_CODE } from "@/utils/langMapping";
import { Star, Ticket, Clock, ExternalLink, Landmark, ChevronRight, MapPin, Utensils, Sparkles, Search, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface AttractionItem {
  id: string;
  name: string;
  type: string;
  description: string;
  image_keyword: string;
  star_rating: number;
  needs_ticket: boolean;
  ticket_price_hint: string;
  best_time: string;
  klook_query: string;
  photo_url?: string;
}

interface AttractionsData {
  city_slug: string;
  translations: Record<string, {
    seo_title: string;
    seo_description: string;
    page_intro: string;
    items: AttractionItem[];
  }>;
}

interface Props {
  citySlug: string;
  attractionsData: AttractionsData;
  initialLang: string;
  langCode: string;
}

const DEFAULT_ATTR_IMG = "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=400&fit=crop";

const BOOK_KLOOK_LABEL: Record<string, string> = {
  en: "Book on Klook", zh: "在 Klook 預訂", ja: "Klookで予約", ko: "Klook에서 예약", fr: "Réserver sur Klook", es: "Reservar en Klook", id: "Pesan di Klook", hi: "Klook पर बुक करें", pt: "Reservar no Klook", ar: "احجز على Klook", bn: "Klook-এ বুক করুন", ru: "Забронировать на Klook",
};

const TOP_ATTRACTIONS_LABEL: Record<string, string> = {
  en: "Top Attractions", zh: "熱門景點", ja: "人気観光スポット", ko: "인기 명소", fr: "Principaux sites", es: "Principales atracciones", id: "Atraksi utama", hi: "शीर्ष आकर्षण", pt: "Principais atrações", ar: "أبرز المعالم", bn: "শীর্ষ আকর্ষণ", ru: "Главные достопримечательности",
};

const BACK_TO_MAP_LABEL: Record<string, string> = {
  en: "Back to Map", zh: "返回地圖", ja: "地図に戻る", ko: "지도로 돌아가기", fr: "Retour à la carte", es: "Volver al mapa", id: "Kembali ke peta", hi: "मानचित्र पर वापस", pt: "Voltar ao mapa", ar: "العودة إلى الخريطة", bn: "মানচিত্রে ফিরুন", ru: "Вернуться к карте",
};

const SEE_FOOD_LABEL: Record<string, string> = {
  en: "See Must-Try Food", zh: "查看必嚐美食", ja: "必食グルメを見る", ko: "필수 음식 보기", fr: "Voir la nourriture incontournable", es: "Ver comida imprescindible", id: "Lihat makanan wajib coba", hi: "जरूर चखें खाना देखें", pt: "Ver comida imperdível", ar: "عرض الطعام المميز", bn: "অবশ্যই খাবার দেখুন", ru: "Посмотреть еду",
};

const RELATED_CITIES_LABEL: Record<string, string> = {
  en: "More City Attraction Guides", zh: "更多城市景點指南", ja: "他の都市の観光ガイド", ko: "더 많은 도시 관광 가이드", fr: "Guides touristiques d'autres villes", es: "Más guías de atracciones por ciudad", id: "Panduan wisata kota lainnya", hi: "अन्य शहरों के आकर्षण गाइड", pt: "Mais guias de atrações por cidade", ar: "أدلة معالم مدن أخرى", bn: "আরও শহরের আকর্ষণ গাইড", ru: "Гиды по достопримечательностям других городов",
};

const HOME_LABEL: Record<string, string> = {
  en: "Home", zh: "首頁", ja: "ホーム", ko: "홈", fr: "Accueil", es: "Inicio", id: "Beranda", hi: "होम", pt: "Início", ar: "الرئيسية", bn: "হোম", ru: "Главная",
};

const SEARCH_CITY_LABEL: Record<string, string> = {
  en: "Search city...", zh: "搜尋城市...", ja: "都市を検索...", ko: "도시 검색...", fr: "Rechercher une ville...", es: "Buscar ciudad...", id: "Cari kota...", hi: "शहर खोजें...", pt: "Pesquisar cidade...", ar: "ابحث عن مدينة...", bn: "শহর খুঁজুন...", ru: "Поиск города...",
};

const SHARE_LABEL: Record<string, string> = {
  en: "Share", zh: "分享", ja: "シェア", ko: "공유", fr: "Partager", es: "Compartir", id: "Bagikan", hi: "शेयर करें", pt: "Compartilhar", ar: "مشاركة", bn: "শেয়ার করুন", ru: "Поделиться",
};

const UPDATED_LABEL: Record<string, string> = {
  en: "Updated 2026", zh: "2026 更新", ja: "2026年更新", ko: "2026 업데이트", fr: "Mis à jour 2026", es: "Actualizado 2026", id: "Diperbarui 2026", hi: "2026 अपडेट", pt: "Atualizado 2026", ar: "محدث 2026", bn: "2026 আপডেট", ru: "Обновлено 2026",
};

const BOOK_ALL_KLOOK_LABEL: Record<string, string> = {
  en: "Explore on Klook", zh: "在 Klook 探索", ja: "Klookで探す", ko: "Klook에서 탐색", fr: "Explorer sur Klook", es: "Explorar en Klook", id: "Jelajahi di Klook", hi: "Klook पर एक्सप्लोर करें", pt: "Explorar no Klook", ar: "استكشف على Klook", bn: "Klook-এ এক্সপ্লোর করুন", ru: "Исследовать на Klook",
};

const TYPE_LABELS: Record<string, Record<string, string>> = {
  landmark: { en: "Landmark", zh: "地標", ja: "ランドマーク", ko: "랜드마크", fr: "Monument", es: "Monumento", id: "Landmark", hi: "स्थलचिह्न", pt: "Ponto Turístico", ar: "معلم", bn: "ল্যান্ডমার্ক", ru: "Достопримечательность" },
  museum: { en: "Museum", zh: "博物館", ja: "博物館", ko: "박물관", fr: "Musée", es: "Museo", id: "Museum", hi: "संग्रहालय", pt: "Museu", ar: "متحف", bn: "জাদুঘর", ru: "Музей" },
  park: { en: "Park", zh: "公園", ja: "公園", ko: "공원", fr: "Parc", es: "Parque", id: "Taman", hi: "पार्क", pt: "Parque", ar: "حديقة", bn: "পার্ক", ru: "Парк" },
  temple: { en: "Temple", zh: "寺廟", ja: "寺院", ko: "사원", fr: "Temple", es: "Templo", id: "Kuil", hi: "मंदिर", pt: "Templo", ar: "معبد", bn: "মন্দির", ru: "Храম" },
  district: { en: "District", zh: "街區", ja: "地区", ko: "지역", fr: "Quartier", es: "Barrio", id: "Kawasan", hi: "क्षेत्र", pt: "Bairro", ar: "حي", bn: "এলাকা", ru: "Район" },
};

function getTypeLabel(type: string, langCode: string) {
  return TYPE_LABELS[type]?.[langCode] ?? type;
}

const BEST_TIME_LABELS: Record<string, Record<string, string>> = {
  morning: { en: "Best in morning", zh: "早上最佳", ja: "朝がおすすめ", ko: "아침 추천", fr: "Matin recommandé", es: "Mejor por la mañana", id: "Terbaik pagi hari", hi: "सुबह बेहतर", pt: "Melhor de manhã", ar: "الأفضل صباحاً", bn: "সকালে ভালো", ru: "Лучше утром" },
  afternoon: { en: "Best in afternoon", zh: "下午最佳", ja: "午後がおすすめ", ko: "오후 추천", fr: "Après-midi recommandé", es: "Mejor por la tarde", id: "Terbaik sore hari", hi: "दोपहर बेहतर", pt: "Melhor à tarde", ar: "الأفضل بعد الظهر", bn: "বিকেলে ভালো", ru: "Лучше после полудня" },
  evening: { en: "Best in evening", zh: "傍晚最佳", ja: "夕方がおすすめ", ko: "저녁 추천", fr: "Soirée recommandée", es: "Mejor por la noche", id: "Terbaik malam hari", hi: "शाम बेहतर", pt: "Melhor à noite", ar: "الأفضل مساءً", bn: "সন্ধ্যায় ভালো", ru: "Лучше вечером" },
};

const NEARBY_CITIES: Record<string, string[]> = {
  "tokyo": ["kyoto", "osaka", "sapporo", "fukuoka"],
  "kyoto": ["tokyo", "osaka", "hakone", "sapporo"],
  "osaka": ["tokyo", "kyoto", "fukuoka", "sapporo"],
  "paris": ["london", "amsterdam", "brussels", "nice"],
  "london": ["paris", "amsterdam", "edinburgh", "brussels"],
  "new-york": ["chicago", "los-angeles", "miami", "boston"],
  "hong-kong": ["taipei", "singapore", "tokyo", "seoul"],
  "hongkong": ["taipei", "singapore", "tokyo", "seoul"],
  "singapore": ["hong-kong", "bangkok", "kuala-lumpur", "bali-kuta"],
  "bangkok": ["singapore", "ho-chi-minh-city", "kuala-lumpur", "bali-kuta"],
  "seoul": ["tokyo", "osaka", "taipei", "hong-kong"],
  "taipei": ["hong-kong", "tokyo", "seoul", "singapore"],
  "barcelona": ["madrid", "paris", "lisbon", "nice"],
  "madrid": ["barcelona", "lisbon", "paris", "seville"],
  "rome": ["florence", "venice", "milan", "naples"],
  "florence": ["rome", "venice", "milan", "bologna"],
  "venice": ["rome", "florence", "milan", "verona"],
  "amsterdam": ["brussels", "paris", "berlin", "london"],
  "berlin": ["amsterdam", "prague", "vienna", "munich"],
  "vienna": ["berlin", "prague", "budapest", "munich"],
  "prague": ["vienna", "berlin", "budapest", "krakow"],
  "dubai": ["abu-dhabi", "doha", "cairo", "marrakesh"],
  "athens": ["rome", "istanbul", "santorini", "florence"],
  "santorini": ["athens", "rome", "barcelona", "nice"],
};

const ALL_CITY_SLUGS = ["amsterdam","athens","auckland","bali-kuta","bangkok","barcelona","berlin","brussels","buenos-aires","cairo","cape-town","chicago","copenhagen","dubai","edinburgh","florence","fukuoka","hakone","ho-chi-minh-city","hong-kong","hongkong","kuala-lumpur","kyoto","las-vegas","lisbon","london","los-angeles","madrid","marrakesh","melbourne","miami","munich","new-york","nice","okinawa","osaka","paris","prague","reykjavik","rio-de-janeiro","rome","san-francisco","santorini","sapporo","seattle","seoul","singapore","stockholm","sydney","taipei","tokyo","toronto","venice","vienna","zurich"];

const CITY_ZH_NAMES: Record<string, string> = {
  "amsterdam": "阿姆斯特丹", "athens": "雅典", "auckland": "奧克蘭", "bali-kuta": "峇里島庫塔",
  "bangkok": "曼谷", "barcelona": "巴塞隆納", "berlin": "柏林", "brussels": "布魯塞爾",
  "buenos-aires": "布宜諾斯艾利斯", "cairo": "開羅", "cape-town": "開普敦", "chicago": "芝加哥",
  "copenhagen": "哥本哈根", "dubai": "杜拜", "edinburgh": "愛丁堡", "florence": "佛羅倫斯",
  "fukuoka": "福岡", "hakone": "箱根", "ho-chi-minh-city": "胡志明市", "hong-kong": "香港",
  "hongkong": "香港", "kuala-lumpur": "吉隆坡", "kyoto": "京都", "las-vegas": "拉斯維加斯",
  "lisbon": "里斯本", "london": "倫敦", "los-angeles": "洛杉磯", "madrid": "馬德里",
  "marrakesh": "馬拉喀什", "melbourne": "墨爾本", "miami": "邁阿密", "munich": "慕尼黑",
  "new-york": "紐約", "nice": "尼斯", "okinawa": "沖繩", "osaka": "大阪",
  "paris": "巴黎", "prague": "布拉格", "reykjavik": "雷克雅維克", "rio-de-janeiro": "里約熱內盧",
  "rome": "羅馬", "san-francisco": "舊金山", "santorini": "聖托里尼", "sapporo": "札幌",
  "seattle": "西雅圖", "seoul": "首爾", "singapore": "新加坡", "stockholm": "斯德哥爾摩",
  "sydney": "雪梨", "taipei": "台北", "tokyo": "東京", "toronto": "多倫多",
  "venice": "威尼斯", "vienna": "維也納", "zurich": "蘇黎世",
};

const CITY_JA_NAMES: Record<string, string> = {
  "amsterdam": "アムステルダム", "athens": "アテネ", "auckland": "オークランド", "bali-kuta": "バリ島クタ",
  "bangkok": "バンコク", "barcelona": "バルセロナ", "berlin": "ベルリン", "brussels": "ブリュッセル",
  "buenos-aires": "ブエノスアイレス", "cairo": "カイロ", "cape-town": "ケープタウン", "chicago": "シカゴ",
  "copenhagen": "コペンハーゲン", "dubai": "ドバイ", "edinburgh": "エディンバラ", "florence": "フィレンツェ",
  "fukuoka": "福岡", "hakone": "箱根", "ho-chi-minh-city": "ホーチミン市", "hong-kong": "香港",
  "hongkong": "香港", "kuala-lumpur": "クアラルンプール", "kyoto": "京都", "las-vegas": "ラスベガス",
  "lisbon": "リスボン", "london": "ロンドン", "los-angeles": "ロサンゼルス", "madrid": "マドリード",
  "marrakesh": "マラケシュ", "melbourne": "メルボルン", "miami": "マイアミ", "munich": "ミュンヘン",
  "new-york": "ニューヨーク", "nice": "ニース", "okinawa": "沖縄", "osaka": "大阪",
  "paris": "パリ", "prague": "プラハ", "reykjavik": "レイキャビク", "rio-de-janeiro": "リオデジャネイロ",
  "rome": "ローマ", "san-francisco": "サンフランシスコ", "santorini": "サントリーニ", "sapporo": "札幌",
  "seattle": "シアトル", "seoul": "ソウル", "singapore": "シンガポール", "stockholm": "ストックホルム",
  "sydney": "シドニー", "taipei": "台北", "tokyo": "東京", "toronto": "トロント",
  "venice": "ヴェネツィア", "vienna": "ウィーン", "zurich": "チューリッヒ",
};

const CITY_KO_NAMES: Record<string, string> = {
  "amsterdam": "암스테르담", "athens": "아테네", "auckland": "오클랜드", "bali-kuta": "발리 쿠타",
  "bangkok": "방콕", "barcelona": "바르셀로나", "berlin": "베를린", "brussels": "브뤼셀",
  "buenos-aires": "부에노스아이레스", "cairo": "카이로", "cape-town": "케이프타운", "chicago": "시카고",
  "copenhagen": "코펜하겐", "dubai": "두바이", "edinburgh": "에든버러", "florence": "피렌체",
  "fukuoka": "후쿠오카", "hakone": "하코네", "ho-chi-minh-city": "호치민시", "hong-kong": "홍콩",
  "hongkong": "홍콩", "kuala-lumpur": "쿠알라룸푸르", "kyoto": "교토", "las-vegas": "라스베이거스",
  "lisbon": "리스본", "london": "런던", "los-angeles": "로스앤젤레스", "madrid": "마드리드",
  "marrakesh": "마라케시", "melbourne": "멜버른", "miami": "마이애미", "munich": "뮌헨",
  "new-york": "뉴욕", "nice": "니스", "okinawa": "오키나와", "osaka": "오사카",
  "paris": "파리", "prague": "프라하", "reykjavik": "레이캬비크", "rio-de-janeiro": "리우데자네이루",
  "rome": "로마", "san-francisco": "샌프란시스코", "santorini": "산토리니", "sapporo": "삿포로",
  "seattle": "시애틀", "seoul": "서울", "singapore": "싱가포르", "stockholm": "스톡홀름",
  "sydney": "시드니", "taipei": "타이베이", "tokyo": "도쿄", "toronto": "토론토",
  "venice": "베네치아", "vienna": "빈", "zurich": "취리히",
};

const CITY_FR_NAMES: Record<string, string> = {
  "amsterdam": "Amsterdam", "athens": "Athènes", "auckland": "Auckland", "bali-kuta": "Bali Kuta",
  "bangkok": "Bangkok", "barcelona": "Barcelone", "berlin": "Berlin", "brussels": "Bruxelles",
  "buenos-aires": "Buenos Aires", "cairo": "Le Caire", "cape-town": "Le Cap", "chicago": "Chicago",
  "copenhagen": "Copenhague", "dubai": "Dubaï", "edinburgh": "Édimbourg", "florence": "Florence",
  "fukuoka": "Fukuoka", "hakone": "Hakone", "ho-chi-minh-city": "Hô-Chi-Minh-Ville", "hong-kong": "Hong Kong",
  "hongkong": "Hong Kong", "kuala-lumpur": "Kuala Lumpur", "kyoto": "Kyoto", "las-vegas": "Las Vegas",
  "lisbon": "Lisbonne", "london": "Londres", "los-angeles": "Los Angeles", "madrid": "Madrid",
  "marrakesh": "Marrakech", "melbourne": "Melbourne", "miami": "Miami", "munich": "Munich",
  "new-york": "New York", "nice": "Nice", "okinawa": "Okinawa", "osaka": "Osaka",
  "paris": "Paris", "prague": "Prague", "reykjavik": "Reykjavik", "rio-de-janeiro": "Rio de Janeiro",
  "rome": "Rome", "san-francisco": "San Francisco", "santorini": "Santorin", "sapporo": "Sapporo",
  "seattle": "Seattle", "seoul": "Séoul", "singapore": "Singapour", "stockholm": "Stockholm",
  "sydney": "Sydney", "taipei": "Taipei", "tokyo": "Tokyo", "toronto": "Toronto",
  "venice": "Venise", "vienna": "Vienne", "zurich": "Zurich",
};

const CITY_ES_NAMES: Record<string, string> = {
  "amsterdam": "Ámsterdam", "athens": "Atenas", "auckland": "Auckland", "bali-kuta": "Bali Kuta",
  "bangkok": "Bangkok", "barcelona": "Barcelona", "berlin": "Berlín", "brussels": "Bruselas",
  "buenos-aires": "Buenos Aires", "cairo": "El Cairo", "cape-town": "Ciudad del Cabo", "chicago": "Chicago",
  "copenhagen": "Copenhague", "dubai": "Dubái", "edinburgh": "Edimburgo", "florence": "Florencia",
  "fukuoka": "Fukuoka", "hakone": "Hakone", "ho-chi-minh-city": "Ciudad Ho Chi Minh", "hong-kong": "Hong Kong",
  "hongkong": "Hong Kong", "kuala-lumpur": "Kuala Lumpur", "kyoto": "Kioto", "las-vegas": "Las Vegas",
  "lisbon": "Lisboa", "london": "Londres", "los-angeles": "Los Ángeles", "madrid": "Madrid",
  "marrakesh": "Marrakech", "melbourne": "Melbourne", "miami": "Miami", "munich": "Múnich",
  "new-york": "Nueva York", "nice": "Niza", "okinawa": "Okinawa", "osaka": "Osaka",
  "paris": "París", "prague": "Praga", "reykjavik": "Reikiavik", "rio-de-janeiro": "Río de Janeiro",
  "rome": "Roma", "san-francisco": "San Francisco", "santorini": "Santorini", "sapporo": "Sapporo",
  "seattle": "Seattle", "seoul": "Seúl", "singapore": "Singapur", "stockholm": "Estocolmo",
  "sydney": "Sídney", "taipei": "Taipéi", "tokyo": "Tokio", "toronto": "Toronto",
  "venice": "Venecia", "vienna": "Viena", "zurich": "Zúrich",
};

const CITY_ID_NAMES: Record<string, string> = {
  "amsterdam": "Amsterdam", "athens": "Athena", "auckland": "Auckland", "bali-kuta": "Bali Kuta",
  "bangkok": "Bangkok", "barcelona": "Barcelona", "berlin": "Berlin", "brussels": "Brussel",
  "buenos-aires": "Buenos Aires", "cairo": "Kairo", "cape-town": "Kota Cape Town", "chicago": "Chicago",
  "copenhagen": "Kopenhagen", "dubai": "Dubai", "edinburgh": "Edinburgh", "florence": "Florence",
  "fukuoka": "Fukuoka", "hakone": "Hakone", "ho-chi-minh-city": "Kota Ho Chi Minh", "hong-kong": "Hong Kong",
  "hongkong": "Hong Kong", "kuala-lumpur": "Kuala Lumpur", "kyoto": "Kyoto", "las-vegas": "Las Vegas",
  "lisbon": "Lisbon", "london": "London", "los-angeles": "Los Angeles", "madrid": "Madrid",
  "marrakesh": "Marrakesh", "melbourne": "Melbourne", "miami": "Miami", "munich": "Munich",
  "new-york": "New York", "nice": "Nice", "okinawa": "Okinawa", "osaka": "Osaka",
  "paris": "Paris", "prague": "Praha", "reykjavik": "Reykjavik", "rio-de-janeiro": "Rio de Janeiro",
  "rome": "Roma", "san-francisco": "San Francisco", "santorini": "Santorini", "sapporo": "Sapporo",
  "seattle": "Seattle", "seoul": "Seoul", "singapore": "Singapura", "stockholm": "Stockholm",
  "sydney": "Sydney", "taipei": "Taipei", "tokyo": "Tokyo", "toronto": "Toronto",
  "venice": "Venesia", "vienna": "Wina", "zurich": "Zurich",
};

const CITY_HI_NAMES: Record<string, string> = {
  "amsterdam": "एम्स्टर्डम", "athens": "एथेंस", "auckland": "ऑकलैंड", "bali-kuta": "बाली कुटा",
  "bangkok": "बैंकॉक", "barcelona": "बार्सिलोना", "berlin": "बर्लिन", "brussels": "ब्रुसेल्स",
  "buenos-aires": "ब्यूनस आयर्स", "cairo": "काहिरा", "cape-town": "केप टाउन", "chicago": "शिकागो",
  "copenhagen": "कोपेनहेगन", "dubai": "दुबई", "edinburgh": "एडिनबर्ग", "florence": "फ्लोरेंस",
  "fukuoka": "फुकुओका", "hakone": "हाकोने", "ho-chi-minh-city": "हो ची मिन्ह सिटी", "hong-kong": "हांगकांग",
  "hongkong": "हांगकांग", "kuala-lumpur": "कुआलालंपुर", "kyoto": "क्योटो", "las-vegas": "लास वेगास",
  "lisbon": "लिस्बन", "london": "लंदन", "los-angeles": "लॉस एंजेलिस", "madrid": "मैड्रिड",
  "marrakesh": "माराकेश", "melbourne": "मेलबर्न", "miami": "मियामी", "munich": "म्यूनिख",
  "new-york": "न्यूयॉर्क", "nice": "नीस", "okinawa": "ओकिनावा", "osaka": "ओसाका",
  "paris": "पेरिस", "prague": "प्राग", "reykjavik": "रेक्याविक", "rio-de-janeiro": "रियो डी जनेरो",
  "rome": "रोम", "san-francisco": "सैन फ्रांसिस्को", "santorini": "सेंटोरिनी", "sapporo": "सापोरो",
  "seattle": "सिएटल", "seoul": "सियोल", "singapore": "सिंगापुर", "stockholm": "स्टॉकहोम",
  "sydney": "सिडनी", "taipei": "ताइपे", "tokyo": "टोक्यो", "toronto": "टोरंटो",
  "venice": "वेनिस", "vienna": "वियना", "zurich": "ज़्यूरिख",
};

const CITY_PT_NAMES: Record<string, string> = {
  "amsterdam": "Amsterdã", "athens": "Atenas", "auckland": "Auckland", "bali-kuta": "Bali Kuta",
  "bangkok": "Bangcoc", "barcelona": "Barcelona", "berlin": "Berlim", "brussels": "Bruxelas",
  "buenos-aires": "Buenos Aires", "cairo": "Cairo", "cape-town": "Cidade do Cabo", "chicago": "Chicago",
  "copenhagen": "Copenhague", "dubai": "Dubai", "edinburgh": "Edimburgo", "florence": "Florença",
  "fukuoka": "Fukuoka", "hakone": "Hakone", "ho-chi-minh-city": "Cidade de Ho Chi Minh", "hong-kong": "Hong Kong",
  "hongkong": "Hong Kong", "kuala-lumpur": "Kuala Lumpur", "kyoto": "Quioto", "las-vegas": "Las Vegas",
  "lisbon": "Lisboa", "london": "Londres", "los-angeles": "Los Angeles", "madrid": "Madrid",
  "marrakesh": "Marraquexe", "melbourne": "Melbourne", "miami": "Miami", "munich": "Munique",
  "new-york": "Nova York", "nice": "Nice", "okinawa": "Okinawa", "osaka": "Osaka",
  "paris": "Paris", "prague": "Praga", "reykjavik": "Reykjavík", "rio-de-janeiro": "Rio de Janeiro",
  "rome": "Roma", "san-francisco": "São Francisco", "santorini": "Santorini", "sapporo": "Sapporo",
  "seattle": "Seattle", "seoul": "Seul", "singapore": "Singapura", "stockholm": "Estocolmo",
  "sydney": "Sydney", "taipei": "Taipé", "tokyo": "Tóquio", "toronto": "Toronto",
  "venice": "Veneza", "vienna": "Viena", "zurich": "Zurique",
};

const CITY_AR_NAMES: Record<string, string> = {
  "amsterdam": "أمستردام", "athens": "أثينا", "auckland": "أوكلاند", "bali-kuta": "بالي كوتا",
  "bangkok": "بانكوك", "barcelona": "برشلونة", "berlin": "برلين", "brussels": "بروكسل",
  "buenos-aires": "بوينس آيرس", "cairo": "القاهرة", "cape-town": "كيب تاون", "chicago": "شيكاغو",
  "copenhagen": "كوبنهاغن", "dubai": "دبي", "edinburgh": "إدنبرة", "florence": "فلورنسا",
  "fukuoka": "فوكوكا", "hakone": "هاكوني", "ho-chi-minh-city": "مدينة هو تشي مينه", "hong-kong": "هونغ كونغ",
  "hongkong": "هونغ كونغ", "kuala-lumpur": "كوالالمبور", "kyoto": "كيوتو", "las-vegas": "لاس فيغاس",
  "lisbon": "لشبونة", "london": "لندن", "los-angeles": "لوس أنجلوس", "madrid": "مدريد",
  "marrakesh": "مراكش", "melbourne": "ملبورن", "miami": "ميامي", "munich": "ميونخ",
  "new-york": "نيويورك", "nice": "نيس", "okinawa": "أوكيناوا", "osaka": "أوساكا",
  "paris": "باريس", "prague": "براغ", "reykjavik": "ريكيافيك", "rio-de-janeiro": "ريو دي جانيرو",
  "rome": "روما", "san-francisco": "سان فرانسيسكو", "santorini": "سانتوريني", "sapporo": "سابورو",
  "seattle": "سياتل", "seoul": "سيول", "singapore": "سنغافورة", "stockholm": "ستوكهولم",
  "sydney": "سيدني", "taipei": "تايبيه", "tokyo": "طوكيو", "toronto": "تورنتو",
  "venice": "البندقية", "vienna": "فيينا", "zurich": "زيورخ",
};

const CITY_BN_NAMES: Record<string, string> = {
  "amsterdam": "আমস্টারডাম", "athens": "এথেন্স", "auckland": "অকল্যান্ড", "bali-kuta": "বালি কুটা",
  "bangkok": "ব্যাংকক", "barcelona": "বার্সেলোনা", "berlin": "বার্লিন", "brussels": "ব্রাসেলস",
  "buenos-aires": "বুয়েনোস আইরেস", "cairo": "কায়রো", "cape-town": "কেপ টাউন", "chicago": "শিকাগো",
  "copenhagen": "কোপেনহেগেন", "dubai": "দুবাই", "edinburgh": "এডিনবার্গ", "florence": "ফ্লোরেন্স",
  "fukuoka": "ফুকুওকা", "hakone": "হাকোনে", "ho-chi-minh-city": "হো চি মিন সিটি", "hong-kong": "হংকং",
  "hongkong": "হংকং", "kuala-lumpur": "কুয়ালালামপুর", "kyoto": "কিয়োটো", "las-vegas": "লাস ভেগাস",
  "lisbon": "লিসবন", "london": "লন্ডন", "los-angeles": "লস অ্যাঞ্জেলেস", "madrid": "মাদ্রিদ",
  "marrakesh": "মারাকেশ", "melbourne": "মেলবোর্ন", "miami": "মায়ামি", "munich": "মিউনিখ",
  "new-york": "নিউ ইয়র্ক", "nice": "নিস", "okinawa": "ওকিনাওয়া", "osaka": "ওসাকা",
  "paris": "প্যারিস", "prague": "প্রাগ", "reykjavik": "রেইকিয়াভিক", "rio-de-janeiro": "রিও ডি জেনেইরো",
  "rome": "রোম", "san-francisco": "সান ফ্রান্সিসকো", "santorini": "সান্তোরিনি", "sapporo": "সাপ্পোরো",
  "seattle": "সিয়াটেল", "seoul": "সিউল", "singapore": "সিঙ্গাপুর", "stockholm": "স্টকহোম",
  "sydney": "সিডনি", "taipei": "তাইপেই", "tokyo": "টোকিও", "toronto": "টরন্টো",
  "venice": "ভেনিস", "vienna": "ভিয়েনা", "zurich": "জুরিখ",
};

const CITY_RU_NAMES: Record<string, string> = {
  "amsterdam": "Амстердам", "athens": "Афины", "auckland": "Окленд", "bali-kuta": "Бали Кута",
  "bangkok": "Бангкок", "barcelona": "Барселона", "berlin": "Берлин", "brussels": "Брюссель",
  "buenos-aires": "Буэнос-Айрес", "cairo": "Каир", "cape-town": "Кейптаун", "chicago": "Чикаго",
  "copenhagen": "Копенгаген", "dubai": "Дубай", "edinburgh": "Эдинбург", "florence": "Флоренция",
  "fukuoka": "Фукуока", "hakone": "Хаконэ", "ho-chi-minh-city": "Хошимин", "hong-kong": "Гонконг",
  "hongkong": "Гонконг", "kuala-lumpur": "Куала-Лумпур", "kyoto": "Киото", "las-vegas": "Лас-Вегас",
  "lisbon": "Лиссабон", "london": "Лондон", "los-angeles": "Лос-Анджелес", "madrid": "Мадрид",
  "marrakesh": "Марракеш", "melbourne": "Мельбурн", "miami": "Майами", "munich": "Мюнхен",
  "new-york": "Нью-Йорк", "nice": "Ницца", "okinawa": "Окинава", "osaka": "Осака",
  "paris": "Париж", "prague": "Прага", "reykjavik": "Рейкьявик", "rio-de-janeiro": "Рио-де-Жанейро",
  "rome": "Рим", "san-francisco": "Сан-Франциско", "santorini": "Санторини", "sapporo": "Саппоро",
  "seattle": "Сиэтл", "seoul": "Сеул", "singapore": "Сингапур", "stockholm": "Стокгольм",
  "sydney": "Сидней", "taipei": "Тайбэй", "tokyo": "Токио", "toronto": "Торонто",
  "venice": "Венеция", "vienna": "Вена", "zurich": "Цюрих",
};

function formatCityName(slug: string): string {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function getLocalizedCityName(slug: string, langCode: string): string {
  const maps: Record<string, Record<string, string>> = {
    zh: CITY_ZH_NAMES, ja: CITY_JA_NAMES, ko: CITY_KO_NAMES,
    fr: CITY_FR_NAMES, es: CITY_ES_NAMES, id: CITY_ID_NAMES,
    hi: CITY_HI_NAMES, pt: CITY_PT_NAMES, ar: CITY_AR_NAMES,
    bn: CITY_BN_NAMES, ru: CITY_RU_NAMES,
  };
  return maps[langCode]?.[slug] ?? formatCityName(slug);
}

function getRelatedCities(citySlug: string, allSlugs: string[]): string[] {
  const nearby = NEARBY_CITIES[citySlug];
  if (nearby) return nearby.filter(s => allSlugs.includes(s)).slice(0, 4);
  return allSlugs.filter(s => s !== citySlug).slice(0, 4);
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={13}
          className={i <= full ? "text-yellow-400 fill-yellow-400" : i === full + 1 && half ? "text-yellow-400 fill-yellow-400/50" : "text-gray-600"} />
      ))}
      <span className="text-yellow-400 font-bold text-xs ml-1">{rating}</span>
    </div>
  );
}

function ImageWithSkeleton({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgSrc = error ? DEFAULT_ATTR_IMG : src;

  return (
    <div className="relative w-full h-full">
      {!loaded && <div className="absolute inset-0 bg-gray-800 animate-pulse" />}
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => { setError(true); setLoaded(true); }}
      />
    </div>
  );
}

function ShareButtons({ title, url, lang }: { title: string; url: string; lang: string }) {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 text-xs">{SHARE_LABEL[lang] ?? SHARE_LABEL["en"]}:</span>
      <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`} target="_blank" rel="noopener noreferrer"
        className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors" title="Share on X">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`} target="_blank" rel="noopener noreferrer"
        className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors" title="Share on Facebook">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </a>
      <a href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encoded}`} target="_blank" rel="noopener noreferrer"
        className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors" title="Share on WhatsApp">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      <button onClick={handleCopy}
        className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors" title="Copy link">
        {copied
          ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        }
      </button>
    </div>
  );
}

function CitySearchBox({ activeLang, onClose }: { activeLang: string; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = ALL_CITY_SLUGS.filter(s =>
    formatCityName(s).toLowerCase().includes(query.toLowerCase())
  ).slice(0, 12);

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 z-50 shadow-2xl">
      <div className="flex items-center gap-2 mb-3">
        <Search size={14} className="text-gray-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={SEARCH_CITY_LABEL[activeLang] ?? SEARCH_CITY_LABEL["en"]}
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
        />
        <button onClick={onClose}><X size={14} className="text-gray-400 hover:text-white" /></button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {filtered.map(slug => (
          <a key={slug} href={`/attractions/${activeLang}/${slug}`}
            className="text-xs text-gray-300 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded-lg transition-colors truncate">
            {getLocalizedCityName(slug, activeLang)}
          </a>
        ))}
      </div>
    </div>
  );
}

function AttractionsContent({ citySlug, attractionsData, initialLang, langCode }: Props) {
  const { language, setLanguage } = useAppContext();
  const [showSearch, setShowSearch] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialLang && initialLang !== language) setLanguage(initialLang);
  }, [initialLang, language, setLanguage]);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch photos for items that don't already have photo_url
  useEffect(() => {
    const enItems = attractionsData.translations["en"]?.items ?? [];
    enItems.forEach((item: any) => {
      if (item.photo_url) {
        setPhotoUrls(prev => ({ ...prev, [item.id]: item.photo_url }));
        return;
      }
      if (!item.image_keyword) return;
      const cityName = formatCityName(citySlug);
      fetch(`/api/activity-photo?keyword=${encodeURIComponent(cityName + " " + item.image_keyword)}&city=${encodeURIComponent(citySlug)}`)
        .then(r => r.json())
        .then(data => {
          if (data.url) {
            setPhotoUrls(prev => ({ ...prev, [item.id]: data.url }));
          }
        })
        .catch(() => {});
    });
  }, [citySlug, attractionsData]);

  const activeLang = LANG_NAME_TO_CODE[language] ?? langCode;
  const translation = attractionsData.translations[activeLang] ?? attractionsData.translations["en"];
  const items = translation?.items ?? [];
  const cityName = getLocalizedCityName(citySlug, activeLang);
  const relatedCities = getRelatedCities(citySlug, ALL_CITY_SLUGS);
  const pageUrl = typeof window !== "undefined" ? window.location.href : `https://www.hkfirstclick.com/attractions/${activeLang}/${citySlug}`;

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 md:px-8 max-w-5xl mx-auto">

      {/* Sticky Klook CTA */}
      {showSticky && (
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href={`https://www.klook.com/search/?query=${encodeURIComponent(cityName + " attractions tickets")}`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm px-5 py-3 rounded-full shadow-lg shadow-yellow-400/30 [transition:transform_200ms_ease,background-color_200ms_ease] hover:scale-105 active:scale-95"
          >
            {BOOK_ALL_KLOOK_LABEL[activeLang] ?? BOOK_ALL_KLOOK_LABEL["en"]}
            <ExternalLink size={13} />
          </a>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-gray-500 mb-6 flex-wrap">
        <a href={`/${activeLang}`} className="hover:text-gray-300 transition-colors">
          {HOME_LABEL[activeLang] ?? HOME_LABEL["en"]}
        </a>
        <ChevronRight size={12} />
        <a href="/map" className="hover:text-gray-300 transition-colors">
          {BACK_TO_MAP_LABEL[activeLang] ?? BACK_TO_MAP_LABEL["en"]}
        </a>
        <ChevronRight size={12} />
        <span className="text-gray-300">{cityName}</span>
        <span className="ml-auto text-gray-600 text-xs">{UPDATED_LABEL[activeLang] ?? UPDATED_LABEL["en"]}</span>
      </nav>

      {/* Back button + internal link */}
      <div className="flex items-center gap-3 mb-8">
        <a href="/map" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <span>←</span>
          <span>{BACK_TO_MAP_LABEL[activeLang] ?? BACK_TO_MAP_LABEL["en"]}</span>
        </a>
        <span className="text-gray-700">|</span>
        <a href={`/food/${activeLang}/${citySlug}`} className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm transition-colors">
          <Utensils size={14} />
          <span>{SEE_FOOD_LABEL[activeLang] ?? SEE_FOOD_LABEL["en"]}</span>
        </a>
      </div>

      {/* Hero */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-purple-400 mb-3">
          <Landmark size={20} />
          <span className="text-sm font-bold uppercase tracking-widest">{TOP_ATTRACTIONS_LABEL[activeLang] ?? TOP_ATTRACTIONS_LABEL["en"]}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 heading-premium">
          {translation?.seo_title ?? `Top Attractions in ${citySlug}`}
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-4">
          {translation?.page_intro}
        </p>
        <ShareButtons title={translation?.seo_title ?? cityName} url={pageUrl} lang={activeLang} />
      </div>

      {/* Attractions Items */}
      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-[#161616] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row hover:border-purple-500/30 transition-colors">
            <div className="relative w-full md:w-56 h-48 md:h-auto shrink-0 bg-gray-800">
              <ImageWithSkeleton
                src={photoUrls[item.id] || item.photo_url || DEFAULT_ATTR_IMG}
                alt={`${item.name} - ${getTypeLabel(item.type, "en")} in ${cityName}`}
              />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-purple-300 text-xs font-bold px-2 py-1 rounded-full">
                {getTypeLabel(item.type, activeLang)}
              </div>
            </div>
            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-xl font-black text-white">{item.name}</h2>
                  <StarRating rating={item.star_rating} />
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">{item.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {item.needs_ticket && (
                    <div className="flex items-center gap-1 text-orange-400">
                      <Ticket size={13} />
                      <span>{item.ticket_price_hint}</span>
                    </div>
                  )}
                  {!item.needs_ticket && (
                    <div className="flex items-center gap-1 text-green-400">
                      <Ticket size={13} />
                      <span>{item.ticket_price_hint}</span>
                    </div>
                  )}
                  {item.best_time && (
                    <div className="flex items-center gap-1 text-blue-400">
                      <Clock size={13} />
                      <span>{BEST_TIME_LABELS[item.best_time]?.[activeLang] ?? item.best_time}</span>
                    </div>
                  )}
                </div>
              </div>
              <a
                href={`https://www.klook.com/search/?query=${encodeURIComponent(item.klook_query)}`}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="mt-4 inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm px-4 py-2 rounded-full transition-colors w-fit"
              >
                {BOOK_KLOOK_LABEL[activeLang] ?? BOOK_KLOOK_LABEL["en"]}
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Itinerary CTA */}
      {(() => {
        const mustVisitList = items.map(i => i.name).filter(Boolean).join(", ");
        const enCityName = formatCityName(citySlug);
        const workspaceUrl = `/workspace?dest=${encodeURIComponent(enCityName)}&mustVisit=${encodeURIComponent(mustVisitList)}`;
        const GENERATE_LABEL: Record<string, string> = {
          en: "Generate AI Itinerary", zh: "一鍵生成 AI 行程", ja: "AIで旅程を作成", ko: "AI 일정 생성",
          fr: "Générer un itinéraire IA", es: "Generar itinerario IA", id: "Buat Itinerary AI",
          hi: "AI यात्रा योजना बनाएं", pt: "Gerar roteiro IA", ar: "إنشاء خطة سفر AI",
          bn: "AI ভ্রমণ পরিকল্পনা তৈরি করুন", ru: "Создать маршрут ИИ",
        };
        const GENERATE_DESC: Record<string, string> = {
          en: `Include all ${cityName} top attractions in your itinerary`,
          zh: `將所有 ${cityName} 熱門景點納入你的行程`,
          ja: `${cityName}の人気観光スポットをすべて旅程に含める`,
          ko: `${cityName}의 모든 명소를 일정에 포함`,
          fr: `Inclure tous les sites incontournables de ${cityName}`,
          es: `Incluir todas las atracciones principales de ${cityName}`,
          id: `Sertakan semua atraksi utama ${cityName} dalam itinerary`,
          hi: `${cityName} के सभी शीर्ष आकर्षण शामिल करें`,
          pt: `Incluir todas as principais atrações de ${cityName}`,
          ar: `تضمين جميع أبرز معالم ${cityName} في خطتك`,
          bn: `${cityName}-এর সব শীর্ষ আকর্ষণ অন্তর্ভুক্ত করুন`,
          ru: `Включить все главные достопримечательности ${cityName}`,
        };
        return (
          <div className="mt-12 p-6 bg-[#EEDC00]/10 border border-[#EEDC00]/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#EEDC00] mb-1">
                <Sparkles size={16} />
                <span className="text-sm font-bold uppercase tracking-widest">{activeLang === "zh" ? "AI 行程" : activeLang === "ja" ? "AI旅程" : activeLang === "ko" ? "AI 일정" : "AI Itinerary"}</span>
              </div>
              <p className="text-white font-bold text-lg">{GENERATE_DESC[activeLang] ?? GENERATE_DESC["en"]}</p>
            </div>
            <a href={workspaceUrl}
              className="inline-flex items-center gap-2 bg-[#EEDC00] hover:bg-yellow-300 text-black font-bold text-sm px-5 py-3 rounded-full transition-colors shrink-0 shadow-[0_0_20px_rgba(238,220,0,0.3)]">
              <Sparkles size={14} />
              {GENERATE_LABEL[activeLang] ?? GENERATE_LABEL["en"]}
            </a>
          </div>
        );
      })()}

      {/* Internal link to Food */}
      <div className="mt-6 p-6 bg-yellow-900/20 border border-yellow-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-yellow-400 mb-1">
            <Utensils size={16} />
            <span className="text-sm font-bold uppercase tracking-widest">
              {SEE_FOOD_LABEL[activeLang] ?? SEE_FOOD_LABEL["en"]}
            </span>
          </div>
          <p className="text-white font-bold text-lg">{cityName}</p>
        </div>
        <a href={`/food/${activeLang}/${citySlug}`}
          className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm px-5 py-2.5 rounded-full transition-colors shrink-0">
          {SEE_FOOD_LABEL[activeLang] ?? SEE_FOOD_LABEL["en"]}
          <ChevronRight size={14} />
        </a>
      </div>

      {/* Related Cities + Search */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <MapPin size={16} className="text-purple-400" />
            {RELATED_CITIES_LABEL[activeLang] ?? RELATED_CITIES_LABEL["en"]}
          </h3>
          <div className="relative">
            <button
              onClick={() => setShowSearch(s => !s)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-full transition-colors"
            >
              <Search size={11} />
              <span>{SEARCH_CITY_LABEL[activeLang]?.replace("...", "") ?? "Search"}</span>
            </button>
            {showSearch && (
              <CitySearchBox activeLang={activeLang} onClose={() => setShowSearch(false)} />
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {relatedCities.map((slug) => (
            <a key={slug} href={`/attractions/${activeLang}/${slug}`}
              className="bg-[#161616] border border-white/10 rounded-xl px-4 py-3 text-center hover:border-purple-500/40 hover:bg-purple-500/5 transition-colors">
              <div className="text-sm font-bold text-white">{getLocalizedCityName(slug, activeLang)}</div>
              <div className="text-xs text-gray-500 mt-0.5 flex items-center justify-center gap-1">
                <Landmark size={10} />
                <span>{TOP_ATTRACTIONS_LABEL[activeLang] ?? TOP_ATTRACTIONS_LABEL["en"]}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AttractionsClientPage({ citySlug, attractionsData, initialLang, langCode }: Props) {
  const router = useRouter();
  const handleLanguageChange = (code: string) => router.push(`/attractions/${code}/${citySlug}`);

  return (
    <GlobalLayout initialLanguage={initialLang} onLanguageChange={handleLanguageChange}>
      <AttractionsContent citySlug={citySlug} attractionsData={attractionsData} initialLang={initialLang} langCode={langCode} />
    </GlobalLayout>
  );
}
