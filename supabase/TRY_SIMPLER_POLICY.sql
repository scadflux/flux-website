-- ============================================================================
-- Try the SIMPLEST possible policy
-- ============================================================================

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "anon_can_insert_applications" ON member_applications;

-- Create the absolute simplest policy possible
-- No AS PERMISSIVE, just the basics
CREATE POLICY "simple_insert_policy"
ON member_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Test it
SET ROLE anon;
INSERT INTO member_applications (name, email, year, campus, bio, reason_for_joining)
VALUES ('Simple Policy Test', 'simpletest' || floor(random()*1000) || '@test.com', '2024', 'SAV CAMPUS', 'Test', 'Test')
RETURNING id, name, email, status;
RESET ROLE;

-- Verify policy
SELECT policyname, cmd, roles::text, with_check::text
FROM pg_policies
WHERE tablename = 'member_applications' AND cmd = 'INSERT';
