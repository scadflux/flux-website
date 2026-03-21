-- Recreate event_registrations table from scratch
-- Run this if the table is broken or has wrong columns

-- Drop existing table if it exists
DROP TABLE IF EXISTS event_registrations CASCADE;

-- Recreate the table with correct structure
CREATE TABLE event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  attendance_status TEXT DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'no-show', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate registrations
  UNIQUE(event_id, user_email)
);

-- Add indexes
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_email ON event_registrations(user_email);
CREATE INDEX idx_event_registrations_status ON event_registrations(attendance_status);

-- Disable RLS (to match other tables)
ALTER TABLE event_registrations DISABLE ROW LEVEL SECURITY;

-- Add capacity fields to events table if they don't exist
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS max_capacity INTEGER,
  ADD COLUMN IF NOT EXISTS registration_deadline TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS requires_registration BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS allow_waitlist BOOLEAN DEFAULT false;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_event_registrations_updated_at
  BEFORE UPDATE ON event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verify table was created
SELECT
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_name = 'event_registrations'
ORDER BY ordinal_position;
