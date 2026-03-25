/**
 * fixLongTitles.mjs
 * Re-optimizes seo_title for languages where title exceeds 60 chars.
 * Targets: fr, id, pt, ru, hi, es, bn, en, ar
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

// Only fix languages where pixel-width truncation is a real risk
const FIX_LANGS = ['fr', 'id', 'pt', 'ru', 'hi', 'es', 'bn', 'en', 'ar'];
const MAX_CHARS = 58; // strict limit to ensure no truncation

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
      return JSON.parse(json.choices?.[0]?.message?.content);
    } catch (e) {
      if (attempt === retries) throw e;
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
}

async function fixFile(filePath, type) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw.startsWith('{')) return;

  const data = JSON.parse(raw);
  const citySlug = data.city_slug;
  const enItems = data.translations?.en?.items ?? [];
  const topNames = enItems.slice(0, 3).map(i => i.name).join(', ');

  let changed = false;

  for (const lang of FIX_LANGS) {
    const t = data.translations?.[lang];
    if (!t) continue;
    const currentTitle = t.seo_title ?? '';
    if (currentTitle.length <= MAX_CHARS) continue; // already fine

    const langName = LANG_NAMES[lang];
    const prompt = `You are an SEO expert. Shorten this SEO title to STRICTLY under ${MAX_CHARS} characters while keeping it compelling.

City: ${citySlug}
Type: ${type === 'food' ? 'food guide' : 'attractions guide'}
Language: ${langName}
Current title (${currentTitle.length} chars, TOO LONG): "${currentTitle}"
Top items: ${topNames}

Rules:
- MUST be under ${MAX_CHARS} characters (count carefully!)
- Keep year 2026
- Keep a number if possible
- Keep power words (Best/Top/Must)
- Write in ${langName}

Return JSON: {"seo_title": "..."}`;

    try {
      const result = await callOpenAI(prompt);
      const newTitle = result.seo_title ?? '';
      if (newTitle && newTitle.length <= 62) { // small buffer
        t.seo_title = newTitle;
        changed = true;
        process.stdout.write(`✓`);
      } else {
        // Force truncate if AI still returned too long
        t.seo_title = newTitle.slice(0, 58) + (newTitle.length > 58 ? '…' : '');
        changed = true;
        process.stdout.write(`~`);
      }
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

  const allFiles = [
    ...foodFiles.map(f => ({ filePath: path.join(FOOD_DIR, f), type: 'food', slug: f.replace('.json','') })),
    ...attrFiles.map(f => ({ filePath: path.join(ATTR_DIR, f), type: 'attr', slug: f.replace('.json','') })),
  ];

  // Only process files that have at least one over-length title
  const toFix = allFiles.filter(({ filePath }) => {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return FIX_LANGS.some(lang => {
      const t = data.translations?.[lang];
      return t && (t.seo_title?.length ?? 0) > MAX_CHARS;
    });
  });

  console.log(`Fixing long titles in ${toFix.length} files...`);

  await Promise.all(toFix.map(({ filePath, type, slug }) => {
    process.stdout.write(`[${type}:${slug}] `);
    return fixFile(filePath, type);
  }));

  console.log('\nDone!');
}

main().catch(console.error);
