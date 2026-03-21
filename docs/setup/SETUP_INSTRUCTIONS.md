# Database Setup Instructions

## Issues Found

1. ❌ RLS policy is blocking anonymous users from submitting applications
2. ❌ Storage buckets (member-photos, event-photos) don't exist

## Quick Fix Steps

### 1. Fix RLS Policy (Run this in Supabase SQL Editor)

Go to your Supabase project → SQL Editor → New Query, then paste and run:

```sql
-- Fix RLS policy to allow anonymous submissions
DROP POLICY IF EXISTS "Anyone can submit applications" ON member_applications;

CREATE POLICY "Anyone can submit applications"
  ON member_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
```

### 2. Create Storage Buckets

Go to Supabase → Storage → Create new bucket:

**Bucket 1: member-photos**
- Name: `member-photos`
- Public: ✅ Yes (checked)
- File size limit: 5 MB
- Allowed MIME types: `image/jpeg,image/png,image/webp`

**Bucket 2: event-photos**
- Name: `event-photos`
- Public: ✅ Yes (checked)
- File size limit: 10 MB
- Allowed MIME types: `image/jpeg,image/png,image/webp`

### 3. Apply Storage Policies

After creating buckets, run this in SQL Editor:

```sql
-- Storage policies for member-photos bucket
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

-- Storage policies for event-photos bucket
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
```

### 4. Test the Fix

Run the test script again:

```bash
node test-db-connection.js
```

You should see:
- ✅ Successfully inserted test application
- ✅ member-photos bucket exists
- ✅ event-photos bucket exists

### 5. Test the Application Form

1. Go to http://localhost:5173/apply
2. Fill out the form
3. Click Submit
4. Check browser console (F12) for any errors

## Verification Queries

To verify policies are set correctly, run in SQL Editor:

```sql
-- Check RLS policies on member_applications
SELECT * FROM pg_policies WHERE tablename = 'member_applications';

-- Check storage policies
SELECT * FROM pg_policies WHERE tablename = 'objects';

-- List all buckets
SELECT * FROM storage.buckets;
```

## Common Issues

- **If you get "policy already exists"**: The policy is already there, just needs to be updated. Use DROP POLICY first.
- **If buckets still don't show**: Make sure you're in the correct Supabase project.
- **If insert still fails**: Check that RLS is enabled on the table (it should be).
