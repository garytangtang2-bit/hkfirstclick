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

        const systemPrompt = `You are a top-tier private travel customization expert with 20 years of experience. You must analyze the exact logistics, time constraints, luggage handling, and group composition provided by the user, and strictly output the itinerary in the REQUIRED FORMAT. DO NOT include any Markdown formatting, conversational text, intros, or outros.

# [USER INPUT PROFILES]
Destination:${destination}(Origin:${origin})|Dates:${dates.start} to ${dates.end}|Flights:Day1 Arrival ${flightTimes?.arrival || "14:00"},LastDay Departure ${flightTimes?.departure || "18:00"}|Hotel:${hotelInfo || "City Center"}|Group:${preferences?.groupSize?.adults || 2} Adults ${preferences?.groupSize?.children || 0} Children ${preferences?.hasElders ? '(with Elders)' : ''}${preferences?.accessibility ? '(Needs Accessibility)' : ''}|Style:${preferences?.style}|Transport:${preferences?.transportation === 'taxi' ? 'Taxi/Private' : 'Public Transit'}|Purposes:${preferences?.purposes?.join(",") || "Sightseeing"}|Budget:${preferences?.budget}${currency}|Dietary:${preferences?.dietary || "None"}|Must Visit:${preferences?.mustVisit || "None"}|Requests:${preferences?.requests || "None"}

# [⚠️ CORE LOGIC & STRICT RULES (MUST FOLLOW)]
0. **ENFORCED OUTPUT LANGUAGE**: ${langInstruction}. All generated names, descriptions, and advice MUST be exactly in ${uiLanguage}.
1. **Daily Nodes**:
   - **Day 1 (Arrival)**: The first activity MUST be "Arrive at Airport". The last activity MUST be "Return to Hotel".
   - **Middle Days**: The first activity MUST be "Depart from Hotel". The last activity MUST be "Return to Hotel".
   - **Crucial**: The first "Depart from Hotel" node each day MUST include hotel check-out or luggage storage instructions if applicable. Do not split departure and luggage into two nodes.
   - **Last Day (Departure)**: The first activity MUST be "Depart from Hotel". The last MUST be "Arrive at Airport" for departure.
2. **Timeline & Logistics**:
   - **Linear Time**: Time must strictly flow from morning to evening. Time travel is forbidden. You must accurately estimate "Stay Duration + Transit Time" to set the next activity's start time.
   - **Luggage Handling**: Explicitly instruct luggage drop-off/storage between airport and hotel in the description. If arriving before 15:00 on Day 1, arrange for luggage drop-off.
   - **Airport Buffer**: Return flight requires arriving at the airport exactly 3 hours before departure.
3. **Anti-Boring & Hidden Gems**:
   - **Geographic Spread**: Do not restrict activities to within 3km of the hotel. Utilize transit to explore different districts.
   - **Hidden Gems Requirement**: You MUST assign at least one highly-rated, local "Hidden Gem" per day based on the user's purposes, apart from tourist traps.
4. **Ultra-Concise & Vivid Descriptions**:
   - 🔥 CRITICAL SPEED RULE: Keep all descriptions EXTREMELY SHORT (Maximum 2 short sentences). Absolutely no filler words.
   - **Restaurants**: Provide the EXACT full real name. State signature dish briefly.
   - **Attractions**: State one photo tip or local secret in one sentence.
5. **Group Constraints**:
   - Do not schedule bars or nightclubs if children or elders are present.
   - If accessibility is requested, strictly avoid steep hills or multi-stair locations.

# [🔗 AFFILIATE & COMMERCIAL RULES]
${premiumSearchInstruction}
- Hotel: Provide a Klook link in bookingUrl appended with ?aid=${TP_MARKER}&af_wid=${TP_MARKER}
- Tickets/Passes (Only if needsTicket = true): You MUST provide a valid Klook search link in the bookingUrl field. ABSOLUTELY DO NOT generate any Markdown text links for Klook in the description or title to prevent duplicate buttons on the frontend.
- Flights: Provide a Kiwi link appended with ?affilid=${TP_MARKER}

# [OUTPUT SPECIFICATIONS & DATA STRUCTURE]
- Location field must start with \`◎\` (e.g., ◎ Kansai International Airport (KIX)).
- \`transitToNext\`: Specific transit mode and duration. The transitToNext for the LAST activity of the day MUST be null.

# Output JSON ONLY (No Markdown, No Code Blocks)
{
    "destination": "City",
    "heroImageKeyword": "english_keyword",
    "flights": { 
        "outbound": { "airline": "A", "departureTime": "09:00", "arrivalTime": "11:00", "airportArrivalInstruction": "Transit Instructions", "estCost": "${currency} 450", "estCostNumber": 450, "bookingUrl": "url_kiwi" },
        "return": { "airline": "A", "departureTime": "17:00", "arrivalTime": "19:00", "airportArrivalInstruction": "Arrive 3 hours early", "estCost": "Inc", "estCostNumber": 0, "bookingUrl": "url_kiwi" }
    },
    "hotel": { "name": "Hotel Full Name", "checkIn": "15:00", "checkOut": "11:00", "estCost": "${currency} 120/nt", "estCostNumber": 480, "bookingUrl": "url_klook" },
    "adviceArr": [{ "title": "Advice", "content": "Content" }],
    "days": [{ 
        "date": "YYYY-MM-DD", 
        "theme": "Theme of the day", 
        "daySummary": "Core regions explored today", 
        "activities": [{ 
            "time": "HH:mm", 
            "title": "Activity Title", 
            "description": "Detailed description (including hidden gems, signature dishes, photo tips, luggage info)", 
            "location": "◎ Exact Location Name", 
            "imageSearchKeyword": "English_Name", 
            "cost": "0", 
            "costNumber": 0, 
            "needsTicket": false, 
            "isFood": false, 
            "bookingUrl": "#",
            "transitToNext": { "mode": "Transit Mode", "duration": "Duration" } 
        }] 
    }]
}`;

        // 4. Determine Dynamic AI Models based on User Tier
        // Both PASS and YEARLY use the same priority model. TRIAL uses the base model.
        let primaryModel = "gemini-2.0-flash"; // Default for TRIAL
        let fallbackModel = "gpt-4o-mini"; // ChatGPT fallback for all tiers

        if (tier === "PASS" || tier === "YEARLY") {
            primaryModel = "gemini-2.5-flash"; // Priority: Stable, ultra-fast model
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
