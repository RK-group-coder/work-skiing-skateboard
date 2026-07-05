const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nithgdwrzhdkghgnfzim.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdGhnZHdyemhka2doZ25memltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjAxNzAsImV4cCI6MjA5MjIzNjE3MH0.xSv_3lfaB4gl73M7jO9viDkukyLHMlzGtAW8eHOiy5Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email: 'test_insert@example.com',
    password: 'password123'
  });
  
  if (authErr) {
    console.log('SignUp Error:', authErr);
    // Maybe try login
    await supabase.auth.signInWithPassword({ email: 'test_insert@example.com', password: 'password123' });
  }

  const { data, error } = await supabase.from('vouchers').insert({
    code: `PKG-TEST-${Date.now()}`,
    title: 'Test',
    type: 'percent',
    value: 100,
    target_type: 'course_package',
    target_id: 'test',
    is_published: false,
    is_active: true,
    grant_quantity: 1
  }).select().single();
  
  console.log('Insert Result (Authenticated):', data, error);
}

check();
