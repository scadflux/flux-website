import { supabase } from '../lib/supabase';

/**
 * Send RSVP confirmation email to the user
 * @param {Object} params - Email parameters
 * @param {string} params.email - Recipient email
 * @param {string} params.name - Recipient name
 * @param {Object} params.event - Event details
 * @returns {Promise<Object>} Response from email service
 */
export const sendRSVPConfirmationEmail = async ({ email, name, event }) => {
  try {
    console.log('📧 Attempting to send RSVP confirmation email...');
    console.log('To:', email);
    console.log('Name:', name);
    console.log('Event:', event.title);

    // Call Supabase Edge Function to send email
    const { data, error } = await supabase.functions.invoke('send-rsvp-confirmation', {
      body: {
        email,
        name,
        event
      }
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      // Don't throw error - we don't want to fail registration if email fails
      return { success: false, error };
    }

    console.log('✅ Email sent successfully!');
    console.log('Response data:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error);
    console.error('Error message:', error.message);
    // Don't throw error - registration should still succeed
    return { success: false, error: error.message };
  }
};

/**
 * Send application status email to the applicant
 * @param {Object} params - Email parameters
 * @param {string} params.email - Recipient email
 * @param {string} params.name - Recipient name
 * @param {string} params.status - Application status (pending, approved, rejected)
 * @returns {Promise<Object>} Response from email service
 */
export const sendApplicationStatusEmail = async ({ email, name, status }) => {
  try {
    console.log('📧 Attempting to send application status email...');
    console.log('To:', email);
    console.log('Name:', name);
    console.log('Status:', status);

    // Call Supabase Edge Function to send email
    const { data, error } = await supabase.functions.invoke('send-application-status', {
      body: {
        email,
        name,
        status
      }
    });

    if (error) {
      console.error('❌ Error sending application status email:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      // Don't throw error - we don't want to fail the operation if email fails
      return { success: false, error };
    }

    console.log('✅ Application status email sent successfully!');
    console.log('Response data:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Failed to send application status email:', error);
    console.error('Error message:', error.message);
    // Don't throw error - operation should still succeed
    return { success: false, error: error.message };
  }
};

export default {
  sendRSVPConfirmationEmail,
  sendApplicationStatusEmail
};
