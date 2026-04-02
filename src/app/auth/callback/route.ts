import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { attributeReferral } from '@/utils/affiliateAttribution'
import { Resend } from 'resend'

interface CookieToSet {
    name: string
    value: string
    options?: Record<string, unknown>
}

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/workspace'

    if (code) {
        const cookieStore = await cookies()

        // Collect all cookies that Supabase wants to set
        const cookiesToSet: CookieToSet[] = []

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(toSet: CookieToSet[]) {
                        // Collect cookies to apply to the response later
                        toSet.forEach(({ name, value, options }) => {
                            cookiesToSet.push({ name, value, options })
                        })
                    },
                },
            }
        )

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.user) {
            // Attribute referral if cookie exists
            const refCode = cookieStore.get('hkfc_ref')?.value
            if (refCode) {
                await attributeReferral(data.user.id, refCode)
            }

            // Send welcome email to new users (created_at == last_sign_in_at means first login)
            const isNewUser = data.user.created_at === data.user.last_sign_in_at
            if (isNewUser && data.user.email) {
                try {
                    const resend = new Resend(process.env.RESEND_API_KEY)
                    await resend.emails.send({
                        from: 'HKfirstclick <onboarding@resend.dev>',
                        to: data.user.email,
                        subject: 'Welcome to HKfirstclick 🗺️',
                        text: `Hi there,\n\nWelcome to HKfirstclick! Your account is ready.\n\nYou have 6 free credits to get started — enough to generate a full trip itinerary.\n\nGet started: ${process.env.NEXT_PUBLIC_SITE_URL}/workspace\n\nHappy travels,\nThe HKfirstclick Team`,
                    })
                } catch (emailErr) {
                    console.error('Failed to send welcome email:', emailErr)
                }
            }

            const response = NextResponse.redirect(`${origin}${next}`)

            // ✅ Apply all session cookies onto the redirect response
            cookiesToSet.forEach(({ name, value, options }) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                response.cookies.set(name, value, (options ?? {}) as any)
            })

            // Clear the referral cookie
            response.cookies.set('hkfc_ref', '', { maxAge: 0, path: '/' })
            return response
        } else {
            console.error("Auth callback error:", error?.message)
        }
    }

    return NextResponse.redirect(`${origin}/login?error=CouldNotAuthenticate`)
}
