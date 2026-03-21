-- View all pending applications
SELECT
  id,
  name,
  email,
  year,
  campus,
  bio,
  portfolio_url,
  reason_for_joining,
  status,
  created_at
FROM member_applications
WHERE status = 'pending'
ORDER BY created_at DESC;
