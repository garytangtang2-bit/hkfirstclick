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
        // According to TravelPayouts Data API v1: /v1/prices/cheap endpoint
        const url = `https://api.travelpayouts.com/v1/prices/cheap?origin=${originIata}&destination=${destIata}&depart_date=${departDate}&return_date=${returnDate}&currency=USD`;
        const res = await fetch(url, {
            headers: {
                "x-access-token": TP_API_TOKEN
            }
        });

        if (res.ok) {
            const data = await res.json();
            if (data.success && data.data && data.data[destIata]) {
                const flightOptions = Object.values(data.data[destIata]);
                if (flightOptions.length > 0) {
                    const cheapestFlight: any = flightOptions[0]; // Take the first result

                    // Generate Affiliate Link (Aviasales standard format)
                    const affiliateLink = `https://search.aviasales.com/flights/?origin_iata=${originIata}&destination_iata=${destIata}&depart_date=${departDate}&return_date=${returnDate}&marker=${TP_MARKER}`;

                    return {
                        flightQuote: {
                            outbound: `Flight from ${originIata} to ${destIata} (Airline: ${cheapestFlight.airline})`,
                            return: `Return from ${destIata} to ${originIata}`, // Simple representation
                            estCost: cheapestFlight.price, // API returns price in USD
                            currency: "USD",
                            bookingUrl: affiliateLink,
                        },
                        // We will just provide a mock hotel for now as Hotellook requires more setup, 
                        // but we can generate an affiliate link pointing to the City's hotel search
                        hotelQuote: {
                            name: `Recommended Hotel near ${destIata}`,
                            stars: 4,
                            estCostPerNight: 100, // Average estimate
                            bookingUrl: `https://search.hotellook.com/hotels/?destination=${destIata}&checkIn=${departDate}&checkOut=${returnDate}&marker=${TP_MARKER}`
                        }
                    };
                }
            }
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
            bookingUrl: `https://search.aviasales.com/flights/?origin_iata=${originIata}&destination_iata=${destIata}&marker=${TP_MARKER}`
        },
        hotelQuote: {
            name: `Grand Central ${destIata}`,
            stars: 4,
            estCostPerNight: 120,
            bookingUrl: `https://search.hotellook.com/hotels/?destination=${destIata}&marker=${TP_MARKER}`
        },
    };
}

export async function POST(req: Request) {
    try {
        const { origin, destination, dates, preferences, currency, uiLanguage } = await req.json();

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
    - 旅遊天數：${dates.start} to ${dates.end}
    - 旅遊風格：${preferences.style}
    - 核心目的：${preferences.purposes.join(", ")}
    - 整體預算：${preferences.budget} ${currency}
    - 特殊需求：${preferences.requests}
    
    # Constraints & Logic
    1. **消費等級控制**：請嚴格遵守 ${preferences.budget} ${currency} 的預算。若為「背包客」，應優先推薦免費或低價景點；若為「奢華享受」，請推薦當地頂級體驗。
    2. **行程節奏**：
       - 背包客：行程可以較緊湊，多利用大眾運輸。
       - 舒適平衡：每天安排 2-3 個主要景點，預留休息時間。
       - 奢華享受：步調緩慢，強調服務品質與舒適度。
    3. **目的權重**：請在行程中優先分配時間給 [${preferences.purposes.join(", ")}] 相關的活動。
    4. **特殊需求**：必須完全滿足此特殊需求: [${preferences.requests}]。
    5. **語言與視覺化**: ${langInstruction} 請多利用 Emoji 來增加可讀性。
    6. **預算衝突與貼心提醒**: 若預算與旅遊風格明顯衝突（如預算不足以支撐奢華風格），請在「advice」欄位開頭給予誠懇的建議，並在預算範圍內提供最接近該風格的替代方案。此外，請在「advice」欄位針對該目的地的天氣、交通或特殊習俗提供 3 點建議。
    7. **Google Maps 連結**: 請在每個景點描述後方加上一個 markdown 連結，格式為 [Google Maps](https://www.google.com/maps/search/?api=1&query=景點名稱)。
    8. **每日行程安排**: 每天的行程 (activities) 必須包含：上午活動、午餐、下午活動、晚餐、住宿建議。若該天為到達日或結束日，請加入交通接送與住宿 Check-in/out，並保留緩衝時間。
    9. **聯盟行銷連結 (重要)**: 我會在下方提供真實的機票與飯店預訂連結 (bookingUrl)，請你「必須」將這些預訂網址填入 JSON 格式的 bookingUrl 欄位中，不要遺漏。
    
    # Extra Data needed across the app
    - Generate a 'heroImageKeyword' (English only) for an Unsplash background photo.
    - For Budget calculation, you MUST provide an exact 'estCostNumber' (an integer representing the cost in ${currency}). If free, 'estCostNumber' should be 0.
    - For activities requiring tickets (Theme Parks, Museums), set 'needsTicket: true' and provide a placeholder 'ticketUrl' (e.g., https://klook.com/...).
    
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
        const openAIRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-5-mini", // Using mini for speed and cost-effectiveness
                messages: [{ role: "system", content: systemPrompt }],
                max_completion_tokens: 8000,
                response_format: { type: "json_object" }
            })
        });

        const rawAiRes = await openAIRes.text();
        let aiData;
        try {
            aiData = JSON.parse(rawAiRes);
        } catch (e) {
            console.error("Failed to parse OpenAI response as JSON. Status:", openAIRes.status);
            console.error("Raw response body:", rawAiRes);
            throw new Error(`OpenAI API returned an invalid response (Status ${openAIRes.status}). The model might be unavailable or returning an error page.`);
        }

        if (!openAIRes.ok || aiData.error) {
            const errorMessage = aiData?.error?.message || rawAiRes || "Unknown error from AI";
            throw new Error(errorMessage);
        }

        let itineraryJson;
        try {
            let contentStr = aiData.choices?.[0]?.message?.content || "";

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
