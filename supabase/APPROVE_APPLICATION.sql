-- ============================================================================
-- Approve a Member Application
-- ============================================================================
-- This script approves an application and creates a member record
-- Replace 'APPLICATION_ID_HERE' with the actual application ID
-- ============================================================================

-- Step 1: View the application you want to approve
SELECT
  id,
  name,
  email,
  year,
  campus,
  bio,
  portfolio_url,
  photo_url,
  reason_for_joining
FROM member_applications
WHERE id = 'APPLICATION_ID_HERE';  -- Replace with actual ID

-- Step 2: Approve the application (insert into members table)
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
  'student' as member_type,  -- Change to 'alumni' or 'faculty' if needed
  'member' as role,          -- Change to 'admin' to make them an admin
  true as is_active,
  false as is_flux_team      -- Change to true if they're on FLUX team
FROM member_applications
WHERE id = 'APPLICATION_ID_HERE'  -- Replace with actual ID
RETURNING id, name, email, member_type, role;

-- Step 3: Update application status to 'approved'
UPDATE member_applications
SET status = 'approved'
WHERE id = 'APPLICATION_ID_HERE'  -- Replace with actual ID
RETURNING id, name, status;

-- ============================================================================
-- After running this, the member will appear on the Community page!
-- ============================================================================
