-- Create pickup_locations table
CREATE TABLE IF NOT EXISTS pickup_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  mode TEXT NOT NULL, -- 'skiing' or 'skateboard'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS to pickup_locations
ALTER TABLE pickup_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to pickup_locations"
  ON pickup_locations FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated full access to pickup_locations"
  ON pickup_locations FOR ALL
  USING (auth.role() = 'authenticated');

-- Add new columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS delivery_method TEXT,
ADD COLUMN IF NOT EXISTS delivery_info JSONB;
