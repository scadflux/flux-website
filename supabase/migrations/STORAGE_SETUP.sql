-- ============================================================================
-- Storage Bucket Policies Setup
-- ============================================================================
-- IMPORTANT: Before running this script, you MUST create the storage buckets
-- via Supabase Dashboard > Storage > New bucket
--
-- Bucket 1: member-photos (Public: YES, File size: 5MB)
-- Bucket 2: event-photos (Public: YES, File size: 10MB)
-- ============================================================================

-- Drop existing storage policies (if any)
DROP POLICY IF EXISTS "public_can_upload_member_photos" ON storage.objects;
DROP POLICY IF EXISTS "public_can_view_member_photos" ON storage.objects;
DROP POLICY IF EXISTS "admins_can_delete_member_photos" ON storage.objects;
DROP POLICY IF EXISTS "admins_can_upload_event_photos" ON storage.objects;
DROP POLICY IF EXISTS "public_can_view_event_photos" ON storage.objects;
DROP POLICY IF EXISTS "admins_can_delete_event_photos" ON storage.objects;

-- Also drop old policy names (from previous migrations)
DROP POLICY IF EXISTS "Anyone can upload member photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view member photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete member photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload event photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view event photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete event photos" ON storage.objects;

-- ============================================================================
-- Member Photos Bucket Policies
-- ============================================================================

-- Allow public (anonymous + authenticated) to upload member photos
CREATE POLICY "public_can_upload_member_photos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'member-photos');

-- Allow public to view member photos
CREATE POLICY "public_can_view_member_photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'member-photos');

-- Allow admins to delete member photos
CREATE POLICY "admins_can_delete_member_photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'member-photos'
  AND EXISTS (
    SELECT 1 FROM members
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================================================
-- Event Photos Bucket Policies
-- ============================================================================

-- Allow admins to upload event photos
CREATE POLICY "admins_can_upload_event_photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event-photos'
  AND EXISTS (
    SELECT 1 FROM members
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Allow public to view event photos
CREATE POLICY "public_can_view_event_photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-photos');

-- Allow admins to delete event photos
CREATE POLICY "admins_can_delete_event_photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'event-photos'
  AND EXISTS (
    SELECT 1 FROM members
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- List all storage buckets
SELECT id, name, public FROM storage.buckets ORDER BY name;

-- List all storage policies
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'objects'
ORDER BY policyname;

-- ============================================================================
-- Expected output:
-- Buckets: member-photos (public=true), event-photos (public=true)
-- Policies: 6 policies total (3 for member-photos, 3 for event-photos)
-- ============================================================================
