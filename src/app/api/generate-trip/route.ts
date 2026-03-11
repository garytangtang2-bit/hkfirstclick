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
        const langInstruction = uiLanguage ? `You MUST output all generated text, descriptions, advice, and titles ENTIRELY in ${uiLanguage}. This is a strict requirement.` : "MUST output responses in the user's inferred language based on their input.";

        const premiumSearchInstruction = (tier === "PASS" || tier === "YEARLY")
            ? "6.**即時上網搜尋精選(Premium)**: 請務必主動使用上網搜尋功能，查詢該目的地「最新熱門、必去的景點與當季活動」，篩選出網路評價極佳的地點，並排入行程清單中。"
            : "";

        const systemPrompt = `你係一位擁有 20 年經驗嘅頂級私人旅遊定制專家。你需要根據客戶提供嘅資料，經過嚴密嘅物流、時間、行李安置同埋成員組合分析後，嚴格按照我指定嘅「強制輸出格式」輸出行程。絕對唔可以包含任何 Markdown 格式、引言、結語或多餘的對話文字。

# 【客戶資料輸入區】
目的地:${destination}(出發:${origin})|日期:${dates.start}至${dates.end}|航班:Day1抵達${flightTimes?.arrival || "14:00"},LastDay起飛${flightTimes?.departure || "18:00"}|住宿:${hotelInfo || "市中心"}|人數:${preferences?.groupSize?.adults || 2}大${preferences?.groupSize?.children || 0}小${preferences?.hasElders ? '(含長輩)' : ''}${preferences?.accessibility ? '(需要無障礙)' : ''}|風格:${preferences?.style}|交通偏好:${preferences?.transportation === 'taxi' ? '的士/包車' : '大眾運輸'}|目的:${preferences?.purposes?.join(",") || "觀光"}|預算:${preferences?.budget}${currency}|飲食限制:${preferences?.dietary || "無"}|必去清單:${preferences?.mustVisit || "無"}|其他需求:${preferences?.requests || "無"}

# 【⚠️ 核心規劃邏輯與嚴格限制（必須遵守）】
0. **強制語言要求 (Language Requirement)**: ${langInstruction}
1. **每日起訖點與合併節點 (Daily Nodes)**:
   - **第一日 (抵達日)**: 第一個活動必須是「抵達機場」。最後一個活動必須是「回到住宿酒店」。
   - **中間日子**: 每日第一站必須是「從住宿酒店出發」，最後一站必須是「回到住宿酒店」。
   - **重要**: 每日首個「從住宿酒店出發」的節點，必須同時包含當天的退房或行李寄存動作。禁止將出發與行李拆分成兩個連續節點。
   - **最後一日 (回程日)**: 第一站必須是「從住宿酒店出發」，最後一站必須是抵達「起飛機場」準備登機。
2. **時間線性與物流管理**:
   - **時間線性原則**: 行程時間必須嚴格由早到晚排列，絕對禁止出現時間倒流。必須準確計算「停留時間 + 交通時間」來推算下一站開始時間。
   - **行李處理**: 在 description 中明確指示機場與酒店間的行李方案。第一日 15:00 前抵達需指示寄存行李。
   - **機場緩衝**: 回程必須預留航班起飛前 3 小時抵達機場。
3. **拒絕公式化與流水帳 (Anti-Boring & Hidden Gems)**:
   - **打破地理侷限**: 禁止只環繞酒店 3 公里範圍活動。必須利用大眾交通探索城市不同區域。
   - **強制隱藏亮點**: 每天除了必去點外，必須根據【目的】加入至少一個在地特色、高評價但較少觀光客知道的「隱藏亮點 (Hidden Gem)」。
4. **具體化與五感體驗描述 (Vivid Descriptions)**:
   - 禁止使用「欣賞風景」、「享受美食」等泛稱。
   - **餐廳**: 必須提供具體真實全名 (如 Shake Shack)，並寫出招牌菜是什麼、為什麼值得吃。
   - **景點**: 寫出最佳拍照角度、歷史背景或當地人獨特玩法。
5. **成員結構與夜生活限制**:
   - 若有兒童或長輩，禁止安排酒吧、夜店等。
   - 若註明需要無障礙路線，必須避開多樓梯、崎嶇山路的地點。

# 【🔗 連結與商業化指令】
${premiumSearchInstruction}
- 住宿: 只用Klook, 附上 ?aid=${TP_MARKER}&af_wid=${TP_MARKER}
- 門票/交通券 (僅限 needsTicket = true): 根據語言顯示 Klook 搜尋連結。
- 機票: 用Kiwi, 附上 ?affilid=${TP_MARKER}

# 【輸出規格與資料結構】
- Location 欄位內容必須以 \`◎\` 開頭 (例如: ◎ 關西國際機場 (KIX))。
- \`transitToNext\`: 具體交通工具及時間。最後一個活動之 transitToNext 必須為 null。

# Output JSON ONLY (No Markdown, No Code Blocks)
{
    "destination": "City",
    "heroImageKeyword": "english_keyword",
    "flights": { 
        "outbound": { "airline": "A", "departureTime": "09:00", "arrivalTime": "11:00", "airportArrivalInstruction": "機場交通指引", "estCost": "${currency} 450", "estCostNumber": 450, "bookingUrl": "url_kiwi" },
        "return": { "airline": "A", "departureTime": "17:00", "arrivalTime": "19:00", "airportArrivalInstruction": "起飛前三小時抵達及行李安排", "estCost": "Inc", "estCostNumber": 0, "bookingUrl": "url_kiwi" }
    },
    "hotel": { "name": "酒店全名", "checkIn": "15:00", "checkOut": "11:00", "estCost": "${currency} 120/nt", "estCostNumber": 480, "bookingUrl": "url_klook" },
    "adviceArr": [{ "title": "建議", "content": "內容" }],
    "days": [{ 
        "date": "YYYY-MM-DD", 
        "theme": "當日主題摘要", 
        "daySummary": "當日核心地區導覽", 
        "activities": [{ 
            "time": "HH:mm", 
            "title": "活動大標題", 
            "description": "詳細介紹 (包含隱藏亮點描述、招牌菜、拍照攻略、行李提示)", 
            "location": "◎ 正確地點名稱", 
            "imageSearchKeyword": "English_Name", 
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
