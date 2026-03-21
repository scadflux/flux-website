-- ============================================================================
-- FLUX University Club - Complete Fresh Database Setup
-- ============================================================================
-- This is a complete fresh start. Run this entire script in Supabase SQL Editor
-- BEFORE running this, make sure to create the storage buckets (see instructions below)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 1: DROP ALL EXISTING TABLES (if they exist)
-- ============================================================================

DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS member_applications CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS get_member_id(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================================================
-- STEP 2: CREATE TABLES
-- ============================================================================

-- Member Applications Table
CREATE TABLE member_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  year TEXT NOT NULL,
  campus TEXT NOT NULL,
  bio TEXT NOT NULL,
  portfolio_url TEXT,
  photo_url TEXT,
  reason_for_joining TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_member_applications_status ON member_applications(status);
CREATE INDEX idx_member_applications_email ON member_applications(email);

-- Members Table
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  year TEXT NOT NULL,
  campus TEXT NOT NULL,
  member_type TEXT NOT NULL CHECK (member_type IN ('student', 'alumni', 'faculty')),
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  bio TEXT,
  portfolio_url TEXT,
  photo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  graduation_year INTEGER,
  current_company TEXT,
  current_position TEXT,
  linkedin_url TEXT,
  willing_to_mentor BOOLEAN NOT NULL DEFAULT false,
  is_flux_team BOOLEAN NOT NULL DEFAULT false,
  flux_team_role TEXT,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_member_type ON members(member_type);
CREATE INDEX idx_members_is_active ON members(is_active);
CREATE INDEX idx_members_role ON members(role);
CREATE INDEX idx_members_is_flux_team ON members(is_flux_team);

-- Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'general' CHECK (event_type IN ('workshop', 'social', 'general', 'competition')),
  photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  max_attendees INTEGER,
  registration_deadline TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_is_published ON events(is_published);
CREATE INDEX idx_events_created_by ON events(created_by);

-- Event Registrations Table
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, member_id)
);

CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_member_id ON event_registrations(member_id);

-- ============================================================================
-- STEP 3: CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to check if current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM members
    WHERE user_id = auth.uid()
    AND role = 'admin'
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get member ID from user ID
CREATE OR REPLACE FUNCTION get_member_id(user_uuid UUID)
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id
    FROM members
    WHERE user_id = user_uuid
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 4: CREATE TRIGGERS
-- ============================================================================

CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 5: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE member_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 6: CREATE RLS POLICIES - MEMBER_APPLICATIONS
-- ============================================================================

-- CRITICAL: Allow public (anonymous + authenticated) to INSERT applications
CREATE POLICY "public_can_insert_applications"
  ON member_applications
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Admins can view all applications
CREATE POLICY "admins_can_view_applications"
  ON member_applications
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins can update applications
CREATE POLICY "admins_can_update_applications"
  ON member_applications
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete applications
CREATE POLICY "admins_can_delete_applications"
  ON member_applications
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================================
-- STEP 7: CREATE RLS POLICIES - MEMBERS
-- ============================================================================

-- Public can view active members
CREATE POLICY "public_can_view_active_members"
  ON members
  FOR SELECT
  TO public
  USING (is_active = true);

-- Members can update their own profile
CREATE POLICY "members_can_update_own_profile"
  ON members
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can insert members
CREATE POLICY "admins_can_insert_members"
  ON members
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admins can update any member
CREATE POLICY "admins_can_update_members"
  ON members
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete members
CREATE POLICY "admins_can_delete_members"
  ON members
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================================
-- STEP 8: CREATE RLS POLICIES - EVENTS
-- ============================================================================

-- Public can view published events
CREATE POLICY "public_can_view_published_events"
  ON events
  FOR SELECT
  TO public
  USING (is_published = true);

-- Admins can view all events
CREATE POLICY "admins_can_view_all_events"
  ON events
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins can create events
CREATE POLICY "admins_can_create_events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admins can update events
CREATE POLICY "admins_can_update_events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete events
CREATE POLICY "admins_can_delete_events"
  ON events
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================================
-- STEP 9: CREATE RLS POLICIES - EVENT_REGISTRATIONS
-- ============================================================================

-- Authenticated members can register for events
CREATE POLICY "members_can_register_for_events"
  ON event_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (member_id = get_member_id(auth.uid()));

-- Members can view their own registrations
CREATE POLICY "members_can_view_own_registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (member_id = get_member_id(auth.uid()));

-- Members can cancel their own registrations
CREATE POLICY "members_can_cancel_own_registrations"
  ON event_registrations
  FOR DELETE
  TO authenticated
  USING (member_id = get_member_id(auth.uid()));

-- Admins can view all registrations
CREATE POLICY "admins_can_view_all_registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins can delete any registration
CREATE POLICY "admins_can_delete_registrations"
  ON event_registrations
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check tables were created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check RLS policies for member_applications
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'member_applications'
ORDER BY policyname;

-- ============================================================================
-- SUCCESS!
-- ============================================================================
-- If you see the tables and policies listed above, the setup is complete.
-- Next steps:
-- 1. Create storage buckets (member-photos, event-photos) via Supabase Dashboard
-- 2. Run the storage policies script
-- 3. Test with: node test-db-connection.js
-- ============================================================================
