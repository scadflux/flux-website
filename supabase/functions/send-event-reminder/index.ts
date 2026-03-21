// Supabase Edge Function to send event reminder emails
// This function should be called 24 hours before an event
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    // Create Supabase client with service role (for admin access)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Get current time
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const dayAfterTomorrow = new Date(now.getTime() + 25 * 60 * 60 * 1000)

    // Find all events happening in the next 24-25 hours
    const { data: upcomingEvents, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', tomorrow.toISOString())
      .lt('event_date', dayAfterTomorrow.toISOString())
      .eq('is_published', true)

    if (eventsError) {
      throw new Error(`Failed to fetch events: ${eventsError.message}`)
    }

    if (!upcomingEvents || upcomingEvents.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No events found for reminders' }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    const results = []

    // For each event, send reminders to all registered attendees
    for (const event of upcomingEvents) {
      // Get all registrations for this event
      const { data: registrations, error: registrationsError } = await supabase
        .from('event_registrations')
        .select('email, name')
        .eq('event_id', event.id)

      if (registrationsError) {
        console.error(`Failed to fetch registrations for event ${event.id}:`, registrationsError)
        continue
      }

      if (!registrations || registrations.length === 0) {
        results.push({ event: event.title, sent: 0, message: 'No registrations found' })
        continue
      }

      // Send reminder email to each attendee
      let sentCount = 0
      for (const registration of registrations) {
        try {
          await sendReminderEmail(registration.email, registration.name, event)
          sentCount++
        } catch (error) {
          console.error(`Failed to send reminder to ${registration.email}:`, error)
        }
      }

      results.push({
        event: event.title,
        sent: sentCount,
        total: registrations.length
      })
    }

    return new Response(
      JSON.stringify({
        message: 'Event reminders sent',
        results
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function sendReminderEmail(email: string, name: string, event: any) {
  const eventDate = new Date(event.event_date)

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'FLUX <onboarding@resend.dev>',
      to: [email],
      subject: `Reminder: ${event.title} Tomorrow!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background-color: #f9fafb;
                margin: 0;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #316EFF 0%, #4A80FF 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
              }
              .content {
                padding: 40px 30px;
              }
              .event-details {
                background-color: #f5f8ff;
                border-radius: 12px;
                padding: 24px;
                margin: 24px 0;
              }
              .event-details h2 {
                color: #316EFF;
                font-size: 24px;
                margin: 0 0 16px 0;
              }
              .detail-row {
                display: flex;
                margin: 12px 0;
                font-size: 16px;
              }
              .detail-label {
                color: #787878;
                font-weight: 500;
                min-width: 80px;
              }
              .detail-value {
                color: #242424;
                font-weight: 600;
              }
              .message {
                color: #242424;
                font-size: 16px;
                line-height: 1.6;
                margin: 20px 0;
              }
              .footer {
                background-color: #f9fafb;
                padding: 24px 30px;
                text-align: center;
                color: #787878;
                font-size: 14px;
              }
              .reminder-badge {
                display: inline-block;
                background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%);
                color: white;
                padding: 12px 24px;
                border-radius: 20px;
                font-weight: 700;
                font-size: 18px;
                margin: 20px 0;
                text-transform: uppercase;
                letter-spacing: 1px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⏰ Event Reminder</h1>
              </div>

              <div class="content">
                <p class="message">
                  Hi <strong>${name}</strong>,
                </p>

                <div style="text-align: center;">
                  <div class="reminder-badge">Tomorrow!</div>
                </div>

                <p class="message">
                  This is a friendly reminder that you're registered for this event happening tomorrow!
                </p>

                <div class="event-details">
                  <h2>${event.title}</h2>

                  <div class="detail-row">
                    <span class="detail-label">📅 Date:</span>
                    <span class="detail-value">${eventDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}</span>
                  </div>

                  ${event.location ? `
                    <div class="detail-row">
                      <span class="detail-label">📍 Location:</span>
                      <span class="detail-value">${event.location}</span>
                    </div>
                  ` : ''}

                  ${event.description ? `
                    <div style="margin-top: 16px;">
                      <p style="color: #787878; font-size: 14px; margin: 0 0 8px 0;">About this event:</p>
                      <p style="color: #242424; font-size: 15px; line-height: 1.6; margin: 0;">${event.description}</p>
                    </div>
                  ` : ''}
                </div>

                <p class="message">
                  We're looking forward to seeing you there! If you can no longer attend, please let us know.
                </p>

                <p class="message" style="color: #787878; font-size: 14px; margin-top: 32px;">
                  See you tomorrow! 🚀<br>
                  <strong>FLUX Team</strong>
                </p>
              </div>

              <div class="footer">
                <p>You're receiving this reminder because you registered for this FLUX event.</p>
                <p style="margin: 8px 0;">© ${new Date().getFullYear()} FLUX. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Resend API error: ${error}`)
  }

  return await res.json()
}
