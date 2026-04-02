import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
// Simple in-memory rate limiter: max 3 requests per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;

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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
        return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
        }

        if (name.length > 100 || message.length > 5000) {
            return NextResponse.json({ error: "Input too long." }, { status: 400 });
        }

        const contactEmail = process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL;
        if (!contactEmail) throw new Error("Contact email not configured.");

        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: "HKfirstclick Contact <hello@hkfirstclick.com>",
            to: contactEmail,
            replyTo: email,
            subject: `[HKfirstclick] Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Contact form error:", err);
        return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
    }
}
