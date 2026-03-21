# Email Notification Setup Guide

Your event registration system now sends automatic confirmation emails! Here's how to set it up:

## Step 1: Sign Up for Resend (Free Email Service)

1. Go to https://resend.com
2. Click **"Sign Up"**
3. Create account with your email
4. Verify your email address
5. Complete onboarding

## Step 2: Get Your API Key

1. In Resend dashboard, go to **"API Keys"**
2. Click **"Create API Key"**
3. Name it: `FLUX Website`
4. Copy the API key (starts with `re_...`)
5. **Save it** - you won't see it again!

## Step 3: Configure Domain (Important!)

### Option A: Use Your Own Domain (Recommended for production)
1. In Resend, go to **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `fluxclub.com`)
4. Add the DNS records Resend provides
5. Wait for verification (usually 5-10 minutes)
6. Update the email function to use: `FLUX <noreply@yourdom domain.com>`

### Option B: Use Resend's Test Domain (Quick start)
- Resend provides `onboarding@resend.dev` for testing
- Works immediately, but emails may go to spam
- **Only use for testing!**

## Step 4: Deploy the Supabase Edge Function

### Install Supabase CLI (if not installed):
```bash
npm install -g supabase
```

### Login to Supabase:
```bash
supabase login
```

### Link your project:
```bash
# From your project directory
supabase link --project-ref <your-supabase-project-ref>
```

### Set the Resend API key as a secret:
```bash
supabase secrets set RESEND_API_KEY=re_your_api_key_here
```

### Deploy the function:
```bash
supabase functions deploy send-rsvp-confirmation
```

## Step 5: Test It!

1. Go to your Events page: http://localhost:5173/events
2. Click **RSVP** on an upcoming event
3. Fill in your email and name
4. Submit
5. Check your email inbox!

## What the Email Looks Like:

The email includes:
- ✅ Beautiful FLUX-branded design
- ✅ Event title, date, time
- ✅ Location and description
- ✅ Professional formatting
- ✅ Mobile-responsive

## Troubleshooting:

### Email not sending?
1. Check Supabase Functions logs:
   ```bash
   supabase functions logs send-rsvp-confirmation
   ```
2. Verify RESEND_API_KEY is set:
   ```bash
   supabase secrets list
   ```
3. Check Resend dashboard for error logs

### Emails going to spam?
- Use a verified domain (not resend.dev)
- Add SPF and DKIM records from Resend
- Avoid spam trigger words in email content

### Function not found error?
- Run `supabase functions deploy send-rsvp-confirmation` again
- Check project is linked: `supabase projects list`

## Free Tier Limits:

Resend Free Tier includes:
- ✅ 3,000 emails/month
- ✅ 100 emails/day
- ✅ 1 verified domain
- ✅ All features unlocked

This is perfect for a club website!

## Alternative: Test Without Email

If you want to skip email setup for now, the registration will still work perfectly - you just won't send confirmation emails. The system is designed to continue working even if email fails.

---

**Note**: Never commit your API keys to git! They're stored securely in Supabase Secrets.
