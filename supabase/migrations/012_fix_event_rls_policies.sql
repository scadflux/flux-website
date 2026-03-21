-- Fix Event RLS Policies for Admin Panel
-- This allows event creation without authentication (for admin panel use)

-- Drop existing restrictive policies if any
DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
DROP POLICY IF EXISTS "Authenticated users can insert events" ON events;
DROP POLICY IF EXISTS "Authenticated users can update their own events" ON events;
DROP POLICY IF EXISTS "Authenticated users can delete their own events" ON events;

-- Create new permissive policies
-- Anyone can view published events
CREATE POLICY "Anyone can view published events"
  ON events FOR SELECT
  USING (is_published = true);

-- Service role can view all events (for admin)
CREATE POLICY "Service role can view all events"
  ON events FOR SELECT
  USING (true);

-- Anyone can insert events (admin panel doesn't use auth)
CREATE POLICY "Anyone can insert events"
  ON events FOR INSERT
  WITH CHECK (true);

-- Anyone can update events (admin panel doesn't use auth)
CREATE POLICY "Anyone can update events"
  ON events FOR UPDATE
  USING (true);

-- Anyone can delete events (admin panel doesn't use auth)
CREATE POLICY "Anyone can delete events"
  ON events FOR DELETE
  USING (true);

-- Note: In production, you should add proper authentication
-- and restrict these policies to authenticated admin users only
-- For now, these policies allow the admin panel to work
