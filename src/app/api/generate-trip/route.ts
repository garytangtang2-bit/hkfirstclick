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

        const systemPrompt = `你是一位專業的資深旅遊規劃師，擅長根據客戶的預算、風格與目的，量身打造兼具深度與流暢度的旅遊行程。
    
    # User Input Data
    - 目的地：${destination} (出發地: ${origin})
    - 旅遊天數：${dates.start} 到 ${dates.end}
    - 航班時間：Day 1 抵達 ${flightTimes?.arrival || "14:00"} | Last Day 起飛 ${flightTimes?.departure || "18:00"}
    - 住宿資訊 (錨點)：${hotelInfo || "未說明，請先當作在主要市區"}
    - 旅遊團體組成：${preferences?.groupSize?.adults || 2} 位成人, ${preferences?.groupSize?.children || 0} 位兒童
    - 旅遊風格：${preferences?.style}
    - 核心目的：${preferences?.purposes?.join(", ") || "觀光打卡"}
    - 整體預算：${preferences?.budget} ${currency}
    - 飲食限制：${preferences?.dietary || "無"}
    - 其他特殊需求：${preferences?.requests || "無"}
    
    # Constraints & Logic
    1. **住宿錨點與交通精算 (極度重要)**：每天的行程都「必須」以 ${hotelInfo || "市中心推薦飯店"} 為起點與終點。規劃路線時，必須將「前往該飯店的車程與步行時間」考慮進去，切勿發生東南西北亂跑的無效路線。
    2. **嚴格時間控管 (第一天與最後一天)**：
       - Day 1：行程的起始時間，必須是班機抵達 (${flightTimes?.arrival || "14:00"}) 的「至少 2 小時後」（扣除通關與機場交通）。
       - Last Day：行程的結束時間，必須是班機起飛 (${flightTimes?.departure || "18:00"}) 的「至少 3.5 小時前」（提前抵達機場並扣除交通時間）。
    3. **消費等級控制**：請嚴格遵守 ${preferences?.budget} ${currency} 的預算。
    4. **行程節奏與群體適配**：目前有 ${preferences?.groupSize?.children || 0} 名兒童。若超過 0 名小童，步調必須放緩、安排親子友善餐廳與景點。
    5. **飲食限制嚴格遵守**：必須完全避開 ${preferences?.dietary || "無"} 的餐廳或食物，這是健康與信仰的最高準則。
    6. **目的權重**：請優先分配時間給 [${preferences?.purposes?.join(", ")}] 相關景點。完全滿足特殊需求: [${preferences?.requests}]。
    7. **語言與視覺化**: ${langInstruction} 請多利用 Emoji 來增加可讀性。
    8. **Google Maps 連結**: 行程表中的每一個地點（包含景點、活動、餐廳、酒店等），「必須」附帶可點擊的 Google Maps 連結。格式：[Google Maps](https://www.google.com/maps/search/?api=1&query=確切地點名稱首都市)。
    9. **每日必備元素**: 每天的行程 (activities) 必須包含：上午活動、午餐、下午活動、晚餐、返回住宿。
    9. **聯盟行銷連結與資料來源 (重要)**:
       - **飯店/住宿**：所有的住宿推薦「必須」且「只能」使用 Klook (客路) 平台。在 JSON 的 \`bookingUrl\` 提供該平台對應該飯店的連結，並務必在網址結尾加上您的追蹤參數 \`?aid=${TP_MARKER}&af_wid=${TP_MARKER}\`。拒絕出現其他任何平台（如 Booking.com、Agoda）。
       - **門票/活動**：若行程需要購買門票（迪士尼、一日遊等），「必須」且「只能」推薦能在 Klook 找到的行程。在 JSON 的 \`ticketUrl\` 填入該平台的**搜尋連結**，並將搜尋關鍵字（例如景點名稱）放入 \`query=\` 參數中。連結格式必須長這樣：\`https://www.klook.com/zh-TW/search/result/?aid=api%7C13694%7Cc3c7cbfa255840018213fd600-706940%7Cpid%7C706940&erid=2Vtzqw6jKWc&query=<景點名稱>&aff_pid=706940&utm_medium=affiliate-alwayson&utm_source=network&utm_campaign=13694&utm_term=706940\`。確保所有的活動門票連結都是這種帶有完整追蹤碼的搜尋格式。
       - **機票**：必須優先使用我提供的 Kiwi.com 機票 \`bookingUrl\`，或者自行生成 Kiwi.com 的搜尋連結，並帶有專屬參數 \`?affilid=${TP_MARKER}\`。
    
    # Extra Data needed across the app
    - Generate a 'heroImageKeyword' (English only) for an Unsplash background photo.
    - For Budget calculation, you MUST provide an exact 'estCostNumber' (an integer representing the cost in ${currency}). If free, 'estCostNumber' should be 0.
    - For activities requiring tickets, MUST set 'needsTicket: true' and provide a valid 'ticketUrl' generated from the rules above.
    
    Here is the live pricing data currently available for their dates:
    Flights: ${JSON.stringify(liveTravelData.flightQuote)}
    Hotels: ${JSON.stringify(liveTravelData.hotelQuote)}

    # Output Format (JSON ONLY)
    Return a JSON object EXACTLY in this format, with no markdown formatting or backticks:
    {
      "destination": "The specific inferred city/airport (e.g., Taipei, Taiwan)",
      "heroImageKeyword": "english keyword for unsplash",
      "flights": {
        "outbound": {
            "airline": "Airline Name",
            "departureTime": "09:00 AM",
            "arrivalTime": "11:00 AM",
            "airportArrivalInstruction": "Description...",
            "estCost": "${currency} 450",
            "estCostNumber": 450,
            "bookingUrl": "https://partners.skyscanner.net/..."
        },
        "return": {
            "airline": "Airline Name",
            "departureTime": "05:00 PM",
            "arrivalTime": "07:00 PM",
            "airportArrivalInstruction": "Description...",
            "estCost": "Included",
            "estCostNumber": 0,
            "bookingUrl": "https://partners.skyscanner.net/..."
        }
      },
      "hotel": {
          "name": "Recommended Hotel Name",
          "checkIn": "03:00 PM",
          "checkOut": "11:00 AM",
          "estCost": "${currency} 120 / night",
          "estCostNumber": 480,
          "bookingUrl": "https://agoda.com/partners/..."
      },
      "adviceArr": [
        {
          "title": "住宿與交通定調",
          "content": "Why the hotel area is chosen based on transit and the user's budget."
        },
        {
          "title": "行程路線邏輯",
          "content": "How the days are geographically grouped."
        },
        {
          "title": "行前準備與行李",
          "content": "Clothing, packing tricks based on the weather."
        },
        {
          "title": "實用旅遊須知",
          "content": "Practical Info like Visas, exchange rates, plug types, etc."
        }
      ],
      "days": [
        {
          "date": "2026-02-23",
          "theme": "Arrival and City Exploration",
          "activities": [
             {
               "time": "02:00 PM",
               "title": "Activity Title (e.g., Lunch at xxx)",
               "description": "Detailed description. Include transport method. Please include Google Maps links like [Google Maps](https://www.google.com/maps/search/?api=1&query=Name)",
               "location": "Address or Place Name",
               "cost": "Est. Cost string",
               "costNumber": 15,
               "needsTicket": true,
               "ticketUrl": "https://klook.com/..."
             }
          ]
        }
      ]
    }`;

        // 4. Call OpenAI API securely
        // 4. Call Gemini API securely
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not configured.");
        }

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
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
        try {
            aiData = JSON.parse(rawAiRes);
        } catch (e) {
            console.error("Failed to parse Gemini response as JSON. Status:", geminiRes.status);
            console.error("Raw response body:", rawAiRes);
            throw new Error(`Gemini API returned an invalid response (Status ${geminiRes.status}).`);
        }

        if (!geminiRes.ok || aiData.error) {
            const errorMessage = aiData?.error?.message || rawAiRes || "Unknown error from Gemini AI";
            throw new Error(errorMessage);
        }

        let itineraryJson;
        try {
            let contentStr = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

            // In case the model ignored "no markdown" and returned ```json ... ```
            contentStr = contentStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            if (!contentStr) {
                throw new Error("Content string is empty");
            }

            itineraryJson = JSON.parse(contentStr);
        } catch (e: any) {
            console.error("Failed to parse AI message content:", rawAiRes);
            throw new Error(`AI failed to return valid JSON format for the itinerary. Please try again. \n\nFULL API Response:\n${rawAiRes}`);
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
