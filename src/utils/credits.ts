import { createClient } from "@supabase/supabase-js";

// Use service role key to bypass RLS and update credits securely
const getSupabaseAdmin = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getUserCredits(userId: string) {
    const supabaseAdmin = getSupabaseAdmin();
    const { data: profile, error } = await supabaseAdmin
        .from("profiles")
        .select("tier, credits, trial_credits, premium_credits, premium_expires_at, topup_credits, topup_expires_at")
        .eq("id", userId)
        .single();

    if (error || !profile) {
        return { tier: "TRIAL", activeCredits: 0, rawProfile: null };
    }

    const now = new Date();

    // Evaluate Premium
    const premiumValid = profile.premium_expires_at && new Date(profile.premium_expires_at) > now;
    const premiumActiveCredits = premiumValid ? (profile.premium_credits || 0) : 0;

    // Evaluate Topup
    const topupValid = profile.topup_expires_at && new Date(profile.topup_expires_at) > now;
    const topupActiveCredits = topupValid ? (profile.topup_credits || 0) : 0;

    // Trial never expires
    const trialActiveCredits = profile.trial_credits || 0;

    let tier = profile.tier;
    // If premium has expired, drop back to Casual (or TRIAL if they were never premium)
    if ((tier === "PASS" || tier === "YEARLY") && !premiumValid) {
        tier = "Casual";
    }

    const totalActiveCredits = premiumActiveCredits + topupActiveCredits + trialActiveCredits;

    // We also provide the full profile as some logic might want to verify exact buckets
    return {
        tier,
        activeCredits: totalActiveCredits,
        rawProfile: profile,
        buckets: {
            trial: trialActiveCredits,
            premium: premiumActiveCredits,
            topup: topupActiveCredits
        },
        expiries: {
            premium: premiumValid ? new Date(profile.premium_expires_at) : null,
            topup: topupValid ? new Date(profile.topup_expires_at) : null
        }
    };
}


/**
 * Subtracts points prioritizing the bucket that expires closest to now.
 */
export async function deductCredits(userId: string, amount: number) {
    const supabaseAdmin = getSupabaseAdmin();
    const result = await getUserCredits(userId);

    // 1. Check if user has enough active credits
    if (result.activeCredits < amount) {
        return { success: false, error: "Insufficient valid credits." };
    }

    const buckets = result.buckets as NonNullable<typeof result.buckets>;
    const expiries = result.expiries as NonNullable<typeof result.expiries>;

    // 2. We construct an array of available buckets
    // For sorting purposes, trial bucket expires at infinity
    const availableBuckets = [];

    if (buckets.premium > 0) {
        availableBuckets.push({
            name: "premium_credits",
            balance: buckets.premium,
            expiry: expiries.premium!.getTime()
        });
    }
    if (buckets.topup > 0) {
        availableBuckets.push({
            name: "topup_credits",
            balance: buckets.topup,
            expiry: expiries.topup!.getTime()
        });
    }
    if (buckets.trial > 0) {
        availableBuckets.push({
            name: "trial_credits",
            balance: buckets.trial,
            expiry: Infinity
        });
    }

    // 3. Sort available buckets by nearest expiration date ascending
    availableBuckets.sort((a, b) => a.expiry - b.expiry);

    // 4. Greedily deduct from buckets
    let remainingToDeduct = amount;
    const updates: Record<string, number> = {};

    for (const bucket of availableBuckets) {
        if (remainingToDeduct <= 0) break;

        if (bucket.balance >= remainingToDeduct) {
            // This bucket can cover the rest
            updates[bucket.name] = bucket.balance - remainingToDeduct;
            remainingToDeduct = 0;
        } else {
            // Bucket doesn't cover all, take what we can
            updates[bucket.name] = 0;
            remainingToDeduct -= bucket.balance;
        }
    }

    // 5. Update Database
    const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update(updates)
        .eq("id", userId);

    if (updateError) {
        return { success: false, error: updateError.message };
    }

    return { success: true };
}
