-- Create the concierge_messages table to support our Concierge Chat Widget
CREATE TABLE IF NOT EXISTS public.concierge_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id), -- Nullable for guests
    user_email text NOT NULL, -- Email of the user or guest
    sender text NOT NULL CHECK (sender IN ('user', 'admin')),
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: To enable REALTIME on this table, you MUST go to the Supabase Dashboard:
-- 1. Database -> Replication
-- 2. Select 'supabase_realtime' publication
-- 3. Click 'Source' and toggle 'concierge_messages' ON
