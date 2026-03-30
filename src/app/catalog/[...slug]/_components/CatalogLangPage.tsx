"use client";

import { useState, useEffect } from "react";
import GlobalLayout from "@/components/GlobalLayout";
import { useAppContext } from "@/components/AppContext";
import { MapPin, Navigation, Search, Utensils, Landmark, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cityPhotos } from "@/data/cityPhotos";
import {
  getTranslatedCityName,
  getCitySlug,
  getRecommendedDays,
} from "@/utils/cityTranslations";

interface CatalogLangPageProps {
  initialLang: string;
  langCode: string;
}

const TABS_TRANSLATIONS: Record<string, { catalog: string, food: string, attractions: string }> = {
  en: { catalog: 'Itineraries', food: 'Food', attractions: 'Attractions' },
  zh: { catalog: '行程', food: '美食', attractions: '景點' },
  ja: { catalog: 'プラン', food: 'グルメ', attractions: '観光スポット' },
  ko: { catalog: '여행 일정', food: '맛집', attractions: '명소' },
  fr: { catalog: 'Itinéraires', food: 'Gastronomie', attractions: 'Attractions' },
  es: { catalog: 'Itinerarios', food: 'Comida', attractions: 'Atracciones' },
  id: { catalog: 'Itinerari', food: 'Kuliner', attractions: 'Atraksi' },
  hi: { catalog: 'यात्रा कार्यक्रम', food: 'भोजन', attractions: 'आकर्षण' },
  pt: { catalog: 'Roteiros', food: 'Gastronomia', attractions: 'Atrações' },
  ar: { catalog: 'مسارات', food: 'طعام', attractions: 'معالم' },
  bn: { catalog: 'ভ্রমণপথ', food: 'খাবার', attractions: 'আকর্ষণ' },
  ru: { catalog: 'Маршруты', food: 'Еда', attractions: 'Достопримечательности' },
};

const MODE_CONTENT: Record<string, Record<string, string>> = {
  en: {
    cat_head: 'AI Travel Itinerary — Curated Destinations',
    cat_desc: 'Browse our AI-generated day-by-day travel guides for top destinations worldwide. Each itinerary includes curated spots and practical tips — tailored to your language and travel style.',
    food_head: 'AI Food Guide — Best Local Eats',
    food_desc: 'Discover the best street food, local delicacies, and highly-rated restaurants tailored to your taste in the world’s most exciting cities.',
    attr_head: 'Top Attractions & Landmarks',
    attr_desc: 'Explore the must-see landmarks, hidden gems, and iconic sights. Find ticket info and practical visiting tips for your trip.',
    search_placeholder: 'Search destinations...',
    days_label: 'Days',
    food_label: 'Local Eats',
    attr_label: 'Top Spots'
  },
  zh: {
    cat_head: 'AI 行程規劃 — 精選旅遊指南',
    cat_desc: '探索由 AI 生成的每日旅遊行程，涵蓋全球熱門目的地。為您提供專屬語言與旅遊風格的景點推薦和實用建議。',
    food_head: 'AI 美食指南 — 探索在地美味',
    food_desc: '為您量身打造，發掘全球最迷人城市中的最佳街頭小吃、當地特色美食和高評價餐廳。',
    attr_head: '熱門景點與地標',
    attr_desc: '探索必訪地標、隱藏秘境和標誌性景點。獲取旅途所需的門票資訊與實用參觀建議。',
    search_placeholder: '搜尋目的地...',
    days_label: '天',
    food_label: '在地美食',
    attr_label: '熱門景點'
  },
  ja: {
    cat_head: 'AI 旅程計画 — 厳選された目的地',
    cat_desc: 'AIが生成した世界中の人気観光地向け日別トラベルガイドをご覧ください。各言語と旅行スタイルに合わせたおすすめスポットと実用的なヒントが含まれています。',
    food_head: 'AI グルメガイド — 最高のご当地グルメ',
    food_desc: '世界で最も魅力的な都市で、あなたの好みに合わせた最高の屋台の食べ物、地元の珍味、高評価のレストランを発見してください。',
    attr_head: '人気観光スポットとランドマーク',
    attr_desc: '必見のランドマーク、隠れた名所、象徴的な名所を探索しましょう。旅行に向けたチケット情報と実用的な観光のヒントをご紹介します。',
    search_placeholder: '目的地を検索...',
    days_label: '日間',
    food_label: 'ご当地グルメ',
    attr_label: '人気スポット'
  },
  ko: {
    cat_head: 'AI 여행 일정 — 엄선된 목적지',
    cat_desc: '전 세계 인기 목적지를 위한 AI 생성 일일 여행 가이드를 살펴보세요. 귀하의 언어와 여행 스타일에 맞춘 추천 명소와 실용적인 팁이 포함되어 있습니다.',
    food_head: 'AI 맛집 가이드 — 최고의 현지 음식',
    food_desc: '세계에서 가장 매력적인 도시에서 귀하의 취향에 맞춘 최고의 길거리 음식, 현지 별미, 그리고 높은 평점을 받은 레스토랑을 발견해보세요.',
    attr_head: '최고의 명소 및 랜드마크',
    attr_desc: '필수 방문 랜드마크, 숨겨진 명소 및 상징적인 장소를 탐험하세요. 티켓 정보와 실용적인 방문 팁을 확인하세요.',
    search_placeholder: '목적지 검색...',
    days_label: '일',
    food_label: '현지 음식',
    attr_label: '인기 명소'
  },
  fr: {
    cat_head: 'Itinéraire avec l\'IA — Destinations',
    cat_desc: 'Parcourez nos guides de voyage générés par l\'IA. Chaque itinéraire comprend des lieux sélectionnés et des conseils pratiques.',
    food_head: 'Guide gastronomique — Spécialités',
    food_desc: 'Découvrez la meilleure cuisine de rue, les spécialités locales et les restaurants très bien notés, adaptés à vos goûts.',
    attr_head: 'Attractions principales',
    attr_desc: 'Explorez les monuments incontournables, les joyaux cachés et les sites emblématiques. Trouvez des informations sur les billets.',
    search_placeholder: 'Rechercher des destinations...',
    days_label: 'Jours',
    food_label: 'Spécialités locales',
    attr_label: 'Meilleurs sites'
  },
  es: {
    cat_head: 'Itinerario de viaje con IA',
    cat_desc: 'Descubre guías de viaje día a día generadas por IA de los mejores destinos. Cada itinerario incluye lugares recomendados y consejos.',
    food_head: 'Guía Gastronómica — Sabores Locales',
    food_desc: 'Descubre la mejor comida callejera, delicias locales y restaurantes destacados adaptados a tu gusto en las ciudades.',
    attr_head: 'Atracciones principales',
    attr_desc: 'Explora monumentos imprescindibles y lugares emblemáticos. Encuentra información de entradas y consejos prácticos.',
    search_placeholder: 'Buscar destinos...',
    days_label: 'Días',
    food_label: 'Comida Local',
    attr_label: 'Sitios populares'
  },
  id: {
    cat_head: 'Itinerary AI — Destinasi Pilihan',
    cat_desc: 'Jelajahi panduan wisata harian yang dibuat oleh AI untuk destinasi teratas di seluruh dunia. Disesuaikan dengan gaya perjalanan Anda.',
    food_head: 'Panduan Kuliner AI — Makanan Lokal',
    food_desc: 'Temukan makanan jalanan terbaik, hidangan khas setempat, dan restoran dengan peringkat tinggi yang disesuaikan dengan selera Anda.',
    attr_head: 'Atraksi & Landmark Utama',
    attr_desc: 'Jelajahi landmark wajib, permata tersembunyi, dan pemandangan ikonik. Temukan info tiket dan tips berkunjung praktis.',
    search_placeholder: 'Cari destinasi...',
    days_label: 'Hari',
    food_label: 'Kuliner',
    attr_label: 'Tempat Populer'
  },
  hi: {
    cat_head: 'AI यात्रा योजना — क्यूरेटेड गंतव्य',
    cat_desc: 'दुनिया भर के शीर्ष गंतव्यों के लिए हमारे AI-निर्मित यात्रा गाइड देखें। योजना में आपके लिए तैयार किए गए चयनित स्थान और सुझाव हैं।',
    food_head: 'AI भोजन गाइड — बेहतरीन व्यंजन',
    food_desc: 'दुनिया के सबसे रोमांचक शहरों में स्ट्रीट फूड, स्थानीय व्यंजनों और उच्च रेटिंग वाले रेस्तरां खोजें।',
    attr_head: 'शीर्ष आकर्षण और लैंडमार्क',
    attr_desc: 'जरूर देखे जाने वाले ऐतिहासिक स्थानों का अन्वेषण करें। अपनी यात्रा के लिए टिकट की जानकारी और उपयोगी सुझाव प्राप्त करें।',
    search_placeholder: 'गंतव्य खोजें...',
    days_label: 'दिन',
    food_label: 'स्थानीय भोजन',
    attr_label: 'शीर्ष स्थान'
  },
  pt: {
    cat_head: 'Roteiros com IA — Destinos Selecionados',
    cat_desc: 'Navegue por guias de viagem diários gerados por IA para os melhores destinos do mundo. Inclui pontos escolhidos e dicas práticas.',
    food_head: 'Guia Gastronômico — Comida Local',
    food_desc: 'Descubra a melhor comida de rua, iguarias locais e restaurantes conceituados, feitos à medida do seu gosto nas cidades.',
    attr_head: 'Principais Atrações e Pontos',
    attr_desc: 'Explore monumentos imperdíveis e turísticos icônicos. Encontre informações sobre ingressos e dicas práticas para sua viagem.',
    search_placeholder: 'Pesquisar destinos...',
    days_label: 'Dias',
    food_label: 'Comida Local',
    attr_label: 'Locais Top'
  },
  ar: {
    cat_head: 'مسارات سفر بالذكاء الاصطناعي',
    cat_desc: 'تصفح أدلة السفر اليومية التي تم إنشاؤها عبر الذكاء الاصطناعي لأفضل الوجهات. يشمل كل مسار أهم المعالم ونصائح عملية مصممة لك.',
    food_head: 'دليل الطعام — أفضل المأكولات',
    food_desc: 'اكتشف أفضل أطعمة الشوارع والأطباق المحلية اللذيذة والمطاعم ذات التقييم العالي المصممة لتناسب ذوقك في أفضل المدن.',
    attr_head: 'أبرز المعالم السياحية',
    attr_desc: 'استكشف المعالم البارزة التي يجب رؤيتها. ابحث عن معلومات التذاكر ونصائح الزيارة لرحلتك.',
    search_placeholder: 'البحث عن وجهات...',
    days_label: 'أيام',
    food_label: 'طعام محلي',
    attr_label: 'أهم الأماكن'
  },
  bn: {
    cat_head: 'AI ভ্রমণপথ — সেরা গন্তব্যসমূহ',
    cat_desc: 'বিশ্বের শীর্ষ গন্তব্যের জন্য আমাদের AI-জেনারেট করা ভ্রমণ গাইড ব্রাউজ করুন। আপনার ভাষা এবং ভ্রমণ শৈলীর জন্য উপযুক্ত টিপস অন্তর্ভুক্ত।',
    food_head: 'AI ফুড গাইড — সেরা খাবার',
    food_desc: 'আপনার স্বাদ অনুযায়ী সেরা স্ট্রিট ফুড, স্থানীয় খাবার এবং রেস্তোরাঁগুলি আবিষ্কার করুন৷',
    attr_head: 'শীর্ষ আকর্ষণ এবং ল্যান্ডমার্ক',
    attr_desc: 'দেখার মতো ল্যান্ডমার্ক এবং আইকনিক দর্শনীয় স্থানগুলি অন্বেষণ করুন৷ আপনার ভ্রমণের জন্য টিকিট তথ্য খুঁজুন৷',
    search_placeholder: 'গন্তব্য অনুসন্ধান...',
    days_label: 'দিন',
    food_label: 'স্থানীয় খাবার',
    attr_label: 'শীর্ষ স্থান'
  },
  ru: {
    cat_head: 'ИИ Путеводитель — Лучшие направления',
    cat_desc: 'Наши ежедневные путеводители от ИИ по лучшим направлениям мира. Включает тщательно отобранные места и практические советы.',
    food_head: 'ИИ Гастрономический гид',
    food_desc: 'Откройте для себя лучшую уличную еду, местные деликатесы и рестораны с высоким рейтингом.',
    attr_head: 'Главные достопримечательности',
    attr_desc: 'Исследуйте обязательные к посещению достопримечательности и знаковые места. Найдите информацию о билетах для поездки.',
    search_placeholder: 'Поиск направлений...',
    days_label: 'Дни',
    food_label: 'Местная еда',
    attr_label: 'Топ места'
  }
};

// Inner component - must be a child of AppProvider (provided by GlobalLayout)
function CatalogGrid({ initialLang, langCode }: CatalogLangPageProps) {
  const { language, setLanguage, t } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [exploreMode, setExploreMode] = useState<"catalog" | "food" | "attractions">("catalog");

  useEffect(() => {
    if (initialLang && initialLang !== language) {
      setLanguage(initialLang);
    }
  }, [initialLang, language, setLanguage]);

  const allCities = Object.keys(cityPhotos);
  const filteredCities = allCities.filter((cityId) => {
    const cityName = getTranslatedCityName(cityId, language).toLowerCase();
    return cityName.includes(searchTerm.toLowerCase());
  });

  const tMode = MODE_CONTENT[langCode] || MODE_CONTENT['en'];

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center">
      {/* SEO H1 + intro */}
      <div className="w-full max-w-3xl mx-auto mb-10 text-center transition-opacity duration-300">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 heading-premium">
          {exploreMode === 'catalog' && tMode.cat_head}
          {exploreMode === 'food' && tMode.food_head}
          {exploreMode === 'attractions' && tMode.attr_head}
        </h1>
        <p className="text-gray-400 text-base md:text-lg leading-relaxed">
          {exploreMode === 'catalog' && tMode.cat_desc}
          {exploreMode === 'food' && tMode.food_desc}
          {exploreMode === 'attractions' && tMode.attr_desc}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="w-full flex justify-center mb-8">
        <div className="flex bg-[#161616]/80 backdrop-blur-md border border-white/10 rounded-full p-1.5 shadow-xl relative overflow-hidden">
          {(["catalog", "food", "attractions"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setExploreMode(mode)}
              className={`relative px-6 py-2.5 rounded-full text-sm md:text-base font-bold flex items-center gap-2 transition-all duration-300 z-10 ${
                exploreMode === mode ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {exploreMode === mode && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full -z-10 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300" />
              )}
              {mode === 'catalog' && <Calendar size={18} className={exploreMode === mode ? "text-white" : "text-gray-500"} />}
              {mode === 'food' && <Utensils size={18} className={exploreMode === mode ? "text-white" : "text-gray-500"} />}
              {mode === 'attractions' && <Landmark size={18} className={exploreMode === mode ? "text-white" : "text-gray-500"} />}
              <span>{TABS_TRANSLATIONS[langCode]?.[mode] || TABS_TRANSLATIONS['en'][mode]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Section */}
      <div className="w-full max-w-3xl mx-auto mb-16 relative">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="text-gray-400 group-focus-within:text-purple-400 transition-colors" size={24} />
          </div>
          <input
            type="text"
            placeholder={tMode.search_placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#161616]/80 backdrop-blur-md text-white border border-white/10 rounded-full py-5 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors duration-150 shadow-lg text-lg placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Grid of Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {filteredCities.map((cityId, idx) => (
          <Link
            href={`/${exploreMode}/${langCode}/${getCitySlug(cityId)}?source=catalog`}
            key={idx}
            className="group relative h-64 md:h-72 rounded-3xl overflow-hidden block border border-white/5 hover:border-purple-500/50 transition-[transform,box-shadow,border-color] duration-300 will-change-transform hover:-translate-y-2 shadow-lg hover:shadow-[0_10px_40px_rgba(168,85,247,0.2)]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${cityPhotos[cityId]}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end h-full">
              <h3 className="text-2xl font-black text-white mb-1 flex items-center gap-2 drop-shadow-lg">
                <MapPin size={20} className="text-purple-400" />
                {getTranslatedCityName(cityId, language)}
              </h3>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                {exploreMode === 'catalog' && (
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs">
                    {getRecommendedDays(cityId)} {tMode.days_label}
                  </span>
                )}
                {exploreMode === 'food' && (
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <Utensils size={12} /> {tMode.food_label}
                  </span>
                )}
                {exploreMode === 'attractions' && (
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <Landmark size={12} /> {tMode.attr_label}
                  </span>
                )}
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/10">
              <Navigation size={18} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Outer component - provides AppProvider then renders GlobalLayout with CatalogGrid as child
export default function CatalogLangPage({ initialLang, langCode }: CatalogLangPageProps) {
  const router = useRouter();

  const handleLanguageChange = (code: string) => {
    router.push(`/catalog/${code}`);
  };

  return (
    <GlobalLayout onLanguageChange={handleLanguageChange} initialLanguage={initialLang}>
      <CatalogGrid initialLang={initialLang} langCode={langCode} />
    </GlobalLayout>
  );
}
