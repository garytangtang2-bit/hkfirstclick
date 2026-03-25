"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { useAppContext } from "@/components/AppContext";
import { LANG_NAME_TO_CODE } from "@/utils/langMapping";
import { Star, ExternalLink, Utensils, ChevronRight, MapPin, Landmark, Sparkles, Search, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface FoodItem {
  id: string;
  name: string;
  type: string;
  description: string;
  image_keyword: string;
  star_rating: number;
  price_range: string;
  must_try: string;
  klook_query: string;
  photo_url?: string;
}

interface FoodData {
  city_slug: string;
  translations: Record<string, {
    seo_title: string;
    seo_description: string;
    page_intro: string;
    items: FoodItem[];
  }>;
}

interface Props {
  citySlug: string;
  foodData: FoodData;
  initialLang: string;
  langCode: string;
}

const DEFAULT_FOOD_IMG = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop";

const TYPE_LABELS: Record<string, Record<string, string>> = {
  restaurant: { en: "Restaurant", zh: "餐廳", ja: "レストラン", ko: "레스토랑", fr: "Restaurant", es: "Restaurante", id: "Restoran", hi: "रेस्तरां", pt: "Restaurante", ar: "مطعم", bn: "রেস্তোরাঁ", ru: "Ресторан" },
  street_food: { en: "Street Food", zh: "街頭美食", ja: "屋台", ko: "길거리 음식", fr: "Street Food", es: "Comida Callejera", id: "Makanan Jalanan", hi: "स्ट्रीट फूड", pt: "Comida de Rua", ar: "طعام الشوارع", bn: "স্ট্রিট ফুড", ru: "Уличная еда" },
  cafe: { en: "Café", zh: "咖啡廳", ja: "カフェ", ko: "카페", fr: "Café", es: "Café", id: "Kafe", hi: "कैफे", pt: "Café", ar: "مقهى", bn: "ক্যাফে", ru: "Кафе" },
  market: { en: "Market", zh: "市場", ja: "市場", ko: "시장", fr: "Marché", es: "Mercado", id: "Pasar", hi: "बाज़ार", pt: "Mercado", ar: "سوق", bn: "বাজার", ru: "Рынок" },
};

const MUST_TRY_LABEL: Record<string, string> = {
  en: "Must try", zh: "必點", ja: "必食", ko: "必須 먹어봐야 할", fr: "À ne pas manquer", es: "Imprescindible", id: "Wajib coba", hi: "जरूर खाएं", pt: "Imperdível", ar: "يجب تجربته", bn: "অবশ্যই চেষ্টা করুন", ru: "Обязательно попробуйте",
};

const BOOK_KLOOK_LABEL: Record<string, string> = {
  en: "Book on Klook", zh: "在 Klook 預訂", ja: "Klookで予約", ko: "Klook에서 예약", fr: "Réserver sur Klook", es: "Reservar en Klook", id: "Pesan di Klook", hi: "Klook पर बुक करें", pt: "Reservar no Klook", ar: "احجز على Klook", bn: "Klook-এ বুক করুন", ru: "Забронировать на Klook",
};

const MUST_TRY_FOOD_LABEL: Record<string, string> = {
  en: "Must Try Food", zh: "必嚐美食", ja: "必食グルメ", ko: "필수 음식", fr: "À goûter absolument", es: "Comida imprescindible", id: "Makanan wajib coba", hi: "जरूर चखें", pt: "Comida imperdível", ar: "طعام لا يُفوَّت", bn: "অবশ্যই খাবার", ru: "Обязательно попробуйте",
};

const BACK_TO_MAP_LABEL: Record<string, string> = {
  en: "Back to Map", zh: "返回地圖", ja: "地図に戻る", ko: "지도로 돌아가기", fr: "Retour à la carte", es: "Volver al mapa", id: "Kembali ke peta", hi: "मानचित्र पर वापस", pt: "Voltar ao mapa", ar: "العودة إلى الخريطة", bn: "মানচিত্রে ফিরুন", ru: "Вернуться к карте",
};

const SEE_ATTRACTIONS_LABEL: Record<string, string> = {
  en: "See Top Attractions", zh: "查看熱門景點", ja: "人気観光スポットを見る", ko: "인기 명소 보기", fr: "Voir les sites touristiques", es: "Ver atracciones principales", id: "Lihat atraksi utama", hi: "शीर्ष आकर्षण देखें", pt: "Ver principais atrações", ar: "عرض المعالم السياحية", bn: "শীর্ষ আকর্ষণ দেখুন", ru: "Посмотреть достопримечательности",
};

const RELATED_CITIES_LABEL: Record<string, string> = {
  en: "More City Food Guides", zh: "更多城市美食指南", ja: "他の都市の食べ物ガイド", ko: "더 많은 도시 음식 가이드", fr: "Guides gastronomiques d'autres villes", es: "Más guías de comida por ciudad", id: "Panduan kuliner kota lainnya", hi: "अन्य शहरों के खाद्य गाइड", pt: "Mais guias de comida por cidade", ar: "أدلة طعام مدن أخرى", bn: "আরও শহরের খাবার গাইড", ru: "Гиды по еде других городов",
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

function formatCityName(slug: string): string {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function getTypeLabel(type: string, langCode: string) {
  return TYPE_LABELS[type]?.[langCode] ?? type;
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
        <Star
          key={i}
          size={13}
          className={i <= full ? "text-yellow-400 fill-yellow-400" : i === full + 1 && half ? "text-yellow-400 fill-yellow-400/50" : "text-gray-600"}
        />
      ))}
      <span className="text-yellow-400 font-bold text-xs ml-1">{rating}</span>
    </div>
  );
}

function ImageWithSkeleton({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgSrc = error ? DEFAULT_FOOD_IMG : src;

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

function CitySearchBox({ activeLang, type, onClose }: { activeLang: string; type: "food" | "attractions"; onClose: () => void }) {
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
          <a key={slug} href={`/${type}/${activeLang}/${slug}`}
            className="text-xs text-gray-300 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded-lg transition-colors truncate">
            {formatCityName(slug)}
          </a>
        ))}
      </div>
    </div>
  );
}

function FoodContent({ citySlug, foodData, initialLang, langCode }: Props) {
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

  // Fetch photos for all items using english items' image_keyword
  useEffect(() => {
    const enItems = foodData.translations["en"]?.items ?? [];
    enItems.forEach((item: any) => {
      if (!item.image_keyword) return;
      fetch(`/api/activity-photo?keyword=${encodeURIComponent(item.image_keyword)}&city=${encodeURIComponent(citySlug)}`)
        .then(r => r.json())
        .then(data => {
          if (data.url) {
            setPhotoUrls(prev => ({ ...prev, [item.id]: data.url }));
          }
        })
        .catch(() => {});
    });
  }, [citySlug, foodData]);

  const activeLang = LANG_NAME_TO_CODE[language] ?? langCode;
  const translation = foodData.translations[activeLang] ?? foodData.translations["en"];
  const items = translation?.items ?? [];
  const cityName = formatCityName(citySlug);
  const relatedCities = getRelatedCities(citySlug, ALL_CITY_SLUGS);
  const pageUrl = typeof window !== "undefined" ? window.location.href : `https://www.hkfirstclick.com/food/${activeLang}/${citySlug}`;

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 md:px-8 max-w-5xl mx-auto">

      {/* Sticky Klook CTA */}
      {showSticky && (
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href={`https://www.klook.com/search/?query=${encodeURIComponent(cityName + " food")}`}
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
        <a href={`/attractions/${activeLang}/${citySlug}`} className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm transition-colors">
          <Landmark size={14} />
          <span>{SEE_ATTRACTIONS_LABEL[activeLang] ?? SEE_ATTRACTIONS_LABEL["en"]}</span>
        </a>
      </div>

      {/* Hero */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-yellow-400 mb-3">
          <Utensils size={20} />
          <span className="text-sm font-bold uppercase tracking-widest">{MUST_TRY_FOOD_LABEL[activeLang] ?? MUST_TRY_FOOD_LABEL["en"]}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 heading-premium">
          {translation?.seo_title ?? `Best Food in ${citySlug}`}
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-4">
          {translation?.page_intro}
        </p>
        <ShareButtons title={translation?.seo_title ?? cityName} url={pageUrl} lang={activeLang} />
      </div>

      {/* Food Items */}
      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-[#161616] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row hover:border-yellow-500/30 transition-colors">
            <div className="relative w-full md:w-56 h-48 md:h-auto shrink-0 bg-gray-800">
              <ImageWithSkeleton
                src={photoUrls[item.id] || item.photo_url || DEFAULT_FOOD_IMG}
                alt={`${item.name} - ${getTypeLabel(item.type, "en")} in ${cityName}`}
              />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-full">
                {getTypeLabel(item.type, activeLang)}
              </div>
            </div>
            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-xl font-black text-white">{item.name}</h2>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StarRating rating={item.star_rating} />
                    <span className="text-gray-500 text-xs">{item.price_range}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">{item.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">{MUST_TRY_LABEL[activeLang] ?? MUST_TRY_LABEL["en"]}:</span>
                  <span className="text-yellow-300 font-semibold">{item.must_try}</span>
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
        const mustVisitList = items.map(i => i.must_try).filter(Boolean).join(", ");
        const workspaceUrl = `/workspace?dest=${encodeURIComponent(cityName)}&mustVisit=${encodeURIComponent(mustVisitList)}`;
        const GENERATE_LABEL: Record<string, string> = {
          en: "Generate AI Itinerary", zh: "一鍵生成 AI 行程", ja: "AIで旅程を作成", ko: "AI 일정 생성",
          fr: "Générer un itinéraire IA", es: "Generar itinerario IA", id: "Buat Itinerary AI",
          hi: "AI यात्रा योजना बनाएं", pt: "Gerar roteiro IA", ar: "إنشاء خطة سفر AI",
          bn: "AI ভ্রমণ পরিকল্পনা তৈরি করুন", ru: "Создать маршрут ИИ",
        };
        const GENERATE_DESC: Record<string, string> = {
          en: `Include all ${cityName} food highlights in your itinerary`,
          zh: `將所有 ${cityName} 美食亮點納入你的行程`,
          ja: `${cityName}のグルメスポットをすべて旅程に含める`,
          ko: `${cityName}의 모든 맛집을 일정에 포함`,
          fr: `Inclure tous les incontournables culinaires de ${cityName}`,
          es: `Incluir todos los platos imprescindibles de ${cityName}`,
          id: `Sertakan semua kuliner unggulan ${cityName} dalam itinerary`,
          hi: `${cityName} के सभी खाने के हाइलाइट्स शामिल करें`,
          pt: `Incluir todos os destaques gastronômicos de ${cityName}`,
          ar: `تضمين جميع أبرز أطعمة ${cityName} في خطتك`,
          bn: `${cityName}-এর সব খাবারের হাইলাইট অন্তর্ভুক্ত করুন`,
          ru: `Включить все гастрономические достопримечательности ${cityName}`,
        };
        return (
          <div className="mt-12 p-6 bg-[#EEDC00]/10 border border-[#EEDC00]/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#EEDC00] mb-1">
                <Sparkles size={16} />
                <span className="text-sm font-bold uppercase tracking-widest">AI Itinerary</span>
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

      {/* Internal link to Attractions */}
      <div className="mt-6 p-6 bg-purple-900/20 border border-purple-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 mb-1">
            <Landmark size={16} />
            <span className="text-sm font-bold uppercase tracking-widest">
              {SEE_ATTRACTIONS_LABEL[activeLang] ?? SEE_ATTRACTIONS_LABEL["en"]}
            </span>
          </div>
          <p className="text-white font-bold text-lg">{cityName}</p>
        </div>
        <a href={`/attractions/${activeLang}/${citySlug}`}
          className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-bold text-sm px-5 py-2.5 rounded-full transition-colors shrink-0">
          {SEE_ATTRACTIONS_LABEL[activeLang] ?? SEE_ATTRACTIONS_LABEL["en"]}
          <ChevronRight size={14} />
        </a>
      </div>

      {/* Related Cities + Search */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <MapPin size={16} className="text-yellow-400" />
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
              <CitySearchBox activeLang={activeLang} type="food" onClose={() => setShowSearch(false)} />
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {relatedCities.map((slug) => (
            <a key={slug} href={`/food/${activeLang}/${slug}`}
              className="bg-[#161616] border border-white/10 rounded-xl px-4 py-3 text-center hover:border-yellow-500/40 hover:bg-yellow-500/5 transition-colors">
              <div className="text-sm font-bold text-white">{formatCityName(slug)}</div>
              <div className="text-xs text-gray-500 mt-0.5 flex items-center justify-center gap-1">
                <Utensils size={10} />
                <span>{MUST_TRY_FOOD_LABEL[activeLang] ?? MUST_TRY_FOOD_LABEL["en"]}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FoodClientPage({ citySlug, foodData, initialLang, langCode }: Props) {
  const router = useRouter();
  const handleLanguageChange = (code: string) => router.push(`/food/${code}/${citySlug}`);

  return (
    <GlobalLayout initialLanguage={initialLang} onLanguageChange={handleLanguageChange}>
      <FoodContent citySlug={citySlug} foodData={foodData} initialLang={initialLang} langCode={langCode} />
    </GlobalLayout>
  );
}
