CREATE TABLE IF NOT EXISTS public.support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT NOT NULL,
    content TEXT NOT NULL,
    is_from_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    read_by_admin BOOLEAN DEFAULT false,
    read_by_user BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own messages
CREATE POLICY "Users can view their own messages" ON public.support_messages
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own messages
CREATE POLICY "Users can insert their own messages" ON public.support_messages
    FOR INSERT
    WITH CHECK (auth.uid() = user_id AND is_from_admin = false);

-- Allow admins to see all messages
CREATE POLICY "Admins can view all messages" ON public.support_messages
    FOR ALL
    USING (
        auth.jwt() ->> 'email' IN ('pokai2952@gmail.com', 'managersk8@gmail.com')
    );
