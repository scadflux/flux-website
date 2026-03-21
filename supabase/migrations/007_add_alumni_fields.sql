-- Add alumni fields to member_applications table
ALTER TABLE member_applications
ADD COLUMN IF NOT EXISTS is_alumni BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS graduation_year TEXT;

-- Add alumni fields to members table
ALTER TABLE members
ADD COLUMN IF NOT EXISTS is_alumni BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS graduation_year TEXT;

-- Add comment to explain the fields
COMMENT ON COLUMN member_applications.is_alumni IS 'Whether the applicant is a SCAD alumni';
COMMENT ON COLUMN member_applications.graduation_year IS 'Year the alumni graduated from SCAD';
COMMENT ON COLUMN members.is_alumni IS 'Whether the member is a SCAD alumni';
COMMENT ON COLUMN members.graduation_year IS 'Year the alumni graduated from SCAD';
