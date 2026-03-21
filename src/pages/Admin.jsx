import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchApplications, approveApplication, rejectApplication, unapproveApplication, fetchMembers, updateFluxTeamStatus } from '../services/members';
import { fetchAllEvents, createEvent, updateEvent, deleteEvent, publishEvent, unpublishEvent, uploadEventImage, fetchEventRegistrations } from '../services/events';
import ImageCropModal from '../components/modals/ImageCropModal';
import AnalyticsDashboard from '../components/Admin/AnalyticsDashboard';
import {
  UserGroupIcon,
  CalendarIcon,
  LockClosedIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  RocketLaunchIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  UsersIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  event_date: z.string().min(1, 'Event date is required'),
  location: z.string().optional(),
  presenter_id: z.string().optional(),
});

export default function Admin() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('admin_unlocked') === 'true';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(() => {
    // Set initial tab based on URL
    if (location.pathname === '/event-manage') return 'events';
    return 'analytics'; // Default to analytics dashboard
  });
  const [statusFilter, setStatusFilter] = useState('pending');
  const [memberView, setMemberView] = useState('applications'); // 'applications' or 'flux-team'

  // Event management state
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [viewingRegistrations, setViewingRegistrations] = useState(null);

  // Image crop modal state
  const [logoCropModalOpen, setLogoCropModalOpen] = useState(false);
  const [coverCropModalOpen, setCoverCropModalOpen] = useState(false);
  const [logoImageSrc, setLogoImageSrc] = useState(null);
  const [coverImageSrc, setCoverImageSrc] = useState(null);

  const ADMIN_PASSWORD = 'webbbbbbb';

  const {
    register: registerEvent,
    handleSubmit: handleSubmitEvent,
    formState: { errors: eventErrors },
    reset: resetEvent,
    setValue: setEventValue
  } = useForm({
    resolver: zodResolver(eventSchema)
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      sessionStorage.setItem('admin_unlocked', 'true');
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      setIsUnlocked(false);
      sessionStorage.removeItem('admin_unlocked');
    }
  };

  // ============ MEMBER MANAGEMENT ============
  // Fetch ALL applications always, then filter client-side
  const { data: allApplications = [], isLoading: applicationsLoading, refetch: refetchApplications } = useQuery({
    queryKey: ['applications'],
    queryFn: () => fetchApplications('all'), // Always fetch all
    enabled: isUnlocked && activeTab === 'members',
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  // Filter applications based on current filter
  const applications = statusFilter === 'all'
    ? allApplications
    : allApplications.filter(app => app.status === statusFilter);

  const approveMutation = useMutation({
    mutationFn: (applicationId) => approveApplication(applicationId),
    onSuccess: async () => {
      // Invalidate and refetch all application queries
      await queryClient.invalidateQueries({ queryKey: ['applications'] });
      await queryClient.invalidateQueries({ queryKey: ['members'] });

      alert('Application approved successfully! The member will appear on the Community page.');
    },
    onError: (error) => {
      alert('Failed to approve: ' + error.message + '\n\nMake sure you ran the SQL migrations first!');
      console.error('Approval error:', error);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (applicationId) => rejectApplication(applicationId),
    onSuccess: async () => {
      // Invalidate and refetch all application queries
      await queryClient.invalidateQueries({ queryKey: ['applications'] });

      alert('Application rejected');
    },
    onError: (error) => {
      alert('Failed to reject: ' + error.message);
    }
  });

  const unapproveMutation = useMutation({
    mutationFn: (applicationId) => unapproveApplication(applicationId),
    onSuccess: async () => {
      // Invalidate and refetch all application queries
      await queryClient.invalidateQueries({ queryKey: ['applications'] });
      await queryClient.invalidateQueries({ queryKey: ['members'] });

      alert('Member unapproved! Application set back to pending. You can now approve it again to update their data.');
    },
    onError: (error) => {
      alert('Failed to unapprove: ' + error.message);
    }
  });

  const handleApprove = (application) => {
    if (confirm(`Approve ${application.name}'s application?\n\nThis will create a member profile and they will appear on the Community page.`)) {
      approveMutation.mutate(application.id);
    }
  };

  const handleReject = (application) => {
    if (confirm(`Reject ${application.name}'s application?`)) {
      rejectMutation.mutate(application.id);
    }
  };

  const handleUnapprove = (application) => {
    if (confirm(`Unapprove ${application.name}?\n\nThis will:\n- Remove them from the Community page\n- Set their application back to pending\n- Allow you to re-approve to update their profile data\n\nContinue?`)) {
      unapproveMutation.mutate(application.id);
    }
  };

  // ============ FLUX TEAM MANAGEMENT ============
  const [editingFluxTeamMember, setEditingFluxTeamMember] = useState(null);
  const [fluxTeamRole, setFluxTeamRole] = useState('');

  const fluxTeamMutation = useMutation({
    mutationFn: ({ memberId, isFluxTeam, role }) =>
      updateFluxTeamStatus(memberId, isFluxTeam, role),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['members'] });
      setEditingFluxTeamMember(null);
      setFluxTeamRole('');
      alert('FLUX team status updated successfully!');
    },
    onError: (error) => {
      alert('Failed to update FLUX team status: ' + error.message);
    }
  });

  const handleAddToFluxTeam = (member) => {
    setEditingFluxTeamMember(member);
    setFluxTeamRole(member.flux_team_role || '');
  };

  const handleRemoveFromFluxTeam = (member) => {
    if (confirm(`Remove ${member.name} from FLUX team?`)) {
      fluxTeamMutation.mutate({
        memberId: member.id,
        isFluxTeam: false,
        role: null
      });
    }
  };

  const handleSaveFluxTeamRole = () => {
    if (!fluxTeamRole.trim()) {
      alert('Please enter a role for this team member');
      return;
    }

    fluxTeamMutation.mutate({
      memberId: editingFluxTeamMember.id,
      isFluxTeam: true,
      role: fluxTeamRole.trim()
    });
  };

  // ============ EVENT MANAGEMENT ============
  const { data: events = [], isLoading: eventsLoading, refetch: refetchEvents } = useQuery({
    queryKey: ['allEvents'],
    queryFn: fetchAllEvents,
    enabled: isUnlocked && activeTab === 'events',
  });

  // Fetch members for presenter dropdown and FLUX team management
  const { data: members = [], refetch: refetchMembers } = useQuery({
    queryKey: ['members'],
    queryFn: () => fetchMembers(),
    enabled: isUnlocked && (activeTab === 'events' || (activeTab === 'members' && memberView === 'flux-team')),
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      let logoUrl = null;
      let coverUrl = null;

      if (logoFile) {
        logoUrl = await uploadEventImage(logoFile, 'logos');
      }
      if (coverFile) {
        coverUrl = await uploadEventImage(coverFile, 'covers');
      }

      return createEvent({
        ...data,
        presenter_id: data.presenter_id || null, // Convert empty string to null
        logo_url: logoUrl,
        cover_image_url: coverUrl,
        is_published: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allEvents'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      refetchEvents();
      setIsCreating(false);
      resetEvent();
      setLogoFile(null);
      setCoverFile(null);
      setLogoPreview(null);
      setCoverPreview(null);
      alert('Event created successfully!');
    },
    onError: (error) => {
      alert('Failed to create event: ' + error.message);
      console.error('Create error:', error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      let logoUrl = editingEvent.logo_url;
      let coverUrl = editingEvent.cover_image_url;

      if (logoFile) {
        logoUrl = await uploadEventImage(logoFile, 'logos');
      }
      if (coverFile) {
        coverUrl = await uploadEventImage(coverFile, 'covers');
      }

      return updateEvent(editingEvent.id, {
        ...data,
        presenter_id: data.presenter_id || null, // Convert empty string to null
        logo_url: logoUrl,
        cover_image_url: coverUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allEvents'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      refetchEvents();
      setEditingEvent(null);
      resetEvent();
      setLogoFile(null);
      setCoverFile(null);
      setLogoPreview(null);
      setCoverPreview(null);
      alert('Event updated successfully!');
    },
    onError: (error) => {
      alert('Failed to update event: ' + error.message);
      console.error('Update error:', error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allEvents'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      refetchEvents();
      alert('Event deleted successfully!');
    },
    onError: (error) => {
      alert('Failed to delete event: ' + error.message);
    }
  });

  const publishMutation = useMutation({
    mutationFn: publishEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allEvents'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      refetchEvents();
      alert('Event published!');
    }
  });

  const unpublishMutation = useMutation({
    mutationFn: unpublishEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allEvents'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      refetchEvents();
      alert('Event unpublished!');
    }
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Logo must be less than 5MB');
        e.target.value = '';
        return;
      }
      // Open crop modal
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImageSrc(reader.result);
        setLogoCropModalOpen(true);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Cover image must be less than 5MB');
        e.target.value = '';
        return;
      }
      // Open crop modal
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageSrc(reader.result);
        setCoverCropModalOpen(true);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleLogoCropComplete = (croppedFile) => {
    setLogoFile(croppedFile);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(croppedFile);
    setLogoCropModalOpen(false);
    setLogoImageSrc(null);
  };

  const handleCoverCropComplete = (croppedFile) => {
    setCoverFile(croppedFile);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result);
    reader.readAsDataURL(croppedFile);
    setCoverCropModalOpen(false);
    setCoverImageSrc(null);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventValue('title', event.title);
    setEventValue('description', event.description || '');
    setEventValue('event_date', event.event_date.split('T')[0]);
    setEventValue('location', event.location || '');
    setEventValue('presenter_id', event.presenter_id || '');
    setLogoPreview(event.logo_url);
    setCoverPreview(event.cover_image_url);
    window.scrollTo(0, 0);
  };

  const handleDeleteEvent = (event) => {
    if (confirm(`Delete "${event.title}"? This cannot be undone.`)) {
      deleteMutation.mutate(event.id);
    }
  };

  const handleTogglePublish = (event) => {
    if (event.is_published) {
      unpublishMutation.mutate(event.id);
    } else {
      publishMutation.mutate(event.id);
    }
  };

  // Fetch registrations for selected event
  const { data: registrations = [], isLoading: registrationsLoading, refetch: refetchRegistrations } = useQuery({
    queryKey: ['eventRegistrations', viewingRegistrations?.id],
    queryFn: () => fetchEventRegistrations(viewingRegistrations.id),
    enabled: !!viewingRegistrations,
  });

  const onSubmitEvent = (data) => {
    if (editingEvent) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setIsCreating(false);
    resetEvent();
    setLogoFile(null);
    setCoverFile(null);
    setLogoPreview(null);
    setCoverPreview(null);
  };

  // Password screen
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1728px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-center min-h-screen py-20">
            <div className="w-full max-w-[480px]">
              <div className="text-center mb-12">
                <LockClosedIcon className="w-20 h-20 mx-auto mb-6 text-[#316EFF]" />
                <h1 className="text-[48px] md:text-[60px] font-medium text-[#242424] mb-4">
                  Admin Access
                </h1>
                <p className="text-[18px] text-[#787878]">
                  Enter password to manage applications and events
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-6 py-4 border-2 border-[rgba(120,120,120,0.2)] rounded-[20px] focus:outline-none focus:border-[#316EFF] transition-all text-[16px] bg-white"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="bg-[#FFF4F4] border-2 border-[#FFE5E5] rounded-[20px] p-4 text-[#E53E3E] text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#316EFF] text-white py-4 rounded-[20px] font-medium text-[16px] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Unlock Admin Panel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1728px] mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-[36px] md:text-[48px] lg:text-[60px] font-medium text-[#242424] mb-2">
              Admin Panel
            </h1>
            <p className="text-[16px] md:text-[18px] text-[#787878]">
              Manage member applications and events
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[rgba(120,120,120,0.2)] text-[#242424] rounded-[20px] hover:border-[#E53E3E] hover:text-[#E53E3E] transition-all font-medium"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-6 py-3 rounded-[20px] transition-all font-medium ${
              activeTab === 'analytics'
                ? 'bg-[#316EFF] text-white shadow-lg scale-105'
                : 'bg-white text-[#787878] hover:bg-gray-50 border-2 border-[rgba(120,120,120,0.1)]'
            }`}
          >
            <ChartBarIcon className="w-5 h-5" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-6 py-3 rounded-[20px] transition-all font-medium ${
              activeTab === 'members'
                ? 'bg-[#316EFF] text-white shadow-lg scale-105'
                : 'bg-white text-[#787878] hover:bg-gray-50 border-2 border-[rgba(120,120,120,0.1)]'
            }`}
          >
            <UserGroupIcon className="w-5 h-5" />
            Manage Applications
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-6 py-3 rounded-[20px] transition-all font-medium ${
              activeTab === 'events'
                ? 'bg-[#316EFF] text-white shadow-lg scale-105'
                : 'bg-white text-[#787878] hover:bg-gray-50 border-2 border-[rgba(120,120,120,0.1)]'
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
            Manage Events
          </button>
        </div>

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {/* MEMBERS TAB */}
        {activeTab === 'members' && (
          <>
            {/* View Selector */}
            <div className="mb-6 flex gap-4">
              <button
                onClick={() => setMemberView('applications')}
                className={`px-6 py-3 rounded-[20px] transition-all font-medium ${
                  memberView === 'applications'
                    ? 'bg-[#316EFF] text-white shadow-lg'
                    : 'bg-white text-[#787878] border-2 border-[rgba(120,120,120,0.1)]'
                }`}
                style={{ fontFamily: 'Space Grotesk' }}
              >
                Applications
              </button>
              <button
                onClick={() => setMemberView('flux-team')}
                className={`px-6 py-3 rounded-[20px] transition-all font-medium ${
                  memberView === 'flux-team'
                    ? 'bg-[#316EFF] text-white shadow-lg'
                    : 'bg-white text-[#787878] border-2 border-[rgba(120,120,120,0.1)]'
                }`}
                style={{ fontFamily: 'Space Grotesk' }}
              >
                FLUX Team
              </button>
            </div>

            {/* APPLICATIONS VIEW */}
            {memberView === 'applications' && (
              <>
                {/* Status Filters */}
                <div className="bg-[#F9FAFB] rounded-[32px] p-6 md:p-8 mb-8">
                  <div className="flex flex-wrap items-center gap-4">
                    {['pending', 'approved', 'rejected', 'all'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-6 py-3 rounded-[20px] transition-all font-medium ${
                          statusFilter === status
                            ? 'bg-[#316EFF] text-white shadow-lg scale-105'
                            : 'bg-white text-[#787878] hover:bg-gray-50 border-2 border-[rgba(120,120,120,0.1)]'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        {' '}
                        ({status === 'all' ? allApplications.length : allApplications.filter(a => a.status === status).length})
                      </button>
                    ))}
                    <button
                      onClick={() => refetchApplications()}
                      disabled={applicationsLoading}
                      className="ml-auto flex items-center gap-2 px-6 py-3 bg-[#316EFF] text-white rounded-[20px] hover:scale-105 transition-all font-medium disabled:opacity-50"
                    >
                      <ArrowPathIcon className={`w-5 h-5 ${applicationsLoading ? 'animate-spin' : ''}`} />
                      {applicationsLoading ? 'Loading...' : 'Refresh'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Applications List */}
            {memberView === 'applications' && (applicationsLoading ? (
              <div className="text-center py-20">
                <ArrowPathIcon className="w-16 h-16 mx-auto mb-4 text-[#316EFF] animate-spin" />
                <p className="text-[18px] text-[#787878]">Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-20 bg-[#F9FAFB] rounded-[32px]">
                <UserGroupIcon className="w-16 h-16 mx-auto mb-4 text-[#787878]" />
                <p className="text-[24px] text-[#787878]">No applications found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="bg-white rounded-[32px] p-6 md:p-8 border-2 border-[rgba(120,120,120,0.1)] hover:border-[#316EFF] hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Photo */}
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-[24px] overflow-hidden bg-gradient-to-br from-[#F0F4FF] to-[#E8EEFF] flex-shrink-0">
                        {application.photo_url ? (
                          <img
                            src={application.photo_url}
                            alt={application.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <UserGroupIcon className="w-16 h-16 text-[#316EFF]" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-[28px] md:text-[32px] font-medium text-[#242424]">
                                {application.name}
                              </h3>
                              {application.is_alumni && (
                                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[12px] font-bold rounded-full shadow-sm">
                                  ALUMNI
                                </span>
                              )}
                            </div>
                            <p className="text-[16px] text-[#787878]">{application.email}</p>
                            {application.is_alumni && application.graduation_year && (
                              <p className="text-[14px] text-[#787878] mt-1">Class of {application.graduation_year}</p>
                            )}
                          </div>
                          <span
                            className={`px-4 py-2 rounded-[12px] text-[14px] font-medium self-start ${
                              application.status === 'pending'
                                ? 'bg-[#FFF9E6] text-[#B8860B]'
                                : application.status === 'approved'
                                ? 'bg-[#E6F9EE] text-[#2F855A]'
                                : 'bg-[#FFF4F4] text-[#E53E3E]'
                            }`}
                          >
                            {application.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] text-[#969696]">Year:</span>
                            <span className="text-[16px] text-[#242424] font-medium">{application.year}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] text-[#969696]">Campus:</span>
                            <span className="text-[16px] text-[#242424] font-medium">{application.campus}</span>
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <div>
                            <p className="text-[14px] text-[#969696] mb-2">Bio:</p>
                            <p className="text-[16px] text-[#242424] leading-relaxed">{application.bio}</p>
                          </div>
                        </div>

                        {application.portfolio_url && (
                          <div className="mb-6">
                            <a
                              href={application.portfolio_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-[#316EFF] hover:underline text-[16px] font-medium"
                            >
                              View Portfolio →
                            </a>
                          </div>
                        )}

                        <div className="text-[14px] text-[#969696] mb-6">
                          Submitted: {new Date(application.created_at).toLocaleString()}
                        </div>

                        {/* Action Buttons */}
                        {application.status === 'pending' && (
                          <div className="flex flex-wrap gap-4">
                            <button
                              onClick={() => handleApprove(application)}
                              disabled={approveMutation.isPending}
                              className="flex items-center gap-2 px-8 py-3 bg-[#2F855A] text-white rounded-[20px] hover:scale-105 transition-all disabled:opacity-50 font-medium"
                            >
                              <CheckIcon className="w-5 h-5" />
                              {approveMutation.isPending ? 'Approving...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleReject(application)}
                              disabled={rejectMutation.isPending}
                              className="flex items-center gap-2 px-8 py-3 bg-[#E53E3E] text-white rounded-[20px] hover:scale-105 transition-all disabled:opacity-50 font-medium"
                            >
                              <XMarkIcon className="w-5 h-5" />
                              {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                            </button>
                          </div>
                        )}

                        {/* Unapprove Button for Approved Applications */}
                        {application.status === 'approved' && (
                          <div className="flex flex-wrap gap-4">
                            <button
                              onClick={() => handleUnapprove(application)}
                              disabled={unapproveMutation.isPending}
                              className="flex items-center gap-2 px-8 py-3 bg-[#F59E0B] text-white rounded-[20px] hover:scale-105 transition-all disabled:opacity-50 font-medium"
                              title="Reset this member back to pending status so you can re-approve and update their data"
                            >
                              <XMarkIcon className="w-5 h-5" />
                              {unapproveMutation.isPending ? 'Resetting...' : 'Reset to Pending'}
                            </button>
                            <span className="text-[14px] text-[#787878] self-center">
                              💡 Use this to re-sync member data after updates
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* FLUX TEAM VIEW */}
            {memberView === 'flux-team' && (
              <>
                <div className="bg-[#F9FAFB] rounded-[32px] p-6 md:p-8 mb-8">
                  <div className="flex flex-wrap items-center gap-4">
                    <h3 className="text-[24px] font-bold text-[#242424]" style={{ fontFamily: 'Space Grotesk' }}>
                      Manage FLUX Team
                    </h3>
                    <button
                      onClick={() => refetchMembers()}
                      className="ml-auto flex items-center gap-2 px-6 py-3 bg-[#316EFF] text-white rounded-[20px] hover:scale-105 transition-all font-medium"
                      style={{ fontFamily: 'Space Grotesk' }}
                    >
                      <ArrowPathIcon className="w-5 h-5" />
                      Refresh
                    </button>
                  </div>
                  <p className="text-[16px] text-[#787878] mt-2" style={{ fontFamily: 'Space Grotesk' }}>
                    Assign officers and team members to display on the FLUX Team page
                  </p>
                </div>

                {/* Current FLUX Team Members */}
                {members.filter(m => m.is_flux_team).length > 0 && (
                  <>
                    <h4 className="text-[20px] font-bold text-[#242424] mb-4" style={{ fontFamily: 'Space Grotesk' }}>
                      Current FLUX Team ({members.filter(m => m.is_flux_team).length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {members.filter(m => m.is_flux_team).map((member) => (
                        <div
                          key={member.id}
                          className="bg-white rounded-[24px] p-6 border-2 border-[#316EFF] shadow-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#316EFF] to-[#4A80FF] flex-shrink-0">
                              {member.photo_url ? (
                                <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-[24px] font-bold" style={{ fontFamily: 'Space Grotesk' }}>
                                  {member.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className="text-[18px] font-bold text-[#242424]" style={{ fontFamily: 'Space Grotesk' }}>
                                {member.name}
                              </h5>
                              <p className="text-[14px] text-[#316EFF] font-semibold" style={{ fontFamily: 'Space Grotesk' }}>
                                {member.flux_team_role}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAddToFluxTeam(member)}
                                className="px-4 py-2 bg-[#F59E0B] text-white rounded-[12px] hover:scale-105 transition-all text-[14px] font-medium"
                                style={{ fontFamily: 'Space Grotesk' }}
                              >
                                Edit Role
                              </button>
                              <button
                                onClick={() => handleRemoveFromFluxTeam(member)}
                                className="px-4 py-2 bg-[#E53E3E] text-white rounded-[12px] hover:scale-105 transition-all text-[14px] font-medium"
                                style={{ fontFamily: 'Space Grotesk' }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Available Members */}
                <h4 className="text-[20px] font-bold text-[#242424] mb-4" style={{ fontFamily: 'Space Grotesk' }}>
                  Available Members ({members.filter(m => !m.is_flux_team).length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.filter(m => !m.is_flux_team).map((member) => (
                    <div
                      key={member.id}
                      className="bg-white rounded-[24px] p-6 border-2 border-[rgba(120,120,120,0.1)] hover:border-[#316EFF] hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#F0F4FF] to-[#E8EEFF] flex-shrink-0">
                          {member.photo_url ? (
                            <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#316EFF] text-[18px] font-bold" style={{ fontFamily: 'Space Grotesk' }}>
                              {member.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-[16px] font-bold text-[#242424]" style={{ fontFamily: 'Space Grotesk' }}>
                            {member.name}
                          </h5>
                          <p className="text-[12px] text-[#787878]" style={{ fontFamily: 'Space Grotesk' }}>
                            {member.year} • {member.campus}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToFluxTeam(member)}
                        className="w-full px-4 py-2 bg-[#316EFF] text-white rounded-[12px] hover:scale-105 transition-all text-[14px] font-medium"
                        style={{ fontFamily: 'Space Grotesk' }}
                      >
                        Add to FLUX Team
                      </button>
                    </div>
                  ))}
                </div>

                {/* Role Assignment Modal */}
                {editingFluxTeamMember && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[32px] p-8 max-w-md w-full">
                      <h3 className="text-[24px] font-bold text-[#242424] mb-6" style={{ fontFamily: 'Space Grotesk' }}>
                        Assign FLUX Team Role
                      </h3>
                      <div className="mb-6">
                        <label className="block text-[14px] font-medium text-[#787878] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                          Member
                        </label>
                        <p className="text-[18px] font-bold text-[#242424]" style={{ fontFamily: 'Space Grotesk' }}>
                          {editingFluxTeamMember.name}
                        </p>
                      </div>
                      <div className="mb-6">
                        <label htmlFor="flux-role" className="block text-[14px] font-medium text-[#787878] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                          Role *
                        </label>
                        <select
                          id="flux-role"
                          value={fluxTeamRole}
                          onChange={(e) => setFluxTeamRole(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-[rgba(120,120,120,0.2)] rounded-[12px] text-[16px]"
                          style={{ fontFamily: 'Space Grotesk' }}
                        >
                          <option value="">Select a role...</option>
                          <option value="President">President</option>
                          <option value="Vice President">Vice President</option>
                          <option value="Secretary">Secretary</option>
                          <option value="Treasurer">Treasurer</option>
                          <option value="Faculty Advisor">Faculty Advisor</option>
                          <option value="Figma Friday Lead">Figma Friday Lead</option>
                          <option value="Yearbook Committee Lead">Yearbook Committee Lead</option>
                          <option value="Events Coordinator">Events Coordinator</option>
                          <option value="Marketing Lead">Marketing Lead</option>
                          <option value="Social Media Manager">Social Media Manager</option>
                          <option value="Workshop Coordinator">Workshop Coordinator</option>
                          <option value="Community Manager">Community Manager</option>
                        </select>
                        <p className="text-[12px] text-[#787878] mt-1" style={{ fontFamily: 'Space Grotesk' }}>
                          Or type a custom role
                        </p>
                        <input
                          type="text"
                          value={fluxTeamRole}
                          onChange={(e) => setFluxTeamRole(e.target.value)}
                          placeholder="e.g., Design Lead"
                          className="w-full px-4 py-3 border-2 border-[rgba(120,120,120,0.2)] rounded-[12px] text-[16px] mt-2"
                          style={{ fontFamily: 'Space Grotesk' }}
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            setEditingFluxTeamMember(null);
                            setFluxTeamRole('');
                          }}
                          className="flex-1 px-6 py-3 bg-[#F9FAFB] text-[#787878] rounded-[16px] hover:bg-[#F0F0F0] transition-all font-medium"
                          style={{ fontFamily: 'Space Grotesk' }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveFluxTeamRole}
                          disabled={fluxTeamMutation.isPending}
                          className="flex-1 px-6 py-3 bg-[#316EFF] text-white rounded-[16px] hover:scale-105 transition-all font-medium disabled:opacity-50"
                          style={{ fontFamily: 'Space Grotesk' }}
                        >
                          {fluxTeamMutation.isPending ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <>
            {/* Create/Edit Form */}
            {(isCreating || editingEvent) && (
              <div className="bg-white border-2 border-[#316EFF] rounded-3xl p-6 md:p-10 mb-8 shadow-lg">
                <h2 className="text-[28px] md:text-[36px] font-bold text-[#242424] mb-8 flex items-center gap-3">
                  {editingEvent ? (
                    <>
                      <PencilIcon className="w-8 h-8" />
                      Edit Event
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-8 h-8" />
                      Create New Event
                    </>
                  )}
                </h2>

                <form onSubmit={handleSubmitEvent(onSubmitEvent)} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-[16px] font-medium text-[#242424] mb-3">
                      Event Title <span className="text-[#316EFF]">*</span>
                    </label>
                    <input
                      {...registerEvent('title')}
                      type="text"
                      className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px]"
                      placeholder="Workshop: Figma Basics"
                    />
                    {eventErrors.title && (
                      <p className="mt-2 text-sm text-red-500">{eventErrors.title.message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[16px] font-medium text-[#242424] mb-3">
                      Description <span className="text-[#316EFF]">*</span>
                    </label>
                    <textarea
                      {...registerEvent('description')}
                      rows={4}
                      className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px] resize-none"
                      placeholder="Learn the basics of Figma in this hands-on workshop..."
                    />
                    {eventErrors.description && (
                      <p className="mt-2 text-sm text-red-500">{eventErrors.description.message}</p>
                    )}
                  </div>

                  {/* Date, Location, Presenter */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[16px] font-medium text-[#242424] mb-3">
                        Event Date <span className="text-[#316EFF]">*</span>
                      </label>
                      <input
                        {...registerEvent('event_date')}
                        type="date"
                        className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px] custom-date-input"
                      />
                      {eventErrors.event_date && (
                        <p className="mt-2 text-sm text-red-500">{eventErrors.event_date.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[16px] font-medium text-[#242424] mb-3">
                        Location <span className="text-[#787878]">(Optional)</span>
                      </label>
                      <input
                        {...registerEvent('location')}
                        type="text"
                        className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px]"
                        placeholder="SCAD Atlanta"
                      />
                    </div>

                    <div>
                      <label className="block text-[16px] font-medium text-[#242424] mb-3">
                        Presenter <span className="text-[#787878]">(Optional - Select a FLUX member)</span>
                      </label>
                      <select
                        {...registerEvent('presenter_id')}
                        className="w-full px-5 py-4 border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#316EFF] transition-colors duration-200 text-[16px] bg-white"
                      >
                        <option value="">No presenter</option>
                        {members.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name} {member.year ? `(${member.year})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Logo */}
                    <div>
                      <label className="block text-[16px] font-medium text-[#242424] mb-3">
                        Event Logo <span className="text-[#787878]">(Optional)</span>
                      </label>
                      {logoPreview && (
                        <div className="mb-4">
                          <img src={logoPreview} alt="Logo preview" className="w-32 h-32 object-cover rounded-xl border-2 border-[#E5E7EB]" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="w-full px-5 py-4 border-2 border-dashed border-[#E5E7EB] rounded-2xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#316EFF] file:text-white hover:file:bg-[#3164DC]"
                      />
                      <p className="mt-2 text-sm text-[#787878]">Max 5MB. Will be cropped to 1:1 ratio.</p>
                    </div>

                    {/* Cover Image */}
                    <div>
                      <label className="block text-[16px] font-medium text-[#242424] mb-3">
                        Cover Image <span className="text-[#787878]">(Optional)</span>
                      </label>
                      {coverPreview && (
                        <div className="mb-4">
                          <img src={coverPreview} alt="Cover preview" className="w-full h-32 object-cover rounded-xl border-2 border-[#E5E7EB]" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="w-full px-5 py-4 border-2 border-dashed border-[#E5E7EB] rounded-2xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#316EFF] file:text-white hover:file:bg-[#3164DC]"
                      />
                      <p className="mt-2 text-sm text-[#787878]">Max 5MB. Will be cropped to 16:9 ratio.</p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="flex-1 px-8 py-4 bg-[#316EFF] text-white rounded-[20px] hover:scale-105 transition-all disabled:opacity-50 font-medium text-[18px]"
                    >
                      {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : editingEvent ? 'Save Changes' : 'Create Event'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-8 py-4 bg-[#EAEAEA] text-[#242424] rounded-[20px] hover:bg-[#D1D1D1] transition-all font-medium text-[18px]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Create Button */}
            {!isCreating && !editingEvent && (
              <div className="mb-8">
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 px-8 py-4 bg-[#316EFF] text-white rounded-[20px] hover:scale-105 transition-all font-medium text-[18px]"
                >
                  <PlusIcon className="w-6 h-6" />
                  Create New Event
                </button>
              </div>
            )}

            {/* Events List */}
            <div className="bg-[#F9FAFB] rounded-[32px] p-6 md:p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[24px] md:text-[32px] font-bold text-[#242424]">
                  All Events ({events.length})
                </h2>
                <button
                  onClick={() => refetchEvents()}
                  disabled={eventsLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-[#316EFF] text-white rounded-[20px] hover:scale-105 transition-all font-medium disabled:opacity-50"
                >
                  <ArrowPathIcon className={`w-5 h-5 ${eventsLoading ? 'animate-spin' : ''}`} />
                  {eventsLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {eventsLoading ? (
                <div className="text-center py-20">
                  <ArrowPathIcon className="w-16 h-16 mx-auto mb-4 text-[#316EFF] animate-spin" />
                  <p className="text-[18px] text-[#787878]">Loading events...</p>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-20">
                  <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-[#787878]" />
                  <p className="text-[24px] text-[#787878]">No events yet</p>
                  <p className="text-[16px] text-[#969696] mt-2">Create your first event to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-[24px] p-6 border-2 border-[rgba(120,120,120,0.1)] hover:border-[#316EFF] hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Images */}
                        <div className="flex gap-4">
                          {event.logo_url && (
                            <img src={event.logo_url} alt="Logo" className="w-20 h-20 object-cover rounded-xl" />
                          )}
                          {event.cover_image_url && (
                            <img src={event.cover_image_url} alt="Cover" className="w-32 h-20 object-cover rounded-xl" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-[24px] font-bold text-[#242424] mb-1">{event.title}</h3>
                              <p className="text-[14px] text-[#787878]">
                                {new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                {event.location && ` • ${event.location}`}
                                {event.presenter && ` • ${event.presenter}`}
                              </p>
                            </div>
                            <span
                              className={`px-4 py-2 rounded-[12px] text-[14px] font-medium ${
                                event.is_published
                                  ? 'bg-[#E6F9EE] text-[#2F855A]'
                                  : 'bg-[#FFF9E6] text-[#B8860B]'
                              }`}
                            >
                              {event.is_published ? 'Published' : 'Draft'}
                            </span>
                          </div>

                          <p className="text-[16px] text-[#242424] mb-4 line-clamp-2">{event.description}</p>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="flex items-center gap-2 px-6 py-2 bg-[#316EFF] text-white rounded-[12px] hover:scale-105 transition-all text-[14px] font-medium"
                            >
                              <PencilIcon className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setViewingRegistrations(event);
                                refetchRegistrations();
                              }}
                              className="flex items-center gap-2 px-6 py-2 bg-[#E6F4FF] text-[#316EFF] rounded-[12px] hover:scale-105 hover:bg-[#CCE7FF] transition-all text-[14px] font-medium"
                            >
                              <UsersIcon className="w-4 h-4" />
                              View RSVPs
                            </button>
                            <button
                              onClick={() => handleTogglePublish(event)}
                              disabled={publishMutation.isPending || unpublishMutation.isPending}
                              className={`flex items-center gap-2 px-6 py-2 rounded-[12px] hover:scale-105 transition-all text-[14px] font-medium disabled:opacity-50 ${
                                event.is_published
                                  ? 'bg-[#FFF9E6] text-[#B8860B] hover:bg-[#FFE5B4]'
                                  : 'bg-[#E6F9EE] text-[#2F855A] hover:bg-[#C6F6D5]'
                              }`}
                            >
                              {event.is_published ? (
                                <>
                                  <EyeSlashIcon className="w-4 h-4" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <RocketLaunchIcon className="w-4 h-4" />
                                  Publish
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event)}
                              disabled={deleteMutation.isPending}
                              className="flex items-center gap-2 px-6 py-2 bg-[#FFF4F4] text-[#E53E3E] rounded-[12px] hover:scale-105 hover:bg-[#FFE5E5] transition-all text-[14px] font-medium disabled:opacity-50"
                            >
                              <TrashIcon className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Image Crop Modal for Logo */}
      <ImageCropModal
        isOpen={logoCropModalOpen}
        onClose={() => {
          setLogoCropModalOpen(false);
          setLogoImageSrc(null);
        }}
        imageSrc={logoImageSrc}
        onCropComplete={handleLogoCropComplete}
        aspectRatio={1}
      />

      {/* Image Crop Modal for Cover */}
      <ImageCropModal
        isOpen={coverCropModalOpen}
        onClose={() => {
          setCoverCropModalOpen(false);
          setCoverImageSrc(null);
        }}
        imageSrc={coverImageSrc}
        onCropComplete={handleCoverCropComplete}
        aspectRatio={16 / 9}
      />

      {/* Event Registrations Modal */}
      {viewingRegistrations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setViewingRegistrations(null)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-3xl mx-4 max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#316EFF] to-[#4A80FF] px-6 py-5 flex justify-between items-center">
              <div>
                <h2 className="text-white text-[24px] font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Event Registrations
                </h2>
                <p className="text-white text-[14px] opacity-90 mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {viewingRegistrations.title}
                </p>
              </div>
              <button
                onClick={() => setViewingRegistrations(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(80vh-100px)]">
              {/* Stats */}
              <div className="bg-[#F5F8FF] rounded-[16px] p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[14px] text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Total Registrations
                    </p>
                    <p className="text-[32px] font-bold text-[#316EFF]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {registrations.length}
                    </p>
                  </div>
                  <button
                    onClick={() => refetchRegistrations()}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-[#316EFF] rounded-[12px] hover:scale-105 transition-all text-[14px] font-medium shadow-sm"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Registrations List */}
              {registrationsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#316EFF] mx-auto"></div>
                  <p className="text-[#787878] mt-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Loading registrations...
                  </p>
                </div>
              ) : registrations.length === 0 ? (
                <div className="text-center py-12">
                  <UsersIcon className="w-16 h-16 text-[#C4C4C4] mx-auto mb-4" />
                  <p className="text-[#787878] text-[16px]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    No registrations yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {registrations.map((registration, index) => (
                    <div
                      key={registration.id}
                      className="bg-white border-2 border-[#E8E8E8] rounded-[16px] p-4 hover:border-[#316EFF] transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#316EFF] rounded-full flex items-center justify-center text-white font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="text-[18px] font-bold text-[#242424]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                {registration.user_name}
                              </h4>
                              <p className="text-[14px] text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                {registration.user_email}
                              </p>
                            </div>
                          </div>
                          <div className="ml-13 space-y-1">
                            {registration.user_phone && (
                              <p className="text-[14px] text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                📱 {registration.user_phone}
                              </p>
                            )}
                            <p className="text-[14px] text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                              📅 Registered: {new Date(registration.registration_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-[8px] text-[12px] font-medium bg-[#E6F9EE] text-[#2F855A]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {registration.attendance_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-[#F5F8FF] border-t border-[#E8E8E8]">
              <button
                onClick={() => setViewingRegistrations(null)}
                className="w-full px-6 py-3 rounded-[12px] bg-[#316EFF] text-white font-medium hover:scale-105 transition-all text-[16px]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-date-input::-webkit-calendar-picker-indicator {
          cursor: pointer;
          border-radius: 4px;
          padding: 4px;
        }

        .custom-date-input::-webkit-calendar-picker-indicator:hover {
          background-color: rgba(49, 110, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
