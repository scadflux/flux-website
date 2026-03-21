-- ============================================================================
-- FLUX University Club - Initial Database Schema
-- ============================================================================
-- This migration sets up the complete database structure for the FLUX website
-- including tables, RLS policies, helper functions, and storage buckets.
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Member Applications Table
-- Stores pending applications from people wanting to join the club
-- ============================================================================
CREATE TABLE IF NOT EXISTS member_applications (
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

-- Add index for faster queries
CREATE INDEX idx_member_applications_status ON member_applications(status);
CREATE INDEX idx_member_applications_email ON member_applications(email);

-- Members Table
-- Stores approved members (students, alumni, faculty)
-- ============================================================================
CREATE TABLE IF NOT EXISTS members (
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

-- Add indexes for faster queries
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_member_type ON members(member_type);
CREATE INDEX idx_members_is_active ON members(is_active);
CREATE INDEX idx_members_role ON members(role);
CREATE INDEX idx_members_is_flux_team ON members(is_flux_team);

-- Events Table
-- Stores club events (past and upcoming)
-- ============================================================================
CREATE TABLE IF NOT EXISTS events (
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

-- Add indexes for faster queries
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_is_published ON events(is_published);
CREATE INDEX idx_events_created_by ON events(created_by);

-- Event Registrations Table
-- Tracks who registered for which events
-- ============================================================================
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, member_id)
);

-- Add indexes for faster queries
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_member_id ON event_registrations(member_id);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to check if current user is an admin
-- ============================================================================
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
-- ============================================================================
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
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to update updated_at for members table
CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at for events table
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE member_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - MEMBER_APPLICATIONS
-- ============================================================================

-- Public (anonymous) users can insert applications
CREATE POLICY "Anyone can submit applications"
  ON member_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON member_applications
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins can update applications (approve/reject)
CREATE POLICY "Admins can update applications"
  ON member_applications
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete applications
CREATE POLICY "Admins can delete applications"
  ON member_applications
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================================
-- RLS POLICIES - MEMBERS
-- ============================================================================

-- Public can view active members
CREATE POLICY "Anyone can view active members"
  ON members
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Members can update their own profile
CREATE POLICY "Members can update own profile"
  ON members
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can do everything with members
CREATE POLICY "Admins can insert members"
  ON members
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update any member"
  ON members
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete members"
  ON members
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================================
-- RLS POLICIES - EVENTS
-- ============================================================================

-- Public can view published events
CREATE POLICY "Anyone can view published events"
  ON events
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Admins can view all events (including unpublished)
CREATE POLICY "Admins can view all events"
  ON events
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins can create events
CREATE POLICY "Admins can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admins can update events
CREATE POLICY "Admins can update events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete events
CREATE POLICY "Admins can delete events"
  ON events
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================================
-- RLS POLICIES - EVENT_REGISTRATIONS
-- ============================================================================

-- Authenticated members can register for events
CREATE POLICY "Members can register for events"
  ON event_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    member_id = get_member_id(auth.uid())
  );

-- Members can view their own registrations
CREATE POLICY "Members can view own registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (member_id = get_member_id(auth.uid()));

-- Members can cancel their own registrations
CREATE POLICY "Members can cancel own registrations"
  ON event_registrations
  FOR DELETE
  TO authenticated
  USING (member_id = get_member_id(auth.uid()));

-- Admins can view all registrations
CREATE POLICY "Admins can view all registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins can manage all registrations
CREATE POLICY "Admins can delete any registration"
  ON event_registrations
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
-- Note: Storage buckets must be created via Supabase Dashboard or API
-- This is a reference for what needs to be set up:
--
-- Bucket: member-photos
-- - Public: true
-- - File size limit: 5MB
-- - Allowed MIME types: image/jpeg, image/png, image/webp
-- - Path: member-photos/{user_id}/{filename}
--
-- Bucket: event-photos
-- - Public: true
-- - File size limit: 10MB
-- - Allowed MIME types: image/jpeg, image/png, image/webp
-- - Path: event-photos/{event_id}/{filename}
-- ============================================================================

-- Storage bucket policies will be set up separately via Supabase Dashboard

-- ============================================================================
-- INITIAL DATA (OPTIONAL)
-- ============================================================================
-- Uncomment below to create a default admin user
-- Note: You'll need to manually create the auth.users entry first via Supabase Dashboard

-- INSERT INTO members (
--   user_id,
--   name,
--   email,
--   year,
--   campus,
--   member_type,
--   role,
--   bio,
--   is_active
-- ) VALUES (
--   'YOUR_AUTH_USER_ID_HERE',
--   'Admin User',
--   'admin@flux.com',
--   'N/A',
--   'SAV CAMPUS',
--   'faculty',
--   'admin',
--   'System Administrator',
--   true
-- );

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify the migration was successful:
--
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public';
-- SELECT COUNT(*) FROM member_applications;
-- SELECT COUNT(*) FROM members;
-- SELECT COUNT(*) FROM events;
-- SELECT COUNT(*) FROM event_registrations;
-- ============================================================================
