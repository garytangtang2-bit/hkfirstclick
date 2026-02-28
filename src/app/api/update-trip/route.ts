import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
                const { data: profile, error: profileError } = await supabaseAdmin
                    .from("profiles")
                    .select("tier, credits")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    tier = profile.tier;
                    userCredits = profile.credits;
                }
            }
        }

        // Updating an itinerary costs 1 credit as well
        if (userCredits <= 0) {
            return NextResponse.json(
                { error: "You do not have enough credits to update your itinerary. Please top up your account." },
                { status: 402 }
            );
        }

        const langInstruction = uiLanguage ? `MUST output responses entirely in ${uiLanguage}.` : "MUST output responses in the user's inferred language.";

        const systemPrompt = `你是一位專業的資深旅遊規劃師，擅長根據客戶的預算、風格與目的，量身打造兼具深度與流暢度的旅遊修改方案。
        
        The user wants to MODIFY their existing travel itinerary based on this new request:
        "${userMessage}"
        
        CRITICAL INSTRUCTIONS FOR ITINERARY QUALITY & FORMAT:
        1. 語言與視覺化: ${langInstruction} 請多利用 Emoji 來增加可讀性。
        2. Schema Preservation: You MUST return the EXACT SAME JSON schema as the original itinerary, but with the requested modifications applied. DO NOT change the root keys.
        3. Do NOT remove any fields (like flights, hotel, heroImageKeyword, adviceArr) unless the user explicitly asks to remove them.
        4. Meals MUST be preserved: Breakfast, Lunch, and Dinner must remain explicitly scheduled unless they directly conflict with the user's request.
        5. 預算與花費: If you add or change activities, estimating costs MUST follow the rules: provide a string 'cost' and an integer 'costNumber' (in ${currency}).
        6. If a new activity needs a ticket (Museum, Park), set 'needsTicket: true' and add a 'ticketUrl'.
        7. 每日行程安排與邏輯: Maintain logical logistics: Keep locations geographically close. 每天的行程活動必須包含上午、午餐、下午、晚餐，並根據需求適當安排休息。
        8. Google Maps 連結: Please include Google Maps links like [Google Maps](https://www.google.com/maps/search/?api=1&query=Name) for any newly added locations in the description.
        9. 預算風格建議: 若修改後預算與旅遊風格明顯衝突，請在「adviceArr」的第一項「住宿與交通定調」中給予誠懇的建議，或提供最接近該風格的替代方案。
        
        Here is the CURRENT itinerary JSON that you need to modify:
        ${JSON.stringify(currentItinerary)}
        
        Return ONLY the modified JSON object, with absolutely no markdown formatting or backticks.`;

        // 4. Call OpenAI API securely
        const openAIRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY} `
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
            console.error("Failed to parse OpenAI response as JSON.", openAIRes.status);
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
            await supabaseAdmin
                .from("profiles")
                .update({ credits: userCredits - 1 })
                .eq("id", userId);

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
