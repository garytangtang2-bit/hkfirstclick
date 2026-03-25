/**
 * addZhSeoMeta.mjs
 * Creates translations.zh with optimized seo_meta for all destination files.
 * The root-level data is Traditional Chinese content — we just need to add
 * a translations.zh entry with proper title/description.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const OPENAI_API_KEY = envContent.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
if (!OPENAI_API_KEY) throw new Error('No OPENAI_API_KEY found');

const DEST_DIR = path.join(__dirname, 'src/data/destinations');

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

async function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw.startsWith('{')) return;

  const data = JSON.parse(raw);

  // Skip if zh already exists and has seo_meta
  if (data.translations?.zh?.seo_meta?.title) {
    process.stdout.write(` skip (exists)\n`);
    return;
  }

  const slug = path.basename(filePath, '.json');
  const rootHook = data.hero_section?.hook_intro || '';
  const days = data.daily_itinerary?.length || 3;

  // Extract city name from root day_title (usually Traditional Chinese)
  const firstDayTitle = data.daily_itinerary?.[0]?.day_title || '';
  const enData = data.translations?.en;
  const enTitle = enData?.seo_meta?.title || slug;

  // Get city name from hook_intro or use slug
  const cityNameMatch = rootHook.match(/^([^\s，,。！!？?]+)/);
  const cityName = cityNameMatch?.[1] || slug.replace(/-/g, ' ');

  const prompt = `You are an SEO expert writing Traditional Chinese (繁體中文, Taiwan usage) meta tags.

City: ${cityName} (${slug})
Days: ${days}
English title for reference: ${enTitle}
Chinese content preview: ${rootHook.substring(0, 100)}

Write a Traditional Chinese SEO title and description for this travel itinerary page.

Rules:
- Title: Max 58 characters (strict). Use 繁體中文 (Taiwan). Include city name + days + 2026.
  Good examples: "大阪3天行程2026｜完整自由行攻略" (15 chars), "東京5天行程2026｜最佳景點完整攻略" (17 chars)
- Description: Max 150 characters. Mention key experiences, include CTA like "立即規劃" or "免費下載"
- Use Taiwan Traditional Chinese terms (not Simplified)

Return JSON: {"title": "...", "description": "..."}`;

  try {
    const result = await callOpenAI(prompt);
    let title = result.title || '';
    let description = result.description || '';

    if (!title || title.length > 60) {
      // Fallback: generate manually
      const cityPart = cityName.length <= 4 ? cityName : cityName.substring(0, 4);
      title = `${cityPart}${days}天行程2026｜完整自由行攻略`;
    }

    if (!data.translations) data.translations = {};
    if (!data.translations.zh) data.translations.zh = {};
    data.translations.zh.seo_meta = { title, description };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    process.stdout.write(` saved: "${title}"\n`);
  } catch (e) {
    process.stdout.write(` ✗ ${e.message}\n`);
  }
}

async function main() {
  const files = fs.readdirSync(DEST_DIR).filter(f => f.endsWith('.json'));
  console.log(`Adding zh seo_meta to ${files.length} destination files...`);

  const BATCH_SIZE = 10;
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(f => {
      const filePath = path.join(DEST_DIR, f);
      const slug = f.replace('.json', '');
      process.stdout.write(`[${slug}]`);
      return processFile(filePath);
    }));
  }

  console.log('\nDone!');
}

main().catch(console.error);
