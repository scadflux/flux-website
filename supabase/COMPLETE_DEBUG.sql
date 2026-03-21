-- ============================================================================
-- Complete Debug - Check Everything About member_applications
-- ============================================================================

-- 1. Check ALL policies (might be conflicting ones)
SELECT
  policyname,
  cmd,
  permissive,
  roles::text,
  qual::text as using_clause,
  with_check::text as with_check_clause
FROM pg_policies
WHERE tablename = 'member_applications'
ORDER BY cmd, policyname;

-- 2. Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'member_applications';

-- 3. Check table permissions
SELECT
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'member_applications';

-- 4. Try to simulate an insert (this will test if YOU can insert as authenticated user)
-- Comment this out if it causes errors
-- INSERT INTO member_applications (name, email, year, campus, bio, reason_for_joining)
-- VALUES ('Debug Test', 'debug@test.com', '2024', 'SAV CAMPUS', 'Test', 'Test')
-- RETURNING id;
