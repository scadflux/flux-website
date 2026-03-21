-- Set default value for member_type column
-- This will prevent the NOT NULL constraint error

-- First, update any existing NULL values
UPDATE members
SET member_type = CASE
  WHEN is_alumni = true THEN 'Alumni'
  ELSE 'Student'
END
WHERE member_type IS NULL;

-- Set default value for future inserts
ALTER TABLE members
ALTER COLUMN member_type SET DEFAULT 'Student';

-- Verify the changes
SELECT id, name, email, member_type, is_alumni
FROM members
ORDER BY created_at DESC
LIMIT 10;