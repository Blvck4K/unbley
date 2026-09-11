-- Unbley customer support inbox and notification source of truth.
CREATE TABLE IF NOT EXISTS public.concierge_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id), -- Nullable for guests
    user_email text NOT NULL, -- Email of the user or guest
    sender text NOT NULL CHECK (sender IN ('user', 'admin')),
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.concierge_messages
    ADD COLUMN IF NOT EXISTS is_read boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

CREATE INDEX IF NOT EXISTS concierge_messages_email_created_idx
    ON public.concierge_messages (user_email, created_at);
CREATE INDEX IF NOT EXISTS concierge_messages_unread_idx
    ON public.concierge_messages (is_read, created_at)
    WHERE is_read = false;

ALTER TABLE public.concierge_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can view their concierge messages" ON public.concierge_messages;
CREATE POLICY "Customers can view their concierge messages"
    ON public.concierge_messages FOR SELECT
    USING (auth.uid() = user_id OR user_email = auth.jwt() ->> 'email');

DROP POLICY IF EXISTS "Customers can insert their concierge messages" ON public.concierge_messages;
CREATE POLICY "Customers can insert their concierge messages"
    ON public.concierge_messages FOR INSERT
    WITH CHECK (auth.uid() = user_id OR (user_id IS NULL AND user_email = auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "Admins can manage concierge messages" ON public.concierge_messages;
CREATE POLICY "Admins can manage concierge messages"
    ON public.concierge_messages FOR ALL
    USING (EXISTS (SELECT 1 FROM public.brand_profiles WHERE id = auth.uid() AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM public.brand_profiles WHERE id = auth.uid() AND is_admin = true));

-- Verification: should return one row with table_name = concierge_messages.
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'concierge_messages';

-- Note: To enable REALTIME on this table, run this once if it is not already enabled:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.concierge_messages;
-- Or use the Supabase Dashboard:
-- 1. Database -> Replication
-- 2. Select 'supabase_realtime' publication
-- 3. Click 'Source' and toggle 'concierge_messages' ON
