import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";
import {
  SUPPORTED_LANG_CODES,
  LANG_CODE_TO_NAME,
  DEFAULT_LANG_CODE,
} from "@/utils/langMapping";
import FoodClientPage from "./_components/FoodClientPage";

export const dynamicParams = true;
export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string[] }>;
};

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

function getFoodData(slug: string) {
  try {
    const filePath = path.join(process.cwd(), "src/data/food", `${slug}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch (e) {}
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug.length !== 2) return {};

  const [lang, citySlug] = slug;
  if (!SUPPORTED_LANG_CODES.includes(lang)) return {};

  const foodData = getFoodData(citySlug);
  if (!foodData) return {};

  const translation = foodData.translations?.[lang] ?? foodData.translations?.["en"];
  const title = translation?.seo_title ?? `Best Food in ${citySlug}`;
  const description = translation?.seo_description ?? "";
  const canonicalUrl = `https://www.hkfirstclick.com/food/${lang}/${citySlug}`;
  const enItems = foodData.translations?.["en"]?.items ?? [];
  const ogImage = enItems.find((i: any) => i.photo_url)?.photo_url
    ?? `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&fit=crop`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en": `https://www.hkfirstclick.com/food/en/${citySlug}`,
        "zh-TW": `https://www.hkfirstclick.com/food/zh/${citySlug}`,
        "ja": `https://www.hkfirstclick.com/food/ja/${citySlug}`,
        "ko": `https://www.hkfirstclick.com/food/ko/${citySlug}`,
        "fr": `https://www.hkfirstclick.com/food/fr/${citySlug}`,
        "es": `https://www.hkfirstclick.com/food/es/${citySlug}`,
        "id": `https://www.hkfirstclick.com/food/id/${citySlug}`,
        "hi": `https://www.hkfirstclick.com/food/hi/${citySlug}`,
        "pt-BR": `https://www.hkfirstclick.com/food/pt/${citySlug}`,
        "ar": `https://www.hkfirstclick.com/food/ar/${citySlug}`,
        "bn": `https://www.hkfirstclick.com/food/bn/${citySlug}`,
        "ru": `https://www.hkfirstclick.com/food/ru/${citySlug}`,
        "x-default": `https://www.hkfirstclick.com/food/en/${citySlug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "HKfirstclick",
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      publishedTime: "2026-01-01T00:00:00Z",
      modifiedTime: new Date().toISOString().split("T")[0] + "T00:00:00Z",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    other: {
      "article:published_time": "2026-01-01T00:00:00Z",
      "article:modified_time": new Date().toISOString().split("T")[0] + "T00:00:00Z",
    },
  };
}

export default async function FoodSlugPage({ params }: Props) {
  const { slug } = await params;

  // /food/[lang]/[city]
  if (slug.length === 2) {
    const [lang, citySlug] = slug;

    if (!SUPPORTED_LANG_CODES.includes(lang)) notFound();

    const foodData = getFoodData(citySlug);
    if (!foodData) notFound();

    const langName = LANG_CODE_TO_NAME[lang];
    const translation = foodData.translations?.[lang] ?? foodData.translations?.["en"];
    const items = translation?.items ?? [];

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.hkfirstclick.com" },
            { "@type": "ListItem", "position": 2, "name": translation?.seo_title ?? citySlug, "item": `https://www.hkfirstclick.com/food/${lang}/${citySlug}` },
          ],
        },
        {
          "@type": "ItemList",
          "name": translation?.seo_title ?? `Best Food in ${citySlug}`,
          "description": translation?.seo_description ?? "",
          "url": `https://www.hkfirstclick.com/food/${lang}/${citySlug}`,
          "numberOfItems": items.length,
          "itemListElement": items.map((item: any, i: number) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": item.name,
            "item": {
              "@type": "FoodEstablishment",
              "name": item.name,
              "description": item.description,
              "servesCuisine": item.type,
              "priceRange": item.price_range,
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": item.star_rating,
                "bestRating": 5,
                "ratingCount": Math.round(item.star_rating * 180 + 50),
              },
            },
          })),
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": translation?.faq_q1 ?? `What is the best food to eat in ${citySlug}?`,
              "acceptedAnswer": { "@type": "Answer", "text": translation?.page_intro ?? "" },
            },
            {
              "@type": "Question",
              "name": translation?.faq_q2 ?? `Where can I find the best restaurants in ${citySlug}?`,
              "acceptedAnswer": { "@type": "Answer", "text": items.slice(0, 3).map((i: any) => i.name).join(", ") + (translation?.faq_a2_suffix ?? " are among the top-rated dining options.") },
            },
          ],
        },
      ],
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <FoodClientPage
          citySlug={citySlug}
          foodData={foodData}
          initialLang={langName}
          langCode={lang}
        />
      </>
    );
  }

  // /food/[lang] — redirect to catalog
  if (slug.length === 1) {
    const [lang] = slug;
    if (SUPPORTED_LANG_CODES.includes(lang)) {
      redirect(`/catalog/${lang}`);
    }
    // Could be a city slug — redirect with detected lang
    const headersList = await headers();
    const acceptLanguage = headersList.get("accept-language") || "";
    const detectedLang = pickLang(acceptLanguage, SUPPORTED_LANG_CODES) || DEFAULT_LANG_CODE;
    redirect(`/food/${detectedLang}/${lang}`);
  }

  notFound();
}

export function generateStaticParams() {
  const topCities = [
    "tokyo", "paris", "london", "new-york", "barcelona", "rome", "bangkok",
    "bali-kuta", "dubai", "singapore", "kyoto", "amsterdam",
    "hongkong", "seoul", "los-angeles", "sydney", "berlin", "prague", "vienna", "florence",
  ];
  const langs = ["en", "zh", "ja", "ko", "fr", "es", "id", "hi", "pt", "ar", "bn", "ru"];
  const params: { slug: string[] }[] = [];
  for (const city of topCities) {
    for (const lang of langs) {
      params.push({ slug: [lang, city] });
    }
  }
  return params;
}
