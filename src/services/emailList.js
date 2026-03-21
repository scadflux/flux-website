import { supabase } from '../lib/supabase';

/**
 * Email List Service - Manages email list subscriptions
 */

/**
 * Subscribe an email to the FLUX email list
 * @param {string} email - Email address to subscribe
 * @param {string} name - Subscriber's name (optional)
 * @returns {Promise<Object>} Subscription record
 */
export const subscribeToEmailList = async (email, name = '') => {
  try {
    // Check if already subscribed
    const { data: existing, error: checkError } = await supabase
      .from('email_list')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing subscription:', checkError);
      throw checkError;
    }

    if (existing) {
      console.log('Email already subscribed:', email);
      return existing;
    }

    // Add new subscription
    const { data, error } = await supabase
      .from('email_list')
      .insert([{
        email: email,
        name: name,
        subscribed_at: new Date().toISOString(),
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      console.error('Error subscribing to email list:', error);
      throw error;
    }

    console.log('Successfully subscribed to email list:', email);
    return data;
  } catch (error) {
    console.error('Failed to subscribe to email list:', error);
    throw error;
  }
};

/**
 * Unsubscribe an email from the FLUX email list
 * @param {string} email - Email address to unsubscribe
 * @returns {Promise<void>}
 */
export const unsubscribeFromEmailList = async (email) => {
  try {
    const { error } = await supabase
      .from('email_list')
      .update({ is_active: false })
      .eq('email', email);

    if (error) {
      console.error('Error unsubscribing from email list:', error);
      throw error;
    }

    console.log('Successfully unsubscribed from email list:', email);
  } catch (error) {
    console.error('Failed to unsubscribe from email list:', error);
    throw error;
  }
};

/**
 * Fetch all active email list subscribers (Admin only)
 * @returns {Promise<Array>} List of subscribers
 */
export const fetchEmailListSubscribers = async () => {
  try {
    const { data, error } = await supabase
      .from('email_list')
      .select('*')
      .eq('is_active', true)
      .order('subscribed_at', { ascending: false });

    if (error) {
      console.error('Error fetching email list:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch email list:', error);
    throw error;
  }
};

export default {
  subscribeToEmailList,
  unsubscribeFromEmailList,
  fetchEmailListSubscribers
};
