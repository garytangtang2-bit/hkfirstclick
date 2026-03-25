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
import AttractionsClientPage from "./_components/AttractionsClientPage";

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

function getAttractionsData(slug: string) {
  try {
    const filePath = path.join(process.cwd(), "src/data/attractions", `${slug}.json`);
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

  const attractionsData = getAttractionsData(citySlug);
  if (!attractionsData) return {};

  const translation = attractionsData.translations?.[lang] ?? attractionsData.translations?.["en"];
  const title = translation?.seo_title ?? `Top Attractions in ${citySlug}`;
  const description = translation?.seo_description ?? "";
  const canonicalUrl = `https://www.hkfirstclick.com/attractions/${lang}/${citySlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...Object.fromEntries(
          SUPPORTED_LANG_CODES.map((l) => [l, `https://www.hkfirstclick.com/attractions/${l}/${citySlug}`])
        ),
        "x-default": `https://www.hkfirstclick.com/attractions/en/${citySlug}`,
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

export default async function AttractionsSlugPage({ params }: Props) {
  const { slug } = await params;

  // /attractions/[lang]/[city]
  if (slug.length === 2) {
    const [lang, citySlug] = slug;

    if (!SUPPORTED_LANG_CODES.includes(lang)) notFound();

    const attractionsData = getAttractionsData(citySlug);
    if (!attractionsData) notFound();

    const langName = LANG_CODE_TO_NAME[lang];

    return (
      <AttractionsClientPage
        citySlug={citySlug}
        attractionsData={attractionsData}
        initialLang={langName}
        langCode={lang}
      />
    );
  }

  // /attractions/[lang] or /attractions/[city] — redirect
  if (slug.length === 1) {
    const [segment] = slug;
    if (SUPPORTED_LANG_CODES.includes(segment)) {
      redirect(`/catalog/${segment}`);
    }
    const headersList = await headers();
    const acceptLanguage = headersList.get("accept-language") || "";
    const detectedLang = pickLang(acceptLanguage, SUPPORTED_LANG_CODES) || DEFAULT_LANG_CODE;
    redirect(`/attractions/${detectedLang}/${segment}`);
  }

  notFound();
}

export function generateStaticParams() {
  return [];
}
