-- Check what storage policies exist
SELECT
  policyname,
  cmd,
  roles::text
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
ORDER BY policyname;

-- Check if we have the necessary policies for member-photos bucket
SELECT COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND policyname LIKE '%member%';
