-- ============================================================================
-- Complete Fix for Application Submission
-- ============================================================================
-- Run this entire script in Supabase SQL Editor to fix all issues
-- ============================================================================

-- ============================================================================
-- STEP 1: Fix RLS Policy for Anonymous Application Submissions
-- ============================================================================

-- Drop and recreate the policy to ensure it's correct
DROP POLICY IF EXISTS "Anyone can submit applications" ON member_applications;

CREATE POLICY "Anyone can submit applications"
  ON member_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ============================================================================
-- STEP 2: Storage Bucket Policies
-- ============================================================================
-- NOTE: Before running this section, make sure you've created the storage
-- buckets in Supabase Dashboard:
-- - member-photos (public)
-- - event-photos (public)
-- ============================================================================

-- Clean up existing policies (if they exist)
DROP POLICY IF EXISTS "Anyone can upload member photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view member photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete member photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload event photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view event photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete event photos" ON storage.objects;

-- Member photos policies
CREATE POLICY "Anyone can upload member photos"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'member-photos');

CREATE POLICY "Anyone can view member photos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'member-photos');

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

-- Event photos policies
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

CREATE POLICY "Anyone can view event photos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'event-photos');

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

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Run these queries to verify everything is set up correctly

-- Check RLS policies on member_applications
-- SELECT * FROM pg_policies WHERE tablename = 'member_applications';

-- Check storage policies
-- SELECT * FROM pg_policies WHERE tablename = 'objects';

-- List all storage buckets
-- SELECT * FROM storage.buckets;
