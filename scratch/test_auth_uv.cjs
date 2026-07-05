const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nithgdwrzhdkghgnfzim.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdGhnZHdyemhka2doZ25memltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjAxNzAsImV4cCI6MjA5MjIzNjE3MH0.xSv_3lfaB4gl73M7jO9viDkukyLHMlzGtAW8eHOiy5Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data: { session } } = await supabase.auth.getSession();
  let user_id;
  if (!session) {
    const { data } = await supabase.auth.signInWithPassword({ email: 'test_insert@example.com', password: 'password123' });
    user_id = data.session.user.id;
  } else {
    user_id = session.user.id;
  }

  const { data: vData } = await supabase.from('vouchers').insert({
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
  
  if (vData) {
    const uvData = Array.from({ length: 1 }).map(() => ({
      user_id: user_id,
      voucher_id: vData.id,
      is_used: false
    }));
    const { data: uvResult, error: uvError } = await supabase.from('user_vouchers').insert(uvData);
    console.log('UV Insert Result:', uvResult, uvError);
  }
}

check();
