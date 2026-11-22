-- ==============================================================================
-- studentBazaar — Contact Messages, Contact Settings & Team Members Schema
-- Run this script in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Contact Messages Table (Submitted by users from the /contact page)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for fast status queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- 2. Contact Page Settings Table (Controlled & updated by Admin)
CREATE TABLE IF NOT EXISTS public.contact_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL DEFAULT 'default_contact',
    headline TEXT NOT NULL DEFAULT 'Get in Touch with studentBazaar',
    subheadline TEXT NOT NULL DEFAULT 'Have questions about semester projects, custom assignments, or seller verification? We are here to help.',
    email TEXT NOT NULL DEFAULT 'support@studentbazaar.pk',
    phone TEXT NOT NULL DEFAULT '+92 300 1234567',
    address TEXT NOT NULL DEFAULT 'FAST-NUCES / Student Hub, Lahore, Pakistan',
    office_hours TEXT NOT NULL DEFAULT 'Monday to Saturday, 9:00 AM – 7:00 PM (PKT)',
    response_time TEXT NOT NULL DEFAULT 'Usually replies within 2–4 hours during working hours.',
    social_links JSONB NOT NULL DEFAULT '{"linkedin": "https://linkedin.com", "github": "https://github.com", "twitter": "https://twitter.com", "instagram": "https://instagram.com"}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Insert default row if not exists
INSERT INTO public.contact_settings (key, headline, subheadline, email, phone, address, office_hours, response_time, social_links)
VALUES (
    'default_contact',
    'Get in Touch with studentBazaar',
    'Have questions about semester projects, custom assignments, or seller verification? We are here to help.',
    'support@studentbazaar.pk',
    '+92 300 1234567',
    'FAST-NUCES / Student Hub, Lahore, Pakistan',
    'Monday to Saturday, 9:00 AM – 7:00 PM (PKT)',
    'Usually replies within 2–4 hours during working hours.',
    '{"linkedin": "https://linkedin.com", "github": "https://github.com", "twitter": "https://twitter.com", "instagram": "https://instagram.com"}'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- 3. Team Members Table (Controlled, edited, updated by Admin)
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    university TEXT NOT NULL,
    bio TEXT NOT NULL,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    linkedin_url TEXT,
    github_url TEXT,
    twitter_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for ordering active team members
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON public.team_members(display_order ASC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 5. Policies: Contact Messages
-- Anyone can submit a message
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

-- Admins can view, update, delete messages
DROP POLICY IF EXISTS "Admins can manage contact messages" ON public.contact_messages;
CREATE POLICY "Admins can manage contact messages" ON public.contact_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 6. Policies: Contact Settings
-- Public can read contact settings
DROP POLICY IF EXISTS "Public can read contact settings" ON public.contact_settings;
CREATE POLICY "Public can read contact settings" ON public.contact_settings
    FOR SELECT USING (true);

-- Admins can update contact settings
DROP POLICY IF EXISTS "Admins can update contact settings" ON public.contact_settings;
CREATE POLICY "Admins can update contact settings" ON public.contact_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 7. Policies: Team Members
-- Public can read active team members
DROP POLICY IF EXISTS "Public can read active team members" ON public.team_members;
CREATE POLICY "Public can read active team members" ON public.team_members
    FOR SELECT USING (is_active = true);

-- Admins can view all, insert, update, delete team members
DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;
CREATE POLICY "Admins can manage team members" ON public.team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 8. Required table privileges (RLS policies still control row access)
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;

GRANT SELECT ON public.contact_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.contact_settings TO authenticated;

GRANT SELECT ON public.team_members TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
