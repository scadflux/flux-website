-- Add custom section fields to member_applications and members tables
ALTER TABLE member_applications
ADD COLUMN IF NOT EXISTS custom_section_title TEXT,
ADD COLUMN IF NOT EXISTS custom_section_description TEXT,
ADD COLUMN IF NOT EXISTS custom_section_images TEXT[];

ALTER TABLE members
ADD COLUMN IF NOT EXISTS custom_section_title TEXT,
ADD COLUMN IF NOT EXISTS custom_section_description TEXT,
ADD COLUMN IF NOT EXISTS custom_section_images TEXT[];

-- Add comments to explain the fields
COMMENT ON COLUMN member_applications.custom_section_title IS 'Custom section title (e.g., "My Work", "Projects")';
COMMENT ON COLUMN member_applications.custom_section_description IS 'Custom section description';
COMMENT ON COLUMN member_applications.custom_section_images IS 'Array of custom section image URLs';

COMMENT ON COLUMN members.custom_section_title IS 'Custom section title (e.g., "My Work", "Projects")';
COMMENT ON COLUMN members.custom_section_description IS 'Custom section description';
COMMENT ON COLUMN members.custom_section_images IS 'Array of custom section image URLs';
