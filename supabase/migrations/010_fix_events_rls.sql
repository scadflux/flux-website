-- Fix RLS policies for events table to allow unauthenticated inserts
-- This is needed for the admin panel which doesn't use Supabase authentication

-- Drop existing policies
DROP POLICY IF EXISTS "anyone_can_view_published_events" ON events;
DROP POLICY IF EXISTS "authenticated_can_view_all_events" ON events;
DROP POLICY IF EXISTS "authenticated_can_insert_events" ON events;
DROP POLICY IF EXISTS "authenticated_can_update_events" ON events;
DROP POLICY IF EXISTS "authenticated_can_delete_events" ON events;

-- Allow everyone to read published events
CREATE POLICY "anyone_can_view_published_events"
ON events
FOR SELECT
USING (is_published = true);

-- Allow everyone to view all events (for admin)
CREATE POLICY "anyone_can_view_all_events"
ON events
FOR SELECT
USING (true);

-- Allow anyone to insert events (admin panel uses password protection)
CREATE POLICY "anyone_can_insert_events"
ON events
FOR INSERT
WITH CHECK (true);

-- Allow anyone to update events (admin panel uses password protection)
CREATE POLICY "anyone_can_update_events"
ON events
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow anyone to delete events (admin panel uses password protection)
CREATE POLICY "anyone_can_delete_events"
ON events
FOR DELETE
USING (true);
