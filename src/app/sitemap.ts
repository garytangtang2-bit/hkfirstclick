import { MetadataRoute } from 'next'

const CITY_SLUGS = [
  'amsterdam', 'athens', 'auckland', 'bali-kuta', 'bangkok', 'barcelona',
  'berlin', 'brussels', 'buenos-aires', 'cairo', 'cape-town', 'chicago',
  'copenhagen', 'dubai', 'edinburgh', 'florence', 'fukuoka', 'hakone',
  'ho-chi-minh-city', 'hongkong', 'kuala-lumpur', 'kyoto', 'las-vegas',
  'lisbon', 'london', 'los-angeles', 'madrid', 'marrakesh', 'melbourne',
  'miami', 'munich', 'new-york', 'nice', 'okinawa', 'osaka', 'paris',
  'prague', 'reykjavik', 'rio-de-janeiro', 'rome', 'san-francisco',
  'santorini', 'sapporo', 'seattle', 'seoul', 'singapore', 'stockholm',
  'sydney', 'taipei', 'tokyo', 'toronto', 'venice', 'vienna', 'zurich',
]

const LOCALES = ['en', 'zh', 'ja', 'ko', 'fr', 'es', 'id', 'hi', 'pt', 'ar', 'bn', 'ru']

const BASE_URL = 'https://www.hkfirstclick.com'
const NOW = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Homepage
  entries.push({ url: BASE_URL, lastModified: NOW, changeFrequency: 'weekly', priority: 1.0 })

  // Core pages
  const corePages = [
    { path: '/workspace', priority: 0.9, freq: 'weekly' as const },
    { path: '/catalog', priority: 0.9, freq: 'weekly' as const },
    { path: '/map', priority: 0.8, freq: 'weekly' as const },
    { path: '/pricing', priority: 0.8, freq: 'monthly' as const },
    { path: '/about', priority: 0.6, freq: 'monthly' as const },
    { path: '/contact', priority: 0.5, freq: 'monthly' as const },
    { path: '/privacy', priority: 0.4, freq: 'yearly' as const },
    { path: '/terms', priority: 0.4, freq: 'yearly' as const },
  ]

  corePages.forEach(({ path, priority, freq }) => {
    entries.push({ url: `${BASE_URL}${path}`, lastModified: NOW, changeFrequency: freq, priority })
  })

  // Catalog with language prefix — highest SEO value
  LOCALES.forEach(locale => {
    entries.push({
      url: `${BASE_URL}/catalog/${locale}`,
      lastModified: NOW,
      changeFrequency: 'weekly',
      priority: 0.85,
    })
  })

  // All 54 city × 12 language destination pages — core content
  LOCALES.forEach(locale => {
    CITY_SLUGS.forEach(city => {
      entries.push({
        url: `${BASE_URL}/catalog/${locale}/${city}`,
        lastModified: NOW,
        changeFrequency: 'monthly',
        priority: 0.95,
      })
    })
  })

  // Food pages — 54 cities × 12 languages
  LOCALES.forEach(locale => {
    CITY_SLUGS.forEach(city => {
      entries.push({
        url: `${BASE_URL}/food/${locale}/${city}`,
        lastModified: NOW,
        changeFrequency: 'monthly',
        priority: 0.85,
      })
    })
  })

  // Attractions pages — 54 cities × 12 languages
  LOCALES.forEach(locale => {
    CITY_SLUGS.forEach(city => {
      entries.push({
        url: `${BASE_URL}/attractions/${locale}/${city}`,
        lastModified: NOW,
        changeFrequency: 'monthly',
        priority: 0.85,
      })
    })
  })

  return entries
}
