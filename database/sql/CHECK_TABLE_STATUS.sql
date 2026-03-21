-- Check if event_registrations table exists and what columns it has

-- Step 1: Check if table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name = 'event_registrations'
);

-- Step 2: If it exists, show all columns
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'event_registrations'
ORDER BY ordinal_position;

-- Step 3: Show sample data if any
SELECT * FROM event_registrations LIMIT 5;
