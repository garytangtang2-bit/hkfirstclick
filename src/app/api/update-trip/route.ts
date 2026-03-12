import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserCredits, deductCredits } from "@/utils/credits";

// Use service role key to bypass RLS and update credits securely
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export async function POST(req: Request) {
    try {
        const { currentItinerary, itineraryId, userMessage, uiLanguage, currency } = await req.json();

        if (!currentItinerary || !userMessage) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Verify User Session & Credits securely on the server
        const authHeader = req.headers.get("Authorization");
        let tier = "TRIAL";
        let userCredits = 0;
        let userId: string | null = null;

        if (authHeader) {
            const token = authHeader.replace("Bearer ", "");
            const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

            if (user) {
                userId = user.id;
                const result = await getUserCredits(user.id);
                tier = result.tier;
                userCredits = result.activeCredits;
            }
        }

        // 🚨 Block TRIAL users from updating itineraries — AI Tweak is a PASS/YEARLY feature
        if (tier === "TRIAL") {
            return NextResponse.json(
                { error: "Free trial users cannot modify generated itineraries. Please upgrade to the Journey Pass or above to unlock AI tweaking ✨." },
                { status: 403 }
            );
        }

        // Updating an itinerary costs 1 credit as well
        if (userCredits <= 0) {
            return NextResponse.json(
                { error: "You do not have enough credits to update your itinerary. Please top up your account." },
                { status: 402 }
            );
        }

        const langInstruction = uiLanguage ? `You MUST output all generated text, descriptions, advice, and titles ENTIRELY in ${uiLanguage}. This is a strict requirement.` : "MUST output responses in the user's inferred language.";

        // To save tokens and speed up generation, we strip out static data (flights, hotel, adviceArr)
        // and only pass the core `days` array to the AI. Include destination for context.
        const minimalItinerary = {
            destination: currentItinerary.destination,
            dates: currentItinerary.days?.map((d: any) => d.date),
            days: currentItinerary.days
        };

        const systemPrompt = `You are a professional travel planner with deep expertise in optimizing travel itineraries based on budget, style, and purpose.
        
        The user wants to MODIFY their existing travel itinerary based on this new request:
        "${userMessage}"
        
        CRITICAL INSTRUCTIONS FOR ITINERARY QUALITY & FORMAT:
        1. Language & Visuals: ${langInstruction} Use Emojis occasionally to improve readability.
        2. Schema Preservation: You MUST return the EXACT SAME JSON schema as the provided itinerary, modifying only the \`days\` array based on the user request. DO NOT change the root keys. 
        3. Do NOT remove any fields unless explicitly requested.
        4. Meals MUST be preserved: Breakfast, Lunch, and Dinner must remain explicitly scheduled.
        5. Budget & Cost: If adding/changing activities, estimating costs MUST follow the rules: provide a string 'cost' and an integer 'costNumber' (in ${currency}).
        6. Ticket rules (needsTicket): ONLY set 'needsTicket: true' if the new activity requires a purchased admission ticket (e.g., Theme Parks, Museums, Observatories). For public spaces, streets, free parks, or restaurants (isFood=true), it MUST be false. If true, add a 'bookingUrl'.
        7. Daily Logistics & Pacing: Keep locations geographically close. Include morning, lunch, afternoon, and dinner activities appropriately.
        8. 🚨Restaurants & Food (isFood = true): If the user asks for food, or you are scheduling Breakfast/Lunch/Dinner/Supper, you MUST set 'isFood: true'. You MUST output an EXACT, REAL restaurant name prefixed with the city name (e.g. "Hong Kong Tsim Sha Tsui Waso Cafe"). DO NOT use generic terms like "Lunch in city".
        9. Location Name (\`location\`): The JSON \`location\` field must be an exact address/name string, absolutely NO markdown links.
        
        Here is the MINIMAL itinerary JSON that you need to modify:
        ${JSON.stringify(minimalItinerary)}
        
        Return ONLY the modified JSON object, containing the root keys 'destination', 'dates', and the modified 'days' array. No markdown formatting.`;

        // 4. Call OpenAI API securely
        const openAIRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY} `
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Optimized for speed and cost-effectiveness
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
            console.error("Failed to parse OpenAI response as JSON.", openAIRes.status, rawAiRes);
            throw new Error(`OpenAI API returned an invalid response.`);
        }

        if (!openAIRes.ok || aiData.error) {
            throw new Error(aiData?.error?.message || "Unknown error from AI");
        }

        let itineraryJson;
        try {
            let contentStr = aiData.choices?.[0]?.message?.content || "";
            contentStr = contentStr.replace(/```json\n ? /g, '').replace(/```\n?/g, '').trim();
            itineraryJson = JSON.parse(contentStr);
        } catch (e: any) {
            console.error("Failed to parse AI message content:", rawAiRes);
            throw new Error(`AI failed to return valid JSON format for the updated itinerary.`);
        }

        // 5. Deduct Credits
        let insertedItineraryId = null;

        if (userId) {
            const deductResult = await deductCredits(userId, 1);
            if (!deductResult.success) {
                console.error("Failed to deduct update points:", deductResult.error);
            }

            // Calculate dates from itineraryJson
            let startDate = new Date().toISOString().split('T')[0];
            let endDate = new Date().toISOString().split('T')[0];

            if (itineraryJson.days && itineraryJson.days.length > 0) {
                startDate = itineraryJson.days[0].date;
                endDate = itineraryJson.days[itineraryJson.days.length - 1].date;
            }

            // Save the new version
            const { data: insertedData, error: insertError } = await supabaseAdmin
                .from("itineraries")
                .insert({
                    user_id: userId,
                    parent_id: itineraryId || null,
                    title: `${itineraryJson.destination || "Updated"} Trip`,
                    destination: itineraryJson.destination || "Unknown",
                    start_date: startDate,
                    end_date: endDate,
                    itinerary_data: itineraryJson,
                    preferences: {}
                })
                .select("id")
                .single();

            if (insertError) {
                console.error("Failed to save updated itinerary to database:", insertError);
            } else if (insertedData) {
                insertedItineraryId = insertedData.id;
            }
        }

        return NextResponse.json({
            itinerary: itineraryJson,
            itineraryId: insertedItineraryId || itineraryId
        });

    } catch (err: any) {
        console.error("Trip Update Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
