-- Test direct SQL insert (this bypasses client-side restrictions)
INSERT INTO member_applications (
  name,
  email,
  year,
  campus,
  bio,
  reason_for_joining
) VALUES (
  'Direct SQL Test',
  'directsql' || floor(random() * 100000) || '@test.com',
  '2024',
  'SAV CAMPUS',
  'Testing direct SQL insert',
  'Testing if table works at all'
) RETURNING id, name, email, status, created_at;
