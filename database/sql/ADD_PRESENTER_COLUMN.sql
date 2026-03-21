-- Add the presenter column to events table

ALTER TABLE events
ADD COLUMN IF NOT EXISTS presenter TEXT;

-- Verify all columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'events'
AND column_name IN ('presenter', 'location', 'logo_url', 'cover_image_url')
ORDER BY column_name;

-- Should show:
-- cover_image_url | text
-- location        | text
-- logo_url        | text
-- presenter       | text
