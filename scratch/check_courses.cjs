
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nithgdwrzhdkghgnfzim.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdGhnZHdyemhka2doZ25memltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjAxNzAsImV4cCI6MjA5MjIzNjE3MH0.xSv_3lfaB4gl73M7jO9viDkukyLHMlzGtAW8eHOiy5Q';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: courses } = await supabase.from('courses').select('*').eq('mode', 'skateboard');
  console.log('Skateboard Courses:', courses?.length || 0);
  courses?.forEach(c => console.log(` - ${c.name}`));
}

check();
