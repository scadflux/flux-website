-- ============================================================================
-- COMPLETE DATABASE MIGRATION FOR AUTH SYSTEM
-- Run this ONCE in Supabase SQL Editor to fix all schema issues
-- ============================================================================

-- Step 1: Add missing columns with proper defaults
-- ============================================================================

-- Add is_public column (for profile visibility)
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Ensure member_type has a default
ALTER TABLE members ALTER COLUMN member_type SET DEFAULT 'Student';

-- Update any NULL member_type values
UPDATE members
SET member_type = CASE
  WHEN is_alumni = true THEN 'Alumni'
  ELSE 'Student'
END
WHERE member_type IS NULL;

-- Ensure is_active exists and defaults to true
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add common social fields if missing
ALTER TABLE members ADD COLUMN IF NOT EXISTS behance_url TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS dribbble_url TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS personal_website TEXT;

-- Add skills array if missing
ALTER TABLE members ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';

-- Step 2: Ensure user_id column exists and is properly set up
-- ============================================================================

-- user_id should already exist, but let's ensure it's set up correctly
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'members' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE members ADD COLUMN user_id UUID;
  END IF;
END $$;

-- Add foreign key constraint if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'members_user_id_fkey'
  ) THEN
    ALTER TABLE members
    ADD CONSTRAINT members_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add unique constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'members_user_id_unique'
  ) THEN
    ALTER TABLE members
    ADD CONSTRAINT members_user_id_unique
    UNIQUE (user_id);
  END IF;
END $$;

-- Step 3: Create indexes for performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_is_public ON members(is_public);
CREATE INDEX IF NOT EXISTS idx_members_is_active ON members(is_active);

-- Step 4: Set up Row Level Security (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can create their own member profile" ON members;
DROP POLICY IF EXISTS "Users can view their own member profile" ON members;
DROP POLICY IF EXISTS "Users can update their own member profile" ON members;
DROP POLICY IF EXISTS "Anyone can view public member profiles" ON members;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON members;
DROP POLICY IF EXISTS "Users can insert own member data" ON members;

-- Policy 1: Allow authenticated users to INSERT their own profile
CREATE POLICY "Users can create their own profile"
  ON members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy 2: Allow authenticated users to SELECT their own profile OR public profiles
CREATE POLICY "Users can view accessible profiles"
  ON members
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    is_public = true
  );

-- Policy 3: Allow authenticated users to UPDATE only their own profile
CREATE POLICY "Users can update their own profile"
  ON members
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: Allow anonymous users to view public profiles
CREATE POLICY "Public profiles are visible to everyone"
  ON members
  FOR SELECT
  TO anon
  USING (is_public = true);

-- Step 5: Grant necessary permissions
-- ============================================================================

GRANT ALL ON members TO authenticated;
GRANT SELECT ON members TO anon;

-- Step 6: Verify setup
-- ============================================================================

-- Show table structure
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'members'
ORDER BY ordinal_position;

-- Show policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'members';

-- Show constraints
SELECT
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'members';
