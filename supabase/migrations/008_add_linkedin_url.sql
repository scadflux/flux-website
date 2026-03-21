-- Add linkedin_url column to member_applications table
ALTER TABLE member_applications
ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Add comment to explain the field
COMMENT ON COLUMN member_applications.linkedin_url IS 'LinkedIn profile URL of the applicant';
