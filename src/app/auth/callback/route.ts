import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { attributeReferral } from '@/utils/affiliateAttribution'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/workspace'

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error && data.user) {
            // Attribute referral if cookie exists
            const cookieStore = await cookies()
            const refCode = cookieStore.get('hkfc_ref')?.value
            if (refCode) {
                await attributeReferral(data.user.id, refCode)
            }

            const response = NextResponse.redirect(`${origin}${next}`)
            // Clear the referral cookie
            response.cookies.set('hkfc_ref', '', { maxAge: 0, path: '/' })
            return response
        } else {
            console.error("Auth callback error:", error?.message)
        }
    }

    return NextResponse.redirect(`${origin}/login?error=CouldNotAuthenticate`)
}
