import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const dir = "src/data/destinations";

const LANG_NAMES = {
  ar: "Arabic",
  bn: "Bengali",
  hi: "Hindi",
  ru: "Russian",
};

const CITY_NAMES = {
  "athens.json": "Athens",
  "bangkok.json": "Bangkok",
  "barcelona.json": "Barcelona",
  "chicago.json": "Chicago",
  "florence.json": "Florence",
  "fukuoka.json": "Fukuoka",
  "hakone.json": "Hakone",
  "hongkong.json": "Hong Kong",
  "madrid.json": "Madrid",
  "paris.json": "Paris",
  "rio-de-janeiro.json": "Rio de Janeiro",
  "sapporo.json": "Sapporo",
  "toronto.json": "Toronto",
  "vienna.json": "Vienna",
};

const problems = [
  { file: "athens.json", lang: "bn", field: "hero_section.hook_intro" },
  { file: "bangkok.json", lang: "ru", field: "hero_section.hook_intro" },
  { file: "barcelona.json", lang: "ar", field: "seo_meta.description" },
  { file: "chicago.json", lang: "bn", field: "hero_section.hook_intro" },
  { file: "chicago.json", lang: "ru", field: "hero_section.hook_intro" },
  { file: "florence.json", lang: "bn", field: "hero_section.hook_intro" },
  { file: "fukuoka.json", lang: "hi", field: "hero_section.hook_intro" },
  { file: "hakone.json", lang: "hi", field: "hero_section.hook_intro" },
  { file: "hongkong.json", lang: "bn", field: "hero_section.hook_intro" },
  { file: "madrid.json", lang: "ar", field: "seo_meta.description" },
  { file: "paris.json", lang: "ar", field: "seo_meta.description" },
  { file: "rio-de-janeiro.json", lang: "bn", field: "hero_section.hook_intro" },
  { file: "sapporo.json", lang: "hi", field: "hero_section.hook_intro" },
  { file: "sapporo.json", lang: "bn", field: "hero_section.hook_intro" },
  { file: "toronto.json", lang: "bn", field: "hero_section.hook_intro" },
  { file: "vienna.json", lang: "hi", field: "hero_section.hook_intro" },
];

async function generateReplacement(city, lang, field) {
  const langName = LANG_NAMES[lang];

  let prompt;
  if (field === "seo_meta.description") {
    prompt = `Write a short SEO meta description (max 160 characters) for a travel guide about ${city}, written entirely in ${langName}. 
The description should attract first-time travelers and mention the city name.
Return ONLY the description text, nothing else. No Chinese/Japanese/Korean characters allowed.`;
  } else {
    prompt = `Write an exciting, enthusiastic travel introduction for ${city}, written entirely in ${langName}.
This is the hero section opening paragraph for a travel itinerary page. It should:
- Be 2-3 paragraphs, around 150-200 words total
- Express excitement about visiting ${city}
- Mention key highlights (landmarks, food, culture)
- Be written ONLY in ${langName} with absolutely NO Chinese/Japanese/Korean/CJK characters
Return ONLY the text, nothing else.`;
  }

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content.trim();
}

// Group by file
const byFile = {};
for (const p of problems) {
  if (!byFile[p.file]) byFile[p.file] = [];
  byFile[p.file].push({ lang: p.lang, field: p.field });
}

for (const [fname, probs] of Object.entries(byFile)) {
  const filePath = path.join(dir, fname);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const city = CITY_NAMES[fname];

  for (const { lang, field } of probs) {
    console.log(`Fixing ${fname} [${lang}] ${field}...`);
    const newText = await generateReplacement(city, lang, field);
    console.log(`  → ${newText.substring(0, 80)}`);

    const tr = data.translations[lang];
    if (field === "seo_meta.description") {
      tr.seo_meta.description = newText;
    } else {
      tr.hero_section.hook_intro = newText;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  console.log(`✓ Saved ${fname}`);
}

console.log("\nAll done!");
