# Deploy Email Function - Quick Start

Your API key is ready! Now run these 4 commands in your terminal:

## Open Terminal and Run:

```bash
# 1. Login to Supabase (browser will open)
npx supabase login

# 2. Link to your project
npx supabase link --project-ref <your-supabase-project-ref>

# 3. Set the API key as a secret
npx supabase secrets set RESEND_API_KEY=<your-resend-api-key>

# 4. Deploy the function
npx supabase functions deploy send-rsvp-confirmation
```

## Or run the script I created:

```bash
./deploy-email-function.sh
```

## That's it!

After running these commands, emails will automatically send when someone RSVPs!

## Test It:
1. Go to http://localhost:5173/events
2. Click RSVP on your event
3. Register with your email
4. **Check your inbox!** 📧

---

**Note**: The email will come from `onboarding@resend.dev`. Later, you can verify your own domain in Resend to use a custom sender address.
