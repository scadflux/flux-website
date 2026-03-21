#!/bin/bash

# Deploy Email Notification Function to Supabase
# Run this script to set up email notifications

echo "🚀 Deploying Email Notification Function..."
echo ""

# Step 1: Login to Supabase
echo "Step 1: Logging in to Supabase..."
npx supabase login

# Step 2: Link to your project
echo ""
echo "Step 2: Linking to your Supabase project..."
npx supabase link --project-ref <your-supabase-project-ref>

# Step 3: Set Resend API key as secret
echo ""
echo "Step 3: Setting Resend API key..."
npx supabase secrets set RESEND_API_KEY=<your-resend-api-key>

# Step 4: Deploy the function
echo ""
echo "Step 4: Deploying send-rsvp-confirmation function..."
npx supabase functions deploy send-rsvp-confirmation

echo ""
echo "✅ Done! Email notifications are now active!"
echo ""
echo "Test it by:"
echo "1. Go to http://localhost:5173/events"
echo "2. Click RSVP on an event"
echo "3. Register with your email"
echo "4. Check your inbox for confirmation!"
