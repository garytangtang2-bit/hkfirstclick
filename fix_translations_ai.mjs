import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const dir = "src/data/destinations";

const LANG_NAMES = {
  hi: "Hindi",
  bn: "Bengali",
  ar: "Arabic",
  ru: "Russian",
};

const scriptPatterns = {
  hi: /[\u0900-\u097F]/,
  bn: /[\u0980-\u09FF]/,
  ar: /[\u0600-\u06FF]/,
  ru: /[\u0400-\u04FF]/,
};

const TRANSLATABLE_FIELDS = new Set([
  "rich_description",
  "practical_tip",
  "hook_intro",
  "day_title",
  "description",
  "rich_alternative",
  "title",
]);

// Find all contaminated fields
function findProblems(data, fname) {
  const problems = [];
  const tr = data.translations || {};
  function checkNode(obj, pathParts, lang, pattern) {
    const key = pathParts[pathParts.length - 1];
    if (typeof obj === "string") {
      if (TRANSLATABLE_FIELDS.has(key) && obj.length > 15) {
        if (!pattern.test(obj)) {
          problems.push({
            file: fname,
            lang,
            pathParts: [...pathParts],
            current: obj,
          });
        }
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, i) =>
        checkNode(item, [...pathParts, i], lang, pattern)
      );
    } else if (obj && typeof obj === "object") {
      Object.entries(obj).forEach(([k, v]) =>
        checkNode(v, [...pathParts, k], lang, pattern)
      );
    }
  }
  for (const [lang, pattern] of Object.entries(scriptPatterns)) {
    if (tr[lang]) checkNode(tr[lang], [], lang, pattern);
  }
  return problems;
}

// Get English equivalent from same path
function getEnglishVal(data, pathParts) {
  const enTr = data.translations?.en;
  if (!enTr) return null;
  try {
    return pathParts.reduce((o, k) => o?.[k], enTr);
  } catch {
    return null;
  }
}

// Set value at path
function setNestedVal(obj, pathParts, value) {
  const last = pathParts[pathParts.length - 1];
  const parent = pathParts
    .slice(0, -1)
    .reduce((o, k) => (o ? o[k] : undefined), obj);
  if (parent !== undefined && parent !== null) {
    parent[last] = value;
  }
}

async function translateText(text, targetLang) {
  const langName = LANG_NAMES[targetLang];
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 600,
    messages: [
      {
        role: "system",
        content: `You are a professional travel content translator. Translate the given English travel content into ${langName}. Keep the same tone (enthusiastic, informative). Preserve any proper nouns (place names, landmark names). Return ONLY the translated text, nothing else.`,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });
  return response.choices[0].message.content.trim();
}

// Process all files
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

const allProblems = [];
const dataCache = {};

for (const fname of files) {
  const filePath = path.join(dir, fname);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  dataCache[fname] = data;
  const problems = findProblems(data, fname);
  allProblems.push(...problems);
}

console.log(`Found ${allProblems.length} fields to translate`);

// Process in batches of 5 parallel requests
const BATCH_SIZE = 5;
let fixed = 0;

for (let i = 0; i < allProblems.length; i += BATCH_SIZE) {
  const batch = allProblems.slice(i, i + BATCH_SIZE);

  await Promise.all(
    batch.map(async (p) => {
      const data = dataCache[p.file];
      const enVal = getEnglishVal(data, p.pathParts);
      const sourceText =
        enVal && typeof enVal === "string" && enVal.length > 10
          ? enVal
          : p.current;

      console.log(
        `[${i + 1}/${allProblems.length}] ${p.file} [${p.lang}] ${p.pathParts.join(".")}`
      );
      console.log(`  EN: ${sourceText.substring(0, 60)}...`);

      try {
        const translated = await translateText(sourceText, p.lang);
        console.log(`  → ${translated.substring(0, 60)}`);

        // Set in translations object
        const tr = data.translations[p.lang];
        setNestedVal(tr, p.pathParts, translated);
        fixed++;
      } catch (err) {
        console.error(`  ERROR: ${err.message}`);
      }
    })
  );

  // Small delay between batches
  if (i + BATCH_SIZE < allProblems.length) {
    await new Promise((r) => setTimeout(r, 200));
  }
}

// Save all modified files
const modifiedFiles = new Set(allProblems.map((p) => p.file));
for (const fname of modifiedFiles) {
  const filePath = path.join(dir, fname);
  fs.writeFileSync(
    filePath,
    JSON.stringify(dataCache[fname], null, 2),
    "utf8"
  );
  console.log(`✓ Saved ${fname}`);
}

console.log(`\nDone! Fixed ${fixed}/${allProblems.length} fields`);
