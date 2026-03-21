import { supabase } from '../lib/supabase';
import { sendApplicationStatusEmail } from './email';

/**
 * Members Service - Supabase operations for members and applications
 */

// ============================================================================
// MEMBERS - Public/Member Operations
// ============================================================================

/**
 * Fetch all active members with optional filtering
 * @param {Object} filters - Optional filters (year, member_type, campus)
 * @returns {Promise<Array>} List of active members
 */
export const fetchMembers = async (filters = {}) => {
  try {
    let query = supabase
      .from('members')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (filters.year) {
      query = query.eq('year', filters.year);
    }
    if (filters.member_type) {
      query = query.eq('member_type', filters.member_type);
    }
    if (filters.campus) {
      query = query.eq('campus', filters.campus);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching members:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch members:', error);
    throw error;
  }
};

/**
 * Fetch a single member by ID
 * @param {string} memberId - Member UUID
 * @returns {Promise<Object>} Member details
 */
export const fetchMemberById = async (memberId) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', memberId)
      .single();

    if (error) {
      console.error('Error fetching member:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch member:', error);
    throw error;
  }
};

/**
 * Get current user's member profile
 * @returns {Promise<Object|null>} Member profile or null
 */
export const getCurrentMemberProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // User might not have a member profile yet
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch current member profile:', error);
    return null;
  }
};

/**
 * Update member profile (only for logged-in member's own profile)
 * @param {string} memberId - Member UUID
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} Updated member data
 */
export const updateMemberProfile = async (memberId, updates) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', memberId)
      .select()
      .single();

    if (error) {
      console.error('Error updating member profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update member profile:', error);
    throw error;
  }
};

// ============================================================================
// MEMBER APPLICATIONS - Public Operations
// ============================================================================

/**
 * Submit a new member application
 * @param {Object} applicationData - Application form data
 * @returns {Promise<Object>} Created application
 */
export const submitApplication = async (applicationData) => {
  try {
    const { data, error } = await supabase
      .from('member_applications')
      .insert([{
        name: applicationData.name,
        email: applicationData.email,
        year: applicationData.year,
        campus: applicationData.campus,
        major: applicationData.major,
        minor: applicationData.minor,
        bio: applicationData.bio,
        portfolio_url: applicationData.portfolio_url,
        linkedin_url: applicationData.linkedin_url,
        instagram_url: applicationData.instagram_url,
        photo_url: applicationData.photo_url,
        vibe_images: applicationData.vibe_images || [],
        custom_section_title: applicationData.custom_section_title,
        custom_section_description: applicationData.custom_section_description,
        custom_section_images: applicationData.custom_section_images || [],
        portfolio_items: applicationData.portfolio_items || [],
        is_alumni: applicationData.is_alumni || false,
        graduation_year: applicationData.graduation_year,
        reason_for_joining: applicationData.reason_for_joining,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error submitting application:', error);
      throw error;
    }

    // Send confirmation email (don't await - let it happen in background)
    sendApplicationStatusEmail({
      email: applicationData.email,
      name: applicationData.name,
      status: 'pending'
    }).catch(err => console.error('Failed to send confirmation email:', err));

    return data;
  } catch (error) {
    console.error('Failed to submit application:', error);
    throw error;
  }
};

// ============================================================================
// MEMBER APPLICATIONS - Admin Operations
// ============================================================================

/**
 * Fetch all member applications (Admin only)
 * @param {string} status - Filter by status (pending, approved, rejected, or 'all')
 * @returns {Promise<Array>} List of applications
 */
export const fetchApplications = async (status = 'all') => {
  try {
    let query = supabase
      .from('member_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    throw error;
  }
};

/**
 * Approve a member application and create member record (Admin only)
 * @param {string} applicationId - Application UUID
 * @param {Object} memberData - Additional member data (user_id, role, etc.)
 * @returns {Promise<Object>} Created member
 */
export const approveApplication = async (applicationId, memberData = {}) => {
  try {
    // First, get the application
    const { data: application, error: fetchError } = await supabase
      .from('member_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (fetchError) throw fetchError;

    // Check if member already exists with this email
    const { data: existingMember } = await supabase
      .from('members')
      .select('id, name, email')
      .eq('email', application.email)
      .single();

    let member;

    if (existingMember) {
      // Member already exists, just update their info and mark as active
      const { data: updatedMember, error: updateMemberError } = await supabase
        .from('members')
        .update({
          name: application.name,
          year: application.year,
          campus: application.campus,
          major: application.major,
          minor: application.minor,
          bio: application.bio,
          portfolio_url: application.portfolio_url,
          linkedin_url: application.linkedin_url,
          instagram_url: application.instagram_url,
          photo_url: application.photo_url,
          vibe_images: application.vibe_images,
          custom_section_title: application.custom_section_title,
          custom_section_description: application.custom_section_description,
          custom_section_images: application.custom_section_images,
          is_alumni: application.is_alumni,
          graduation_year: application.graduation_year,
          is_active: true
        })
        .eq('id', existingMember.id)
        .select()
        .single();

      if (updateMemberError) throw updateMemberError;
      member = updatedMember;
    } else {
      // Create new member record
      const { data: newMember, error: memberError } = await supabase
        .from('members')
        .insert([{
          user_id: memberData.user_id || null,
          name: application.name,
          email: application.email,
          year: application.year,
          campus: application.campus,
          major: application.major,
          minor: application.minor,
          bio: application.bio,
          portfolio_url: application.portfolio_url,
          linkedin_url: application.linkedin_url,
          instagram_url: application.instagram_url,
          photo_url: application.photo_url,
          vibe_images: application.vibe_images,
          custom_section_title: application.custom_section_title,
          custom_section_description: application.custom_section_description,
          custom_section_images: application.custom_section_images,
          is_alumni: application.is_alumni,
          graduation_year: application.graduation_year,
          member_type: memberData.member_type || 'student',
          role: memberData.role || 'member',
          is_active: true
        }])
        .select()
        .single();

      if (memberError) throw memberError;
      member = newMember;
    }

    // Create portfolio items if provided in the application
    if (application.portfolio_items && application.portfolio_items.length > 0) {
      console.log(`Creating ${application.portfolio_items.length} portfolio items for member ${member.id}`);

      const portfolioItemsToInsert = application.portfolio_items.map(item => ({
        member_id: member.id,
        title: item.title,
        description: item.description,
        category: item.category,
        project_url: item.project_url,
        tools_used: item.tools_used,
        image_url: item.image_url,
        display_order: item.display_order
      }));

      const { error: portfolioError } = await supabase
        .from('portfolio_items')
        .insert(portfolioItemsToInsert);

      if (portfolioError) {
        console.error('Error creating portfolio items:', portfolioError);
        // Don't throw - portfolio items are optional
      } else {
        console.log('Portfolio items created successfully');
      }
    }

    // Update application status
    const { error: updateError } = await supabase
      .from('member_applications')
      .update({ status: 'approved' })
      .eq('id', applicationId);

    if (updateError) throw updateError;

    // Send approval email (don't await - let it happen in background)
    sendApplicationStatusEmail({
      email: application.email,
      name: application.name,
      status: 'approved'
    }).catch(err => console.error('Failed to send approval email:', err));

    return member;
  } catch (error) {
    console.error('Failed to approve application:', error);
    throw error;
  }
};

/**
 * Reject a member application (Admin only)
 * @param {string} applicationId - Application UUID
 * @returns {Promise<void>}
 */
export const rejectApplication = async (applicationId) => {
  try {
    // First, get the application to access email and name
    const { data: application, error: fetchError } = await supabase
      .from('member_applications')
      .select('email, name')
      .eq('id', applicationId)
      .single();

    if (fetchError) throw fetchError;

    // Update application status
    const { error } = await supabase
      .from('member_applications')
      .update({ status: 'rejected' })
      .eq('id', applicationId);

    if (error) {
      console.error('Error rejecting application:', error);
      throw error;
    }

    // Send rejection email (don't await - let it happen in background)
    sendApplicationStatusEmail({
      email: application.email,
      name: application.name,
      status: 'rejected'
    }).catch(err => console.error('Failed to send rejection email:', err));

  } catch (error) {
    console.error('Failed to reject application:', error);
    throw error;
  }
};

/**
 * Unapprove a member - deletes member record and sets application back to pending
 * This allows re-approving to update member data
 * @param {string} applicationId - Application UUID
 * @returns {Promise<void>}
 */
export const unapproveApplication = async (applicationId) => {
  try {
    // Get the application to find the associated member
    const { data: application, error: fetchError } = await supabase
      .from('member_applications')
      .select('email')
      .eq('id', applicationId)
      .single();

    if (fetchError) throw fetchError;

    // Delete the member record (if exists)
    const { error: deleteMemberError } = await supabase
      .from('members')
      .delete()
      .eq('email', application.email);

    if (deleteMemberError) {
      console.error('Error deleting member:', deleteMemberError);
      // Don't throw - member might not exist yet
    }

    // Set application back to pending
    const { error: updateError } = await supabase
      .from('member_applications')
      .update({ status: 'pending' })
      .eq('id', applicationId);

    if (updateError) throw updateError;

    console.log('Application unapproved successfully');
  } catch (error) {
    console.error('Failed to unapprove application:', error);
    throw error;
  }
};

/**
 * Delete a member application (Admin only)
 * @param {string} applicationId - Application UUID
 * @returns {Promise<void>}
 */
export const deleteApplication = async (applicationId) => {
  try {
    const { error } = await supabase
      .from('member_applications')
      .delete()
      .eq('id', applicationId);

    if (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete application:', error);
    throw error;
  }
};

// ============================================================================
// STORAGE - Photo Upload
// ============================================================================

/**
 * Upload member photo to Supabase Storage
 * @param {File} file - Image file
 * @param {string} userId - User ID for path organization
 * @returns {Promise<string>} Public URL of uploaded photo
 */
export const uploadMemberPhoto = async (file, userId) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('member-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('member-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Failed to upload member photo:', error);
    throw error;
  }
};

/**
 * Delete member photo from Supabase Storage
 * @param {string} photoUrl - Photo URL to delete
 * @returns {Promise<void>}
 */
export const deleteMemberPhoto = async (photoUrl) => {
  try {
    // Extract file path from URL
    const url = new URL(photoUrl);
    const pathParts = url.pathname.split('/member-photos/');
    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from('member-photos')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete member photo:', error);
    throw error;
  }
};

/**
 * Upload vibe image to Supabase Storage
 * @param {File} file - Image file
 * @param {string} userId - User ID for path organization
 * @returns {Promise<string>} Public URL of uploaded image
 */
export const uploadVibeImage = async (file, userId) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/vibes/${fileName}`;

    const { data, error } = await supabase.storage
      .from('vibe-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading vibe image:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('vibe-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Failed to upload vibe image:', error);
    throw error;
  }
};

/**
 * Delete vibe image from Supabase Storage
 * @param {string} imageUrl - Image URL to delete
 * @returns {Promise<void>}
 */
export const deleteVibeImage = async (imageUrl) => {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/vibe-images/');
    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from('vibe-images')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting vibe image:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete vibe image:', error);
    throw error;
  }
};

/**
 * Update member's FLUX team status and role (Admin only)
 * @param {string} memberId - Member UUID
 * @param {boolean} isFluxTeam - Whether member is on FLUX team
 * @param {string|null} fluxTeamRole - Role on FLUX team (e.g., "President", "Vice President", etc.)
 * @returns {Promise<Object>} Updated member
 */
export const updateFluxTeamStatus = async (memberId, isFluxTeam, fluxTeamRole = null) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .update({
        is_flux_team: isFluxTeam,
        flux_team_role: isFluxTeam ? fluxTeamRole : null
      })
      .eq('id', memberId)
      .select()
      .single();

    if (error) {
      console.error('Error updating FLUX team status:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update FLUX team status:', error);
    throw error;
  }
};

export default {
  fetchMembers,
  fetchMemberById,
  getCurrentMemberProfile,
  updateMemberProfile,
  submitApplication,
  fetchApplications,
  approveApplication,
  rejectApplication,
  unapproveApplication,
  deleteApplication,
  uploadMemberPhoto,
  deleteMemberPhoto,
  uploadVibeImage,
  deleteVibeImage,
  updateFluxTeamStatus
};
