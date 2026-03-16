import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

const LANG_NAMES = {
  en: "English", ja: "Japanese", ko: "Korean", fr: "French",
  es: "Spanish", id: "Bahasa Indonesia", hi: "Hindi",
  pt: "Portuguese (Brazilian)", ar: "Arabic", bn: "Bengali", ru: "Russian",
};

const DEST_DIR = path.join(__dirname, "src/data/destinations");
const CONCURRENCY = 6; // parallel API calls at once

function hasChinese(str) {
  return /[\u4e00-\u9fff]/.test(str);
}

async function callOpenAI(prompt, retries = 4) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 4096,
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
    } catch (err) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
      } else {
        throw err;
      }
    }
  }
}

async function fixActivity(act, langName) {
  const toFix = {};
  if (hasChinese(act.rich_description || "")) toFix.rich_description = act.rich_description;
  if (hasChinese(act.practical_tip || "")) toFix.practical_tip = act.practical_tip;
  if (hasChinese(act.spot_name || "")) toFix.spot_name = act.spot_name;
  if (hasChinese(act.time_slot || "")) toFix.time_slot = act.time_slot;
  if (Object.keys(toFix).length === 0) return null;

  const prompt = `Translate the following travel content from Traditional Chinese to ${langName}.
Rules:
- Keep proper noun place names in their most internationally recognized form
- Keep emoji as-is
- Translate naturally for a travel blog audience
- Return valid JSON with the exact same keys

${JSON.stringify(toFix, null, 2)}`;

  const text = await callOpenAI(prompt);
  return JSON.parse(text);
}

// Semaphore to limit concurrency
function createSemaphore(max) {
  let count = 0;
  const queue = [];
  return async function acquire(fn) {
    if (count < max) {
      count++;
      try { return await fn(); } finally { count--; if (queue.length) queue.shift()(); }
    }
    return new Promise((resolve, reject) => {
      queue.push(async () => {
        count++;
        try { resolve(await fn()); } catch(e) { reject(e); } finally {
          count--;
          if (queue.length) queue.shift()();
        }
      });
    });
  };
}

async function processFile(filename, sem) {
  const filePath = path.join(DEST_DIR, filename);
  const cityName = filename.replace(".json", "");
  let data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const tasks = [];

  for (const [langCode, trans] of Object.entries(data.translations || {})) {
    const langName = LANG_NAMES[langCode];
    if (!langName) continue;

    for (let di = 0; di < (trans.daily_itinerary || []).length; di++) {
      for (let ai = 0; ai < (trans.daily_itinerary[di].activities || []).length; ai++) {
        const act = trans.daily_itinerary[di].activities[ai];
        if (!hasChinese(act.rich_description || "") && !hasChinese(act.practical_tip || "") && !hasChinese(act.spot_name || "") && !hasChinese(act.time_slot || "")) continue;

        tasks.push(sem(async () => {
          try {
            const fixed = await fixActivity(act, langName);
            if (fixed) {
              Object.assign(data.translations[langCode].daily_itinerary[di].activities[ai], fixed);
            }
          } catch (err) {
            process.stdout.write(`✗ ${cityName}/${langCode}[${di}][${ai}] `);
          }
        }));
      }
    }

    // Fix hook_intro
    if (hasChinese(trans.hero_section?.hook_intro || "")) {
      tasks.push(sem(async () => {
        try {
          const prompt = `Translate the following travel blog intro from Traditional Chinese to ${langName}. Keep emoji as-is. Return JSON with key "hook_intro".\n\n${JSON.stringify({ hook_intro: trans.hero_section.hook_intro })}`;
          const text = await callOpenAI(prompt);
          const fixed = JSON.parse(text);
          if (fixed.hook_intro) data.translations[langCode].hero_section.hook_intro = fixed.hook_intro;
        } catch (err) {
          process.stdout.write(`✗ ${cityName}/${langCode}/hook `);
        }
      }));
    }
  }

  if (tasks.length === 0) {
    console.log(`✓ ${cityName}: clean`);
    return;
  }

  await Promise.all(tasks);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✓ ${cityName} fixed (${tasks.length} tasks)`);
}

async function main() {
  const files = fs.readdirSync(DEST_DIR).filter((f) => f.endsWith(".json"));
  console.log(`Scanning ${files.length} files with ${CONCURRENCY} parallel calls...\n`);

  const sem = createSemaphore(CONCURRENCY);

  // Process all files in parallel too (batches of 6 files)
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(f => processFile(f, sem)));
  }

  console.log("\n✅ All done!");
}

main().catch(console.error);
