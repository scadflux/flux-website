-- ============================================================================
-- Vibe Images Storage Bucket and Policies
-- ============================================================================

-- Create vibe-images bucket (if not exists, you'll need to create manually in Supabase dashboard)
-- Go to Storage > Create bucket > name: "vibe-images" > public: true

-- Allow anyone to upload vibe images
CREATE POLICY "Anyone can upload vibe images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'vibe-images');

-- Allow anyone to read vibe images
CREATE POLICY "Anyone can view vibe images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'vibe-images');

-- Allow anyone to update vibe images
CREATE POLICY "Anyone can update vibe images"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'vibe-images');

-- Allow anyone to delete vibe images
CREATE POLICY "Anyone can delete vibe images"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'vibe-images');

-- Verify policies were created
SELECT policyname, cmd, roles::text
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
AND policyname LIKE '%vibe images%';
