# Complete Fresh Database Setup Guide

Follow these steps **in order** to set up your FLUX database from scratch.

## Prerequisites

✅ You have a Supabase project created
✅ You have your `.env` file configured with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

---

## Step 1: Clean SQL Editor (You're here!)

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Delete any existing queries/scripts you have open
3. Click **New Query**

---

## Step 2: Run Main Database Setup

1. **Open the file**: `supabase/migrations/FRESH_START.sql`
2. **Copy the entire contents** of that file
3. **Paste into Supabase SQL Editor**
4. **Click "Run"** (or press Cmd/Ctrl + Enter)
5. **Wait for completion** - you should see output showing:
   - List of tables created (events, event_registrations, member_applications, members)
   - List of policies created

**If you see errors**: Stop and share the error message. Otherwise, continue to Step 3.

---

## Step 3: Create Storage Buckets

Storage buckets **cannot** be created via SQL - you must use the Dashboard UI.

1. Go to **Supabase Dashboard** → **Storage**
2. Click **"New bucket"**

### Bucket 1: member-photos
- **Name**: `member-photos`
- **Public bucket**: ✅ **YES (IMPORTANT: Check this box!)**
- **File size limit**: 5 MB (5000000 bytes)
- **Allowed MIME types**: Leave as default or add: `image/jpeg,image/png,image/webp`

Click **Create bucket**

### Bucket 2: event-photos
- **Name**: `event-photos`
- **Public bucket**: ✅ **YES (IMPORTANT: Check this box!)**
- **File size limit**: 10 MB (10000000 bytes)
- **Allowed MIME types**: Leave as default or add: `image/jpeg,image/png,image/webp`

Click **Create bucket**

**Verify**: You should now see both buckets listed in Storage tab.

---

## Step 4: Apply Storage Policies

1. Go back to **SQL Editor**
2. **Click "New Query"**
3. **Open the file**: `supabase/migrations/STORAGE_SETUP.sql`
4. **Copy the entire contents**
5. **Paste into SQL Editor**
6. **Click "Run"**
7. **Verify output** shows:
   - 2 buckets listed (member-photos, event-photos)
   - 6 policies listed

---

## Step 5: Test the Setup

Run the test script from your terminal:

```bash
cd /Users/minwook/site
node test-db-connection.js
```

**Expected output:**
```
✅ Set Supabase URL
✅ Set Anon Key
✅ Can read applications
✅ Successfully inserted test application
✅ Storage accessible
✅ member-photos
✅ event-photos
```

**If you see errors**, share the output and I'll help debug.

---

## Step 6: Test Application Form

1. Make sure dev server is running: `npm run dev`
2. Go to: http://localhost:5173/apply
3. Fill out the application form
4. Open browser console (F12) → Console tab
5. Click **Submit**

**Expected result:**
- Console shows: "Application submitted successfully"
- Form shows success message
- Form resets

---

## Troubleshooting

### "new row violates row-level security policy"
- The RLS policy is still blocking inserts
- Go back to Step 2 and make sure you ran the ENTIRE `FRESH_START.sql` script
- Check that the policy exists: Run this in SQL Editor:
  ```sql
  SELECT policyname, roles FROM pg_policies
  WHERE tablename = 'member_applications' AND cmd = 'INSERT';
  ```
  - You should see: `public_can_insert_applications` with role `public`

### "storage bucket not found" or buckets show ❌
- You didn't create the buckets in Step 3
- Make sure to create them via Dashboard UI (Storage → New bucket)
- **IMPORTANT**: Check "Public bucket" = YES

### Test script shows errors
- Check your `.env` file has the correct Supabase credentials
- Make sure you're in the correct Supabase project

---

## Quick Verification Queries

Run these in SQL Editor to verify everything is set up:

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public';

-- Check critical policy for applications
SELECT policyname, cmd, roles FROM pg_policies
WHERE tablename = 'member_applications' AND cmd = 'INSERT';

-- Check storage buckets
SELECT name, public FROM storage.buckets;

-- Check storage policies count (should be 6)
SELECT COUNT(*) FROM pg_policies WHERE tablename = 'objects';
```

---

## Success Checklist

- ✅ All 4 tables created (member_applications, members, events, event_registrations)
- ✅ RLS enabled on all tables
- ✅ Policy `public_can_insert_applications` exists with role `public`
- ✅ 2 storage buckets created (both public)
- ✅ 6 storage policies created
- ✅ Test script passes all checks
- ✅ Application form submits successfully

---

Once all checks pass, your database is fully set up! 🎉
