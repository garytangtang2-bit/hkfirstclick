export interface ItineraryActivity {
  time_slot: string;
  spot_name: string;
  image_search_keyword: string;
  rich_description: string;
  practical_tip: string;
}

export interface ItineraryDay {
  day: number;
  day_title: string;
  activities: ItineraryActivity[];
}

export interface HeroSection {
  hook_intro: string;
  hero_image_keyword: string;
}

export interface SeoMeta {
  title: string;
  description: string;
}

export interface DestinationItinerary {
  seo_meta: SeoMeta;
  hero_section: HeroSection;
  daily_itinerary: ItineraryDay[];
}
