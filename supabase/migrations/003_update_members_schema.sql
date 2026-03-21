-- ============================================================================
-- Update Members Table Schema - Add New Fields
-- ============================================================================

-- Add new fields to members table
ALTER TABLE members
ADD COLUMN IF NOT EXISTS major TEXT,
ADD COLUMN IF NOT EXISTS minor TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS vibe_images JSONB DEFAULT '[]'::jsonb;

-- Update member_applications table with same fields
ALTER TABLE member_applications
ADD COLUMN IF NOT EXISTS major TEXT,
ADD COLUMN IF NOT EXISTS minor TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS vibe_images JSONB DEFAULT '[]'::jsonb;

-- Verify columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'members'
AND column_name IN ('major', 'minor', 'instagram_url', 'vibe_images')
ORDER BY column_name;
