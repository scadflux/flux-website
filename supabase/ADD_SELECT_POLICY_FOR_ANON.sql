-- ============================================================================
-- Add SELECT policy for anon (required for RETURNING clause)
-- ============================================================================
-- When you INSERT with RETURNING, PostgreSQL needs SELECT permission
-- to return the inserted row data
-- ============================================================================

-- Add SELECT policy that allows anon to see their own insert
CREATE POLICY "anon_can_select_own_insert"
ON member_applications
FOR SELECT
TO anon, authenticated
USING (true);

-- Verify all policies now
SELECT
  policyname,
  cmd,
  roles::text
FROM pg_policies
WHERE tablename = 'member_applications'
ORDER BY cmd, policyname;

-- Test insert with RETURNING
SET ROLE anon;
INSERT INTO member_applications (name, email, year, campus, bio, reason_for_joining)
VALUES ('With SELECT Policy', 'selectpolicy' || floor(random()*1000) || '@test.com', '2024', 'SAV CAMPUS', 'Test with SELECT policy', 'Test')
RETURNING id, name, email, status;
RESET ROLE;
