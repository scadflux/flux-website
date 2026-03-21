import { supabase } from '../lib/supabase';

/**
 * Events Service - Supabase operations for events and registrations
 */

// ============================================================================
// EVENTS - Public/Member Operations
// ============================================================================

/**
 * Fetch all published events with optional filtering
 * @param {Object} filters - Optional filters (event_type, upcoming/past)
 * @returns {Promise<Array>} List of published events
 */
export const fetchEvents = async (filters = {}) => {
  try {
    let query = supabase
      .from('events')
      .select('*, created_by(name)')
      .eq('is_published', true)
      .order('event_date', { ascending: filters.upcoming !== false });

    // Filter by event type
    if (filters.event_type) {
      query = query.eq('event_type', filters.event_type);
    }

    // Filter upcoming vs past events
    if (filters.upcoming === true) {
      query = query.gte('event_date', new Date().toISOString());
    } else if (filters.upcoming === false) {
      query = query.lt('event_date', new Date().toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw error;
  }
};

/**
 * Fetch a single event by ID
 * @param {string} eventId - Event UUID
 * @returns {Promise<Object>} Event details with registration count
 */
export const fetchEventById = async (eventId) => {
  try {
    // Fetch event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*, created_by(name)')
      .eq('id', eventId)
      .single();

    if (eventError) {
      console.error('Error fetching event:', eventError);
      throw eventError;
    }

    // Fetch registration count
    const { count, error: countError } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    if (countError) {
      console.error('Error fetching registration count:', countError);
    }

    return {
      ...event,
      registration_count: count || 0
    };
  } catch (error) {
    console.error('Failed to fetch event:', error);
    throw error;
  }
};

// ============================================================================
// EVENTS - Admin Operations
// ============================================================================

/**
 * Fetch all events including unpublished (Admin only)
 * @returns {Promise<Array>} List of all events
 */
export const fetchAllEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*, created_by(name)')
      .order('event_date', { ascending: false });

    if (error) {
      console.error('Error fetching all events:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch all events:', error);
    throw error;
  }
};

/**
 * Create a new event (Admin only)
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} Created event
 */
export const createEvent = async (eventData) => {
  try {
    // Try to get authenticated user, but don't require it
    let createdBy = null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get member_id from user_id
        const { data: member } = await supabase
          .from('members')
          .select('id')
          .eq('user_id', user.id)
          .single();
        createdBy = member?.id || null;
      }
    } catch (authError) {
      // Admin panel doesn't use Supabase auth, continue without creator
      console.log('Creating event without authenticated user');
    }

    const { data, error } = await supabase
      .from('events')
      .insert([{
        ...eventData,
        created_by: createdBy
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to create event:', error);
    throw error;
  }
};

/**
 * Update an event (Admin only)
 * @param {string} eventId - Event UUID
 * @param {Object} updates - Event updates
 * @returns {Promise<Object>} Updated event
 */
export const updateEvent = async (eventId, updates) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update event:', error);
    throw error;
  }
};

/**
 * Delete an event (Admin only)
 * @param {string} eventId - Event UUID
 * @returns {Promise<void>}
 */
export const deleteEvent = async (eventId) => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete event:', error);
    throw error;
  }
};

/**
 * Publish an event (Admin only)
 * @param {string} eventId - Event UUID
 * @returns {Promise<Object>} Updated event
 */
export const publishEvent = async (eventId) => {
  return updateEvent(eventId, { is_published: true });
};

/**
 * Unpublish an event (Admin only)
 * @param {string} eventId - Event UUID
 * @returns {Promise<Object>} Updated event
 */
export const unpublishEvent = async (eventId) => {
  return updateEvent(eventId, { is_published: false });
};

// ============================================================================
// EVENT REGISTRATIONS - Member Operations
// ============================================================================

/**
 * Register for an event with email/name (for non-authenticated users)
 * @param {string} eventId - Event UUID
 * @param {Object} registrationData - {user_email, user_name, user_phone}
 * @returns {Promise<Object>} Created registration
 */
export const registerForEvent = async (eventId, registrationData) => {
  try {
    const { user_email, user_name, user_phone } = registrationData;

    if (!user_email || !user_name) {
      throw new Error('Email and name are required');
    }

    const { data, error } = await supabase
      .from('event_registrations')
      .insert([{
        event_id: eventId,
        user_email,
        user_name,
        user_phone: user_phone || null,
        attendance_status: 'registered'
      }])
      .select()
      .single();

    if (error) {
      // Handle duplicate registration
      if (error.code === '23505') {
        throw new Error('You are already registered for this event');
      }
      console.error('Error registering for event:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to register for event:', error);
    throw error;
  }
};

/**
 * Cancel event registration by email
 * @param {string} eventId - Event UUID
 * @param {string} userEmail - User's email
 * @returns {Promise<void>}
 */
export const cancelRegistration = async (eventId, userEmail) => {
  try {
    if (!userEmail) {
      throw new Error('Email is required to cancel registration');
    }

    const { error } = await supabase
      .from('event_registrations')
      .update({ attendance_status: 'cancelled' })
      .eq('event_id', eventId)
      .eq('user_email', userEmail);

    if (error) {
      console.error('Error canceling registration:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to cancel registration:', error);
    throw error;
  }
};

/**
 * Check if user is registered for an event by email
 * @param {string} eventId - Event UUID
 * @param {string} userEmail - User's email
 * @returns {Promise<boolean>} True if registered
 */
export const checkRegistration = async (eventId, userEmail) => {
  try {
    if (!userEmail) {
      return false;
    }

    const { data, error } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_email', userEmail)
      .neq('attendance_status', 'cancelled')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking registration:', error);
    }

    return !!data;
  } catch (error) {
    console.error('Failed to check registration:', error);
    return false;
  }
};

/**
 * Fetch registrations for a specific event
 * @param {string} eventId - Event UUID
 * @returns {Promise<Array>} List of registrations
 */
export const fetchEventRegistrations = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .neq('attendance_status', 'cancelled')
      .order('registration_date', { ascending: false });

    if (error) {
      console.error('Error fetching event registrations:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch event registrations:', error);
    throw error;
  }
};

/**
 * Get registration count for an event
 * @param {string} eventId - Event UUID
 * @returns {Promise<number>} Number of registrations
 */
export const getRegistrationCount = async (eventId) => {
  try {
    const { count, error } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .neq('attendance_status', 'cancelled');

    if (error) {
      console.error('Error getting registration count:', error);
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error('Failed to get registration count:', error);
    return 0;
  }
};

// ============================================================================
// STORAGE - Event Photo Upload
// ============================================================================

/**
 * Upload event image to Supabase Storage
 * @param {File} file - Image file
 * @param {string} folder - Folder name (logos, covers, etc.)
 * @returns {Promise<string>} Public URL of uploaded image
 */
export const uploadEventImage = async (file, folder = 'general') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('event-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading event image:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('event-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Failed to upload event image:', error);
    throw error;
  }
};

/**
 * Upload event photo to Supabase Storage (legacy)
 * @param {File} file - Image file
 * @param {string} eventId - Event ID for path organization
 * @returns {Promise<string>} Public URL of uploaded photo
 */
export const uploadEventPhoto = async (file, eventId) => {
  return uploadEventImage(file, eventId);
};

/**
 * Delete event photo from Supabase Storage
 * @param {string} photoUrl - Photo URL to delete
 * @returns {Promise<void>}
 */
export const deleteEventPhoto = async (photoUrl) => {
  try {
    // Extract file path from URL
    const url = new URL(photoUrl);
    const pathParts = url.pathname.split('/event-photos/');
    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from('event-photos')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting event photo:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete event photo:', error);
    throw error;
  }
};

export default {
  fetchEvents,
  fetchEventById,
  fetchAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  publishEvent,
  unpublishEvent,
  registerForEvent,
  cancelRegistration,
  checkRegistration,
  fetchEventRegistrations,
  getRegistrationCount,
  uploadEventImage,
  uploadEventPhoto,
  deleteEventPhoto
};
