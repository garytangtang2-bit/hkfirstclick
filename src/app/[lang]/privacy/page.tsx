"use client";

import { useParams } from "next/navigation";
import GlobalLayout from "@/components/GlobalLayout";
import { LANG_CODE_TO_NAME } from "@/utils/langMapping";
import { PrivacyContent } from "@/app/privacy/page";

export default function LangPrivacyPage() {
    const params = useParams();
    const lang = typeof params.lang === "string" ? params.lang : "en";
    const initialLanguage = LANG_CODE_TO_NAME[lang] || "English";
    return (
        <GlobalLayout initialLanguage={initialLanguage}>
            <PrivacyContent />
        </GlobalLayout>
    );
}
