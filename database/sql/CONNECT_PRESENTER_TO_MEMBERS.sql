-- Connect presenter to members table
-- This allows selecting FLUX members as event presenters

-- Step 1: Remove the text presenter column if it exists
ALTER TABLE events
DROP COLUMN IF EXISTS presenter CASCADE;

-- Step 2: Add presenter_id as a foreign key to members
ALTER TABLE events
ADD COLUMN IF NOT EXISTS presenter_id UUID REFERENCES members(id) ON DELETE SET NULL;

-- Step 3: Verify the change
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'events'
AND column_name IN ('presenter_id', 'created_by')
ORDER BY column_name;

-- Should show:
-- created_by    | uuid | YES
-- presenter_id  | uuid | YES
