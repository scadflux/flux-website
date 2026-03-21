-- Check ALL policies on member_applications (not just INSERT)
SELECT
  policyname,
  cmd,
  permissive,
  roles::text,
  qual::text as using_clause,
  with_check::text
FROM pg_policies
WHERE tablename = 'member_applications'
ORDER BY cmd, policyname;

-- Check if there are any restrictive policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles::text,
  cmd
FROM pg_policies
WHERE tablename = 'member_applications'
AND permissive = 'RESTRICTIVE';

-- Verify RLS is enabled correctly
SELECT
  schemaname,
  tablename,
  rowsecurity,
  (SELECT COUNT(*) FROM pg_policies WHERE pg_policies.tablename = pg_tables.tablename) as policy_count
FROM pg_tables
WHERE tablename = 'member_applications';
