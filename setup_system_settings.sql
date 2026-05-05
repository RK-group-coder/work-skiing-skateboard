CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS to system_settings
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to system_settings"
  ON system_settings FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated full access to system_settings"
  ON system_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert default email settings row if it doesn't exist
INSERT INTO system_settings (key, value)
VALUES (
  'emailjs',
  '{"service_id": "", "template_id": "", "public_key": ""}'::jsonb
)
ON CONFLICT (key) DO NOTHING;
