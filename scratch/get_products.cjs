const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envPath = '.env';
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
} else if (fs.existsSync('.env.local')) {
  envContent = fs.readFileSync('.env.local', 'utf8');
}

const supabaseUrlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const supabaseKeyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = supabaseUrlMatch[1].trim();
const supabaseKey = supabaseKeyMatch[1].trim();
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('products').select('*');
  console.log("Total products:", data.length);
  const match = data.filter(d => d.special_price === 6200 || d.price === 6200);
  console.log("Match:", match);
}
main();
