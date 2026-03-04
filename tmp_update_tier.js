const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../d/hkfirstclick/.env.local') });

// Fallback if dotenv config path is weird
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    dotenv.config({ path: 'd:\\hkfirstclick\\.env.local' });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing supabase credentials in env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const email = 'garytangtang2@gmail.com';
    console.log('Fetching users...');
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('Error fetching users:', error);
        return;
    }

    const user = users.find(u => u.email === email);
    if (!user) {
        console.error('User not found with email:', email);
        return;
    }

    console.log('User found:', user.id);

    // Set tier to PASS and give 9999 credits
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ tier: 'PASS', credits: 9999 })
        .eq('id', user.id);

    if (updateError) {
        console.error('Error updating profile:', updateError);
    } else {
        console.log('Successfully updated profile for:', email, 'to PASS with 9999 credits');
    }
}

main();
