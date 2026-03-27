"use client";

import { useParams } from "next/navigation";
import GlobalLayout from "@/components/GlobalLayout";
import { LANG_CODE_TO_NAME } from "@/utils/langMapping";
import { PricingContent } from "@/app/pricing/page";

export default function LangPricingPage() {
    const params = useParams();
    const lang = typeof params.lang === "string" ? params.lang : "en";
    const initialLanguage = LANG_CODE_TO_NAME[lang] || "English";
    return (
        <GlobalLayout initialLanguage={initialLanguage}>
            <PricingContent />
        </GlobalLayout>
    );
}
