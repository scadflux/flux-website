-- FIX STORAGE BUCKET POLICIES
-- This allows image uploads for events and members
-- Run this AFTER running FIX_ALL_RLS.sql

-- ============================================================================
-- MAKE STORAGE BUCKETS PUBLIC
-- ============================================================================

-- Update event-images bucket to be public
UPDATE storage.buckets
SET public = true
WHERE id = 'event-images';

-- Update member-photos bucket to be public (if exists)
UPDATE storage.buckets
SET public = true
WHERE id = 'member-photos';

-- Update vibe-images bucket to be public (if exists)
UPDATE storage.buckets
SET public = true
WHERE id = 'vibe-images';

-- ============================================================================
-- DROP ALL RESTRICTIVE STORAGE POLICIES
-- ============================================================================
 
-- Drop all policies on event-images bucket
DROP POLICY IF EXISTS "Anyone can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- ============================================================================
-- CREATE PERMISSIVE STORAGE POLICIES
-- ============================================================================

-- Allow anyone to view files in public buckets
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id IN ('event-images', 'member-photos', 'vibe-images'));

-- Allow anyone to upload files
CREATE POLICY "Public insert access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id IN ('event-images', 'member-photos', 'vibe-images'));

-- Allow anyone to update files
CREATE POLICY "Public update access"
ON storage.objects FOR UPDATE
USING (bucket_id IN ('event-images', 'member-photos', 'vibe-images'));

-- Allow anyone to delete files
CREATE POLICY "Public delete access"
ON storage.objects FOR DELETE
USING (bucket_id IN ('event-images', 'member-photos', 'vibe-images'));
