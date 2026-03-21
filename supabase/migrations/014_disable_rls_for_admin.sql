-- Temporary Fix: Disable RLS on tables for admin panel to work
-- This allows the admin panel to function without authentication
-- In production, you should implement proper Supabase Auth for admins

-- ============================================================================
-- DISABLE RLS (Simplest solution for now)
-- ============================================================================

-- Disable RLS on events table
ALTER TABLE events DISABLE ROW LEVEL SECURITY;

-- Disable RLS on members table
ALTER TABLE members DISABLE ROW LEVEL SECURITY;

-- Disable RLS on member_applications table
ALTER TABLE member_applications DISABLE ROW LEVEL SECURITY;

-- Disable RLS on event_registrations table (if it exists)
ALTER TABLE event_registrations DISABLE ROW LEVEL SECURITY;

-- Note: This makes all tables publicly accessible via the Supabase API
-- Make sure your Supabase API keys are kept secure
-- In production, you should:
-- 1. Enable RLS again
-- 2. Implement Supabase Auth in your admin panel
-- 3. Create proper policies for authenticated admin users
