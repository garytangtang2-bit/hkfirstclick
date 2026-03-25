"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { useAppContext } from "@/components/AppContext";
import { getCitySlug } from "@/utils/cityTranslations";
import { LANG_NAME_TO_CODE } from "@/utils/langMapping";
import { Star, MapPin, ExternalLink, Utensils } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

function getUnsplashUrl(name: string, mustTry: string) {
  // Try restaurant name first, fall back to must_try dish name
  const keyword = encodeURIComponent(`${name} ${mustTry} food`);
  return `https://source.unsplash.com/400x300/?${keyword}`;
}

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

function getTypeLabel(type: string, langCode: string) {
  return TYPE_LABELS[type]?.[langCode] ?? type;
}

function FoodContent({ citySlug, foodData, initialLang, langCode }: Props) {
  const { language, setLanguage } = useAppContext();

  useEffect(() => {
    if (initialLang && initialLang !== language) {
      setLanguage(initialLang);
    }
  }, [initialLang, language, setLanguage]);

  const activeLang = LANG_NAME_TO_CODE[language] ?? langCode;
  const translation = foodData.translations[activeLang] ?? foodData.translations["en"];
  const items = translation?.items ?? [];

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2 text-yellow-400 mb-3">
          <Utensils size={20} />
          <span className="text-sm font-bold uppercase tracking-widest">{MUST_TRY_FOOD_LABEL[activeLang] ?? MUST_TRY_FOOD_LABEL["en"]}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 heading-premium">
          {translation?.seo_title ?? `Best Food in ${citySlug}`}
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {translation?.page_intro}
        </p>
      </div>

      {/* Food Items */}
      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-[#161616] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row hover:border-yellow-500/30 transition-all">
            {/* Image */}
            <div className="relative w-full md:w-56 h-48 md:h-auto shrink-0 bg-gray-800">
              <img
                src={getUnsplashUrl(item.name, item.must_try)}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&fit=crop";
                }}
              />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-full">
                {getTypeLabel(item.type, activeLang)}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-xl font-black text-white">{item.name}</h2>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm">{item.star_rating}</span>
                    <span className="text-gray-500 text-sm ml-2">{item.price_range}</span>
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
    </div>
  );
}

export default function FoodClientPage({ citySlug, foodData, initialLang, langCode }: Props) {
  const router = useRouter();

  const handleLanguageChange = (code: string) => {
    router.push(`/food/${code}/${citySlug}`);
  };

  return (
    <GlobalLayout initialLanguage={initialLang} onLanguageChange={handleLanguageChange}>
      <FoodContent citySlug={citySlug} foodData={foodData} initialLang={initialLang} langCode={langCode} />
    </GlobalLayout>
  );
}
