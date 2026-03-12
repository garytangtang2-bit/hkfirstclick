import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import DestinationClientWrapper from './DestinationClientWrapper';

// Define the 12 supported language codes
const supportedLanguages = ['en', 'zh', 'ja', 'ko', 'fr', 'es', 'id', 'hi', 'pt', 'ar', 'bn', 'ru'];

// Helper to fetch valid destination slugs
function getDestinationSlugs() {
    const dataDir = path.join(process.cwd(), 'src/data/destinations');
    if (!fs.existsSync(dataDir)) return [];
    const files = fs.readdirSync(dataDir);
    return files.filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
}

// 1. generateStaticParams: Tells Next.js to pre-build 54 x 12 pages statically
export async function generateStaticParams() {
    const slugs = getDestinationSlugs();
    const params: { slug: string; lang: string }[] = [];

    for (const slug of slugs) {
        for (const lang of supportedLanguages) {
            params.push({ slug, lang });
        }
    }
    return params;
}

// 2. generateMetadata: Injects hreflang tags and standard SEO titles
export async function generateMetadata({ params }: { params: Promise<{ slug: string; lang: string }> }): Promise<Metadata> {
    const { slug, lang } = await params;

    // Load the specific json
    const dataDir = path.join(process.cwd(), 'src/data/destinations');
    const filePath = path.join(dataDir, `${slug}.json`);

    let destinationName = slug;
    if (fs.existsSync(filePath)) {
        try {
            const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (fileData[lang] && fileData[lang].destination) {
                destinationName = fileData[lang].destination;
            }
        } catch (e) {
            console.error(e);
        }
    }

    // Construct hreflang dictionary for alternate links
    const languages: Record<string, string> = {};
    supportedLanguages.forEach(l => {
        languages[l] = `https://hkfirstclick.com/destinations/${slug}/${l}`;
    });
    // x-default points to English
    languages['x-default'] = `https://hkfirstclick.com/destinations/${slug}/en`;

    return {
        title: `AI Trip to ${destinationName} | HKfirstclick Itineraries`,
        description: `Perfect AI-generated travel itinerary for ${destinationName}. Find the best attractions, hotels, and hidden gems with our premium planner.`,
        alternates: {
            canonical: `https://hkfirstclick.com/destinations/${slug}/${lang}`,
            languages
        }
    };
}

// 3. The Server Component Page
export default async function DestinationPage({ params }: { params: Promise<{ slug: string; lang: string }> }) {
    const { slug, lang } = await params;

    const dataDir = path.join(process.cwd(), 'src/data/destinations');
    const filePath = path.join(dataDir, `${slug}.json`);

    if (!fs.existsSync(filePath)) {
        return <div className="p-20 text-center text-white text-2xl">
            <h1>404 - Destination not found in database</h1>
            <p>DEBUG SLUG: {String(slug)}</p>
            <p>DEBUG LANG: {String(lang)}</p>
        </div>;
    }

    const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const itinerary = rawData[lang] || rawData['en'] || null;

    if (!itinerary) {
        return <div className="p-20 text-center text-white text-2xl">Itinerary not available in this language.</div>;
    }

    // JSON-LD Structured Data Schema for LLM / Google rich indexing
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Trip",
        "name": `${itinerary.destination} Itinerary`,
        "description": `A beautifully crafted AI travel itinerary for ${itinerary.destination} over ${itinerary.days?.length || 1} days.`,
        "itinerary": {
            "@type": "ItemList",
            "itemListElement": itinerary.days?.map((day: any, i: number) => ({
                "@type": "ListItem",
                "position": i + 1,
                "item": {
                    "@type": "TouristTrip",
                    "name": `Day ${i + 1}: ${day.theme || 'Exploration'}`,
                    "description": day.daySummary || ''
                }
            })) || []
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* We pass the pure JSON down to a Client component that acts identically to the workspace display */}
            <DestinationClientWrapper itinerary={itinerary} lang={lang} slug={slug} />
        </>
    );
}
