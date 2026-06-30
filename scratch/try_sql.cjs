
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nithgdwrzhdkghgnfzim.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdGhnZHdyemhka2doZ25memltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjAxNzAsImV4cCI6MjA5MjIzNjE3MH0.xSv_3lfaB4gl73M7jO9viDkukyLHMlzGtAW8eHOiy5Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function trySql() {
    const sql = `
        ALTER TABLE courses 
        ADD COLUMN IF NOT EXISTS full_day_first_price NUMERIC,
        ADD COLUMN IF NOT EXISTS full_day_add_price NUMERIC,
        ADD COLUMN IF NOT EXISTS half_day_am_first_price NUMERIC,
        ADD COLUMN IF NOT EXISTS half_day_am_add_price NUMERIC,
        ADD COLUMN IF NOT EXISTS half_day_pm_first_price NUMERIC,
        ADD COLUMN IF NOT EXISTS half_day_pm_add_price NUMERIC;
    `;
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    if (error) {
        console.log('RPC exec_sql not found or failed:', error.message);
    } else {
        console.log('Success! Columns added via RPC.');
    }
}

trySql();
