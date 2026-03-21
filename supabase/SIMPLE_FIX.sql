-- ============================================================================
-- SIMPLE ONE-STEP FIX FOR APPLICATION SUBMISSION
-- ============================================================================
-- Copy and paste this ENTIRE script into Supabase SQL Editor and run it once
-- ============================================================================

-- Drop the broken policy
DROP POLICY IF EXISTS "Anyone can submit applications" ON member_applications;

-- Create a new policy that allows PUBLIC (includes anonymous) to insert
CREATE POLICY "allow_public_insert_applications"
  ON member_applications
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Verify it was created (you should see the new policy listed)
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'member_applications'
AND cmd = 'INSERT';
