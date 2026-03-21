# Step-by-Step Email Testing Guide

## ✅ What I Fixed:
1. **Application Form** - Added missing "Why do you want to join FLUX?" field
2. **Alumni Checkbox** - Fixed validation so alumni applications work
3. **Presenter Field** - Fixed saving/editing event presenters
4. **Email Debugging** - Added console logging to track email sending

---

## 📧 How to Test Email Notifications:

### Step 1: Open Your Browser Console
1. Go to your website: http://localhost:5173
2. Press **F12** on your keyboard (or right-click > Inspect)
3. Click the **Console** tab at the top
4. Keep this open during testing

### Step 2: Navigate to Events Page
1. Click on "Events" in the navigation menu
2. You should see the events list

### Step 3: Try to RSVP for an Event
1. Click the **RSVP** button on any upcoming event
2. Fill in the form:
   - **Name**: Your name
   - **Email**: Use your real email address
   - **Phone**: Optional
3. Click **Submit**

### Step 4: Check the Console
Look for messages like this:
- 📧 "Attempting to send RSVP confirmation email..."
- ✅ "Email sent successfully!" (if it worked)
- ❌ "Error sending email:" (if it failed)

**Take a screenshot of the console** and show me what you see!

### Step 5: Check Function Logs (In Terminal)
1. Open a **new terminal window**
2. Navigate to your project: `cd /Users/minwook/site`
3. Run: `./CHECK_EMAIL_LOGS.sh`
4. This will show you what's happening on the Supabase server side
5. Try RSVPing again while this is running
6. **Take a screenshot of any errors** you see

### Step 6: Check Your Email Inbox
1. Wait 1-2 minutes
2. Check your email inbox
3. Also check your **spam folder**
4. Look for email from: `FLUX <onboarding@resend.dev>`

---

## 🔍 What to Look For:

### If Email Works:
- ✅ Console shows: "Email sent successfully!"
- ✅ You receive a beautiful FLUX-branded email
- ✅ Email has event details, date, location

### If Email Doesn't Work - Possible Issues:

**Console shows error:**
- Share the exact error message with me

**Function logs show error:**
- Could be API key issue
- Could be Resend service issue
- Share the error from terminal

**No error but no email:**
- Email might be in spam
- Check spam/junk folder
- Resend test domain might be blocked

---

## 📸 What I Need From You:

Please send me:
1. **Screenshot of browser console** after clicking RSVP
2. **Screenshot of terminal** showing function logs
3. **Tell me**: Did you receive the email? (check spam too!)

This will help me figure out exactly what's wrong!

---

## 🎯 Quick Summary:

```bash
# In Terminal 1 (already running):
npm run dev

# In Terminal 2 (new window):
./CHECK_EMAIL_LOGS.sh

# Then in browser:
1. Open http://localhost:5173
2. Press F12 to open console
3. Go to Events page
4. Click RSVP
5. Fill form and submit
6. Check console for 📧 ✅ ❌ messages
7. Check terminal for function errors
8. Check email inbox (and spam!)
```
