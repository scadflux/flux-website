# Event Reminder Email Setup Guide

## Overview
Automated event reminder emails are sent to all registered attendees 24 hours before an event starts.

## How It Works
1. A Supabase Edge Function (`send-event-reminder`) finds all events happening in the next 24-25 hours
2. For each event, it fetches all registered attendees
3. Sends a reminder email to each attendee
4. Returns a summary of how many emails were sent

## Setup Options

### Option 1: Manual Trigger (Testing)
You can manually trigger the reminder function to test it:

```bash
# Using curl
curl -X POST \
  'https://<your-supabase-project-ref>.supabase.co/functions/v1/send-event-reminder' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -H 'Content-Type: application/json'
```

### Option 2: GitHub Actions (Recommended)
Create a GitHub Action that runs daily:

1. Go to your repository on GitHub
2. Click on **Actions** tab
3. Create a new workflow file: `.github/workflows/event-reminders.yml`

```yaml
name: Send Event Reminders

on:
  schedule:
    # Run every day at 9:00 AM UTC
    - cron: '0 9 * * *'
  workflow_dispatch: # Allow manual triggers

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Send Event Reminder Emails
        run: |
          curl -X POST \
            '${{ secrets.SUPABASE_URL }}/functions/v1/send-event-reminder' \
            -H 'Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}' \
            -H 'Content-Type: application/json'
```

4. Add secrets to your repository:
   - Go to Settings > Secrets and variables > Actions
   - Add `SUPABASE_URL`: `https://<your-supabase-project-ref>.supabase.co`
   - Add `SUPABASE_ANON_KEY`: (your Supabase anon key from `.env`)

### Option 3: Vercel Cron Jobs
If you deploy to Vercel, you can use Vercel Cron:

1. Create `api/cron/event-reminders.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Verify cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const response = await fetch(
      `${process.env.VITE_SUPABASE_URL}/functions/v1/send-event-reminder`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

2. Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/event-reminders",
    "schedule": "0 9 * * *"
  }]
}
```

### Option 4: Supabase pg_cron (Advanced)
Use Supabase's built-in cron functionality:

1. Enable pg_cron extension in Supabase Dashboard:
   - Go to Database > Extensions
   - Search for "pg_cron" and enable it

2. Create a cron job using SQL:
   - Go to SQL Editor in Supabase Dashboard
   - Copy ONLY the SQL code below (without the ```sql markers)
   - Paste into SQL Editor and run

**⚠️ IMPORTANT: Copy ONLY the SQL code below. Do NOT copy the ```sql or ``` markers - those are just for formatting in this document!**

```sql
-- Schedule the event reminder function to run daily at 9:00 AM UTC
SELECT cron.schedule(
  'send-event-reminders',
  '0 9 * * *',
  $$
  SELECT
    net.http_post(
      url:='https://<your-supabase-project-ref>.supabase.co/functions/v1/send-event-reminder',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
    ) as request_id;
  $$
);
```

**Copy from here:**
```
SELECT cron.schedule(
  'send-event-reminders',
  '0 9 * * *',
  $$
  SELECT
    net.http_post(
      url:='https://<your-supabase-project-ref>.supabase.co/functions/v1/send-event-reminder',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
    ) as request_id;
  $$
);
```
**To here** (don't include the comment line starting with --)

**Important**: Replace `YOUR_SERVICE_ROLE_KEY` with your actual Supabase service role key (keep this secret!).

3. View scheduled jobs:

```sql
SELECT * FROM cron.job;
```

4. Unschedule a job (if needed):

```sql
SELECT cron.unschedule('send-event-reminders');
```

## Testing

### Test with Upcoming Events
1. Create a test event with event_date set to tomorrow
2. Add a test registration with your email
3. Manually trigger the function (Option 1 above)
4. Check your email inbox (and spam folder)

### Check Logs
View function logs in Supabase Dashboard:
- Go to Edge Functions > send-event-reminder > Logs
- Check for any errors or successful sends

## Monitoring

### Check Email Delivery
- Login to [Resend Dashboard](https://resend.com/emails)
- View all sent emails and delivery status
- Check bounce/spam rates

### Function Logs
```bash
# View recent logs
npx supabase functions logs send-event-reminder

# View logs with follow mode (not supported in all environments)
npx supabase functions logs send-event-reminder --follow
```

## Troubleshooting

### No Emails Sent
1. **Check if events exist**: Make sure there are events happening in the next 24-25 hours
2. **Check registrations**: Verify that events have registrations
3. **Check RESEND_API_KEY**: Ensure the key is set in Supabase Edge Function secrets

### Emails Not Received
1. Check spam/junk folder
2. Verify email address in registrations
3. Check Resend dashboard for delivery status
4. Ensure from domain is verified in Resend (or use test domain)

### Function Errors
1. Check Supabase function logs for detailed errors
2. Verify all environment variables are set:
   - `RESEND_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Best Practices

1. **Time Zone Consideration**: The function uses UTC time. Adjust cron schedule based on your timezone.
2. **Rate Limiting**: Resend has rate limits. For large events (100+ attendees), consider batching emails.
3. **Testing**: Always test with a small group before enabling for all events.
4. **Monitoring**: Set up alerts for failed cron jobs.

## Email Template Customization

To customize the reminder email template, edit:
`supabase/functions/send-event-reminder/index.ts`

Then redeploy:
```bash
npx supabase functions deploy send-event-reminder
```

## Current Status

✅ Edge Function Created
✅ Edge Function Deployed
⏳ Cron Job Setup (Choose option above)
⏳ Testing with Real Events

## Next Steps

1. Choose a cron setup option (GitHub Actions recommended for simplicity)
2. Test the function manually first
3. Create a test event and registration
4. Verify emails are sent successfully
5. Enable automated cron job
6. Monitor for 1 week to ensure stability
