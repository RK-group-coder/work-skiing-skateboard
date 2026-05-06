
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nithgdwrzhdkghgnfzim.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdGhnZHdyemhka2doZ25memltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjAxNzAsImV4cCI6MjA5MjIzNjE3MH0.xSv_3lfaB4gl73M7jO9viDkukyLHMlzGtAW8eHOiy5Q';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('--- All Locations ---');
  const { data: loc } = await supabase.from('locations').select('*');
  loc.forEach(l => console.log(`ID: ${l.id}, Name: ${l.name}, Mode: ${l.mode}`));

  console.log('\n--- All Time Settings ---');
  const { data: tSet } = await supabase.from('course_time_settings').select('*');
  tSet.forEach(t => console.log(`Mode: ${t.mode}, Weekday: ${t.weekday_slots}`));
}

check();
