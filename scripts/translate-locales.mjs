import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { config } from 'dotenv';
config({ path: path.join(__dirname, '../.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY in .env.local");
    process.exit(1);
}

const localesDir = path.join(__dirname, '../src/locales');
if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true });
}

// Clean duplicate malformed keys function
function cleanJson(filePath) {
    if (!fs.existsSync(filePath)) return null;
    let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let cleaned = {};
    for (const [key, val] of Object.entries(data)) {
        if (!key.endsWith(': ')) {
            cleaned[key] = val;
        }
    }
    fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 4));
    return cleaned;
}

const enPath = path.join(localesDir, 'en.json');
const enJson = cleanJson(enPath);
cleanJson(path.join(localesDir, 'zh.json'));

if (!enJson) {
    console.error("en.json not found. Cannot proceed.");
    process.exit(1);
}

const TARGET_LANGS = [
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'ar', name: 'Modern Standard Arabic' },
    { code: 'fr', name: 'French' },
    { code: 'bn', name: 'Bengali' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'id', name: 'Indonesian' },
    { code: 'ko', name: 'Korean' },
    { code: 'ja', name: 'Japanese' }
];

// Translate only the given subset of english keys into target language
async function translateKeys(keySubset, langName) {
    if (Object.keys(keySubset).length === 0) return {};
    
    console.log(`  Translating ${Object.keys(keySubset).length} missing keys into ${langName}...`);
    const systemPrompt = `You are an expert software localization translator. 
Translate the following English JSON values into ${langName}.
Keep the EXACT same JSON keys.
Keep HTML tags like <br/> intact.
Keep placeholders like {n}, {price}, {query} intact — do NOT translate them.
Return ONLY valid JSON, no markdown blocks.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: JSON.stringify(keySubset) }
            ],
            temperature: 0.1
        })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "API Error");

    let content = data.choices[0].message.content;
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(content);
}

async function main() {
    for (const lang of TARGET_LANGS) {
        const destPath = path.join(localesDir, `${lang.code}.json`);

        // Load existing translations (or empty object if file doesn't exist)
        let existing = {};
        if (fs.existsSync(destPath)) {
            existing = JSON.parse(fs.readFileSync(destPath, 'utf-8'));
        }

        // Find keys that are in en.json but missing from this language file
        const missingKeys = {};
        for (const key of Object.keys(enJson)) {
            if (!(key in existing)) {
                missingKeys[key] = enJson[key];
            }
        }

        if (Object.keys(missingKeys).length === 0) {
            console.log(`✅ ${lang.code}.json — already up to date, skipping.`);
            continue;
        }

        console.log(`⚠️  ${lang.code}.json — missing ${Object.keys(missingKeys).length} keys. Translating...`);

        try {
            const translated = await translateKeys(missingKeys, lang.name);
            // Merge: preserve existing translations, fill in new ones
            const merged = { ...existing, ...translated };
            // Re-sort to match en.json key order for readability
            const sorted = {};
            for (const key of Object.keys(enJson)) {
                sorted[key] = merged[key] ?? enJson[key];
            }
            fs.writeFileSync(destPath, JSON.stringify(sorted, null, 4));
            console.log(`  ✅ Saved ${lang.code}.json (added ${Object.keys(missingKeys).length} keys)`);
        } catch (err) {
            console.error(`  ❌ Failed to translate to ${lang.name}:`, err.message);
        }
    }
    console.log("\n🎉 All translations complete.");
}

main();
