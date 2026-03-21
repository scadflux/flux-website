-- Complete fix for members table
-- Run this entire script in Supabase SQL Editor

-- Step 1: Add auth_user_id column if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'members'
    AND column_name = 'auth_user_id'
  ) THEN
    ALTER TABLE members ADD COLUMN auth_user_id UUID;
  END IF;
END $$;

-- Step 2: Add is_alumni and graduation_year if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'members'
    AND column_name = 'is_alumni'
  ) THEN
    ALTER TABLE members ADD COLUMN is_alumni BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'members'
    AND column_name = 'graduation_year'
  ) THEN
    ALTER TABLE members ADD COLUMN graduation_year VARCHAR(4);
  END IF;
END $$;

-- Step 3: Drop existing constraints if they exist
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_auth_user_id_fkey;
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_auth_user_id_unique;

-- Step 4: Add foreign key constraint
ALTER TABLE members
ADD CONSTRAINT members_auth_user_id_fkey
FOREIGN KEY (auth_user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Step 5: Add unique constraint
ALTER TABLE members
ADD CONSTRAINT members_auth_user_id_unique
UNIQUE (auth_user_id);

-- Step 6: Create indexes
DROP INDEX IF EXISTS idx_members_auth_user_id;
DROP INDEX IF EXISTS idx_members_email;
CREATE INDEX idx_members_auth_user_id ON members(auth_user_id);
CREATE INDEX idx_members_email ON members(email);

-- Step 7: Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Step 8: Drop all existing policies
DROP POLICY IF EXISTS "Users can create their own member profile" ON members;
DROP POLICY IF EXISTS "Users can view their own member profile" ON members;
DROP POLICY IF EXISTS "Users can update their own member profile" ON members;
DROP POLICY IF EXISTS "Anyone can view public member profiles" ON members;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON members;
DROP POLICY IF EXISTS "Users can insert own member data" ON members;

-- Step 9: Create new policies
CREATE POLICY "Users can create their own member profile"
  ON members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can view their own member profile"
  ON members
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id OR is_public = true);

CREATE POLICY "Users can update their own member profile"
  ON members
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Anyone can view public member profiles"
  ON members
  FOR SELECT
  TO anon
  USING (is_public = true);

-- Step 10: Grant permissions
GRANT ALL ON members TO authenticated;
GRANT SELECT ON members TO anon;

-- Step 11: Refresh schema cache (IMPORTANT!)
NOTIFY pgrst, 'reload schema';

-- Step 12: Show current table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'members'
ORDER BY ordinal_position;