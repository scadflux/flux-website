#!/bin/bash

echo "Checking Supabase function logs for send-rsvp-confirmation..."
echo ""
echo "Note: This shows the most recent logs. After testing RSVP, run this command again to see new logs."
echo ""

npx supabase functions logs send-rsvp-confirmation
