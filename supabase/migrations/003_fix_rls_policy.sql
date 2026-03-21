-- ============================================================================
-- Fix RLS Policy for Anonymous Application Submissions
-- ============================================================================
-- This migration fixes the RLS policy to allow anonymous users to submit
-- applications through the public application form.
-- ============================================================================

-- First, drop the existing policy if it exists
DROP POLICY IF EXISTS "Anyone can submit applications" ON member_applications;

-- Recreate the policy to allow BOTH anonymous and authenticated users to insert
CREATE POLICY "Anyone can submit applications"
  ON member_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Verify the policy was created
-- To check: SELECT * FROM pg_policies WHERE tablename = 'member_applications';
