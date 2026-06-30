const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nithgdwrzhdkghgnfzim.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdGhnZHdyemhka2doZ25memltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjAxNzAsImV4cCI6MjA5MjIzNjE3MH0.xSv_3lfaB4gl73M7jO9viDkukyLHMlzGtAW8eHOiy5Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRecentOrders() {
  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, created_at, customer_name, customer_phone, course_id, status, last_five_digits')
    .order('created_at', { ascending: false })
    .limit(3);

  const { data: orders } = await supabase
    .from('orders')
    .select('id, created_at, customer_name, customer_phone, status, last_five_digits')
    .order('created_at', { ascending: false })
    .limit(3);

  console.log('RECENT BOOKINGS:');
  console.log(JSON.stringify(bookings, null, 2));

  console.log('RECENT ORDERS:');
  console.log(JSON.stringify(orders, null, 2));
}

checkRecentOrders();
