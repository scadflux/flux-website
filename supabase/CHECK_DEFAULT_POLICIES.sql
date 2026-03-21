-- Check if there are ANY other policies that might conflict
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles::text,
  cmd,
  qual::text as using_clause,
  with_check::text as with_check_clause
FROM pg_policies
WHERE tablename = 'member_applications'
ORDER BY permissive DESC, cmd, policyname;

-- Check table security settings
SELECT
  tablename,
  rowsecurity as rls_enabled,
  relforcerowsecurity as rls_forced
FROM pg_tables t
JOIN pg_class c ON t.tablename = c.relname
WHERE tablename = 'member_applications';

-- Check if authenticator role is properly set up
SELECT
  r.rolname,
  array_agg(m.rolname) as member_of_roles
FROM pg_roles r
LEFT JOIN pg_auth_members am ON r.oid = am.member
LEFT JOIN pg_roles m ON am.roleid = m.oid
WHERE r.rolname = 'anon'
GROUP BY r.rolname;
