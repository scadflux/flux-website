import { useQuery } from '@tanstack/react-query';
import { fetchMembers, fetchApplications } from '../../services/members';
import { fetchAllEvents, fetchEventRegistrations } from '../../services/events';
import {
  UserGroupIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function AnalyticsDashboard() {
  // Fetch data
  const { data: members = [] } = useQuery({
    queryKey: ['members'],
    queryFn: () => fetchMembers(),
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['all-applications'],
    queryFn: () => fetchApplications('all'),
  });

  const { data: events = [] } = useQuery({
    queryKey: ['all-events-analytics'],
    queryFn: () => fetchAllEvents(),
  });

  // Calculate metrics
  const stats = {
    totalMembers: members.length,
    alumniCount: members.filter(m => m.is_alumni).length,
    activeMembers: members.filter(m => m.is_active).length,

    pendingApplications: applications.filter(a => a.status === 'pending').length,
    approvedApplications: applications.filter(a => a.status === 'approved').length,
    rejectedApplications: applications.filter(a => a.status === 'rejected').length,
    approvalRate: applications.length > 0
      ? ((applications.filter(a => a.status === 'approved').length / applications.length) * 100).toFixed(1)
      : 0,

    totalEvents: events.length,
    upcomingEvents: events.filter(e => new Date(e.event_date) > new Date()).length,
    pastEvents: events.filter(e => new Date(e.event_date) <= new Date()).length,
    publishedEvents: events.filter(e => e.is_published).length,
  };

  // Get this month's data
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const thisMonthStats = {
    newMembers: members.filter(m => new Date(m.created_at) >= thisMonth).length,
    newApplications: applications.filter(a => new Date(a.created_at) >= thisMonth).length,
    newEvents: events.filter(e => new Date(e.created_at) >= thisMonth).length,
  };

  // Member distribution
  const membersByYear = members.reduce((acc, member) => {
    const year = member.year || 'Unknown';
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const membersByCampus = members.reduce((acc, member) => {
    const campus = member.campus || 'Unknown';
    acc[campus] = (acc[campus] || 0) + 1;
    return acc;
  }, {});

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
    };

    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Space Grotesk' }}>
              {title}
            </p>
            <p className="text-3xl font-bold mt-2" style={{ fontFamily: 'Space Grotesk' }}>
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Space Grotesk' }}>
                {subtitle}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
          Analytics Dashboard
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Space Grotesk' }}>
          Overview of your FLUX community
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={UserGroupIcon}
          title="Total Members"
          value={stats.totalMembers}
          subtitle={`+${thisMonthStats.newMembers} this month`}
          color="blue"
        />
        <StatCard
          icon={ClipboardDocumentCheckIcon}
          title="Pending Applications"
          value={stats.pendingApplications}
          subtitle={`${stats.approvalRate}% approval rate`}
          color="orange"
        />
        <StatCard
          icon={CalendarIcon}
          title="Upcoming Events"
          value={stats.upcomingEvents}
          subtitle={`${stats.totalEvents} total events`}
          color="purple"
        />
        <StatCard
          icon={ChartBarIcon}
          title="Active Members"
          value={stats.activeMembers}
          subtitle={`${stats.alumniCount} alumni`}
          color="green"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Distribution */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
            Members by Year
          </h3>
          <div className="space-y-3">
            {Object.entries(membersByYear).map(([year, count]) => (
              <div key={year} className="flex items-center justify-between">
                <span className="text-gray-700" style={{ fontFamily: 'Space Grotesk' }}>
                  {year}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full w-32">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${(count / stats.totalMembers) * 100}%` }}
                    />
                  </div>
                  <span className="font-bold text-sm w-8 text-right" style={{ fontFamily: 'Space Grotesk' }}>
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Distribution */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
            Members by Campus
          </h3>
          <div className="space-y-3">
            {Object.entries(membersByCampus).map(([campus, count]) => (
              <div key={campus} className="flex items-center justify-between">
                <span className="text-gray-700" style={{ fontFamily: 'Space Grotesk' }}>
                  {campus}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full w-32">
                    <div
                      className="h-2 bg-purple-500 rounded-full"
                      style={{ width: `${(count / stats.totalMembers) * 100}%` }}
                    />
                  </div>
                  <span className="font-bold text-sm w-8 text-right" style={{ fontFamily: 'Space Grotesk' }}>
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Status Breakdown */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
          Application Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <p className="text-3xl font-bold text-yellow-600" style={{ fontFamily: 'Space Grotesk' }}>
              {stats.pendingApplications}
            </p>
            <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Space Grotesk' }}>
              Pending
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-3xl font-bold text-green-600" style={{ fontFamily: 'Space Grotesk' }}>
              {stats.approvedApplications}
            </p>
            <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Space Grotesk' }}>
              Approved
            </p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <p className="text-3xl font-bold text-red-600" style={{ fontFamily: 'Space Grotesk' }}>
              {stats.rejectedApplications}
            </p>
            <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Space Grotesk' }}>
              Rejected
            </p>
          </div>
        </div>
      </div>

      {/* Event Statistics */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
          Event Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600" style={{ fontFamily: 'Space Grotesk' }}>
              {stats.totalEvents}
            </p>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Space Grotesk' }}>Total Events</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Space Grotesk' }}>
              {stats.upcomingEvents}
            </p>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Space Grotesk' }}>Upcoming</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600" style={{ fontFamily: 'Space Grotesk' }}>
              {stats.pastEvents}
            </p>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Space Grotesk' }}>Past</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600" style={{ fontFamily: 'Space Grotesk' }}>
              {stats.publishedEvents}
            </p>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Space Grotesk' }}>Published</p>
          </div>
        </div>
      </div>
    </div>
  );
}
