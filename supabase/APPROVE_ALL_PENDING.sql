-- ============================================================================
-- Approve ALL Pending Applications (Quick Test)
-- ============================================================================
-- This approves all pending applications and creates member records
-- Use this for testing or bulk approval
-- ============================================================================

-- Insert all pending applications as members
INSERT INTO members (
  name,
  email,
  year,
  campus,
  bio,
  portfolio_url,
  photo_url,
  member_type,
  role,
  is_active,
  is_flux_team
)
SELECT
  name,
  email,
  year,
  campus,
  bio,
  portfolio_url,
  photo_url,
  'student' as member_type,
  'member' as role,
  true as is_active,
  false as is_flux_team
FROM member_applications
WHERE status = 'pending'
RETURNING id, name, email, member_type;

-- Update all to approved status
UPDATE member_applications
SET status = 'approved'
WHERE status = 'pending'
RETURNING id, name, status;

-- Verify members were created
SELECT
  id,
  name,
  email,
  year,
  campus,
  member_type,
  is_active
FROM members
ORDER BY created_at DESC
LIMIT 10;
