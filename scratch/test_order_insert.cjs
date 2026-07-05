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

  const { data, error } = await supabase.from('orders').insert({
    user_id: user_id,
    total_price: 0,
    status: 'confirmed',
    items: [{ id: 'test', type: 'course_booking' }],
    mode: 'skiing',
    customer_name: 'test',
    customer_email: 'test@example.com'
  });
  
  console.log('Order Insert Result:', data, error);
}

check();
