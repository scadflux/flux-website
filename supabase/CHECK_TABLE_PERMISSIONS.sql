-- ============================================================================
-- Check Table-Level Permissions (GRANT)
-- ============================================================================
-- RLS policies control row-level access, but table-level GRANT permissions
-- control whether roles can even attempt INSERT/SELECT/UPDATE/DELETE
-- ============================================================================

-- 1. Check what permissions exist on member_applications
SELECT
  grantee,
  table_schema,
  table_name,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'member_applications'
ORDER BY grantee, privilege_type;

-- 2. Check default privileges for anon role
SELECT
  r.rolname,
  r.rolsuper,
  r.rolinherit,
  r.rolcreaterole,
  r.rolcreatedb,
  r.rolcanlogin
FROM pg_roles r
WHERE r.rolname IN ('anon', 'authenticated', 'postgres', 'authenticator')
ORDER BY r.rolname;

-- 3. Check if anon role has been granted permissions
-- Expected: anon should have INSERT, SELECT, UPDATE, DELETE on member_applications
SELECT
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'member_applications'
AND grantee IN ('anon', 'authenticated', 'authenticator', 'postgres')
ORDER BY grantee, privilege_type;
