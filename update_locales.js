const fs = require('fs');
const path = require('path');

const envLocal = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
const match = envLocal.match(/GEMINI_API_KEY=(.*)/);
const GEMINI_API_KEY = match ? match[1].trim() : null;

if (!GEMINI_API_KEY) {
    console.error("Please set GEMINI_API_KEY in .env.local");
    process.exit(1);
}

const localesDir = path.join(__dirname, 'src', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const newEnglishCopy = {
    "landing_desc": "Say goodbye to tedious planning. Simply provide your confirmed flight and hotel details, and our top-tier AI will craft a precision-timed, perfectly routed itinerary just for you.",
    "step2_title": "Precision AI Routing",
    "step2_desc": "Our AI uses your exact hotel as the daily anchor, calculating precise transit times and optimal routes so you never waste a single minute of your trip.",
    "faq_a1": "HKfirstclick allows you to input your destination, flight times, and hotel address, converting them into a highly actionable, precision-timed itinerary using AI.",
    "faq_a2": "Our system analyzes your specific needs, dietary restrictions, and exact flight schedule to calculate the most logical point-to-point daily routes.",
    "faq_q4": "Is the generated itinerary timing accurate?",
    "faq_a4": "Yes! By providing your exact flight arrival/departure times and hotel address, the AI calculates realistic buffer times for airport transit and daily commutes.",
    "ws_desc": "Fill in your flight and hotel details below. Our AI will calculate the optimal daily routes and generate a professional itinerary for you."
};

async function translate(targetLang, textObj) {
    if (targetLang === 'English' || targetLang === 'en') return textObj;

    const prompt = `Translate the following JSON object values into the language corresponding to language code '${targetLang}'. Keep the keys exactly the same. Output ONLY valid JSON, nothing else.\n\n${JSON.stringify(textObj, null, 2)}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        })
    });

    if (!res.ok) {
        throw new Error(`Gemini API failed with status ${res.status}`);
    }

    const data = await res.json();
    let resultText = data.candidates[0].content.parts[0].text;
    resultText = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(resultText);
}

async function main() {
    for (const file of files) {
        const langCode = file.replace('.json', '');
        console.log(`Processing ${langCode}...`);

        const filePath = path.join(localesDir, file);
        const originalData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        try {
            const translatedCopy = await translate(langCode, newEnglishCopy);

            // Merge back into original
            for (const key of Object.keys(newEnglishCopy)) {
                if (translatedCopy[key]) {
                    originalData[key] = translatedCopy[key];
                }
            }

            fs.writeFileSync(filePath, JSON.stringify(originalData, null, 4));
            console.log(`Successfully updated ${file}`);
        } catch (e) {
            console.error(`Error updating ${file}:`, e);
        }
    }
    console.log("Translation pass complete!");
}

main();
