-- Check ALL policies on member_applications
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
