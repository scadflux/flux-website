-- ============================================================================
-- Event Images Storage Bucket and Policies
-- ============================================================================

-- Create event-images bucket (if not exists, you'll need to create manually in Supabase dashboard)
-- Go to Storage > Create bucket > name: "event-images" > public: true

-- Allow anyone to upload event images
CREATE POLICY "Anyone can upload event images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'event-images');

-- Allow anyone to read event images
CREATE POLICY "Anyone can view event images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'event-images');

-- Allow anyone to update event images
CREATE POLICY "Anyone can update event images"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'event-images');

-- Allow anyone to delete event images
CREATE POLICY "Anyone can delete event images"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'event-images');

-- Verify policies were created
SELECT policyname, cmd, roles::text
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
AND policyname LIKE '%event images%';
