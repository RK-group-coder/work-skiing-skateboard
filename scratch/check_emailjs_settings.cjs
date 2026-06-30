const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nithgdwrzhdkghgnfzim.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdGhnZHdyemhka2doZ25memltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjAxNzAsImV4cCI6MjA5MjIzNjE3MH0.xSv_3lfaB4gl73M7jO9viDkukyLHMlzGtAW8eHOiy5Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSettings() {
  const { data, error } = await supabase.from('system_settings').select('*');
  if (error) {
    console.error('Error fetching settings:', error);
  } else {
    console.log('System settings fetched:');
    data.forEach(item => {
      if (item.key.includes('emailjs') || item.key.includes('email')) {
        console.log(`${item.key}: "${item.value}"`);
      }
    });
  }
}

checkSettings();
