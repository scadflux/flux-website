-- Sample Event for Testing
-- Run this SQL in your Supabase SQL Editor to create a test event

INSERT INTO events (
  title,
  description,
  event_date,
  location,
  event_type,
  photo_urls,
  is_published
) VALUES (
  'Design Thinking Workshop',
  'Join us for an interactive workshop where we explore the fundamentals of design thinking. Learn how to empathize with users, define problems, ideate solutions, prototype rapidly, and test your ideas. Perfect for beginners and experienced designers alike!',
  '2025-12-15 18:00:00+00',
  'Arnold Hall, Room 301',
  'workshop',
  ARRAY[
    '/assets/ue_1.png',
    '/assets/ue_2.png',
    '/assets/ue_3.png',
    '/assets/ue_4.png'
  ],
  true
);

-- To view the created event, run:
-- SELECT * FROM events WHERE title = 'Design Thinking Workshop';

-- To get the event ID for accessing the detail page, run:
-- SELECT id FROM events WHERE title = 'Design Thinking Workshop';
