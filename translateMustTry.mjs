/**
 * translateMustTry.mjs
 * Only translates the `must_try` field in each language's items
 * for all food JSON files. Does NOT regenerate the whole file.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const OPENAI_API_KEY = envContent.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
if (!OPENAI_API_KEY) throw new Error('No OPENAI_API_KEY found');

const LANGS = ['zh','ja','ko','fr','es','id','hi','pt','ar','bn','ru'];

const LANG_NAMES = {
  zh: '繁體中文', ja: '日本語', ko: '한국어', fr: 'Français',
  es: 'Español', id: 'Bahasa Indonesia', hi: 'हिन्दी',
  pt: 'Português', ar: 'العربية', bn: 'বাংলা', ru: 'Русский',
};

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
          temperature: 0.3,
          response_format: { type: 'json_object' },
        }),
      });
      const json = await res.json();
      const text = json.choices?.[0]?.message?.content;
      return JSON.parse(text);
    } catch (e) {
      if (attempt === retries) throw e;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function translateMustTryForCity(slug) {
  const filePath = path.join(FOOD_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return;

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const enItems = data.translations?.en?.items;
  if (!enItems?.length) return;

  // Extract english must_try values
  const enMustTry = enItems.map(item => item.must_try);

  let changed = false;

  for (const lang of LANGS) {
    const langItems = data.translations?.[lang]?.items;
    if (!langItems?.length) continue;

    // Check if already translated (not same as english)
    const alreadyTranslated = langItems.every((item, i) =>
      item.must_try && item.must_try !== enMustTry[i]
    );
    if (alreadyTranslated) continue;

    process.stdout.write(`  [${lang}]...`);

    const prompt = `Translate these food/dish names to ${LANG_NAMES[lang]}. Keep proper nouns and dish names that are universally known in their original form (e.g. "Pad Thai", "Croissant"). Only translate if there's a natural local equivalent.

Return JSON: {"translations": ["translated name 1", "translated name 2", ...]}

Names to translate:
${JSON.stringify(enMustTry)}`;

    try {
      const result = await callOpenAI(prompt);
      const translations = result.translations;
      if (!Array.isArray(translations) || translations.length !== enMustTry.length) continue;

      translations.forEach((translated, i) => {
        if (langItems[i]) langItems[i].must_try = translated;
      });
      changed = true;
      process.stdout.write(`✓ `);
    } catch (e) {
      process.stdout.write(`✗ `);
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    process.stdout.write(`saved\n`);
  } else {
    process.stdout.write(`skip\n`);
  }
}

async function main() {
  const files = fs.readdirSync(FOOD_DIR).filter(f => f.endsWith('.json'));
  const slugs = files.map(f => f.replace('.json', ''));

  // Filter out placeholder files
  const validSlugs = slugs.filter(slug => {
    const content = fs.readFileSync(path.join(FOOD_DIR, `${slug}.json`), 'utf8').trim();
    return content.startsWith('{');
  });

  console.log(`Translating must_try for ${validSlugs.length} cities...`);

  // Process all cities simultaneously
  await Promise.all(validSlugs.map(slug => {
    process.stdout.write(`[${slug}] `);
    return translateMustTryForCity(slug);
  }));

  console.log('\nDone!');
}

main().catch(console.error);
