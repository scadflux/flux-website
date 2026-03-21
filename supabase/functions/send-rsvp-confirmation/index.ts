// Supabase Edge Function to send RSVP confirmation emails
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { email, name, event } = await req.json()

    // Send email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'FLUX <onboarding@resend.dev>', // Using Resend test domain
        to: [email],
        subject: `RSVP Confirmation: ${event.title}`,
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
                .button {
                  display: inline-block;
                  background-color: #316EFF;
                  color: white;
                  padding: 14px 32px;
                  border-radius: 12px;
                  text-decoration: none;
                  font-weight: 600;
                  margin: 20px 0;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 RSVP Confirmed!</h1>
                </div>

                <div class="content">
                  <p class="message">
                    Hi <strong>${name}</strong>,
                  </p>

                  <p class="message">
                    Thank you for registering! We're excited to see you at the event.
                  </p>

                  <div class="event-details">
                    <h2>${event.title}</h2>

                    <div class="detail-row">
                      <span class="detail-label">📅 Date:</span>
                      <span class="detail-value">${new Date(event.event_date).toLocaleDateString('en-US', {
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
                    We'll send you a reminder closer to the event date. If you have any questions, feel free to reach out!
                  </p>

                  <p class="message" style="color: #787878; font-size: 14px; margin-top: 32px;">
                    See you there! 🚀<br>
                    <strong>FLUX Team</strong>
                  </p>
                </div>

                <div class="footer">
                  <p>You're receiving this email because you registered for a FLUX event.</p>
                  <p style="margin: 8px 0;">© ${new Date().getFullYear()} FLUX. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
