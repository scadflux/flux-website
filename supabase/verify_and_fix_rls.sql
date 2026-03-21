-- ============================================================================
-- Step 1: Check current policies
-- ============================================================================
-- Run this first to see what policies exist
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'member_applications'
ORDER BY policyname;

-- ============================================================================
-- Step 2: Drop ALL existing policies on member_applications
-- ============================================================================
-- Run each of these individually if you get errors

DROP POLICY IF EXISTS "Anyone can submit applications" ON member_applications;
DROP POLICY IF EXISTS "Public can submit applications" ON member_applications;
DROP POLICY IF EXISTS "Anon can submit applications" ON member_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON member_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON member_applications;
DROP POLICY IF EXISTS "Admins can delete applications" ON member_applications;

-- ============================================================================
-- Step 3: Create new policies with correct permissions
-- ============================================================================

-- Allow anonymous AND authenticated users to INSERT applications
CREATE POLICY "allow_anon_insert_applications"
  ON member_applications
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Admins can SELECT applications
CREATE POLICY "allow_admin_select_applications"
  ON member_applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Admins can UPDATE applications
CREATE POLICY "allow_admin_update_applications"
  ON member_applications
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

-- Admins can DELETE applications
CREATE POLICY "allow_admin_delete_applications"
  ON member_applications
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- ============================================================================
-- Step 4: Verify RLS is enabled
-- ============================================================================

-- Check if RLS is enabled (should return true)
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'member_applications'
AND schemaname = 'public';

-- ============================================================================
-- Step 5: Verify new policies
-- ============================================================================

SELECT
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'member_applications'
ORDER BY policyname;
