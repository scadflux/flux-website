-- ============================================================================
-- Check Storage Bucket Permissions
-- ============================================================================

-- 1. Verify buckets exist
SELECT id, name, public, owner FROM storage.buckets ORDER BY name;

-- 2. Check storage.objects table permissions
SELECT
  grantee,
  table_name,
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'storage'
AND table_name = 'objects'
AND grantee IN ('anon', 'authenticated', 'postgres')
ORDER BY grantee, privilege_type;

-- 3. Check storage.buckets table permissions
SELECT
  grantee,
  table_name,
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'storage'
AND table_name = 'buckets'
AND grantee IN ('anon', 'authenticated', 'postgres')
ORDER BY grantee, privilege_type;

-- 4. Check policies on storage.objects
SELECT
  policyname,
  cmd,
  roles::text,
  with_check::text
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
ORDER BY policyname;

-- 5. Check if anon role can access storage schema
SELECT
  schema_name,
  schema_owner
FROM information_schema.schemata
WHERE schema_name = 'storage';
