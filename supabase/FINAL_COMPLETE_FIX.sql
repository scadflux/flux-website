-- ============================================================================
-- FINAL COMPLETE FIX - Apply All Missing Permissions
-- ============================================================================
-- This fixes both RLS policies AND table-level GRANT permissions
-- Run this entire script in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- PART 1: Grant Table-Level Permissions (THE MISSING PIECE!)
-- ============================================================================

-- Member Applications: Allow anon to insert, allow authenticated to manage
GRANT SELECT, INSERT ON TABLE member_applications TO anon, authenticated;
GRANT UPDATE, DELETE ON TABLE member_applications TO authenticated;

-- Members: Allow public to view, authenticated to manage
GRANT SELECT ON TABLE members TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE members TO authenticated;

-- Events: Allow public to view, authenticated to manage
GRANT SELECT ON TABLE events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE events TO authenticated;

-- Event Registrations: Allow authenticated to manage
GRANT SELECT, INSERT, DELETE ON TABLE event_registrations TO authenticated;

-- Grant usage on sequences (for UUID generation and auto-increment)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================================================
-- PART 2: Verify RLS Policies Are Correct
-- ============================================================================

-- Drop and recreate the critical INSERT policy for member_applications
DROP POLICY IF EXISTS "public_can_insert_applications" ON member_applications;
DROP POLICY IF EXISTS "anon_and_auth_can_insert_applications" ON member_applications;
DROP POLICY IF EXISTS "allow_anon_insert" ON member_applications;

CREATE POLICY "anon_can_insert_applications"
  ON member_applications
  AS PERMISSIVE
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ============================================================================
-- PART 3: Verify Storage Permissions
-- ============================================================================

-- Grant access to storage schema
GRANT USAGE ON SCHEMA storage TO anon, authenticated;

-- Grant SELECT on buckets (so listBuckets() works)
GRANT SELECT ON TABLE storage.buckets TO anon, authenticated;

-- Grant permissions on storage.objects for file operations
GRANT SELECT, INSERT ON TABLE storage.objects TO anon, authenticated;
GRANT DELETE ON TABLE storage.objects TO authenticated;

-- ============================================================================
-- PART 4: Verification Queries
-- ============================================================================

-- Check 1: Table permissions granted
SELECT
  grantee,
  table_name,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name IN ('member_applications', 'members', 'events', 'event_registrations')
AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee, privilege_type;

-- Check 2: RLS policy exists
SELECT
  policyname,
  cmd,
  roles::text
FROM pg_policies
WHERE tablename = 'member_applications'
AND cmd = 'INSERT';

-- Check 3: Storage permissions
SELECT
  grantee,
  table_schema,
  table_name,
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'storage'
AND table_name IN ('buckets', 'objects')
AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee;

-- ============================================================================
-- Expected Results:
-- ============================================================================
-- Check 1: Should show anon and authenticated with SELECT, INSERT on member_applications
-- Check 2: Should show anon_can_insert_applications policy with roles {anon,authenticated}
-- Check 3: Should show anon with SELECT on storage.buckets and storage.objects
-- ============================================================================

-- ============================================================================
-- After running this script:
-- ============================================================================
-- 1. Verify all three checks show expected results
-- 2. Run: node test-db-connection.js
-- 3. Should see ✅ Successfully inserted test application
-- 4. Test the application form at http://localhost:5173/apply
-- ============================================================================
