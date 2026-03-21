-- ============================================================================
-- Verify What Actually Exists in Database
-- ============================================================================

-- 1. Check GRANT permissions on member_applications
SELECT
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants
WHERE table_name = 'member_applications'
AND grantee IN ('anon', 'authenticated', 'postgres', 'public')
ORDER BY grantee, privilege_type;

-- 2. Check ALL policies on member_applications
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

-- 3. Test direct SQL insert (bypasses RLS if you're superuser)
-- This will tell us if the table itself works
INSERT INTO member_applications (
  name,
  email,
  year,
  campus,
  bio,
  reason_for_joining
) VALUES (
  'Direct SQL Test',
  'directsql' || floor(random() * 100000) || '@test.com',
  '2024',
  'SAV CAMPUS',
  'Testing direct SQL insert',
  'Testing if table works at all'
) RETURNING id, name, email, status, created_at;

-- 4. Check if RLS is actually enabled
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'member_applications';

-- 5. Check storage bucket visibility
SELECT id, name, public, owner FROM storage.buckets;

-- 6. Check storage permissions
SELECT
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'storage'
AND table_name = 'buckets'
AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;
