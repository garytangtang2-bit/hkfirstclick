/**
 * optimizePageIntro.mjs
 * Rewrites page_intro for all food + attractions JSON with engaging, high-CTR copy.
 * Also adds localized FAQ questions (faq_q1, faq_q2, faq_a2_suffix / faq_a1_suffix, faq_a2).
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
          temperature: 0.5,
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

    const currentIntro = t.page_intro ?? '';

    const prompt = type === 'food'
      ? `You are a travel copywriter. Rewrite the page intro and generate localized FAQ questions for a food guide page.

City: ${citySlug}
Language: ${langName}
Top restaurants: ${topNames}
Current intro: "${currentIntro}"

Rules for page_intro (2-3 sentences, max 200 chars):
- Start with an exciting hook about the city's food scene
- Mention local specialties or famous dishes
- End with a value prop (save time, curated picks, Klook booking)
- Write in ${langName}

Also generate:
- faq_q1: "What is the best food to eat in [city]?" in ${langName}
- faq_q2: "Where can I find the best restaurants in [city]?" in ${langName}
- faq_a2_suffix: " are among the top-rated dining options." in ${langName} (starts with space)

Return JSON: {"page_intro": "...", "faq_q1": "...", "faq_q2": "...", "faq_a2_suffix": "..."}`
      : `You are a travel copywriter. Rewrite the page intro and generate localized FAQ questions for an attractions guide page.

City: ${citySlug}
Language: ${langName}
Top attractions: ${topNames}
Current intro: "${currentIntro}"

Rules for page_intro (2-3 sentences, max 200 chars):
- Start with an exciting hook about the city's attractions
- Mention iconic landmarks or hidden gems
- End with a value prop (skip the lines, book via Klook)
- Write in ${langName}

Also generate:
- faq_q1: "What are the top attractions in [city]?" in ${langName}
- faq_a1_suffix: " are among the must-see attractions." in ${langName} (starts with space)
- faq_q2: "Do I need tickets for attractions in [city]?" in ${langName}
- faq_a2: Answer about needing tickets, mentioning Klook, in ${langName} (1-2 sentences)

Return JSON: {"page_intro": "...", "faq_q1": "...", "faq_a1_suffix": "...", "faq_q2": "...", "faq_a2": "..."}`;

    try {
      const result = await callOpenAI(prompt);
      if (result.page_intro) t.page_intro = result.page_intro;
      if (result.faq_q1) t.faq_q1 = result.faq_q1;
      if (result.faq_q2) t.faq_q2 = result.faq_q2;
      if (result.faq_a2_suffix) t.faq_a2_suffix = result.faq_a2_suffix;
      if (result.faq_a1_suffix) t.faq_a1_suffix = result.faq_a1_suffix;
      if (result.faq_a2) t.faq_a2 = result.faq_a2;
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

  console.log(`Optimizing page_intro + FAQ: ${foodFiles.length} food + ${attrFiles.length} attractions files`);
  console.log('Each file = 12 languages = 12 API calls\n');

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
