-- Check for triggers that might be blocking inserts
SELECT
  trigger_name,
  event_manipulation,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_table = 'member_applications';

-- Check for constraints
SELECT
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'member_applications';

-- Check schema permissions for anon
SELECT
  nspname as schema_name,
  nspowner::regrole as owner
FROM pg_namespace
WHERE nspname IN ('public', 'auth', 'storage');

-- Check if anon has USAGE on public schema
SELECT
  grantee,
  privilege_type
FROM information_schema.schema_privileges
WHERE schema_name = 'public'
AND grantee IN ('anon', 'authenticated', 'public');
