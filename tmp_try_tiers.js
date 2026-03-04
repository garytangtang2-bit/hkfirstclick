const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../d/hkfirstclick/.env.local') });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) dotenv.config({ path: 'd:\\hkfirstclick\\.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const email = 'garytangtang2@gmail.com';
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    const user = users.find(u => u.email === email);
    if (!user) return console.error('User not found');

    const tiersToTry = ['Pro', 'PRO', 'Pro Member', 'Member', 'MEMBER', 'PASS', 'Pass', 'Yearly', 'YEARLY', 'Premium', 'PREMIUM', 'tier3', 'Tier3', 'Tier 3', 'pro_member', 'Paid', 'PAID'];

    for (const tier of tiersToTry) {
        console.log(`Trying tier: ${tier}`);
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ tier, credits: 999999 })
            .eq('id', user.id);

        if (!updateError) {
            console.log(`Success! Tier set to: ${tier}`);
            return;
        }
    }
    console.log('All attempts failed due to constraints.');
}

main();
