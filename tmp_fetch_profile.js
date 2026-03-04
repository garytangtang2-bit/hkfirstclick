const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../d/hkfirstclick/.env.local') });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    dotenv.config({ path: 'd:\\hkfirstclick\\.env.local' });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const email = 'garytangtang2@gmail.com';
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    const user = users.find(u => u.email === email);
    if (!user) return console.error('User not found');

    const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const fs = require('fs');
    if (profileError) {
        console.error('Error fetching profile:', profileError);
    } else {
        fs.writeFileSync('tmp_profile.json', JSON.stringify(data, null, 2));
        console.log('Saved profile to tmp_profile.json');
    }
}

main();
