
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nithgdwrzhdkghgnfzim.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdGhnZHdyemhka2doZ25memltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjAxNzAsImV4cCI6MjA5MjIzNjE3MH0.xSv_3lfaB4gl73M7jO9viDkukyLHMlzGtAW8eHOiy5Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addColumns() {
    // This is a long shot, but let's try to use the 'run_sql' RPC if it exists
    // or just try to update with a non-existent column to see the error.
    const { error } = await supabase.from('courses').update({ 
        full_day_first_price: 0,
        full_day_add_price: 0,
        half_day_am_first_price: 0,
        half_day_am_add_price: 0,
        half_day_pm_first_price: 0,
        half_day_pm_add_price: 0
    }).eq('id', '768fbd1a-c2a5-47d3-8d8d-ed57426bd753');
    
    if (error) {
        console.log('Error (Expected if columns missing):', error.message);
        if (error.message.includes('column "full_day_first_price" of relation "courses" does not exist')) {
            console.log('Columns definitely missing.');
        }
    } else {
        console.log('Success! Columns already exist.');
    }
}

addColumns();
