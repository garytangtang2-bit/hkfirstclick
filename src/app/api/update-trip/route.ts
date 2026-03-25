import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserCredits, deductCredits } from "@/utils/credits";

// Use service role key to bypass RLS and update credits securely
const getSupabaseAdmin = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

// Rate limiter: max 10 update requests per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
        return false;
    }
    if (entry.count >= RATE_LIMIT) return true;
    entry.count++;
    return false;
}

export async function POST(req: Request) {
    const supabaseAdmin = getSupabaseAdmin();
    try {
        // Use Vercel's real IP (not spoofable x-forwarded-for)
        const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        if (isRateLimited(ip)) {
            return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
        }

        // 1. Require authentication before doing anything else
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "Authentication required." }, { status: 401 });
        }
        const token = authHeader.replace("Bearer ", "");
        const { data: { user: authUser } } = await supabaseAdmin.auth.getUser(token);
        if (!authUser) {
            return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
        }

        const { currentItinerary, itineraryId, userMessage, uiLanguage, currency } = await req.json();

        if (!currentItinerary || !userMessage) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 2. Fetch verified credits for the authenticated user
        let tier = "TRIAL";
        let userCredits = 0;
        const userId = authUser.id;
        const result = await getUserCredits(userId);
        tier = result.tier;
        userCredits = result.activeCredits;

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

        const nativeLanguagePrompts: Record<string, string> = {
            'zh': '🚨 絕對指令：你必須扮演頂級旅遊專家，並【全部使用繁體中文】修改這個行程，包含所有標題、描述和細節。絕對禁止使用其他語言！',
            'ja': '🚨 絶対的な指示：あなたはトップクラスの旅行エキスパートです。【必ず日本語で】この旅程を修正してください。タイトルや説明など、すべて日本語で出力すること。他の言語は一切禁止です！',
            'ko': '🚨 절대 지침: 당신은 최고 수준의 여행 전문가입니다. 제목, 설명, 세부 정보를 포함하여 이 일정표를 【반드시 한국어로】 수정해야 합니다. 다른 언어 사용은 절대 금지됩니다!',
            'fr': '🚨 DIRECTIVE ABSOLUE : Vous devez modifier cet itinéraire 【ENTIÈREMENT EN FRANÇAIS】, y compris tous les titres et descriptions. L\'utilisation d\'autres langues est strictement interdite !',
            'es': '🚨 DIRECTIVA ABSOLUTA: Debes modificar este itinerario 【COMPLETAMENTE EN ESPAÑOL】, incluyendo todos los títulos y descripciones. ¡El uso de otros idiomas está estrictamente prohibido!',
            'id': '🚨 ARAHAN MUTLAK: Anda harus mengubah rencana perjalanan ini 【SEPENUHNYA DALAM BAHASA INDONESIA】, termasuk semua judul dan deskripsi. Penggunaan bahasa lain sangat dilarang!',
            'hi': '🚨 पूर्ण निर्देश: आपको इस यात्रा कार्यक्रम को 【पूरी तरह से हिंदी में】 संशोधित करना चाहिए। अन्य भाषाओं का उपयोग सख्त वर्जित है!',
            'pt': '🚨 DIRETRIZ ABSOLUTA: Você deve modificar este itinerário 【TOTALMENTE EM PORTUGUÊS】, incluindo todos os títulos e descrições. O uso de outros idiomas é estritamente proibido!',
            'ar': '🚨 توجيه مطلق: يجب أن تقوم بتعديل مسار الرحلة هذا 【باللغة العربية بالكامل】. يمنع منعا باتا استخدام لغات أخرى!',
            'bn': '🚨 পরম নির্দেশ: আপনাকে এই ভ্রমণপথটি 【সম্পূর্ণরূপে বাংলায়】 সংশোধন করতে হবে। অন্য ভাষার ব্যবহার কঠোরভাবে নিষিদ্ধ!',
            'ru': '🚨 АБСОЛЮТНАЯ ДИРЕКТИВА: Вы должны изменить этот маршрут 【ПОЛНОСТЬЮ НА РУССКОМ ЯЗЫКЕ】. Использование других языков строго запрещено!',
            'en': '🚨 ABSOLUTE DIRECTIVE: You must modify this itinerary 【ENTIRELY IN ENGLISH】, including all titles and descriptions. The use of other languages is strictly prohibited!'
        };

        const nativeCommand = uiLanguage ? (nativeLanguagePrompts[uiLanguage] || nativeLanguagePrompts['en']) : nativeLanguagePrompts['en'];
        const langInstruction = uiLanguage ? `You MUST output all generated text, descriptions, advice, and titles ENTIRELY in target language. This is a strict requirement.` : "MUST output responses in the user's inferred language.";

        // To save tokens and speed up generation, we strip out static data (flights, hotel, adviceArr)
        // and only pass the core `days` array to the AI. Include destination for context.
        const minimalItinerary = {
            destination: currentItinerary.destination,
            dates: currentItinerary.days?.map((d: any) => d.date),
            days: currentItinerary.days
        };

        const systemPrompt = `${nativeCommand}\n\nYou are a professional travel planner with deep expertise in optimizing travel itineraries based on budget, style, and purpose.
        
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
        10. 🔥 CRITICAL SPEED RULE: Keep all \`description\` fields EXTREMELY SHORT (Maximum 1-2 sentences). Absolutely no filler words.
        
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
