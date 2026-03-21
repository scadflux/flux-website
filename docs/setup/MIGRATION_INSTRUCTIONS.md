# Database Migration Instructions

## Required Migrations

You need to apply THREE migration files in order:

1. `supabase/migrations/011_event_registrations.sql` - Event RSVP system
2. `supabase/migrations/012_fix_event_rls_policies.sql` - Fix event permissions
3. `supabase/migrations/013_fix_members_rls_policies.sql` - Fix member/application permissions

### Steps to Apply Migrations:

#### Option 1: Supabase Dashboard (Recommended)

**For each migration file (011, 012, 013):**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy and paste the contents of the migration file
5. Click **Run** to execute the migration
6. Repeat for the next migration file

#### Option 2: Supabase CLI

If you have Supabase CLI installed:

```bash
# From your project directory
supabase db push
```

### What This Migration Does:

1. **Creates `event_registrations` table** with:
   - User information (email, name, phone)
   - Registration status tracking (registered, attended, no-show, cancelled)
   - Duplicate prevention (same email can't register twice for same event)

2. **Adds new fields to `events` table**:
   - `max_capacity` - Maximum number of attendees
   - `registration_deadline` - Last date to register
   - `requires_registration` - Whether RSVP is required
   - `allow_waitlist` - Enable waitlist when full

3. **Creates helper functions**:
   - `get_event_registration_count()` - Get number of registrations
   - `is_event_full()` - Check if event is at capacity

4. **Sets up RLS (Row Level Security)** policies for secure access

### Verify Migration Success:

After running the migration, verify by running this query in Supabase SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'event_registrations';
```

You should see `event_registrations` in the results.

### Next Steps:

After applying the migration, the RSVP functionality will work on your website!
Users can now:
- Click "RSVP" on upcoming events
- Fill in their name, email, and phone
- Receive confirmation
- View registration count on event pages

---

**Note**: Make sure you have already run all previous migrations (001-010) before applying this one.
