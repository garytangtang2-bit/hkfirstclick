import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace with your actual project path to the .env.local
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

const enJson = cleanJson(path.join(localesDir, 'en.json'));
cleanJson(path.join(localesDir, 'zh.json'));

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

async function translateLocale(langName) {
    console.log(`Translating to ${langName}...`);
    const systemPrompt = `You are an expert software localization translator. 
Translate the following English JSON values into ${langName}.
Keep the EXACT same JSON keys.
Keep the HTML tags like <br/> intact.
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
                { role: "user", content: JSON.stringify(enJson) }
            ],
            temperature: 0.1
        })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Error");

    let content = data.choices[0].message.content;
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(content);
}

async function main() {
    for (const lang of TARGET_LANGS) {
        const destPath = path.join(localesDir, `${lang.code}.json`);
        if (fs.existsSync(destPath)) {
            console.log(`Skipping ${lang.code}, already exists.`);
            continue;
        }

        try {
            const translatedJson = await translateLocale(lang.name);
            fs.writeFileSync(destPath, JSON.stringify(translatedJson, null, 4));
            console.log(`Successfully saved ${lang.code}.json`);
        } catch (err) {
            console.error(`Failed to translate to ${lang.name}:`, err);
        }
    }
    console.log("All translations complete.");
}

main();
