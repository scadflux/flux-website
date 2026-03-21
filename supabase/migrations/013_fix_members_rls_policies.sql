-- Fix Members and Applications RLS Policies for Admin Panel
-- This allows member/application management without authentication

-- ============================================================================
-- MEMBER_APPLICATIONS TABLE
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view applications" ON member_applications;
DROP POLICY IF EXISTS "Anyone can insert applications" ON member_applications;
DROP POLICY IF EXISTS "Admin can update applications" ON member_applications;
DROP POLICY IF EXISTS "Admin can delete applications" ON member_applications;

-- Create new policies
CREATE POLICY "Anyone can insert applications"
  ON member_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view applications"
  ON member_applications FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update applications"
  ON member_applications FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete applications"
  ON member_applications FOR DELETE
  USING (true);

-- ============================================================================
-- MEMBERS TABLE
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active members" ON members;
DROP POLICY IF EXISTS "Members can update their own profile" ON members;
DROP POLICY IF EXISTS "Admin can insert members" ON members;
DROP POLICY IF EXISTS "Admin can update members" ON members;
DROP POLICY IF EXISTS "Admin can delete members" ON members;

-- Create new policies
CREATE POLICY "Anyone can view active members"
  ON members FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can insert members"
  ON members FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update members"
  ON members FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete members"
  ON members FOR DELETE
  USING (true);

-- Note: In production, you should add proper authentication
-- and restrict these policies to authenticated admin users only
-- For now, these policies allow the admin panel to work
