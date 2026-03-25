/**
 * optimizeDestinationSEO.mjs
 * Optimizes seo_meta title (<60 chars) and description (<155 chars) for all
 * destination JSON files across all 12 languages.
 * High-CTR focus: concise, power words, year 2026, specific day count.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const OPENAI_API_KEY = envContent.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
if (!OPENAI_API_KEY) throw new Error('No OPENAI_API_KEY found');

const DEST_DIR = path.join(__dirname, 'src/data/destinations');

const LANG_INSTRUCTIONS = {
  en: 'English. Use power words like "Ultimate", "Complete", "Best". Include year 2026.',
  zh: '繁體中文（台灣用語）。使用吸引點擊的詞如「完整攻略」「必去」「最新」。包含2026年。',
  ja: '日本語。「完全ガイド」「必見」「最新」などの強力な言葉を使用。2026年を含める。',
  ko: '한국어. 「완벽 가이드」「필수 코스」「최신」 등 강력한 단어 사용. 2026년 포함.',
  fr: 'Français. Utiliser des mots forts comme "Guide complet", "Incontournable", "2026".',
  es: 'Español. Usar palabras fuertes como "Guía completa", "Imprescindible", "2026".',
  id: 'Bahasa Indonesia. Gunakan kata kuat seperti "Panduan Lengkap", "Wajib Kunjung", "2026".',
  hi: 'हिंदी. "संपूर्ण गाइड", "जरूरी", "2026" जैसे आकर्षक शब्दों का उपयोग करें।',
  pt: 'Português (Brasil). Usar palavras fortes como "Guia Completo", "Imperdível", "2026".',
  ar: 'العربية. استخدم كلمات قوية مثل "دليل شامل"، "لا يفوتك"، "2026".',
  bn: 'বাংলা। "সম্পূর্ণ গাইড", "অবশ্যই দেখুন", "২০২৬" এর মতো আকর্ষণীয় শব্দ ব্যবহার করুন।',
  ru: 'Русский. Использовать сильные слова: "Полный гид", "Лучшее", "2026".',
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

async function fixDestFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw.startsWith('{')) return;

  const data = JSON.parse(raw);
  const slug = path.basename(filePath, '.json');

  // Get city name from English data or root
  const enData = data.translations?.en || data;
  const cityName = enData?.hero_section?.city_name || slug.replace(/-/g, ' ');
  const days = enData?.daily_itinerary?.length || data?.daily_itinerary?.length || 3;

  const langs = Object.keys(data.translations || {}).filter(l => LANG_INSTRUCTIONS[l]);
  if (!langs.length) {
    // Root-level only (no translations key)
    return;
  }

  // Build per-language items to optimize
  const items = langs.map(lang => {
    const t = data.translations[lang];
    const title = t?.seo_meta?.title || '';
    const desc = t?.seo_meta?.description || '';
    return { lang, title, desc, needsOptimization: title.length > 60 || desc.length > 155 || !title };
  });

  const needsWork = items.filter(i => i.needsOptimization);
  if (!needsWork.length) return;

  const langList = needsWork.map(i =>
    `${i.lang}: current title="${i.title.substring(0, 80)}" (${i.title.length} chars)`
  ).join('\n');

  const prompt = `You are an SEO expert optimizing travel itinerary page titles and descriptions to maximize click-through rate.

City: ${cityName}
Days in itinerary: ${days}
Destination slug: ${slug}

For each language below, write a new SEO title and meta description:

TITLE rules:
- Max 58 characters (strict)
- Include city name + days count + year 2026
- High-CTR power words in that language
- No brackets like 【】[] if they eat into char limit
- Examples of good titles:
  EN: "Tokyo 5-Day Itinerary 2026 | Ultimate Travel Guide"
  ZH: "東京5天行程2026｜完整自由行攻略"
  JA: "東京5日間観光2026｜完全旅行ガイド"

DESCRIPTION rules:
- Max 150 characters
- Mention key attractions or experiences
- Include a call-to-action ("Get free itinerary", "Plan your trip")
- Natural language, no keyword stuffing

Languages to optimize:
${langList}

Language writing instructions:
${needsWork.map(i => `${i.lang}: ${LANG_INSTRUCTIONS[i.lang]}`).join('\n')}

Return JSON: {"results": [{"lang": "xx", "title": "...", "description": "..."}, ...]}`;

  try {
    const result = await callOpenAI(prompt);
    const results = result.results ?? [];

    let changed = false;
    for (const r of results) {
      if (!r.lang || !data.translations[r.lang]) continue;
      if (!data.translations[r.lang].seo_meta) data.translations[r.lang].seo_meta = {};

      // Strict length enforcement
      let title = r.title || '';
      let desc = r.description || '';

      if (title.length > 60 || desc.length > 155 || !title) continue; // skip if still too long

      data.translations[r.lang].seo_meta.title = title;
      data.translations[r.lang].seo_meta.description = desc;
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      process.stdout.write(` saved\n`);
    } else {
      process.stdout.write(` no changes\n`);
    }
  } catch (e) {
    process.stdout.write(` ✗ ${e.message}\n`);
  }
}

async function main() {
  const files = fs.readdirSync(DEST_DIR)
    .filter(f => f.endsWith('.json'));

  console.log(`Optimizing SEO for ${files.length} destination files...`);

  // Process in batches of 10 to avoid rate limits
  const BATCH_SIZE = 10;
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(f => {
      const filePath = path.join(DEST_DIR, f);
      const slug = f.replace('.json', '');
      process.stdout.write(`[${slug}]`);
      return fixDestFile(filePath);
    }));
  }

  console.log('\nDone!');

  // Verify results
  let over60 = 0, total = 0;
  files.forEach(f => {
    const data = JSON.parse(fs.readFileSync(path.join(DEST_DIR, f), 'utf8'));
    Object.values(data.translations || {}).forEach((t) => {
      const title = t?.seo_meta?.title;
      if (title) { total++; if (title.length > 60) over60++; }
    });
  });
  console.log(`Verification: ${over60}/${total} titles still over 60 chars`);
}

main().catch(console.error);
