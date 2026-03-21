-- ============================================================================
-- Fix Members Table INSERT Policy
-- ============================================================================
-- Allow INSERT into members table (needed for approving applications)
-- ============================================================================

-- Check current INSERT policies on members
SELECT policyname, cmd, roles::text, with_check::text
FROM pg_policies
WHERE tablename = 'members' AND cmd = 'INSERT';

-- Add INSERT policy for anon and authenticated (needed for approveApplication)
CREATE POLICY "allow_insert_members_from_applications"
ON members
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Verify it was created
SELECT policyname, cmd, roles::text
FROM pg_policies
WHERE tablename = 'members' AND cmd = 'INSERT';
