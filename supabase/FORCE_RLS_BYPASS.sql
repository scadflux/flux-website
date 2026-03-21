-- ============================================================================
-- Try using USING clause instead of WITH CHECK
-- ============================================================================
-- Some PostgreSQL versions have issues with WITH CHECK on INSERT without USING
-- ============================================================================

-- Drop existing policy
DROP POLICY IF EXISTS "simple_insert_policy" ON member_applications;

-- Try with BOTH using and with_check (even though using shouldn't matter for INSERT)
CREATE POLICY "insert_with_using_and_check"
ON member_applications
FOR INSERT
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Test it
SET ROLE anon;
INSERT INTO member_applications (name, email, year, campus, bio, reason_for_joining)
VALUES ('Using+Check Test', 'usingcheck' || floor(random()*1000) || '@test.com', '2024', 'SAV CAMPUS', 'Test', 'Test')
RETURNING id, name, email;
RESET ROLE;

-- Show the policy
SELECT policyname, cmd, qual::text as using_clause, with_check::text
FROM pg_policies
WHERE tablename = 'member_applications' AND cmd = 'INSERT';
