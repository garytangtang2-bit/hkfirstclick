/**
 * fixPriceRange.mjs
 * Replaces generic $/$$/$$$  with real estimated price ranges (e.g. "¥800–1,500").
 * Uses OpenAI to generate city-appropriate local currency prices.
 * Only updates English items (price_range is shared across languages since it's a number).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const OPENAI_API_KEY = envContent.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
if (!OPENAI_API_KEY) throw new Error('No OPENAI_API_KEY found');

const FOOD_DIR = path.join(__dirname, 'src/data/food');

async function callOpenAI(prompt, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          response_format: { type: 'json_object' },
        }),
      });
      const json = await res.json();
      return JSON.parse(json.choices?.[0]?.message?.content);
    } catch (e) {
      if (attempt === retries) throw e;
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
}

async function fixFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw.startsWith('{')) return;

  const data = JSON.parse(raw);
  const citySlug = data.city_slug;
  const enItems = data.translations?.en?.items ?? [];
  if (!enItems.length) return;

  // Build list of items needing real prices
  const itemList = enItems.map((item, i) => `${i}. ${item.name} (${item.type}) - current: "${item.price_range}"`).join('\n');

  const prompt = `You are a travel expert. Replace the generic price symbols ($, $$, $$$) with real estimated local currency price ranges for each food venue.

City: ${citySlug}
Items:
${itemList}

Rules:
- Use the local currency (e.g. ¥ for Japan, $ for USA, € for Europe, HK$ for Hong Kong, ฿ for Thailand, etc.)
- Format as a range like "¥800–1,500" or "€15–30" per person for a meal
- For street food/markets, use per-item prices
- Be realistic based on 2025/2026 prices
- Keep it concise (max 12 chars)

Return JSON: {"prices": ["price for item 0", "price for item 1", ...]} (array matching item order)`;

  try {
    const result = await callOpenAI(prompt);
    const prices = result.prices ?? [];

    let changed = false;
    prices.forEach((price, i) => {
      if (price && enItems[i]) {
        enItems[i].price_range = price;
        changed = true;
      }
    });

    if (changed) {
      // Also update price_range in all other language translations (it's the same value)
      for (const [lang, t] of Object.entries(data.translations ?? {})) {
        if (lang === 'en') continue;
        const langItems = t.items ?? [];
        prices.forEach((price, i) => {
          if (price && langItems[i]) langItems[i].price_range = price;
        });
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      process.stdout.write(` saved\n`);
    }
  } catch (e) {
    process.stdout.write(` ✗ ${e.message}\n`);
  }
}

async function main() {
  const foodFiles = fs.readdirSync(FOOD_DIR)
    .filter(f => f.endsWith('.json'))
    .filter(f => fs.readFileSync(path.join(FOOD_DIR, f), 'utf8').trim().startsWith('{'));

  console.log(`Fixing price ranges for ${foodFiles.length} food files...`);

  await Promise.all(foodFiles.map(f => {
    const filePath = path.join(FOOD_DIR, f);
    const slug = f.replace('.json', '');
    process.stdout.write(`[${slug}]`);
    return fixFile(filePath);
  }));

  console.log('\nDone!');
}

main().catch(console.error);
