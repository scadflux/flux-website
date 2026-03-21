-- Fix RLS policies to use the correct 'user_id' column
-- Your database uses 'user_id' not 'auth_user_id'

-- Enable RLS on members table
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can create their own member profile" ON members;
DROP POLICY IF EXISTS "Users can view their own member profile" ON members;
DROP POLICY IF EXISTS "Users can update their own member profile" ON members;
DROP POLICY IF EXISTS "Anyone can view public member profiles" ON members;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON members;
DROP POLICY IF EXISTS "Users can insert own member data" ON members;

-- Create new policies using 'user_id'
CREATE POLICY "Users can create their own member profile"
  ON members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own member profile"
  ON members
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can update their own member profile"
  ON members
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view public member profiles"
  ON members
  FOR SELECT
  TO anon
  USING (is_public = true);

-- Grant necessary permissions
GRANT ALL ON members TO authenticated;
GRANT SELECT ON members TO anon;

-- Add is_public column if it doesn't exist
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Show policies to verify
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'members';