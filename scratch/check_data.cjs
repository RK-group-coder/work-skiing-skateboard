
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nithgdwrzhdkghgnfzim.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdGhnZHdyemhka2doZ25memltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjAxNzAsImV4cCI6MjA5MjIzNjE3MH0.xSv_3lfaB4gl73M7jO9viDkukyLHMlzGtAW8eHOiy5Q';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('--- Checking Skateboard Data ---');
  
  const { data: loc } = await supabase.from('locations').select('*').eq('mode', 'skateboard');
  console.log('Locations:', loc?.length || 0);
  if (loc) loc.forEach(l => console.log(` - ${l.name}`));

  const { data: coa } = await supabase.from('coaches').select('*').eq('mode', 'skateboard');
  console.log('Coaches:', coa?.length || 0);
  if (coa) coa.forEach(c => console.log(` - ${c.name}`));

  const { data: tSet } = await supabase.from('course_time_settings').select('*').eq('mode', 'skateboard');
  console.log('Time Settings:', tSet?.length || 0);
  if (tSet) tSet.forEach(t => console.log(` - Weekday: ${t.weekday_slots}, Weekend: ${t.weekend_slots}`));

  console.log('--- Checking Skiing Data (for comparison) ---');
  const { data: sLoc } = await supabase.from('locations').select('*').eq('mode', 'skiing');
  console.log('Skiing Locations:', sLoc?.length || 0);
}

check();
