-- ============================================================================
-- TEMPORARY: Disable RLS to test if that's the issue
-- ============================================================================
-- This will temporarily allow all operations to test if RLS is the blocker
-- DO NOT leave this disabled in production!
-- ============================================================================

-- Disable RLS temporarily
ALTER TABLE member_applications DISABLE ROW LEVEL SECURITY;

-- Test insert as anon
SET ROLE anon;
INSERT INTO member_applications (name, email, year, campus, bio, reason_for_joining)
VALUES ('Test With RLS Disabled', 'rlstest@test.com', '2024', 'SAV CAMPUS', 'Test', 'Test')
RETURNING id, name, status;
RESET ROLE;

-- Re-enable RLS immediately
ALTER TABLE member_applications ENABLE ROW LEVEL SECURITY;

-- Show result
SELECT 'If you see a row above, RLS was the blocker' as result;
