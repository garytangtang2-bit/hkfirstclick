'use client';

import { useEffect } from 'react';

// Arabic is the only RTL language in the supported set
const RTL_LOCALES = new Set(['ar']);

// Map BCP 47 locale codes to full html lang values where they differ
const LOCALE_TO_HTML_LANG: Record<string, string> = {
    zh: 'zh-TW',
};

interface LangSetupProps {
    lang: string;
}

/**
 * Sets <html lang="…"> and <html dir="…"> on the client after hydration.
 * This is a zero-render component — it returns null and only runs a side-effect.
 *
 * We need a client component because the root layout owns the <html> element
 * and nested server layouts cannot mutate it directly.
 */
export default function LangSetup({ lang }: LangSetupProps) {
    useEffect(() => {
        const htmlLang = LOCALE_TO_HTML_LANG[lang] ?? lang;
        const dir = RTL_LOCALES.has(lang) ? 'rtl' : 'ltr';

        document.documentElement.setAttribute('lang', htmlLang);
        document.documentElement.setAttribute('dir', dir);
    }, [lang]);

    return null;
}
