-- ============================================================================
-- Fix Anon Role Membership
-- ============================================================================
-- The anon role must be a member of authenticator role in Supabase
-- ============================================================================

-- Grant anon role membership in authenticator
GRANT anon TO authenticator;
GRANT authenticated TO authenticator;

-- Verify the fix
SELECT
  r.rolname as role,
  array_agg(m.rolname) as member_of_roles
FROM pg_roles r
LEFT JOIN pg_auth_members am ON r.oid = am.member
LEFT JOIN pg_roles m ON am.roleid = m.oid
WHERE r.rolname IN ('anon', 'authenticated')
GROUP BY r.rolname
ORDER BY r.rolname;

-- Test insert again
SET ROLE anon;
INSERT INTO member_applications (name, email, year, campus, bio, reason_for_joining)
VALUES ('After Role Fix', 'rolefix' || floor(random()*1000) || '@test.com', '2024', 'SAV CAMPUS', 'Test after fixing role membership', 'Test')
RETURNING id, name, email, status;
RESET ROLE;
