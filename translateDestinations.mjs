import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local manually (skip comment lines)
const envPath = path.join(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const idx = trimmed.indexOf("=");
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    process.env[key] = val;
  }
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in .env.local");
  process.exit(1);
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "hi", name: "Hindi" },
  { code: "pt", name: "Portuguese (Brazilian)" },
  { code: "ar", name: "Arabic" },
  { code: "bn", name: "Bengali" },
  { code: "ru", name: "Russian" },
];

const DEST_DIR = path.join(__dirname, "src/data/destinations");

async function callGemini(prompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function translateJSON(jsonObj, targetLang) {
  const fieldsToTranslate = {
    seo_meta_title: jsonObj.seo_meta?.title || "",
    seo_meta_description: jsonObj.seo_meta?.description || "",
    hook_intro: jsonObj.hero_section?.hook_intro || "",
    days: (jsonObj.daily_itinerary || []).map((day) => ({
      day_title: day.day_title || "",
      activities: (day.activities || []).map((act) => ({
        time_slot: act.time_slot || "",
        spot_name: act.spot_name || "",
        rich_description: act.rich_description || "",
        practical_tip: act.practical_tip || "",
      })),
    })),
  };

  const prompt = `Translate the following travel itinerary content from Traditional Chinese to ${targetLang}.
Rules:
- Keep proper noun place names in their most internationally recognized form
- Keep emoji as-is
- Translate "Day 1", "Day 2" naturally into the target language
- Translate naturally for a travel blog audience
- Return valid JSON with the exact same structure, no extra fields

${JSON.stringify(fieldsToTranslate, null, 2)}`;

  const text = await callGemini(prompt);
  return JSON.parse(text);
}

function applyTranslation(original, translated, langCode) {
  const result = JSON.parse(JSON.stringify(original));
  if (!result.translations) result.translations = {};

  result.translations[langCode] = {
    seo_meta: {
      title: translated.seo_meta_title || "",
      description: translated.seo_meta_description || "",
    },
    hero_section: {
      hook_intro: translated.hook_intro || "",
      hero_image_keyword: original.hero_section?.hero_image_keyword || "",
    },
    daily_itinerary: (original.daily_itinerary || []).map((day, di) => ({
      ...day,
      day_title: translated.days?.[di]?.day_title || day.day_title,
      activities: (day.activities || []).map((act, ai) => ({
        ...act,
        time_slot: translated.days?.[di]?.activities?.[ai]?.time_slot || act.time_slot,
        spot_name: translated.days?.[di]?.activities?.[ai]?.spot_name || act.spot_name,
        rich_description: translated.days?.[di]?.activities?.[ai]?.rich_description || act.rich_description,
        practical_tip: translated.days?.[di]?.activities?.[ai]?.practical_tip || act.practical_tip,
      })),
    })),
  };

  return result;
}

async function processFile(filename) {
  const filePath = path.join(DEST_DIR, filename);
  const cityName = filename.replace(".json", "");
  let data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const existing = Object.keys(data.translations || {});
  const missing = LANGUAGES.filter((l) => !existing.includes(l.code));

  if (missing.length === 0) {
    console.log(`✓ ${cityName}: all languages done`);
    return;
  }

  console.log(`\n📍 ${cityName}: translating ${missing.map((l) => l.code).join(", ")}...`);

  for (const lang of missing) {
    try {
      process.stdout.write(`  → ${lang.name}... `);
      const translated = await translateJSON(data, lang.name);
      data = applyTranslation(data, translated, lang.code);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      console.log(`✓`);
    } catch (err) {
      console.log(`✗ (${err.message.slice(0, 100)})`);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
}

async function main() {
  const files = fs.readdirSync(DEST_DIR).filter((f) => f.endsWith(".json"));
  console.log(`Found ${files.length} destination files, ${LANGUAGES.length} languages to translate\n`);

  for (const file of files) {
    await processFile(file);
  }

  console.log("\n✅ All done!");
}

main().catch(console.error);
