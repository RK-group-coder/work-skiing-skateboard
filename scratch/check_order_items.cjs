const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nithgdwrzhdkghgnfzim.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdGhnZHdyemhka2doZ25memltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjAxNzAsImV4cCI6MjA5MjIzNjE3MH0.xSv_3lfaB4gl73M7jO9viDkukyLHMlzGtAW8eHOiy5Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkOrderItems() {
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', '5246cdbc-15ae-4707-86b1-4d29d278a74d')
    .single();

  if (error) {
    console.error(error);
  } else {
    console.log('ORDER DETAILS:');
    console.log(JSON.stringify(order, null, 2));
  }
}

checkOrderItems();
