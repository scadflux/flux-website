-- Fix RLS policies for member creation
-- This ensures users can create their own member profiles

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create their own member profile" ON members;
DROP POLICY IF EXISTS "Users can view their own member profile" ON members;
DROP POLICY IF EXISTS "Users can update their own member profile" ON members;

-- Enable RLS on members table
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

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

-- Ensure the auth_user_id column exists and has proper constraints
DO $$
BEGIN
  -- Check if constraint exists before adding
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'members_auth_user_id_unique'
    AND table_name = 'members'
  ) THEN
    ALTER TABLE members ADD CONSTRAINT members_auth_user_id_unique UNIQUE (auth_user_id);
  END IF;
END $$;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_members_auth_user_id ON members(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);