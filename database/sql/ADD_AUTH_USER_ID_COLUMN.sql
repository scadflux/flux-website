-- Add auth_user_id column to members table if it doesn't exist
-- This links member profiles to Supabase auth users

-- Add the column if it doesn't exist
ALTER TABLE members
ADD COLUMN IF NOT EXISTS auth_user_id UUID;

-- Add foreign key constraint to auth.users
ALTER TABLE members
DROP CONSTRAINT IF EXISTS members_auth_user_id_fkey;

ALTER TABLE members
ADD CONSTRAINT members_auth_user_id_fkey
FOREIGN KEY (auth_user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Add unique constraint to ensure one member per auth user
ALTER TABLE members
DROP CONSTRAINT IF EXISTS members_auth_user_id_unique;

ALTER TABLE members
ADD CONSTRAINT members_auth_user_id_unique
UNIQUE (auth_user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_members_auth_user_id ON members(auth_user_id);

-- Enable RLS on members table
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own member profile" ON members;
DROP POLICY IF EXISTS "Users can view their own member profile" ON members;
DROP POLICY IF EXISTS "Users can update their own member profile" ON members;
DROP POLICY IF EXISTS "Anyone can view public member profiles" ON members;

-- Policy for creating member profile (authenticated users can create their own profile)
CREATE POLICY "Users can create their own member profile"
  ON members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

-- Policy for viewing member profiles
CREATE POLICY "Users can view their own member profile"
  ON members
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = auth_user_id OR
    is_public = true
  );

-- Policy for updating own profile
CREATE POLICY "Users can update their own member profile"
  ON members
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- Policy for public viewing (anyone can view public profiles)
CREATE POLICY "Anyone can view public member profiles"
  ON members
  FOR SELECT
  TO anon
  USING (is_public = true);

-- Grant necessary permissions
GRANT ALL ON members TO authenticated;
GRANT SELECT ON members TO anon;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';