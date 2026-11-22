-- ==============================================================================
-- studentBazaar — Fix: Permission Denied for Table Projects & Related Tables
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

BEGIN;

-- 1. Table Grants for `public.projects`
-- Allows anonymous visitors to browse approved projects on /browse, /project/:slug, Home
GRANT SELECT ON public.projects TO anon;

-- Allows authenticated buyers, sellers, and administrators to access projects
-- (Row Level Security policies enforce status='approved', owner checks, and admin roles)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;

-- 2. Table Grants for `public.project_files`
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_files TO authenticated;

-- 3. Table Grants for `public.profiles`
-- Anonymous visitors need SELECT on public author/seller profile fields for project cards
GRANT SELECT (id, full_name, role, university, degree, semester, avatar_url)
ON public.profiles TO anon, authenticated;

-- 4. Table Grants for Marketplace Orders & Applications
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.payments TO authenticated;
GRANT SELECT, INSERT ON public.download_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.seller_applications TO authenticated;

-- 5. Table Grants for Custom Requests
GRANT SELECT ON public.custom_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.custom_requests TO authenticated;

-- 6. Table Grants for Contact Messages, Settings & Our Team
GRANT SELECT ON public.contact_settings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_settings TO authenticated;

GRANT SELECT ON public.team_members TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;

GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;

-- 7. Grant sequence usage for auto-incrementing / serial identifiers if any exist
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

COMMIT;
