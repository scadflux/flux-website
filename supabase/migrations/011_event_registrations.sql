-- Event Registrations System
-- Allows members to RSVP for events and track attendance

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
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

-- Add indexes for better query performance
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_email ON event_registrations(user_email);
CREATE INDEX idx_event_registrations_status ON event_registrations(attendance_status);

-- Add capacity and registration fields to events table
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS max_capacity INTEGER,
  ADD COLUMN IF NOT EXISTS registration_deadline TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS requires_registration BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS allow_waitlist BOOLEAN DEFAULT false;

-- Create function to get registration count for an event
CREATE OR REPLACE FUNCTION get_event_registration_count(event_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM event_registrations
  WHERE event_id = event_uuid
  AND attendance_status NOT IN ('cancelled');
$$ LANGUAGE SQL STABLE;

-- Create function to check if event is full
CREATE OR REPLACE FUNCTION is_event_full(event_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT CASE
    WHEN e.max_capacity IS NULL THEN false
    WHEN get_event_registration_count(event_uuid) >= e.max_capacity THEN true
    ELSE false
  END
  FROM events e
  WHERE e.id = event_uuid;
$$ LANGUAGE SQL STABLE;

-- RLS Policies for event_registrations
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view registrations (for public event pages)
CREATE POLICY "allow_all_select_registrations" ON event_registrations
  FOR SELECT USING (true);

-- Allow anyone to register for events
CREATE POLICY "allow_all_insert_registrations" ON event_registrations
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own registrations
CREATE POLICY "allow_all_update_registrations" ON event_registrations
  FOR UPDATE USING (true) WITH CHECK (true);

-- Allow admins to delete registrations
CREATE POLICY "allow_all_delete_registrations" ON event_registrations
  FOR DELETE USING (true);

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

-- Add comment
COMMENT ON TABLE event_registrations IS 'Stores event registrations and attendance tracking';
