import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
                // Fetch user's exact tier and credits
                const { data: profile, error: profileError } = await supabaseAdmin
                    .from("profiles")
                    .select("tier, credits")
                    .eq("id", user.id)
                    .single();

                if (profileError) {
                    console.error("Error fetching user profile:", profileError);
                }

                if (profile) {
                    tier = profile.tier;
                    userCredits = profile.credits;
                } else {
                    console.warn(`Profile not found for user ID: ${user.id}`);
                }
            }
        }

        // 🚨 Business Logic Constraint: Ensure user has enough credits
        if (userCredits <= 0) {
            return NextResponse.json(
                { error: "You do not have enough credits to generate an itinerary. Please top up your account." },
                { status: 402 }
            );
        }

        // 🚨 Business Logic Constraint: FREE/TRIAL users are capped at 5 days max.
        if (tier === "TRIAL" && tripDays > 5) {
            return NextResponse.json(
                { error: "Free trial users are limited to generating itineraries up to 5 days. Please upgrade your plan for longer trips." },
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

        const premiumSearchInstruction = (tier === "PAID" || tier === "PREMIUM")
            ? "6.**即時上網搜尋精選(Premium)**: 請務必主動使用上網搜尋功能，查詢該目的地「最新熱門、必去的景點與當季活動」，篩選出網路評價極佳的地點，並排入行程清單中。"
            : "";

        const systemPrompt = `你是一位專業旅遊規劃師，請根據以下條件打造行程。
# User Input
目的地:${destination}(出發:${origin})|日期:${dates.start}至${dates.end}|航班:Day1抵達${flightTimes?.arrival || "14:00"},LastDay起飛${flightTimes?.departure || "18:00"}|住宿:${hotelInfo || "市中心"}|人數:${preferences?.groupSize?.adults || 2}大${preferences?.groupSize?.children || 0}小${preferences?.hasElders ? '(含長輩,需減少步行/爬坡)' : ''}${preferences?.accessibility ? '(需無障礙/推車友善環境)' : ''}|風格:${preferences?.style}|交通偏好:${preferences?.transportation === 'taxi' ? '計程車/包車為主' : '大眾運輸為主'}|目的:${preferences?.purposes?.join(",") || "觀光"}|預算:${preferences?.budget}${currency}|飲食限制:${preferences?.dietary || "無"}|必去清單:${preferences?.mustVisit || "無"}|其他需求:${preferences?.requests || "無"}

# 核心規則 (需嚴格遵守)
1.**住宿分配**: 若用戶有提供住宿資訊 (${hotelInfo || "無"})，請完全直接複製名稱，不要重新推薦。若需推薦，**必須是位於 ${destination} 境內的真實飯店/旅館**，絕對不可推薦活動或景點，且不可跨國/跨區推薦(如去日本卻推薦南京的飯店)。
2.**時間控管與邏輯性**:
 - Day1 從抵達的 2 小時後開始。LastDay **必須排定提早 2.5 到 3 小時抵達機場**。
 - **每日起訖**: 每一天的第一個行程**必須**是「從住宿出發」，每一天的最後一個行程**必須**是「返回住宿休息」。
 - 行程安排**必須極度符合現實邏輯與實際地理距離**。請考慮真實的**營業開放時間** (勿於深夜安排博物館、商店等)。
 - 活動前後順序需合理。不可安排不合理的連續行程 (例如吃完晚餐後立刻去夜市再吃一餐)，每日景點密度需適中不可過度重複 (如整天都是寺廟) 除非用戶特別要求。請盡量參考網路上真實旅客熱門推薦的高評價景點，打造符合其風格的客製化行程。
3.**極度精簡輸出(節省Token)**: 所有 \`description\` 與 \`content\` 必須控制在50字內，切勿廢話，並使用Emoji。${langInstruction}
4.**地點與交通文字格式**: 
 - JSON 中的 \`location\` 欄位**只能是純文字的景點或地址名稱** (絕對不要寫成 [Google Maps](url))。
 - 每個 activity (除了每日最後一個返回住宿的活動外)，**必須包含 \`transitToNext\` 物件**，提供前往下一個地點的「交通方式與預估時間」。
 - 每個 activity **必須包含 \`imageSearchKeyword\` 欄位**，提供該地點的**官方或常用英文名稱** (例如 "Taipei 101" 或 "Senso-ji Temple")，專門用於後續自動搜尋 Wikimedia 圖庫。如果是普通吃飯或逛街，請給當地通用的英文景點關鍵字。
5.**真實機票與設定**: 機票資訊請沿用下方【報價參考】。若用戶已明確提供自訂的去程航班或抵達資訊，請在 JSON 中將 \`estCostNumber\` 設為 0 以隱藏無效票價。
${premiumSearchInstruction}
- 住宿:只用Klook, 附上 \`?aid=${TP_MARKER}&af_wid=${TP_MARKER}\`
- 門票/交通券(依語言/類型替換<名稱>):
 (1)中文+景點: \`https://tp.media/r?campaign_id=137&erid=2Vtzqw6jKWc&marker=706940&p=4110&trs=503142&u=https%3A%2F%2Fwww.klook.com%2Fzh-TW%2Fsearch%2Fresult%2F%3Fquery%3D<名稱>%26sort%3Dmost_relevant%26start%3D1%26tab_key%3D2\`
 (2)中文+交通: 同上但 \`tab_key=30\`
 (3)非中文+景點: \`...en-US/search/result/?query=<名稱>%26...tab_key%3D2\`
 (4)非中文+交通: \`...en-US/search/result/?clickId=b89bca4fc3%26query=<名稱>%26...tab_key%3D30\`
- 機票:用Kiwi, 附上 \`?affilid=${TP_MARKER}\`

報價參考:
機票:${JSON.stringify(liveTravelData.flightQuote)}
住宿:${JSON.stringify(liveTravelData.hotelQuote)}

# Output JSON ONLY
{
"destination":"City",
"heroImageKeyword":"english keyword",
"flights":{"outbound":{"airline":"A","departureTime":"09:00","arrivalTime":"11:00","airportArrivalInstruction":"Desc","estCost":"${currency} 450","estCostNumber":450,"bookingUrl":"url_kiwi"},"return":{"airline":"A","departureTime":"17:00","arrivalTime":"19:00","airportArrivalInstruction":"提早三小時抵達機場","estCost":"Inc","estCostNumber":0,"bookingUrl":"url_kiwi"}},
"hotel":{"name":"Hotel","checkIn":"15:00","checkOut":"11:00","estCost":"${currency} 120/nt","estCostNumber":480,"bookingUrl":"url_klook"},
"adviceArr":[{"title":"住宿交通","content":"原因"},{"title":"路線邏輯","content":"原因"},{"title":"行前準備","content":"準備"},{"title":"須知","content":"須知"}],
"days":[{"date":"2026-02-23","theme":"Arrival","activities":[{"time":"14:00","title":"從住宿出發","description":"準備開始精彩旅程","location":"真實地點名稱","imageSearchKeyword":"English Keyword for Place","cost":"0","costNumber":0,"needsTicket":false,"transitToNext":{"mode":"捷運 (機場專線)","duration":"約 45 分鐘"}}]}]
}`;

        // 4. Determine Dynamic AI Models based on User Tier
        let primaryModel = "gemini-2.5-flash"; // Default for Free/Trial
        let fallbackModel = "gpt-4o-mini"; // Default fallback

        if (tier === "PAID" || tier === "PREMIUM") {
            primaryModel = "gemini-3-flash-preview";
            fallbackModel = "gpt-5-mini";
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
                    ...((tier === "PAID" || tier === "PREMIUM") ? { tools: [{ googleSearch: {} }] } : {}),
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
            const { error: updateError } = await supabaseAdmin
                .from("profiles")
                .update({ credits: userCredits - 1 })
                .eq("id", userId);

            if (updateError) {
                console.error("Failed to deduct credits:", updateError);
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
