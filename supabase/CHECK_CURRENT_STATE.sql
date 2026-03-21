-- ============================================================================
-- Check Current Database State
-- ============================================================================
-- Run this to see what's currently set up in your database
-- ============================================================================

-- Check 1: Do the tables exist?
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check 2: Is RLS enabled?
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check 3: What INSERT policies exist on member_applications?
SELECT
  policyname,
  cmd,
  roles::text,
  with_check::text
FROM pg_policies
WHERE tablename = 'member_applications'
AND cmd = 'INSERT'
ORDER BY policyname;

-- Check 4: What are ALL policies on member_applications?
SELECT
  policyname,
  cmd,
  roles::text
FROM pg_policies
WHERE tablename = 'member_applications'
ORDER BY cmd, policyname;

-- Check 5: Do storage buckets exist?
SELECT
  name,
  public,
  file_size_limit,
  created_at
FROM storage.buckets
ORDER BY name;

-- ============================================================================
-- What to look for:
-- ============================================================================
-- Check 1: Should show 4 tables (events, event_registrations, member_applications, members)
-- Check 2: All tables should have rowsecurity = true
-- Check 3: Should show policy "public_can_insert_applications" with roles = {public}
-- Check 4: Should show multiple policies (insert, select, update, delete)
-- Check 5: Should show member-photos and event-photos buckets with public = true
-- ============================================================================
