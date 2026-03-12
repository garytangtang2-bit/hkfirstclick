import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import fs from 'fs';
import path from 'path';

// Define the 12 supported language codes
const supportedLanguages = ['en', 'zh', 'ja', 'ko', 'fr', 'es', 'id', 'hi', 'pt', 'ar', 'bn', 'ru'];



export default async function DestinationRootRedirect({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || 'en';

    let targetLang = 'en'; // default

    // Match accept-language against our supported languages
    // The accept-language string looks like: zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7
    for (const lang of supportedLanguages) {
        // Simple string parsing. Works efficiently for top-level language codes
        if (acceptLanguage.includes(lang)) {
            // Priority edge cases
            if (acceptLanguage.indexOf(lang) < acceptLanguage.indexOf(targetLang) || targetLang === 'en') {
                targetLang = lang;
            }
        }
    }

    // Force 307 temporary redirect to the fully localized SSG page
    redirect(`/destinations/${slug}/${targetLang}`);
}
