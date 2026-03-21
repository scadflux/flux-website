-- ============================================================================
-- Fix Storage Bucket Visibility
-- ============================================================================
-- Allow anon to list buckets via storage.listBuckets()
-- ============================================================================

-- Grant SELECT on storage.buckets to anon
GRANT SELECT ON TABLE storage.buckets TO anon, authenticated;

-- Grant SELECT on storage.objects to anon (for file listings)
GRANT SELECT ON TABLE storage.objects TO anon, authenticated;

-- Verify grants
SELECT
  grantee,
  table_schema,
  table_name,
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'storage'
AND table_name IN ('buckets', 'objects')
AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee, privilege_type;

-- Verify buckets are visible
SELECT id, name, public FROM storage.buckets;
