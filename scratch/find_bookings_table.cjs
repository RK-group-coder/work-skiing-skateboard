const { createClient } = require('@supabase/supabase-client');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  const { data: tables, error } = await supabase.rpc('get_tables');
  if (error) {
    // If RPC doesn't exist, try common names
    const commonNames = ['bookings', 'course_bookings', 'orders'];
    for (const name of commonNames) {
      const { data, error: e } = await supabase.from(name).select('*', { count: 'exact', head: true });
      if (!e) console.log(`Table ${name} exists`);
      else console.log(`Table ${name} not found or error: ${e.message}`);
    }
  } else {
    console.log('Tables:', tables);
  }
}

checkTables();
