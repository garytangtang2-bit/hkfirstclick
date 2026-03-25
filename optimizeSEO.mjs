/**
 * optimizeSEO.mjs
 * Rewrites seo_title and seo_description for all food + attractions JSON
 * using high-CTR patterns: numbers, power words, clear value props.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const OPENAI_API_KEY = envContent.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
if (!OPENAI_API_KEY) throw new Error('No OPENAI_API_KEY found');

const FOOD_DIR = path.join(__dirname, 'src/data/food');
const ATTR_DIR = path.join(__dirname, 'src/data/attractions');

const LANG_NAMES = {
  en: 'English', zh: '繁體中文', ja: '日本語', ko: '한국어',
  fr: 'Français', es: 'Español', id: 'Bahasa Indonesia',
  hi: 'हिन्दी', pt: 'Português', ar: 'العربية', bn: 'বাংলা', ru: 'Русский',
};

async function callOpenAI(prompt, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.4,
          response_format: { type: 'json_object' },
        }),
      });
      const json = await res.json();
      return JSON.parse(json.choices?.[0]?.message?.content);
    } catch (e) {
      if (attempt === retries) throw e;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function optimizeFile(filePath, type) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw.startsWith('{')) return;

  const data = JSON.parse(raw);
  const citySlug = data.city_slug;
  const enItems = data.translations?.en?.items ?? [];
  const topNames = enItems.slice(0, 3).map(i => i.name).join(', ');

  let changed = false;

  for (const [lang, langName] of Object.entries(LANG_NAMES)) {
    const t = data.translations?.[lang];
    if (!t) continue;

    const currentTitle = t.seo_title ?? '';
    const currentDesc = t.seo_description ?? '';

    const prompt = type === 'food'
      ? `You are an SEO expert. Rewrite the SEO title and meta description for a food guide page.

City: ${citySlug}
Language: ${langName}
Top restaurants/foods featured: ${topNames}
Current title: "${currentTitle}"
Current description: "${currentDesc}"

Rules for title (max 60 chars):
- Include city name, year 2026
- Use power words: "Best", "Must-Try", "Top", "Hidden Gems", "Local Favorites"
- Include a number if possible (e.g. "8 Must-Try Restaurants")
- Write in ${langName}

Rules for description (max 155 chars):
- Lead with the value prop (save time, real recommendations)
- Include "Klook" booking mention
- Add a subtle CTA ("Plan your meal now", "Discover local favorites")
- Write in ${langName}

Return JSON: {"seo_title": "...", "seo_description": "..."}`
      : `You are an SEO expert. Rewrite the SEO title and meta description for a travel attractions guide page.

City: ${citySlug}
Language: ${langName}
Top attractions featured: ${topNames}
Current title: "${currentTitle}"
Current description: "${currentDesc}"

Rules for title (max 60 chars):
- Include city name, year 2026
- Use power words: "Top", "Must-See", "Best", "Complete Guide", "Hidden Gems"
- Include a number if possible (e.g. "8 Must-See Attractions")
- Write in ${langName}

Rules for description (max 155 chars):
- Lead with the value prop (tickets, opening hours, insider tips)
- Mention Klook booking links
- Add a subtle CTA
- Write in ${langName}

Return JSON: {"seo_title": "...", "seo_description": "..."}`;

    try {
      const result = await callOpenAI(prompt);
      if (result.seo_title) t.seo_title = result.seo_title;
      if (result.seo_description) t.seo_description = result.seo_description;
      changed = true;
      process.stdout.write(`✓`);
    } catch {
      process.stdout.write(`✗`);
    }

    await new Promise(r => setTimeout(r, 50));
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    process.stdout.write(` saved\n`);
  }
}

async function main() {
  const foodFiles = fs.readdirSync(FOOD_DIR)
    .filter(f => f.endsWith('.json'))
    .filter(f => fs.readFileSync(path.join(FOOD_DIR, f), 'utf8').trim().startsWith('{'));

  const attrFiles = fs.readdirSync(ATTR_DIR)
    .filter(f => f.endsWith('.json'))
    .filter(f => fs.readFileSync(path.join(ATTR_DIR, f), 'utf8').trim().startsWith('{'));

  console.log(`Optimizing SEO: ${foodFiles.length} food + ${attrFiles.length} attractions files`);
  console.log('Each file = 12 languages = 12 API calls\n');

  // Process in batches of 10 cities simultaneously
  const allFiles = [
    ...foodFiles.map(f => ({ filePath: path.join(FOOD_DIR, f), type: 'food', slug: f.replace('.json','') })),
    ...attrFiles.map(f => ({ filePath: path.join(ATTR_DIR, f), type: 'attr', slug: f.replace('.json','') })),
  ];

  await Promise.all(allFiles.map(({ filePath, type, slug }) => {
    process.stdout.write(`[${type}:${slug}] `);
    return optimizeFile(filePath, type);
  }));

  console.log('\nDone!');
}

main().catch(console.error);
