"use client";

import CatalogLangPage from "./CatalogLangPage";

interface CatalogLangPageWrapperProps {
  initialLang: string;
  langCode: string;
}

// Client component wrapper - passes props to child client component
export default function CatalogLangPageWrapper({
  initialLang,
  langCode,
}: CatalogLangPageWrapperProps) {
  return <CatalogLangPage initialLang={initialLang} langCode={langCode} />;
}
