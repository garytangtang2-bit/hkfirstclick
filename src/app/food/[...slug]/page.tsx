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

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...Object.fromEntries(
          SUPPORTED_LANG_CODES.map((l) => [l, `https://www.hkfirstclick.com/food/${l}/${citySlug}`])
        ),
        "x-default": `https://www.hkfirstclick.com/food/en/${citySlug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "HKfirstclick",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
                "ratingCount": 100,
              },
            },
          })),
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": `What is the best food to eat in ${citySlug}?`,
              "acceptedAnswer": { "@type": "Answer", "text": translation?.page_intro ?? "" },
            },
            {
              "@type": "Question",
              "name": `Where can I find the best restaurants in ${citySlug}?`,
              "acceptedAnswer": { "@type": "Answer", "text": items.slice(0, 3).map((i: any) => i.name).join(", ") + " are among the top-rated dining options." },
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
  return [];
}
