-- FINAL COMPREHENSIVE FIX
-- This script will absolutely disable RLS and fix all issues

-- ============================================================================
-- STEP 1: Check current RLS status
-- ============================================================================
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('events', 'members', 'member_applications', 'event_registrations')
ORDER BY tablename;

-- ============================================================================
-- STEP 2: Drop ALL policies first (even if they don't exist)
-- ============================================================================

-- Drop all possible policies on events
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'events') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON events';
    END LOOP;
END $$;

-- Drop all possible policies on members
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'members') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON members';
    END LOOP;
END $$;

-- Drop all possible policies on member_applications
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'member_applications') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON member_applications';
    END LOOP;
END $$;

-- Drop all possible policies on event_registrations
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'event_registrations') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON event_registrations';
    END LOOP;
END $$;

-- ============================================================================
-- STEP 3: Force disable RLS on all tables
-- ============================================================================

ALTER TABLE IF EXISTS events DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS members DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS member_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS event_registrations DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 4: Add missing columns to events table
-- ============================================================================

ALTER TABLE events
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- ============================================================================
-- STEP 5: Verify RLS is disabled (should show 'f' for all)
-- ============================================================================

SELECT
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('events', 'members', 'member_applications', 'event_registrations')
ORDER BY tablename;

-- Expected result:
-- events              | f
-- event_registrations | f
-- member_applications | f
-- members             | f

-- ============================================================================
-- STEP 6: Verify no policies exist
-- ============================================================================

SELECT
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE tablename IN ('events', 'members', 'member_applications', 'event_registrations')
ORDER BY tablename, policyname;

-- Expected result: NO ROWS (empty result)
