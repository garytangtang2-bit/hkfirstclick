import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

// Skip static generation for catalog pages - render dynamically
export const dynamicParams = true;
import { headers } from "next/headers";
import {
  SUPPORTED_LANG_CODES,
  LANG_CODE_TO_NAME,
  DEFAULT_LANG_CODE,
} from "@/utils/langMapping";
import { getCityIdFromSlug } from "@/utils/cityTranslations";
import CatalogLangPageWrapper from "./_components/CatalogLangPageWrapper";
import DestinationClientPage from "./_components/DestinationClientPage";

type Props = {
  params: Promise<{ slug: string[] }>;
};

// Helper to pick lang from Accept-Language header
function pickLang(acceptLanguage: string, supported: string[]): string | null {
  if (!acceptLanguage) return null;
  const langs = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().toLowerCase());
  for (const lang of langs) {
    if (supported.includes(lang)) return lang;
    const langFamily = lang.split("-")[0];
    if (supported.includes(langFamily)) return langFamily;
  }
  return null;
}

// Get rich data helper
const getRichItinerary = (slug: string) => {
  try {
    const fs = require("fs");
    const path = require("path");
    const filePath = path.join(
      process.cwd(),
      "src/data/destinations",
      `${slug}.json`
    );
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(fileContent);
    }
  } catch (e) {}
  return null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Case: /catalog/[lang] — language listing page
  if (slug.length === 1) {
    const lang = slug[0];
    if (!SUPPORTED_LANG_CODES.includes(lang)) return {};

    const langNames: Record<string, string> = {
      en: 'English', zh: '繁體中文', ja: '日本語', ko: '한국어',
      fr: 'Français', es: 'Español', id: 'Bahasa Indonesia',
      hi: 'हिन्दी', pt: 'Português', ar: 'العربية', bn: 'বাংলা', ru: 'Русский',
    };
    const langTitles: Record<string, string> = {
      en: 'AI Travel Itinerary Catalog — 54 Destinations | HKfirstclick',
      zh: 'AI 旅行行程目錄 — 54 個目的地 | HKfirstclick',
      ja: 'AI 旅行プランカタログ — 54 の目的地 | HKfirstclick',
      ko: 'AI 여행 일정 카탈로그 — 54개 여행지 | HKfirstclick',
      fr: 'Catalogue d\'itinéraires IA — 54 destinations | HKfirstclick',
      es: 'Catálogo de itinerarios IA — 54 destinos | HKfirstclick',
      id: 'Katalog Itinerari AI — 54 Destinasi | HKfirstclick',
      hi: 'AI यात्रा कार्यक्रम कैटलॉग — 54 गंतव्य | HKfirstclick',
      pt: 'Catálogo de roteiros IA — 54 destinos | HKfirstclick',
      ar: 'كتالوج البرامج السياحية — 54 وجهة | HKfirstclick',
      bn: 'AI ভ্রমণ পরিকল্পনা ক্যাটালগ — 54টি গন্তব্য | HKfirstclick',
      ru: 'Каталог маршрутов с ИИ — 54 направления | HKfirstclick',
    };
    const langDescs: Record<string, string> = {
      en: 'Browse AI-generated day-by-day travel guides for 54 top destinations worldwide. Free itineraries in English with curated spots, tips, and flight suggestions.',
      zh: '瀏覽全球 54 個頂級目的地的 AI 逐日旅遊攻略。繁體中文版行程，含精選景點、實用建議與航班推薦。',
      ja: '世界54か所のトップ目的地向けAI日程別旅行ガイドをご覧ください。日本語版プランで厳選スポット・ヒント・フライト提案付き。',
      ko: '전 세계 54개 주요 여행지의 AI 일별 여행 가이드를 확인하세요. 한국어 일정에 엄선된 명소, 팁, 항공편 제안 포함.',
      fr: 'Parcourez les guides de voyage IA pour 54 destinations mondiales. Itinéraires en français avec lieux sélectionnés, conseils et suggestions de vols.',
      es: 'Explora guías de viaje IA para 54 destinos top en todo el mundo. Itinerarios en español con lugares seleccionados, consejos y sugerencias de vuelos.',
      id: 'Jelajahi panduan perjalanan AI untuk 54 destinasi terbaik dunia. Itinerari Bahasa Indonesia lengkap dengan tempat pilihan, tips, dan saran penerbangan.',
      hi: 'दुनिया के 54 शीर्ष गंतव्यों के लिए AI यात्रा गाइड देखें। हिंदी में यात्रा कार्यक्रम, चुनिंदा स्थान, सुझाव और फ्लाइट जानकारी सहित।',
      pt: 'Navegue pelos guias de viagem IA para 54 destinos top do mundo. Roteiros em português com pontos selecionados, dicas e sugestões de voos.',
      ar: 'تصفح أدلة السفر بالذكاء الاصطناعي لـ 54 وجهة عالمية. برامج سياحية بالعربية مع أماكن مختارة ونصائح واقتراحات رحلات.',
      bn: 'বিশ্বের 54টি শীর্ষ গন্তব্যের জন্য AI ভ্রমণ গাইড দেখুন। বাংলায় ভ্রমণ পরিকল্পনা, বাছাই করা স্থান ও ফ্লাইট পরামর্শ সহ।',
      ru: 'Просматривайте ИИ-путеводители по 54 лучшим направлениям мира. Маршруты на русском с отобранными местами, советами и предложениями рейсов.',
    };

    const canonicalUrl = `https://www.hkfirstclick.com/catalog/${lang}`;
    const title = langTitles[lang] ?? langTitles['en'];
    const description = langDescs[lang] ?? langDescs['en'];

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          "en": "https://www.hkfirstclick.com/catalog/en",
          "zh-TW": "https://www.hkfirstclick.com/catalog/zh",
          "ja": "https://www.hkfirstclick.com/catalog/ja",
          "ko": "https://www.hkfirstclick.com/catalog/ko",
          "fr": "https://www.hkfirstclick.com/catalog/fr",
          "es": "https://www.hkfirstclick.com/catalog/es",
          "id": "https://www.hkfirstclick.com/catalog/id",
          "hi": "https://www.hkfirstclick.com/catalog/hi",
          "pt-BR": "https://www.hkfirstclick.com/catalog/pt",
          "ar": "https://www.hkfirstclick.com/catalog/ar",
          "bn": "https://www.hkfirstclick.com/catalog/bn",
          "ru": "https://www.hkfirstclick.com/catalog/ru",
          "x-default": "https://www.hkfirstclick.com/catalog/en",
        },
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'HKfirstclick',
        type: 'website',
        images: [{ url: 'https://www.hkfirstclick.com/og-image.png', width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['https://www.hkfirstclick.com/og-image.png'],
      },
    };
  }

  if (slug.length !== 2) return {};

  const [lang, destination] = slug;
  if (!SUPPORTED_LANG_CODES.includes(lang)) return {};

  const richData = getRichItinerary(destination);
  if (!richData) return {};

  const activeTranslation = richData.translations?.[lang]
    ?? richData.translations?.['en']
    ?? richData;

  const title = activeTranslation?.seo_meta?.title ?? richData.seo_meta?.title ?? destination;
  const description = activeTranslation?.seo_meta?.description ?? richData.seo_meta?.description ?? '';
  const canonicalUrl = `https://www.hkfirstclick.com/catalog/${lang}/${destination}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en": `https://www.hkfirstclick.com/catalog/en/${destination}`,
        "zh-TW": `https://www.hkfirstclick.com/catalog/zh/${destination}`,
        "ja": `https://www.hkfirstclick.com/catalog/ja/${destination}`,
        "ko": `https://www.hkfirstclick.com/catalog/ko/${destination}`,
        "fr": `https://www.hkfirstclick.com/catalog/fr/${destination}`,
        "es": `https://www.hkfirstclick.com/catalog/es/${destination}`,
        "id": `https://www.hkfirstclick.com/catalog/id/${destination}`,
        "hi": `https://www.hkfirstclick.com/catalog/hi/${destination}`,
        "pt-BR": `https://www.hkfirstclick.com/catalog/pt/${destination}`,
        "ar": `https://www.hkfirstclick.com/catalog/ar/${destination}`,
        "bn": `https://www.hkfirstclick.com/catalog/bn/${destination}`,
        "ru": `https://www.hkfirstclick.com/catalog/ru/${destination}`,
        "x-default": `https://www.hkfirstclick.com/catalog/en/${destination}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'HKfirstclick',
      type: 'article',
      images: [{
        url: `https://www.hkfirstclick.com/api/og?destination=${destination}&lang=${lang}`,
        width: 1200,
        height: 630,
        alt: title,
      }],
      publishedTime: "2026-01-01T00:00:00Z",
      modifiedTime: new Date().toISOString().split("T")[0] + "T00:00:00Z",
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://www.hkfirstclick.com/api/og?destination=${destination}&lang=${lang}`],
    },
    other: {
      "article:published_time": "2026-01-01T00:00:00Z",
      "article:modified_time": new Date().toISOString().split("T")[0] + "T00:00:00Z",
    },
  };
}

export default async function CatalogSlugPage({ params }: Props) {
  const { slug } = await params;

  // Case 1: /catalog/[lang] - just language
  if (slug.length === 1) {
    const segment = slug[0];
    if (SUPPORTED_LANG_CODES.includes(segment)) {
      const langName = LANG_CODE_TO_NAME[segment];
      return <CatalogLangPageWrapper initialLang={langName} langCode={segment} />;
    }

    // Could be a city slug without language - redirect with lang
    const cityId = getCityIdFromSlug(segment);
    if (cityId) {
      const headersList = await headers();
      const acceptLanguage = headersList.get("accept-language") || "";
      const lang = pickLang(acceptLanguage, SUPPORTED_LANG_CODES) || DEFAULT_LANG_CODE;
      redirect(`/catalog/${lang}/${segment}`);
    }

    notFound();
  }

  // Case 2: /catalog/[lang]/[destination] - language + city
  if (slug.length === 2) {
    const [lang, destination] = slug;

    if (!SUPPORTED_LANG_CODES.includes(lang)) {
      notFound();
    }

    const cityId = getCityIdFromSlug(destination);
    if (!cityId) {
      notFound();
    }

    const langName = LANG_CODE_TO_NAME[lang];
    const richData = getRichItinerary(destination);

    // Build JSON-LD from the active translation or fallback to root-level data
    const activeTranslation = richData?.translations?.[lang]
      ?? richData?.translations?.['en']
      ?? richData;

    const buildJsonLd = () => {
      if (!richData) return null;

      const title = activeTranslation?.seo_meta?.title ?? richData.seo_meta?.title;
      const description = activeTranslation?.seo_meta?.description ?? richData.seo_meta?.description;
      const intro = activeTranslation?.hero_section?.hook_intro ?? richData.hero_section?.hook_intro;

      // Build ItemList of all activities across all days
      const allActivities: { position: number; name: string; description: string; tip: string }[] = [];
      const dailyItinerary = activeTranslation?.daily_itinerary ?? richData.daily_itinerary ?? [];
      let position = 1;
      for (const day of dailyItinerary) {
        for (const act of day.activities ?? []) {
          allActivities.push({
            position: position++,
            name: act.spot_name,
            description: act.rich_description,
            tip: act.practical_tip,
          });
        }
      }

      // Build FAQ from richData: days count + top spots from first 3 activities of each day
      const days = dailyItinerary.length;
      const topSpots = dailyItinerary
        .flatMap((day: any) => day.activities?.slice(0, 1).map((a: any) => a.spot_name) ?? [])
        .slice(0, 5)
        .join(', ');
      const cityLabel = title ?? destination;

      const faqItems = [
        {
          q: `How many days should I spend in ${cityLabel}?`,
          a: `We recommend ${days} days for ${cityLabel}. This itinerary covers ${days} full days of sightseeing, giving you enough time to explore the top attractions without feeling rushed.`,
        },
        {
          q: `What are the must-see spots in ${cityLabel}?`,
          a: `The top spots in ${cityLabel} include ${topSpots}. This itinerary visits all of these across ${days} days.`,
        },
        {
          q: `Is this ${cityLabel} itinerary suitable for first-time visitors?`,
          a: `Yes! This AI-generated ${cityLabel} itinerary is designed for first-time visitors. It covers the most iconic landmarks and local experiences, with practical tips for each stop.`,
        },
        {
          q: `Can I customize this ${cityLabel} itinerary?`,
          a: `Absolutely. Click the 'Generate AI Itinerary' button to clone this template to your workspace. You can then adjust dates, swap activities, add your flight details, and let the AI re-optimize the schedule for you.`,
        },
        {
          q: `What is the best time to visit ${cityLabel}?`,
          a: `The best time to visit ${cityLabel} depends on your preferences. Spring and autumn generally offer the most pleasant weather for sightseeing. Check our full itinerary for seasonal tips at each attraction.`,
        },
      ];

      return {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.hkfirstclick.com" },
              { "@type": "ListItem", "position": 2, "name": "Catalog", "item": `https://www.hkfirstclick.com/catalog/${lang}` },
              { "@type": "ListItem", "position": 3, "name": title, "item": `https://www.hkfirstclick.com/catalog/${lang}/${destination}` },
            ],
          },
          {
            "@type": "TouristDestination",
            "@id": `https://www.hkfirstclick.com/catalog/${lang}/${destination}#destination`,
            "name": title,
            "description": description ?? intro,
            "url": `https://www.hkfirstclick.com/catalog/${lang}/${destination}`,
            "touristType": "independent traveler",
            "includesAttraction": allActivities.map(a => ({
              "@type": "TouristAttraction",
              "name": a.name,
              "description": a.description,
            })),
          },
          {
            "@type": "FAQPage",
            "@id": `https://www.hkfirstclick.com/catalog/${lang}/${destination}#faq`,
            "mainEntity": faqItems.map(({ q, a }) => ({
              "@type": "Question",
              "name": q,
              "acceptedAnswer": { "@type": "Answer", "text": a },
            })),
          },
          {
            "@type": "Article",
            "@id": `https://www.hkfirstclick.com/catalog/${lang}/${destination}#article`,
            "headline": title,
            "description": description ?? intro,
            "url": `https://www.hkfirstclick.com/catalog/${lang}/${destination}`,
            "inLanguage": lang,
            "author": {
              "@type": "Organization",
              "name": "HKfirstclick",
              "url": "https://www.hkfirstclick.com",
            },
            "publisher": {
              "@type": "Organization",
              "name": "HKfirstclick",
              "url": "https://www.hkfirstclick.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.hkfirstclick.com/icon.png",
              },
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": title,
              "description": `Complete ${dailyItinerary.length}-day itinerary for ${destination}`,
              "numberOfItems": allActivities.length,
              "itemListElement": allActivities.map(a => ({
                "@type": "ListItem",
                "position": a.position,
                "name": a.name,
                "description": `${a.description} ${a.tip}`.trim(),
              })),
            },
          },
        ],
      };
    };

    const jsonLd = buildJsonLd();

    return (
      <>
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        <DestinationClientPage
          cityId={cityId}
          richData={richData}
          initialLang={langName}
          langCode={lang}
        />
      </>
    );
  }

  // Invalid path
  notFound();
}

// Skip static generation - catalog pages render dynamically
// This is necessary because AppContext hooks can't be called during SSG
export function generateStaticParams() {
  return [];
}
