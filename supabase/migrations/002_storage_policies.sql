-- Storage Bucket Policies for member-photos and event-photos

-- Allow anyone to upload to member-photos (for application submissions)
CREATE POLICY "Anyone can upload member photos"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'member-photos');

-- Allow anyone to read member photos (public bucket)
CREATE POLICY "Anyone can view member photos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'member-photos');

-- Allow admins to delete member photos
CREATE POLICY "Admins can delete member photos"
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

-- Allow admins to upload event photos
CREATE POLICY "Admins can upload event photos"
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

-- Allow anyone to read event photos (public bucket)
CREATE POLICY "Anyone can view event photos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'event-photos');

-- Allow admins to delete event photos
CREATE POLICY "Admins can delete event photos"
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
