-- ============================================================================
-- Create Events Table
-- ============================================================================

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  presenter TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on event_date for faster queries
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_published ON events(is_published);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read published events
CREATE POLICY "anyone_can_view_published_events"
ON events
FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- Allow authenticated users to view all events (for admin)
CREATE POLICY "authenticated_can_view_all_events"
ON events
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert events
CREATE POLICY "authenticated_can_insert_events"
ON events
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Allow authenticated users to update events
CREATE POLICY "authenticated_can_update_events"
ON events
FOR UPDATE
TO authenticated, anon
USING (true);

-- Allow authenticated users to delete events
CREATE POLICY "authenticated_can_delete_events"
ON events
FOR DELETE
TO authenticated, anon
USING (true);

-- Grant permissions
GRANT ALL ON events TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Verify table was created
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'events'
ORDER BY ordinal_position;
