import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserCredits, deductCredits } from "@/utils/credits";

// Use service role key to bypass RLS and update credits securely
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const TP_API_TOKEN = process.env.TRAVELPAYOUTS_API_TOKEN || "cc66f5cef74bc5caa83d12b6bf05b37a";
const TP_MARKER = process.env.TRAVELPAYOUTS_MARKER || "503142";

// Helper: Convert User's Text "City Name" to IATA Code (e.g. Taipei -> TPE) using Travelpayouts Autocomplete
async function getCityIata(cityName: string): Promise<string | null> {
    try {
        const res = await fetch(`http://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(cityName)}&locale=en&types[]=city`);
        if (!res.ok) return null;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
            return data[0].code; // Return the most relevant IATA code
        }
    } catch (err) {
        console.error("TravelPayouts Autocomplete Error:", err);
    }
    return null;
}

// Helper: Fetch real flight prices
async function fetchLiveFlightData(originIata: string, destIata: string, departDate: string, returnDate: string) {
    try {
        const processFlightData = (data: any) => {
            if (data.success && data.data && data.data[destIata]) {
                const flightOptions = Object.values(data.data[destIata]);
                if (flightOptions.length > 0) {
                    const cheapestFlight: any = flightOptions[0]; // Take the first result
                    const affiliateLink = `https://www.kiwi.com/en/search/results/${originIata}/${destIata}/${departDate}/${returnDate}?affilid=${TP_MARKER}`;
                    return {
                        flightQuote: {
                            outbound: `Flight from ${originIata} to ${destIata} (Airline: ${cheapestFlight.airline})`,
                            return: `Return from ${destIata} to ${originIata}`, // Simple representation
                            estCost: cheapestFlight.price, // API returns price in USD
                            currency: "USD",
                            bookingUrl: affiliateLink,
                        },
                        hotelQuote: {
                            name: `Recommended Hotel near ${destIata}`,
                            stars: 4,
                            estCostPerNight: 90, // Average estimate
                            bookingUrl: `https://www.klook.com/search/?searchTerm=${destIata}&aid=${TP_MARKER}`
                        }
                    };
                }
            }
            return null;
        };

        let res = await fetch(`https://api.travelpayouts.com/v1/prices/cheap?origin=${originIata}&destination=${destIata}&depart_date=${departDate}&return_date=${returnDate}&currency=USD`, {
            headers: { "x-access-token": TP_API_TOKEN }
        });

        let result = res.ok ? processFlightData(await res.json()) : null;

        // Fallback: If exact dates return no cache, fetch ANY cheap flight for the route to get a price estimate
        if (!result) {
            res = await fetch(`https://api.travelpayouts.com/v1/prices/cheap?origin=${originIata}&destination=${destIata}&currency=USD`, {
                headers: { "x-access-token": TP_API_TOKEN }
            });
            result = res.ok ? processFlightData(await res.json()) : null;
        }

        if (result) {
            return result;
        }

    } catch (err) {
        console.error("TravelPayouts Data API Error:", err);
    }

    // Fallback if the API returns nothing or user enters invalid dates
    return {
        flightQuote: {
            outbound: `Flight ${originIata} -> ${destIata}`,
            return: `Flight ${destIata} -> ${originIata}`,
            estCost: 450,
            bookingUrl: `https://www.kiwi.com/en/search/results/${originIata}/${destIata}?affilid=${TP_MARKER}`
        },
        hotelQuote: {
            name: `Grand Central ${destIata}`,
            stars: 4,
            estCostPerNight: 120,
            bookingUrl: `https://www.klook.com/search/?searchTerm=${destIata}&aid=${TP_MARKER}`
        },
    };
}

export async function POST(req: Request) {
    try {
        const { origin, destination, dates, flightTimes, hotelInfo, preferences, currency, uiLanguage } = await req.json();

        // Calculate trip duration
        const startDate = new Date(dates.start);
        const endDate = new Date(dates.end);
        const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;

        // 1. Verify User Session & Credits securely on the server
        const authHeader = req.headers.get("Authorization");
        let tier = "TRIAL"; // Default assumption
        let userCredits = 0;
        let userId: string | null = null;

        if (authHeader) {
            const token = authHeader.replace("Bearer ", "");
            const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

            if (user) {
                userId = user.id;
                // Fetch user's exact tier and active credits using helper
                const result = await getUserCredits(user.id);
                tier = result.tier;
                userCredits = result.activeCredits;
            }
        }

        // 🚨 Business Logic Constraint: Ensure user has enough credits
        if (userCredits < 5) {
            return NextResponse.json(
                { error: "You need at least 5 credits to generate a new itinerary. Please top up your account." },
                { status: 402 }
            );
        }

        // 🚨 Business Logic Constraint: FREE/TRIAL/Casual users are capped at 5 days max.
        if ((tier === "TRIAL" || tier === "Casual") && tripDays > 5) {
            return NextResponse.json(
                { error: "Free and Casual users are limited to generating itineraries up to 5 days. Please upgrade to a Journey Pass for longer trips." },
                { status: 403 }
            );
        }

        // 2. Fetch Live Quotes from TravelPayouts API
        // First, convert cities to IATA codes
        const originIata = await getCityIata(origin) || origin;
        const destIata = await getCityIata(destination) || destination;

        // Fetch Real Flight Data & generate affiliate URLs
        const liveTravelData = await fetchLiveFlightData(originIata, destIata, dates.start, dates.end);

        // 3. System Prompt for OpenAI
        const langInstruction = uiLanguage ? `MUST output responses entirely in ${uiLanguage}.` : "MUST output responses in the user's inferred language based on their input.";

        const premiumSearchInstruction = (tier === "PASS" || tier === "YEARLY")
            ? "6.**即時上網搜尋精選(Premium)**: 請務必主動使用上網搜尋功能，查詢該目的地「最新熱門、必去的景點與當季活動」，篩選出網路評價極佳的地點，並排入行程清單中。"
            : "";

        const systemPrompt = `你係一位擁有 20 年經驗嘅頂級私人旅遊定制專家。你需要根據客戶提供嘅資料，經過嚴密嘅物流、時間、行李安置同埋成員組合分析後，嚴格按照我指定嘅「強制輸出格式」輸出行程。絕對唔可以改變我要求嘅排版結構，亦唔可以自行發明新嘅格式。

# 【客戶資料輸入區】
目的地:${destination}(出發:${origin})|日期:${dates.start}至${dates.end}|航班:Day1抵達${flightTimes?.arrival || "14:00"},LastDay起飛${flightTimes?.departure || "18:00"}|住宿:${hotelInfo || "市中心"}|人數:${preferences?.groupSize?.adults || 2}大${preferences?.groupSize?.children || 0}小${preferences?.hasElders ? '(含長輩)' : ''}${preferences?.accessibility ? '(需要無障礙)' : ''}|風格:${preferences?.style}|交通偏好:${preferences?.transportation === 'taxi' ? '的士/包車' : '大眾運輸'}|目的:${preferences?.purposes?.join(",") || "觀光"}|預算:${preferences?.budget}${currency}|飲食限制:${preferences?.dietary || "無"}|必去清單:${preferences?.mustVisit || "無"}|其他需求:${preferences?.requests || "無"}

# 【⚠️ 核心規劃邏輯（LLM 必須執行嘅隱藏思考）】
1. **真實物流與行李處理**:
   - **抵達日**: 行程必須由「抵達機場」開始。必須明確指示點樣由機場去市區。如果未到酒店 Check-in 時間，必須安排先去酒店或車站寄存行李，然後先開始行程。
   - **回程日**: 必須預留航班起飛前 3 小時到達機場。必須說明早上 Check-out 後行李點樣處理（例如寄存喺酒店或沿途車站）。
2. **防幻覺與真實性約束**:
   - 推薦嘅所有餐廳、景點、商舖必須喺現實中真實存在。
   - 餐廳必須嚴格符合客戶嘅【飲食限制】。絕對不能使用「市區午餐」等籠統詞語，必須寫出確實存在的真實、有名、高評價餐廳名稱 (例如: "香港尖沙咀華嫂冰室")。
3. **成員結構與夜生活智能調整**:
   - 有兒童或長輩同行: 絕對禁止安排酒吧、夜店等成人夜生活場所。晚間行程請替換為適合家庭嘅活動（如夜市、睇夜景），或盡早返酒店休息。
   - 全成人同行: 可根據當地文化適度推薦著名嘅夜生活體驗或特色酒吧。
4. **行程密度與豐富度**: 除第一天與最後一天外，**每天必須安排 5-8 個活動/景點 (包含餐飲)**，行程需緊湊且具吸引力，且符合地理距離。
5. **Google Maps 連結自動生成**: 行程中提及嘅每一個具體地點（機場、酒店、景點、餐廳），必須附上 Google Maps 超連結。格式：[地點名稱](https://www.google.com/maps/search/?api=1&query=地點名稱+${destination})。

# 【🔗 連結與商業化指令】
${premiumSearchInstruction}
- 住宿:只用Klook, 附上 ?aid=${TP_MARKER}&af_wid=${TP_MARKER}
- 門票/交通券 (僅限 needsTicket = true): 必須在該景點下方加上購票連結。
  (1)中文: https://tp.media/r?campaign_id=137&erid=2Vtzqw6jKWc&marker=706940&p=4110&trs=503142&u=https%3A%2F%2Fwww.klook.com%2Fzh-TW%2Fsearch%2Fresult%2F%3Fquery%3D<名稱>%26tab_key%3D2
  (2)非中文: ...en-US/search/result/?query=<名稱>%26tab_key%3D2
- 機票:用Kiwi, 附上 ?affilid=${TP_MARKER}

# 【輸出規格】
- \`daySummary\`: 1-2 句話總結當日主題。
- \`transitToNext\`: 具體交通工具 (如 "捷運銀座線", "260 號巴士", "的士") 及真實時間。
- \`imageSearchKeyword\`: 對應地點的**官方或常用英文名稱**，用於圖庫搜尋。
- \`needsTicket\`: 僅限需買門票的地點。餐廳及街道一律為 false。

# Output JSON ONLY
{
    "destination": "City",
    "heroImageKeyword": "english keyword",
    "flights": { 
        "outbound": { "airline": "A", "departureTime": "09:00", "arrivalTime": "11:00", "airportArrivalInstruction": "機場交通指引", "estCost": "${currency} 450", "estCostNumber": 450, "bookingUrl": "url_kiwi" },
        "return": { "airline": "A", "departureTime": "17:00", "arrivalTime": "19:00", "airportArrivalInstruction": "提早三小時抵達機場及行李安排", "estCost": "Inc", "estCostNumber": 0, "bookingUrl": "url_kiwi" }
    },
    "hotel": { "name": "[酒店名稱](https://www.google.com/maps/search/?api=1&query=酒店名稱+${destination})", "checkIn": "15:00", "checkOut": "11:00", "estCost": "${currency} 120/nt", "estCostNumber": 480, "bookingUrl": "url_klook" },
    "adviceArr": [{ "title": "建議", "content": "內容" }],
    "days": [{ 
        "date": "2026-02-23", 
        "theme": "主題", 
        "daySummary": "摘要", 
        "activities": [{ 
            "time": "14:00", 
            "title": "[地點名稱](google_maps_link)", 
            "description": "50字內簡介,行李及物流建議", 
            "location": "精確地址名稱", 
            "imageSearchKeyword": "English Name", 
            "cost": "0", 
            "costNumber": 0, 
            "needsTicket": false, 
            "isFood": false, 
            "bookingUrl": "#",
            "transitToNext": { "mode": "交通方式", "duration": "時間" } 
        }] 
    }]
} `;

        // 4. Determine Dynamic AI Models based on User Tier
        // Both PASS and YEARLY use the same priority model. TRIAL uses the base model.
        let primaryModel = "gemini-2.0-flash"; // Default for TRIAL
        let fallbackModel = "gpt-4o-mini"; // ChatGPT fallback for all tiers

        if (tier === "PASS" || tier === "YEARLY") {
            primaryModel = "gemini-2.5-flash-preview-04-17"; // Priority: same for both paid tiers
        }

        // 5. Call Gemini API securely First
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not configured.");
        }

        let itineraryJson;

        try {
            const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${primaryModel}:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...((tier === "PASS" || tier === "YEARLY") ? { tools: [{ googleSearch: {} }] } : {}),
                    systemInstruction: {
                        parts: [{ text: systemPrompt }]
                    },
                    contents: [{
                        role: "user",
                        parts: [{ text: "Please generate the itinerary JSON based on the system instructions." }]
                    }],
                    generationConfig: {
                        responseMimeType: "application/json",
                    }
                })
            });

            const rawAiRes = await geminiRes.text();
            let aiData;

            if (!geminiRes.ok) {
                throw new Error(`Gemini API Error (Status ${geminiRes.status}): ${rawAiRes}`);
            }

            try {
                aiData = JSON.parse(rawAiRes);
            } catch (e) {
                throw new Error(`Gemini API returned an invalid JSON response.`);
            }

            if (aiData.error) {
                throw new Error(aiData.error.message || "Unknown error from Gemini API");
            }

            let contentStr = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
            contentStr = contentStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            if (!contentStr) {
                throw new Error("Gemini Content string is empty");
            }

            itineraryJson = JSON.parse(contentStr);

        } catch (geminiError: any) {
            console.warn(`⚠️ Gemini Primary Generation Failed (${primaryModel}). Likely quota limit or JSON error. Falling back to OpenAI GPT (${fallbackModel})... ERROR:`, geminiError.message);

            // 5.b Fallback to OpenAI if Gemini fails
            const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
            if (!OPENAI_API_KEY) {
                throw new Error(`Gemini API failed (${geminiError.message}), and OPENAI_API_KEY is not configured for fallback.`);
            }

            const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: fallbackModel,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: "Please generate the itinerary JSON based on the system instructions." }
                    ],
                    response_format: { type: "json_object" }
                })
            });

            if (!openaiRes.ok) {
                const errorData = await openaiRes.text();
                throw new Error(`Fallback Error: OpenAI API failed (Status ${openaiRes.status}) - ${errorData}`);
            }

            const fallbackData = await openaiRes.json();
            let contentStr = fallbackData.choices?.[0]?.message?.content || "";
            contentStr = contentStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            try {
                itineraryJson = JSON.parse(contentStr);
            } catch (fallbackParseError) {
                console.error("Failed to parse OpenAI fallback message content:", contentStr);
                throw new Error(`AI Engines failed to return valid JSON format for the itinerary. Please try again.`);
            }
        }

        // 5. Deduct Credits from Supabase Database securely using Service Role
        let insertedItineraryId = null;

        if (userId) {
            const deductResult = await deductCredits(userId, 5);
            if (!deductResult.success) {
                console.error("Failed to deduct credits:", deductResult.error);
            }

            // 6. Save the itinerary to the database
            const { data: insertedData, error: insertError } = await supabaseAdmin
                .from("itineraries")
                .insert({
                    user_id: userId,
                    title: `${itineraryJson.destination} Trip`,
                    destination: itineraryJson.destination,
                    start_date: dates.start,
                    end_date: dates.end,
                    itinerary_data: itineraryJson,
                    preferences: preferences
                })
                .select("id")
                .single();

            if (insertError) {
                console.error("Failed to save itinerary to database:", insertError);
            } else if (insertedData) {
                insertedItineraryId = insertedData.id;
            }
        }

        return NextResponse.json({
            itinerary: itineraryJson,
            itineraryId: insertedItineraryId
        });

    } catch (err: any) {
        console.error("Trip Generation Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
