-- ============================================================================
-- Grant Table-Level Permissions
-- ============================================================================
-- This is likely THE MISSING PIECE!
-- RLS policies control row access, but GRANT controls table access
-- Without GRANT, even correct RLS policies won't work
-- ============================================================================

-- Grant INSERT permission to anon and authenticated roles on member_applications
GRANT INSERT ON member_applications TO anon, authenticated;

-- Grant SELECT permission (needed for .select() after insert)
GRANT SELECT ON member_applications TO anon, authenticated;

-- Grant UPDATE permission to authenticated users (for admins)
GRANT UPDATE ON member_applications TO authenticated;

-- Grant DELETE permission to authenticated users (for admins)
GRANT DELETE ON member_applications TO authenticated;

-- Also grant usage on the sequence (for auto-incrementing IDs)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================================================
-- Do the same for other tables
-- ============================================================================

-- Members table (public can view, authenticated can update own profile)
GRANT SELECT ON members TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON members TO authenticated;

-- Events table
GRANT SELECT ON events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON events TO authenticated;

-- Event registrations
GRANT SELECT, INSERT, DELETE ON event_registrations TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================================================
-- Verify the grants were applied
-- ============================================================================

SELECT
  grantee,
  table_name,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name IN ('member_applications', 'members', 'events', 'event_registrations')
AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee, privilege_type;
