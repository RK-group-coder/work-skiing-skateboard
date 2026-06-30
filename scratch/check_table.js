import { supabase } from '../src/lib/supabase.js';

async function check() {
  const { data, error } = await supabase.from('support_messages').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success, table exists. Data:', data);
  }
}

check();
