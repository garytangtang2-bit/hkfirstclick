/**
 * generateCityPages.mjs
 * Uses Gemini API to generate food + attractions data for all 54 cities
 * Output: src/data/food/[slug].json and src/data/attractions/[slug].json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load API key from .env.local
const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const OPENAI_API_KEY = envContent.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
if (!OPENAI_API_KEY) throw new Error('No OPENAI_API_KEY found');

const LANGS = ['en','zh','ja','ko','fr','es','id','hi','pt','ar','bn','ru'];

// All 54 cities: [slug, English name, local name for search context]
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
        max_tokens: 16384,
        response_format: { type: 'json_object' },
      }),
    });
    const data = await res.json();
    if (data.error?.code === 'rate_limit_exceeded' || res.status === 429) {
      const wait = attempt * 10000;
      process.stdout.write(`(rate limit, wait ${wait/1000}s)...`);
      await new Promise(r => setTimeout(r, wait));
      continue;
    }
    if (data.error) throw new Error(data.error.message);
    const choice = data.choices?.[0];
    if (choice?.finish_reason === 'length') throw new Error('Response truncated (length limit)');
    const text = choice?.message?.content || '';
    return JSON.parse(text);
  }
  throw new Error('Max retries exceeded');
}

function buildFoodPromptEn(citySlug, cityEn, cityZh) {
  return `You are a travel content expert. Generate a JSON data object for a food guide page for ${cityEn} (${cityZh}). English only.

Return valid JSON with this EXACT structure:
{
  "city_slug": "${citySlug}",
  "translations": {
    "en": {
      "seo_title": "Best Food in ${cityEn} 2026 — Top Restaurants & Street Food Guide",
      "seo_description": "Discover the best restaurants, street food and local specialties in ${cityEn}. From budget eats to fine dining — with booking links.",
      "page_intro": "2-3 sentence intro about ${cityEn} food culture (100 words)",
      "items": [
        {
          "id": "unique-slug",
          "name": "Real famous restaurant or food market name",
          "type": "restaurant|street_food|night_market|cafe|bar",
          "description": "3-4 sentences about this place, what to order, price range, atmosphere (80-120 words)",
          "image_keyword": "descriptive photo search keyword",
          "star_rating": 4.5,
          "price_range": "$|$$|$$$",
          "must_try": "signature dish name",
          "klook_query": "search term for Klook restaurant/food tour booking"
        }
      ]
    }
  }
}

Requirements:
- Include EXACTLY 8 items (real famous places)
- Mix: 2-3 street food/night markets, 2-3 well-known restaurants, 1-2 local specialties
- Names must be REAL (e.g. Din Tai Fung, Shilin Night Market, Tsukiji Market)
- star_rating between 4.2 and 4.9
- Return ONLY valid JSON, no extra text`;
}

function buildFoodTranslatePrompt(cityEn, enData, langs) {
  const items = enData.translations.en.items.map(it => ({
    id: it.id, name: it.name, description: it.description
  }));
  const langNames = { zh: 'Traditional Chinese', ja: 'Japanese', ko: 'Korean', fr: 'French', es: 'Spanish', id: 'Indonesian', hi: 'Hindi', pt: 'Portuguese', ar: 'Arabic', bn: 'Bengali', ru: 'Russian' };
  const langList = langs.map(l => `${l} (${langNames[l]})`).join(', ');
  return `Translate the following ${cityEn} food guide data into these languages: ${langList}.

For each language, translate: seo_title, seo_description, page_intro, and each item's name and description.
Keep id, type, image_keyword, star_rating, price_range, must_try, klook_query UNCHANGED.

English source:
seo_title: ${enData.translations.en.seo_title}
seo_description: ${enData.translations.en.seo_description}
page_intro: ${enData.translations.en.page_intro}
items: ${JSON.stringify(items)}

Return valid JSON with keys for each language code. Example:
{ "${langs[0]}": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [{"id":"...","name":"...","description":"..."},...] }, ... }

Return ONLY valid JSON, no extra text.`;
}

function buildAttractionsPromptEn(citySlug, cityEn, cityZh) {
  return `You are a travel content expert. Generate a JSON data object for an attractions guide page for ${cityEn} (${cityZh}). English only.

Return valid JSON with this EXACT structure:
{
  "city_slug": "${citySlug}",
  "translations": {
    "en": {
      "seo_title": "Top Attractions in ${cityEn} 2026 — Tickets, Tips & Complete Guide",
      "seo_description": "Explore the best attractions in ${cityEn}. Find opening hours, ticket prices and booking links for ${cityEn}'s top landmarks.",
      "page_intro": "2-3 sentence intro about ${cityEn} as a destination (100 words)",
      "items": [
        {
          "id": "unique-slug",
          "name": "Real famous attraction name",
          "type": "landmark|museum|temple|park|viewpoint|market|district",
          "description": "3-4 sentences about this attraction, what to see, tips, how long to visit (80-120 words)",
          "image_keyword": "descriptive photo search keyword",
          "star_rating": 4.7,
          "needs_ticket": true,
          "ticket_price_hint": "approx price or Free",
          "best_time": "morning|afternoon|evening|anytime",
          "klook_query": "search term for Klook ticket booking"
        }
      ]
    }
  }
}

Requirements:
- Include EXACTLY 8 items (real famous attractions)
- Mix: 2-3 landmarks, 1-2 museums, 1-2 temples/nature, 1-2 districts/markets
- Names must be REAL well-known places
- star_rating between 4.3 and 4.9
- needs_ticket: true for paid, false for free
- Return ONLY valid JSON, no extra text`;
}

function buildAttractionsTranslatePrompt(cityEn, enData, langs) {
  const items = enData.translations.en.items.map(it => ({
    id: it.id, name: it.name, description: it.description
  }));
  const langNames = { zh: 'Traditional Chinese', ja: 'Japanese', ko: 'Korean', fr: 'French', es: 'Spanish', id: 'Indonesian', hi: 'Hindi', pt: 'Portuguese', ar: 'Arabic', bn: 'Bengali', ru: 'Russian' };
  const langList = langs.map(l => `${l} (${langNames[l]})`).join(', ');
  return `Translate the following ${cityEn} attractions data into these languages: ${langList}.

For each language, translate: seo_title, seo_description, page_intro, and each item's name and description.
Keep id, type, image_keyword, star_rating, needs_ticket, ticket_price_hint, best_time, klook_query UNCHANGED.

English source:
seo_title: ${enData.translations.en.seo_title}
seo_description: ${enData.translations.en.seo_description}
page_intro: ${enData.translations.en.page_intro}
items: ${JSON.stringify(items)}

Return valid JSON with keys for each language code. Example:
{ "${langs[0]}": { "seo_title": "...", "seo_description": "...", "page_intro": "...", "items": [{"id":"...","name":"...","description":"..."},...] }, ... }

Return ONLY valid JSON, no extra text.`;
}

async function generateCity(slug, nameEn, nameZh) {
  const foodPath = path.join(__dirname, 'src/data/food', `${slug}.json`);
  const attrPath = path.join(__dirname, 'src/data/attractions', `${slug}.json`);

  const results = { food: false, attractions: false };

  // Food (3-step: English, then translate batch1, batch2)
  if (!fs.existsSync(foodPath)) {
    try {
      process.stdout.write(`  food(en)...`);
      const enData = await callOpenAI(buildFoodPromptEn(slug, nameEn, nameZh));
      process.stdout.write(`✓ `);
      const enItems = enData.translations.en.items;
      const batch1 = ['zh','ja','ko','fr','es','id'];
      const batch2 = ['hi','pt','ar','bn','ru'];
      for (const batch of [batch1, batch2]) {
        await new Promise(r => setTimeout(r, 1000));
        process.stdout.write(`tr(${batch[0]})...`);
        const t = await callOpenAI(buildFoodTranslatePrompt(nameEn, enData, batch));
        for (const lang of Object.keys(t)) {
          enData.translations[lang] = {
            ...t[lang],
            items: t[lang].items.map((item, i) => ({ ...enItems[i], name: item.name, description: item.description })),
          };
        }
        process.stdout.write(`✓ `);
      }
      fs.writeFileSync(foodPath, JSON.stringify(enData, null, 2), 'utf8');
      results.food = true;
      process.stdout.write(`saved `);
    } catch (e) {
      process.stdout.write(`✗(${e.message.slice(0,30)}) `);
    }
  } else {
    process.stdout.write(`  food(skip) `);
    results.food = true;
  }

  // Small delay to avoid rate limiting
  await new Promise(r => setTimeout(r, 2000));

  // Attractions (3-step: English, then translate batch1, batch2)
  if (!fs.existsSync(attrPath)) {
    try {
      process.stdout.write(`attr(en)...`);
      const enData = await callOpenAI(buildAttractionsPromptEn(slug, nameEn, nameZh));
      process.stdout.write(`✓ `);
      const enItems = enData.translations.en.items;
      const batch1 = ['zh','ja','ko','fr','es','id'];
      const batch2 = ['hi','pt','ar','bn','ru'];
      for (const batch of [batch1, batch2]) {
        await new Promise(r => setTimeout(r, 1000));
        process.stdout.write(`tr(${batch[0]})...`);
        const t = await callOpenAI(buildAttractionsTranslatePrompt(nameEn, enData, batch));
        for (const lang of Object.keys(t)) {
          enData.translations[lang] = {
            ...t[lang],
            items: t[lang].items.map((item, i) => ({ ...enItems[i], name: item.name, description: item.description })),
          };
        }
        process.stdout.write(`✓ `);
      }
      fs.writeFileSync(attrPath, JSON.stringify(enData, null, 2), 'utf8');
      results.attractions = true;
      process.stdout.write(`saved\n`);
    } catch (e) {
      process.stdout.write(`✗(${e.message.slice(0,30)})\n`);
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
  const CONCURRENCY = 36;

  console.log(`Generating ${cities.length} cities (food + attractions), concurrency=${CONCURRENCY}...`);
  let success = 0, fail = 0;

  // Process in batches of CONCURRENCY
  for (let i = 0; i < cities.length; i += CONCURRENCY) {
    const batch = cities.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(async ([slug, nameEn, nameZh]) => {
      process.stdout.write(`[${slug}] `);
      return generateCity(slug, nameEn, nameZh);
    }));
    for (const res of results) {
      if (res.food && res.attractions) success++;
      else fail++;
    }
    console.log(`\n--- batch done (${i + batch.length}/${cities.length}) ---`);
  }

  console.log(`\nDone: ${success} success, ${fail} failed`);
}

main().catch(console.error);
