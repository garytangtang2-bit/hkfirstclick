import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SUPPORTED_LANG_CODES, DEFAULT_LANG_CODE } from "@/utils/langMapping";

// Helper to pick the best language from Accept-Language header
function pickLang(acceptLanguage: string, supported: string[]): string | null {
  if (!acceptLanguage) return null;
  const langs = acceptLanguage.split(",").map((lang) => lang.split(";")[0].trim().toLowerCase());
  for (const lang of langs) {
    if (supported.includes(lang)) return lang;
    // Check for language family match (e.g., "zh-TW" -> "zh")
    const langFamily = lang.split("-")[0];
    if (supported.includes(langFamily)) return langFamily;
  }
  return null;
}

export default async function CatalogRedirect() {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";
  const lang = pickLang(acceptLanguage, SUPPORTED_LANG_CODES) || DEFAULT_LANG_CODE;
  // Redirect to new nested route structure with route group
  redirect(`/catalog/${lang}`);
}
