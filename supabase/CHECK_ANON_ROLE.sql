-- Check if anon role is properly configured
SELECT
  rolname,
  rolsuper,
  rolinherit,
  rolcreaterole,
  rolcreatedb,
  rolcanlogin,
  rolreplication
FROM pg_roles
WHERE rolname IN ('anon', 'authenticated', 'authenticator', 'postgres')
ORDER BY rolname;

-- Check role memberships (anon should inherit from authenticator)
SELECT
  r.rolname as role,
  m.rolname as member_of
FROM pg_roles r
LEFT JOIN pg_auth_members am ON r.oid = am.member
LEFT JOIN pg_roles m ON am.roleid = m.oid
WHERE r.rolname IN ('anon', 'authenticated')
ORDER BY r.rolname;

-- Check table owner
SELECT
  tablename,
  tableowner
FROM pg_tables
WHERE tablename = 'member_applications';

-- Try to test as anon role explicitly
SET ROLE anon;
INSERT INTO member_applications (name, email, year, campus, bio, reason_for_joining)
VALUES ('Anon Role Test', 'anontest@test.com', '2024', 'SAV CAMPUS', 'Test', 'Test')
RETURNING id, name;
RESET ROLE;
