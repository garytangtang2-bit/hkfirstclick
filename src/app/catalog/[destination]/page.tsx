import { Metadata, ResolvingMetadata } from 'next';
import { getCityIdFromSlug, getTranslatedCityName, getTranslatedData } from "@/utils/cityTranslations";
import DestinationClientPage from "./DestinationClientPage";
import { notFound } from "next/navigation";

// Next.js params typing for dynamic routes
type Props = {
    params: Promise<{ destination: string }>;
};

// Generate dynamic SEO metadata server-side based on the URL slug
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { destination } = await params;
    const slug = destination;
    const cityId = getCityIdFromSlug(slug);

    if (!cityId) {
        return {
            title: "Destination Not Found | HKfirstclick",
            description: "The requested travel destination could not be found."
        };
    }

    // Default SEO text using English and Traditional Chinese for maximum reach
    // (Actual page UI language depends on user preference via Context/Cookies)
    const enName = getTranslatedCityName(cityId, "English");
    const twName = getTranslatedCityName(cityId, "繁體中文");
    const enDesc = getTranslatedData(cityId, "description", "English");

    return {
        title: `${twName} ${enName} 3 Days Itinerary | HKfirstclick`,
        description: `Explore the best 3-day itinerary for ${enName} (${twName}). ${enDesc}. Create and customize your perfect trip.`,
        openGraph: {
            title: `${twName} ${enName} 3 Days Itinerary | HKfirstclick`,
            description: `Explore the best 3-day itinerary for ${enName} (${twName}). ${enDesc}.`,
            type: "article",
        }
    };
}

// Server Component wrapper
export default async function DestinationPage({ params }: Props) {
    const { destination } = await params;
    const slug = destination;
    const cityId = getCityIdFromSlug(slug);

    if (!cityId) {
        notFound();
    }

    return <DestinationClientPage cityId={cityId} />;
}
