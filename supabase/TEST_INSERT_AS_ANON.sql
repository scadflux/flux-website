-- Test inserting as anonymous user directly in SQL
-- This simulates what the application form does

-- First, let's see what the current role is
SELECT current_user, current_role;

-- Try to insert a test application
-- This should work if the policy is correct
INSERT INTO member_applications (
  name,
  email,
  year,
  campus,
  bio,
  reason_for_joining
) VALUES (
  'SQL Test User',
  'sqltest' || floor(random() * 10000) || '@example.com',
  '2024',
  'SAV CAMPUS',
  'Testing database insert from SQL editor',
  'Verifying RLS policy configuration'
) RETURNING id, name, email, status;

-- If the above works, delete it
-- DELETE FROM member_applications WHERE name = 'SQL Test User';
