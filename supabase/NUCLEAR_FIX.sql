-- ============================================================================
-- NUCLEAR OPTION: Complete RLS Reset
-- ============================================================================
-- This will disable RLS, remove all policies, and rebuild from scratch
-- ============================================================================

-- Step 1: Disable RLS temporarily
ALTER TABLE member_applications DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE tablename = 'member_applications'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON member_applications', pol.policyname);
    END LOOP;
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE member_applications ENABLE ROW LEVEL SECURITY;

-- Step 4: Create the INSERT policy for anonymous users
-- Using the most permissive syntax possible
CREATE POLICY "allow_anon_insert"
  ON member_applications
  AS PERMISSIVE
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Step 5: Recreate admin policies
CREATE POLICY "allow_admin_select"
  ON member_applications
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "allow_admin_update"
  ON member_applications
  AS PERMISSIVE
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM members
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "allow_admin_delete"
  ON member_applications
  AS PERMISSIVE
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Step 6: Verify
SELECT
  policyname,
  cmd,
  permissive,
  roles::text
FROM pg_policies
WHERE tablename = 'member_applications'
ORDER BY cmd, policyname;
