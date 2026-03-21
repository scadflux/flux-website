// Supabase Edge Function to send application status emails
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { email, name, status } = await req.json()

    // Generate email content based on status
    const emailContent = getEmailContent(name, status)

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
        subject: emailContent.subject,
        html: emailContent.html,
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

function getEmailContent(name: string, status: string) {
  const baseStyles = `
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
      .highlight-box {
        background-color: #f5f8ff;
        border-radius: 12px;
        padding: 24px;
        margin: 24px 0;
      }
    </style>
  `

  if (status === 'pending') {
    return {
      subject: 'Application Received - FLUX',
      html: `
        <!DOCTYPE html>
        <html>
          <head>${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header" style="background: linear-gradient(135deg, #316EFF 0%, #4A80FF 100%);">
                <h1>📝 Application Received!</h1>
              </div>

              <div class="content">
                <p class="message">
                  Hi <strong>${name}</strong>,
                </p>

                <p class="message">
                  Thank you for applying to join FLUX! We've successfully received your application.
                </p>

                <div class="highlight-box">
                  <p style="color: #316EFF; font-weight: 600; margin: 0 0 12px 0;">What's Next?</p>
                  <p style="color: #242424; font-size: 15px; line-height: 1.6; margin: 0;">
                    Our team will review your application and get back to you within 3-5 business days.
                    We carefully consider each application to ensure the best fit for our community.
                  </p>
                </div>

                <p class="message">
                  In the meantime, feel free to explore our website and upcoming events!
                </p>

                <p class="message" style="color: #787878; font-size: 14px; margin-top: 32px;">
                  Best regards,<br>
                  <strong>FLUX Team</strong>
                </p>
              </div>

              <div class="footer">
                <p>You're receiving this email because you submitted an application to FLUX.</p>
                <p style="margin: 8px 0;">© ${new Date().getFullYear()} FLUX. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    }
  }

  if (status === 'approved') {
    return {
      subject: '🎉 Welcome to FLUX!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header" style="background: linear-gradient(135deg, #2F855A 0%, #38A169 100%);">
                <h1>🎉 Welcome to FLUX!</h1>
              </div>

              <div class="content">
                <p class="message">
                  Hi <strong>${name}</strong>,
                </p>

                <p class="message">
                  Congratulations! We're excited to inform you that your application to join FLUX has been <strong>approved</strong>! 🚀
                </p>

                <div class="highlight-box">
                  <p style="color: #2F855A; font-weight: 600; margin: 0 0 12px 0;">What's Next?</p>
                  <p style="color: #242424; font-size: 15px; line-height: 1.6; margin: 0 0 12px 0;">
                    1. <strong>Check out our Community page</strong> - You're now featured as an official FLUX member!<br>
                    2. <strong>Join upcoming events</strong> - Browse and RSVP to workshops, meetups, and more.<br>
                    3. <strong>Connect with the team</strong> - Follow us on social media and join our community channels.
                  </p>
                </div>

                <p class="message">
                  We can't wait to see you at our next event. Welcome to the FLUX family! 💙
                </p>

                <p class="message" style="color: #787878; font-size: 14px; margin-top: 32px;">
                  See you soon!<br>
                  <strong>FLUX Team</strong>
                </p>
              </div>

              <div class="footer">
                <p>You're receiving this email because you applied to FLUX.</p>
                <p style="margin: 8px 0;">© ${new Date().getFullYear()} FLUX. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    }
  }

  if (status === 'rejected') {
    return {
      subject: 'FLUX Application Update',
      html: `
        <!DOCTYPE html>
        <html>
          <head>${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header" style="background: linear-gradient(135deg, #787878 0%, #969696 100%);">
                <h1>Application Update</h1>
              </div>

              <div class="content">
                <p class="message">
                  Hi <strong>${name}</strong>,
                </p>

                <p class="message">
                  Thank you for your interest in joining FLUX. After careful consideration, we've decided not to move forward with your application at this time.
                </p>

                <div class="highlight-box">
                  <p style="color: #242424; font-size: 15px; line-height: 1.6; margin: 0;">
                    This decision doesn't reflect on your skills or potential. We receive many applications and have to make difficult choices based on our current capacity and team needs.
                  </p>
                </div>

                <p class="message">
                  We encourage you to stay connected with FLUX! You're welcome to:
                </p>

                <p class="message">
                  • Attend our public events and workshops<br>
                  • Follow us on social media for updates<br>
                  • Apply again in the future when applications reopen
                </p>

                <p class="message">
                  Thank you again for your interest in FLUX. We wish you all the best in your UX design journey!
                </p>

                <p class="message" style="color: #787878; font-size: 14px; margin-top: 32px;">
                  Best wishes,<br>
                  <strong>FLUX Team</strong>
                </p>
              </div>

              <div class="footer">
                <p>You're receiving this email because you applied to FLUX.</p>
                <p style="margin: 8px 0;">© ${new Date().getFullYear()} FLUX. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    }
  }

  // Default fallback
  return {
    subject: 'FLUX Application Status',
    html: `
      <!DOCTYPE html>
      <html>
        <head>${baseStyles}</head>
        <body>
          <div class="container">
            <div class="header" style="background: linear-gradient(135deg, #316EFF 0%, #4A80FF 100%);">
              <h1>FLUX Application</h1>
            </div>
            <div class="content">
              <p class="message">Hi <strong>${name}</strong>,</p>
              <p class="message">Your application status has been updated.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} FLUX. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}
