-- Check if anon has SELECT policy (needed for RETURNING clause)
SELECT
  policyname,
  cmd,
  roles::text,
  qual::text as using_clause
FROM pg_policies
WHERE tablename = 'member_applications'
AND cmd = 'SELECT'
ORDER BY policyname;

-- Check if anon was granted to authenticator
SELECT
  r.rolname as role,
  array_agg(m.rolname) as member_of_roles
FROM pg_roles r
LEFT JOIN pg_auth_members am ON r.oid = am.member
LEFT JOIN pg_roles m ON am.roleid = m.oid
WHERE r.rolname = 'anon'
GROUP BY r.rolname;
