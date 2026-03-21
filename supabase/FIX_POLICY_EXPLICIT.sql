-- ============================================================================
-- Fix RLS Policy - Use Explicit Roles Instead of "public"
-- ============================================================================
-- Supabase might not recognize "TO public" correctly
-- Let's use explicit roles: anon, authenticated
-- ============================================================================

-- Drop the current policy
DROP POLICY IF EXISTS "public_can_insert_applications" ON member_applications;

-- Create new policy with EXPLICIT roles (anon AND authenticated)
CREATE POLICY "anon_and_auth_can_insert_applications"
  ON member_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Verify it was created
SELECT
  policyname,
  cmd,
  roles::text,
  with_check::text
FROM pg_policies
WHERE tablename = 'member_applications'
AND cmd = 'INSERT';

-- Expected output:
-- policyname: anon_and_auth_can_insert_applications
-- roles: {anon,authenticated}
-- with_check: true
