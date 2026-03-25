"use client";

import GlobalLayout from "@/components/GlobalLayout";
import { useAppContext } from "@/components/AppContext";
import { LANG_NAME_TO_CODE } from "@/utils/langMapping";
import { Star, Ticket, Clock, ExternalLink, Landmark } from "lucide-react";
import { useEffect } from "react";
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

const BOOK_KLOOK_LABEL: Record<string, string> = {
  en: "Book on Klook", zh: "在 Klook 預訂", ja: "Klookで予約", ko: "Klook에서 예약", fr: "Réserver sur Klook", es: "Reservar en Klook", id: "Pesan di Klook", hi: "Klook पर बुक करें", pt: "Reservar no Klook", ar: "احجز على Klook", bn: "Klook-এ বুক করুন", ru: "Забронировать на Klook",
};

const TOP_ATTRACTIONS_LABEL: Record<string, string> = {
  en: "Top Attractions", zh: "熱門景點", ja: "人気観光スポット", ko: "인기 명소", fr: "Principaux sites", es: "Principales atracciones", id: "Atraksi utama", hi: "शीर्ष आकर्षण", pt: "Principais atrações", ar: "أبرز المعالم", bn: "শীর্ষ আকর্ষণ", ru: "Главные достопримечательности",
};

const TYPE_LABELS: Record<string, Record<string, string>> = {
  landmark: { en: "Landmark", zh: "地標", ja: "ランドマーク", ko: "랜드마크", fr: "Monument", es: "Monumento", id: "Landmark", hi: "स्थलचिह्न", pt: "Ponto Turístico", ar: "معلم", bn: "ল্যান্ডমার্ক", ru: "Достопримечательность" },
  museum: { en: "Museum", zh: "博物館", ja: "博物館", ko: "박물관", fr: "Musée", es: "Museo", id: "Museum", hi: "संग्रहालय", pt: "Museu", ar: "متحف", bn: "জাদুঘর", ru: "Музей" },
  park: { en: "Park", zh: "公園", ja: "公園", ko: "공원", fr: "Parc", es: "Parque", id: "Taman", hi: "पार्क", pt: "Parque", ar: "حديقة", bn: "পার্ক", ru: "Парк" },
  temple: { en: "Temple", zh: "寺廟", ja: "寺院", ko: "사원", fr: "Temple", es: "Templo", id: "Kuil", hi: "मंदिर", pt: "Templo", ar: "معبد", bn: "মন্দির", ru: "Храм" },
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

function AttractionsContent({ citySlug, attractionsData, initialLang, langCode }: Props) {
  const { language, setLanguage } = useAppContext();

  useEffect(() => {
    if (initialLang && initialLang !== language) {
      setLanguage(initialLang);
    }
  }, [initialLang, language, setLanguage]);

  const activeLang = LANG_NAME_TO_CODE[language] ?? langCode;
  const translation = attractionsData.translations[activeLang] ?? attractionsData.translations["en"];
  const items = translation?.items ?? [];

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2 text-purple-400 mb-3">
          <Landmark size={20} />
          <span className="text-sm font-bold uppercase tracking-widest">{TOP_ATTRACTIONS_LABEL[activeLang] ?? TOP_ATTRACTIONS_LABEL["en"]}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 heading-premium">
          {translation?.seo_title ?? `Top Attractions in ${citySlug}`}
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {translation?.page_intro}
        </p>
      </div>

      {/* Attractions Items */}
      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-[#161616] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row hover:border-purple-500/30 transition-all">
            {/* Image */}
            <div className="relative w-full md:w-56 h-48 md:h-auto shrink-0 bg-gray-800">
              <img
                src={`https://source.unsplash.com/400x300/?${encodeURIComponent(item.name + ' ' + item.image_keyword)}`}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&fit=crop";
                }}
              />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-purple-300 text-xs font-bold px-2 py-1 rounded-full">
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
                  </div>
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
    </div>
  );
}

export default function AttractionsClientPage({ citySlug, attractionsData, initialLang, langCode }: Props) {
  const router = useRouter();

  const handleLanguageChange = (code: string) => {
    router.push(`/attractions/${code}/${citySlug}`);
  };

  return (
    <GlobalLayout initialLanguage={initialLang} onLanguageChange={handleLanguageChange}>
      <AttractionsContent citySlug={citySlug} attractionsData={attractionsData} initialLang={initialLang} langCode={langCode} />
    </GlobalLayout>
  );
}
