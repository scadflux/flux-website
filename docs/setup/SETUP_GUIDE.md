# FLUX Website Setup Guide

## 🎯 Overview

This guide will help you set up all the new features:
1. ✅ Fixed duplicate email issue in approval
2. ✅ Updated Apply form with new fields (major, minor, LinkedIn, Instagram, vibe images)
3. ✅ Updated database schema
4. 🔜 Event management system
5. 🔜 Updated member profile pages

## 📋 Prerequisites

- Supabase project set up
- Database migrations folder: `/supabase/migrations/`
- Access to Supabase SQL Editor

## 🚀 Step-by-Step Setup

### Step 1: Run Database Migrations

You need to run these SQL files in your Supabase SQL Editor in order:

#### 1.1 Update Members Table Schema

File: `/supabase/migrations/003_update_members_schema.sql`

```sql
-- Add new fields to members and member_applications tables
ALTER TABLE members
ADD COLUMN IF NOT EXISTS major TEXT,
ADD COLUMN IF NOT EXISTS minor TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS vibe_images JSONB DEFAULT '[]'::jsonb;

ALTER TABLE member_applications
ADD COLUMN IF NOT EXISTS major TEXT,
ADD COLUMN IF NOT EXISTS minor TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS vibe_images JSONB DEFAULT '[]'::jsonb;
```

#### 1.2 Create Events Table

File: `/supabase/migrations/004_create_events_table.sql`

Run this to create the events table with all necessary fields and RLS policies.

#### 1.3 Fix Members INSERT Policy (CRITICAL)

File: `/supabase/FIX_MEMBERS_INSERT_POLICY.sql`

```sql
CREATE POLICY "allow_insert_members_from_applications"
ON members
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
```

**⚠️ This is required for approving applications to work!**

### Step 2: Create Storage Buckets

Go to Supabase Dashboard > Storage > Create Bucket:

1. **vibe-images**
   - Name: `vibe-images`
   - Public: ✅ Yes
   - Then run: `/supabase/migrations/006_vibe_images_storage_policies.sql`

2. **event-images**
   - Name: `event-images`
   - Public: ✅ Yes
   - Then run: `/supabase/migrations/005_event_storage_policies.sql`

### Step 3: Verify Setup

Run these queries in SQL Editor to verify everything is set up:

```sql
-- Check members table columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'members';

-- Check member_applications table columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'member_applications';

-- Check events table exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'events';

-- Check storage buckets
SELECT * FROM storage.buckets;

-- Check RLS policies on members table
SELECT policyname, cmd, roles::text
FROM pg_policies
WHERE tablename = 'members';
```

## ✨ New Features

### Application Form Updates

The Apply form (`/apply`) now includes:
- ✅ Full Name
- ✅ University Email
- ✅ Academic Year
- ✅ Campus
- ✅ **Major** (required)
- ✅ **Minor** (optional)
- ✅ Profile Photo
- ✅ Bio
- ✅ Portfolio URL
- ✅ **LinkedIn Profile URL** (optional)
- ✅ **Instagram Handle** (optional)
- ✅ **Vibe Images** - Up to 5 images to showcase on profile
- ✅ Reason for joining

### Admin Panel Features

Access at: `/admin-manage`
Password: `flux2024admin`

Features:
- ✅ View all applications (Pending, Approved, Rejected)
- ✅ Approve/Reject applications
- ✅ Automatic member creation on approval
- ✅ Duplicate email handling (updates existing member)
- ✅ Real-time updates after approval

### Member Profiles

- Member profile pages at `/member/:id`
- Shows all member information
- Displays vibe images in photo dump section
- Social links (LinkedIn, Instagram, Email, Portfolio)

## 🐛 Troubleshooting

### Issue: "duplicate key value violates unique constraint 'members_email_key'"
**Solution**: Make sure you ran the SQL fix that handles existing members. The code now checks for existing emails and updates instead of inserting.

### Issue: "new row violates row-level security policy"
**Solution**: Run the `FIX_MEMBERS_INSERT_POLICY.sql` file to add INSERT policy for members table.

### Issue: Application submission fails
**Checklist**:
1. ✅ Ran all migrations?
2. ✅ Created storage buckets?
3. ✅ Applied storage policies?
4. ✅ Added members INSERT policy?

### Issue: Storage upload fails
**Solution**:
1. Make sure buckets are set to **Public**
2. Run the storage policy SQL files
3. Check bucket names match exactly: `member-photos`, `vibe-images`, `event-images`

## 📝 Next Steps

### 1. Event Management (Coming Soon)
- Admin UI to create/edit events
- Event list on Events page
- Event detail pages
- Upload event logos and cover images

### 2. Member Profile Enhancements
- Display vibe images
- Show Instagram link
- Display major/minor
- Enhanced profile layout

## 🧪 Testing Checklist

- [ ] Submit a test application with all fields filled
- [ ] Verify application appears in admin panel
- [ ] Approve the application
- [ ] Check that member appears in Community page
- [ ] Click on member card to view profile
- [ ] Verify all fields display correctly
- [ ] Test uploading vibe images (up to 5)
- [ ] Test duplicate email handling (submit same email twice)

## 💡 Tips

1. **Always run migrations in order** (001, 002, 003, etc.)
2. **Check SQL errors carefully** - they usually indicate missing prerequisites
3. **Use browser console (F12)** to debug JavaScript errors
4. **Check Supabase logs** in Dashboard > Logs for database issues

## 🆘 Need Help?

If you encounter issues:
1. Check browser console (F12) for errors
2. Check Supabase logs in Dashboard
3. Verify all migrations ran successfully
4. Make sure storage buckets are public
5. Confirm RLS policies are in place

---

**Last Updated**: 2025-01-18
**Version**: 2.0
