import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("🚨 Error: GEMINI_API_KEY environment variable is missing.");
    console.log("Please run the script like this (Windows PowerShell):");
    console.log("$env:GEMINI_API_KEY='your_api_key_here'; node generateAllItineraries.mjs");
    process.exit(1);
}

// Extract cities from cityTranslations.ts with a more robust regex
const cityTranslationsPath = path.join(__dirname, 'src/utils/cityTranslations.ts');
const cityTranslationsContent = fs.readFileSync(cityTranslationsPath, 'utf-8');

const cities = [];
const regex = /"([^"]+)":\s*{\s*name:\s*{[\s\S]*?EN:\s*"([^"]+)"[\s\S]*?}[\s\S]*?recommendedDays:\s*(\d+)/g;

let match;
while ((match = regex.exec(cityTranslationsContent)) !== null) {
    const slug = match[2].toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    cities.push({
        origName: match[1],
        slug: slug,
        days: parseInt(match[3], 10)
    });
}

const destDir = path.join(__dirname, 'src/data/destinations');
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// The Prompt
const getPrompt = (cityName, days) => `
【角色設定與任務目標】
你現在是一位擁有千萬流量的頂級旅遊部落客與 SEO 專家（寫作風格請參考「波比看世界」或「tsunagu Japan」）。
請幫我撰寫一份專屬的旅遊攻略。

目的地：${cityName}
旅遊天數：${days} 天

【寫作風格與語氣】
語氣必須充滿熱情、專業且極具感染力，讓讀者一看就想立刻買機票出發。
使用繁體中文撰寫，適度加入 Emoji (如 🍜, ⛩️, 📸) 增加閱讀趣味。
內容必須具備極高的實用性，包含交通提示或必吃美食建議。

【API 圖片搜尋整合機制】
我的系統擁有內建的圖片搜尋 API。請在每一個需要顯示照片的地方，提供一個最精準的英文搜尋關鍵字（例如："Sensoji Temple Tokyo" 或 "Eiffel Tower sunset"），放在 image_search_keyword 欄位中，我的系統會自動抓取並顯示照片。

【嚴格 JSON 輸出格式】
為了配合前端系統渲染，請「嚴格」輸出為以下 JSON 格式，不要包含任何 Markdown 標記或其他解釋文字：

{
  "seo_meta": {
    "title": "【2026 ${cityName} 自由行】最強 ${days} 日行程規劃懶人包！景點交通＆必吃全攻略",
    "description": "第一次去 ${cityName} 怎麼玩？這篇超完整的 ${days} 天 ${cityName} 自由行攻略，帶你一次逛完必去景點、品嚐在地美食..."
  },
  "hero_section": {
    "hook_intro": "用 2-3 段充滿熱情的文字，介紹這個城市的魅力，並說明這趟 ${days} 天行程的核心亮點。",
    "hero_image_keyword": "代表該城市最經典風景的英文關鍵字"
  },
  "daily_itinerary": [
    {
      "day": 1,
      "day_title": "Day 1：(填入當天核心主題)",
      "activities": [
        {
          "time_slot": "早上",
          "spot_name": "景點或餐廳名稱",
          "image_search_keyword": "精準的英文景點名稱 (用於 API 抓圖)",
          "rich_description": "用部落客的口吻詳細介紹這裡為什麼必去？有什麼必吃或必看？(約 80-100 字)",
          "practical_tip": "💡 達人小提示：(例如交通方式、最佳拍照位置或避開人潮的秘訣)"
        }
      ]
    }
  ]
}

【行程規劃邏輯要求】
動線必須完全符合真實地理位置，絕不允許一天內跨越城市兩端（不走回頭路）。
每天必須包含「早上」、「下午」、「晚上」三個時段的行程。
行程節奏必須合理，包含景點、用餐與逛街購物。

直接輸出純 JSON，不可有任何額外的文字或 markdown 區塊（例如不可輸出 \`\`\`json）。
`;

async function generateWithRetry(city, retries = 3) {
    const filePath = path.join(destDir, `${city.slug}.json`);
    if (fs.existsSync(filePath)) {
        console.log(`⏭️ Skipping ${city.slug}.json (already exists)`);
        return;
    }

    const prompt = getPrompt(city.origName, city.days);

    for (let i = 0; i < retries; i++) {
        console.log(`⏳ [Try ${i+1}/${retries}] Generating for ${city.origName} (${city.slug})...`);
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        responseMimeType: "application/json"
                    }
                })
            });

            if (response.status === 503) {
                console.warn(`⚠️ 503 Service Unavailable for ${city.origName}. Waiting 5s...`);
                await new Promise(r => setTimeout(r, 5000));
                continue;
            }

            if (!response.ok) {
                console.error(`❌ Failed for ${city.origName}: ${response.status} ${response.statusText}`);
                continue;
            }

            const data = await response.json();
            let text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                // Robust JSON extraction: Find first { and last }
                const start = text.indexOf('{');
                const end = text.lastIndexOf('}');
                if (start !== -1 && end !== -1) {
                    text = text.substring(start, end + 1);
                }

                try {
                    const jsonObj = JSON.parse(text);
                    fs.writeFileSync(filePath, JSON.stringify(jsonObj, null, 2), 'utf-8');
                    console.log(`✅ Successfully saved: ${city.slug}.json`);
                    return; // Success!
                } catch (parseError) {
                    console.error(`❌ JSON Parse Error for ${city.origName}: ${parseError.message}`);
                    if (i === retries - 1) {
                        // Log raw text for debugging on last try
                        fs.writeFileSync(path.join(destDir, `${city.slug}.error.log`), text, 'utf-8');
                    }
                }
            }
        } catch (fetchError) {
            console.error(`❌ Fetch Error for ${city.origName}: ${fetchError.message}`);
        }
        await new Promise(r => setTimeout(r, 2000));
    }
}

async function runAll() {
    console.log(`📌 Found ${cities.length} cities total.`);
    
    for (const city of cities) {
        await generateWithRetry(city);
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    console.log(`🎉 All missing cities have been processed!`);
}

runAll();
