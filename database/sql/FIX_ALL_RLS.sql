-- COMPLETE FIX: Disable ALL RLS policies
-- Copy and paste this ENTIRE script into Supabase SQL Editor and run it

-- ============================================================================
-- DISABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE IF EXISTS events DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS members DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS member_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS event_registrations DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on events table
DROP POLICY IF EXISTS "Anyone can view published events" ON events;
DROP POLICY IF EXISTS "Service role can view all events" ON events;
DROP POLICY IF EXISTS "Anyone can insert events" ON events;
DROP POLICY IF EXISTS "Anyone can update events" ON events;
DROP POLICY IF EXISTS "Anyone can delete events" ON events;
DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
DROP POLICY IF EXISTS "Authenticated users can insert events" ON events;
DROP POLICY IF EXISTS "Authenticated users can update their own events" ON events;
DROP POLICY IF EXISTS "Authenticated users can delete their own events" ON events;

-- Drop ALL existing policies on members table
DROP POLICY IF EXISTS "Anyone can view active members" ON members;
DROP POLICY IF EXISTS "Anyone can insert members" ON members;
DROP POLICY IF EXISTS "Anyone can update members" ON members;
DROP POLICY IF EXISTS "Anyone can delete members" ON members;
DROP POLICY IF EXISTS "Members can update their own profile" ON members;
DROP POLICY IF EXISTS "Admin can insert members" ON members;
DROP POLICY IF EXISTS "Admin can update members" ON members;
DROP POLICY IF EXISTS "Admin can delete members" ON members;

-- Drop ALL existing policies on member_applications table
DROP POLICY IF EXISTS "Anyone can view applications" ON member_applications;
DROP POLICY IF EXISTS "Anyone can insert applications" ON member_applications;
DROP POLICY IF EXISTS "Anyone can update applications" ON member_applications;
DROP POLICY IF EXISTS "Anyone can delete applications" ON member_applications;
DROP POLICY IF EXISTS "Admin can update applications" ON member_applications;
DROP POLICY IF EXISTS "Admin can delete applications" ON member_applications;

-- Drop ALL existing policies on event_registrations table (if exists)
DROP POLICY IF EXISTS "Anyone can view registrations" ON event_registrations;
DROP POLICY IF EXISTS "Anyone can insert registrations" ON event_registrations;
DROP POLICY IF EXISTS "Anyone can update registrations" ON event_registrations;
DROP POLICY IF EXISTS "Anyone can delete registrations" ON event_registrations;

-- ============================================================================
-- VERIFY RLS IS DISABLED
-- ============================================================================

-- Check RLS status (should show 'f' for false/disabled)
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('events', 'members', 'member_applications', 'event_registrations');

-- This should return:
-- events | f
-- members | f
-- member_applications | f
-- event_registrations | f
