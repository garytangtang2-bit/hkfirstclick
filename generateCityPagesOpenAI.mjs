/**
 * generateCityPagesOpenAI.mjs
 * Uses OpenAI gpt-4o-mini to generate food + attractions data for all 54 cities
 * Split into 2 API calls per data type (6 langs each) to avoid token limits
 * Output: src/data/food/[slug].json and src/data/attractions/[slug].json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const OPENAI_API_KEY = envContent.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
if (!OPENAI_API_KEY) throw new Error('No OPENAI_API_KEY found');

const CITIES = [
  ['taipei','Taipei','台北'],['tokyo','Tokyo','東京'],['osaka','Osaka','大阪'],
  ['kyoto','Kyoto','京都'],['seoul','Seoul','首爾'],['hongkong','Hong Kong','香港'],
  ['singapore','Singapore','新加坡'],['bangkok','Bangkok','曼谷'],
  ['kuala-lumpur','Kuala Lumpur','吉隆坡'],['ho-chi-minh-city','Ho Chi Minh City','胡志明市'],
  ['bali-kuta','Bali','峇里島'],['paris','Paris','巴黎'],['london','London','倫敦'],
  ['rome','Rome','羅馬'],['barcelona','Barcelona','巴塞隆拿'],['madrid','Madrid','馬德里'],
  ['amsterdam','Amsterdam','阿姆斯特丹'],['berlin','Berlin','柏林'],['prague','Prague','布拉格'],
  ['vienna','Vienna','維也納'],['lisbon','Lisbon','里斯本'],['athens','Athens','雅典'],
  ['venice','Venice','威尼斯'],['florence','Florence','佛羅倫斯'],['nice','Nice','尼斯'],
  ['santorini','Santorini','聖托里尼'],['edinburgh','Edinburgh','愛丁堡'],
  ['stockholm','Stockholm','斯德哥爾摩'],['copenhagen','Copenhagen','哥本哈根'],
  ['munich','Munich','慕尼黑'],['brussels','Brussels','布魯塞爾'],['zurich','Zurich','蘇黎世'],
  ['reykjavik','Reykjavik','雷克雅維克'],['new-york','New York','紐約'],
  ['los-angeles','Los Angeles','洛杉磯'],['san-francisco','San Francisco','三藩市'],
  ['chicago','Chicago','芝加哥'],['miami','Miami','邁阿密'],['seattle','Seattle','西雅圖'],
  ['las-vegas','Las Vegas','拉斯維加斯'],['toronto','Toronto','多倫多'],
  ['dubai','Dubai','杜拜'],['cairo','Cairo','開羅'],['cape-town','Cape Town','開普敦'],
  ['marrakesh','Marrakesh','馬拉喀什'],['rio-de-janeiro','Rio de Janeiro','里約熱內盧'],
  ['buenos-aires','Buenos Aires','布宜諾斯艾利斯'],['sydney','Sydney','雪梨'],
  ['melbourne','Melbourne','墨爾本'],['auckland','Auckland','奧克蘭'],
  ['sapporo','Sapporo','札幌'],['fukuoka','Fukuoka','福岡'],
  ['hakone','Hakone','箱根'],['okinawa','Okinawa','沖繩'],
];

async function callOpenAI(prompt, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 16000,
          response_format: { type: 'json_object' },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.choices?.[0]?.message?.content || '';
      return JSON.parse(text);
    } catch (e) {
      if (attempt === retries) throw e;
      process.stdout.write(`(retry${attempt})...`);
      await new Promise(r => setTimeout(r, 3000 * attempt));
    }
  }
}

// Build food prompt for a specific set of languages
// Pass items from the EN call to ensure consistency in translated calls
function buildFoodPromptPart1(citySlug, cityEn, cityZh) {
  return `You are a travel content expert. Generate a food guide JSON for ${cityEn} (${cityZh}).

Return a JSON object with this EXACT structure:
{
  "city_slug": "${citySlug}",
  "items_base": [
    {
      "id": "unique-slug",
      "type": "restaurant|street_food|night_market|cafe|bar",
      "image_keyword": "descriptive keyword for Unsplash",
      "star_rating": 4.5,
      "price_range": "$|$$|$$$",
      "must_try": "signature dish",
      "klook_query": "Klook search term"
    }
  ],
  "translations": {
    "en": {
      "seo_title": "Best Food in ${cityEn} 2026 — Top Restaurants & Street Food Guide",
      "seo_description": "Discover the best restaurants, street food and local specialties in ${cityEn}. From budget eats to fine dining — with booking links.",
      "page_intro": "2-3 sentences about ${cityEn} food culture (around 100 words)",
      "items": [ { "id": "same-slug-as-above", "name": "...", "description": "..." } ]
    },
    "zh": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Traditional Chinese name", "description": "Traditional Chinese description" } ] },
    "ja": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Japanese name", "description": "Japanese description" } ] },
    "ko": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Korean name", "description": "Korean description" } ] },
    "fr": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "French name", "description": "French description" } ] },
    "es": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Spanish name", "description": "Spanish description" } ] }
  }
}

Requirements:
- EXACTLY 8 items
- Mix: 2-3 street food/night markets, 2-3 well-known restaurants, 1-2 local specialty spots
- All names must be REAL, verifiable places that actually exist in ${cityEn}
- star_rating between 4.2 and 4.9
- price_range must reflect actual cost level
- must_try must be the real signature dish
- Translations must be natural and accurate`;
}

function buildFoodPromptPart2(citySlug, cityEn, cityZh, itemsBase, enItems) {
  const itemsList = itemsBase.map((item, i) => `${i+1}. id: "${item.id}", name (EN): "${enItems[i]?.name}"`).join('\n');
  return `You are a travel content expert. Translate the following ${cityEn} food guide items into 6 languages.

The items to translate (keep the same id values):
${itemsList}

Return a JSON object with this EXACT structure:
{
  "translations": {
    "id": {
      "seo_title": "Makanan Terbaik di ${cityEn} 2026 — Panduan Restoran & Makanan Jalanan",
      "seo_description": "Temukan restoran terbaik, makanan jalanan dan kuliner lokal di ${cityEn}.",
      "page_intro": "2-3 sentences in Indonesian about ${cityEn} food culture",
      "items": [ { "id": "same-id", "name": "Indonesian name", "description": "Indonesian description 80-120 words" } ]
    },
    "hi": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Hindi name", "description": "Hindi description" } ] },
    "pt": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Portuguese name", "description": "Portuguese description" } ] },
    "ar": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Arabic name", "description": "Arabic description" } ] },
    "bn": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Bengali name", "description": "Bengali description" } ] },
    "ru": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Russian name", "description": "Russian description" } ] }
  }
}

Requirements:
- EXACTLY 8 items per language matching the ids above
- Translations must be natural and accurate
- descriptions should be 80-120 words`;
}

function buildAttractionsPromptPart1(citySlug, cityEn, cityZh) {
  return `You are a travel content expert. Generate an attractions guide JSON for ${cityEn} (${cityZh}).

Return a JSON object with this EXACT structure:
{
  "city_slug": "${citySlug}",
  "items_base": [
    {
      "id": "unique-slug",
      "type": "landmark|museum|temple|park|viewpoint|market|district",
      "image_keyword": "descriptive keyword for Unsplash",
      "star_rating": 4.7,
      "needs_ticket": true,
      "ticket_price_hint": "approx price or Free",
      "best_time": "morning|afternoon|evening|anytime",
      "klook_query": "Klook search term"
    }
  ],
  "translations": {
    "en": {
      "seo_title": "Top Attractions in ${cityEn} 2026 — Tickets, Tips & Complete Guide",
      "seo_description": "Explore the best attractions in ${cityEn}. Find opening hours, ticket prices and booking links for ${cityEn}'s top landmarks.",
      "page_intro": "2-3 sentences about ${cityEn} as a destination (around 100 words)",
      "items": [ { "id": "same-slug-as-above", "name": "...", "description": "..." } ]
    },
    "zh": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Traditional Chinese name", "description": "Traditional Chinese description" } ] },
    "ja": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Japanese name", "description": "Japanese description" } ] },
    "ko": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Korean name", "description": "Korean description" } ] },
    "fr": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "French name", "description": "French description" } ] },
    "es": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Spanish name", "description": "Spanish description" } ] }
  }
}

Requirements:
- EXACTLY 8 items
- Mix: 2-3 landmarks/monuments, 1-2 museums, 1-2 temples/nature, 1-2 districts/markets
- All names must be REAL, verifiable attractions that actually exist in ${cityEn}
- needs_ticket: true for paid, false for free — must reflect reality
- ticket_price_hint must be the actual approximate admission price (or "Free")
- best_time must reflect the genuinely recommended visiting time
- star_rating between 4.3 and 4.9
- Translations must be natural and accurate`;
}

function buildAttractionsPromptPart2(citySlug, cityEn, cityZh, itemsBase, enItems) {
  const itemsList = itemsBase.map((item, i) => `${i+1}. id: "${item.id}", name (EN): "${enItems[i]?.name}"`).join('\n');
  return `You are a travel content expert. Translate the following ${cityEn} attractions into 6 languages.

The items to translate (keep the same id values):
${itemsList}

Return a JSON object with this EXACT structure:
{
  "translations": {
    "id": {
      "seo_title": "Tempat Wisata Terbaik di ${cityEn} 2026 — Tiket, Tips & Panduan Lengkap",
      "seo_description": "Jelajahi tempat wisata terbaik di ${cityEn}. Temukan jam buka, harga tiket dan link pemesanan.",
      "page_intro": "2-3 sentences in Indonesian about ${cityEn} as a destination",
      "items": [ { "id": "same-id", "name": "Indonesian name", "description": "Indonesian description 80-120 words" } ]
    },
    "hi": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Hindi name", "description": "Hindi description" } ] },
    "pt": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Portuguese name", "description": "Portuguese description" } ] },
    "ar": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Arabic name", "description": "Arabic description" } ] },
    "bn": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Bengali name", "description": "Bengali description" } ] },
    "ru": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [ { "id": "...", "name": "Russian name", "description": "Russian description" } ] }
  }
}

Requirements:
- EXACTLY 8 items per language matching the ids above
- Translations must be natural and accurate
- descriptions should be 80-120 words`;
}

function mergeData(part1, part2, type) {
  const LANGS = ['en','zh','ja','ko','fr','es','id','hi','pt','ar','bn','ru'];
  const itemsBase = part1.items_base;
  const result = {
    city_slug: part1.city_slug,
    translations: {},
  };

  for (const lang of LANGS) {
    const source = lang === 'id' || lang === 'hi' || lang === 'pt' || lang === 'ar' || lang === 'bn' || lang === 'ru'
      ? part2.translations[lang]
      : part1.translations[lang];

    if (!source) continue;

    result.translations[lang] = {
      seo_title: source.seo_title,
      seo_description: source.seo_description,
      page_intro: source.page_intro,
      items: source.items.map((item, i) => {
        const base = itemsBase[i] || {};
        if (type === 'food') {
          return {
            id: base.id || item.id,
            name: item.name,
            type: base.type,
            description: item.description,
            image_keyword: base.image_keyword,
            star_rating: base.star_rating,
            price_range: base.price_range,
            must_try: base.must_try,
            klook_query: base.klook_query,
          };
        } else {
          return {
            id: base.id || item.id,
            name: item.name,
            type: base.type,
            description: item.description,
            image_keyword: base.image_keyword,
            star_rating: base.star_rating,
            needs_ticket: base.needs_ticket,
            ticket_price_hint: base.ticket_price_hint,
            best_time: base.best_time,
            klook_query: base.klook_query,
          };
        }
      }),
    };
  }

  return result;
}

async function generateCity(slug, nameEn, nameZh) {
  const foodPath = path.join(__dirname, 'src/data/food', `${slug}.json`);
  const attrPath = path.join(__dirname, 'src/data/attractions', `${slug}.json`);
  const results = { food: false, attractions: false };

  // Food
  const foodExists = fs.existsSync(foodPath) && fs.readFileSync(foodPath, 'utf8').trim() !== 'PLACEHOLDER';
  if (!foodExists) {
    try {
      process.stdout.write(`  food(1/2)...`);
      const part1 = await callOpenAI(buildFoodPromptPart1(slug, nameEn, nameZh));
      await new Promise(r => setTimeout(r, 1000));
      process.stdout.write(`(2/2)...`);
      const part2 = await callOpenAI(buildFoodPromptPart2(slug, nameEn, nameZh, part1.items_base, part1.translations.en.items));
      const merged = mergeData(part1, part2, 'food');
      fs.writeFileSync(foodPath, JSON.stringify(merged, null, 2), 'utf8');
      results.food = true;
      process.stdout.write(`✓ `);
    } catch (e) {
      process.stdout.write(`✗(${e.message.slice(0,40)}) `);
    }
  } else {
    process.stdout.write(`  food(skip) `);
    results.food = true;
  }

  await new Promise(r => setTimeout(r, 1000));

  // Attractions
  const attrExists = fs.existsSync(attrPath) && fs.readFileSync(attrPath, 'utf8').trim() !== 'PLACEHOLDER';
  if (!attrExists) {
    try {
      process.stdout.write(`attr(1/2)...`);
      const part1 = await callOpenAI(buildAttractionsPromptPart1(slug, nameEn, nameZh));
      await new Promise(r => setTimeout(r, 1000));
      process.stdout.write(`(2/2)...`);
      const part2 = await callOpenAI(buildAttractionsPromptPart2(slug, nameEn, nameZh, part1.items_base, part1.translations.en.items));
      const merged = mergeData(part1, part2, 'attractions');
      fs.writeFileSync(attrPath, JSON.stringify(merged, null, 2), 'utf8');
      results.attractions = true;
      process.stdout.write(`✓\n`);
    } catch (e) {
      process.stdout.write(`✗(${e.message.slice(0,40)})\n`);
    }
  } else {
    process.stdout.write(`attr(skip)\n`);
    results.attractions = true;
  }

  return results;
}

async function main() {
  const targetSlug = process.argv[2];
  const cities = targetSlug ? CITIES.filter(([slug]) => slug === targetSlug) : CITIES;

  console.log(`Generating ${cities.length} cities (food + attractions) using gpt-4o-mini...`);
  let success = 0, fail = 0;

  for (const [slug, nameEn, nameZh] of cities) {
    process.stdout.write(`[${slug}] `);
    const res = await generateCity(slug, nameEn, nameZh);
    if (res.food && res.attractions) success++;
    else fail++;
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\nDone: ${success} success, ${fail} failed`);
}

main().catch(console.error);
