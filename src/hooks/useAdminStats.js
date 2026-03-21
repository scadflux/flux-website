import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Admin 통계 데이터를 관리하는 커스텀 훅
 * @returns {Object} 통계 데이터, 로딩 상태, 에러 상태, 새로고침 함수
 */
export const useAdminStats = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    studentCount: 0,
    facultyCount: 0,
    alumniCount: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    pastEvents: 0,
    totalInvites: 0,
    pendingInvites: 0,
    acceptedInvites: 0,
    memberTrends: [], // 최근 가입 추세 데이터
    membersByRole: [], // 역할별 멤버 분포
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 멤버 통계 가져오기
   */
  const fetchMemberStats = async () => {
    try {
      // 전체 멤버 가져오기
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('*');

      if (membersError) throw membersError;

      // 상태별 카운트
      const studentCount = members?.filter(m => m.status === 'student').length || 0;
      const facultyCount = members?.filter(m => m.status === 'faculty').length || 0;
      const alumniCount = members?.filter(m => m.status === 'alumni').length || 0;

      return {
        totalMembers: members?.length || 0,
        studentCount,
        facultyCount,
        alumniCount,
        members: members || [],
      };
    } catch (err) {
      console.error('Error fetching member stats:', err);
      throw err;
    }
  };

  /**
   * 이벤트 통계 가져오기
   */
  const fetchEventStats = async () => {
    try {
      // 이벤트 테이블이 있다면 가져오기
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*');

      if (eventsError && eventsError.code !== 'PGRST116') {
        // PGRST116은 테이블이 없는 경우
        throw eventsError;
      }

      const now = new Date();
      const upcomingEvents = events?.filter(e => new Date(e.date) >= now).length || 0;
      const pastEvents = events?.filter(e => new Date(e.date) < now).length || 0;

      return {
        totalEvents: events?.length || 0,
        upcomingEvents,
        pastEvents,
      };
    } catch (err) {
      console.error('Error fetching event stats:', err);
      // 이벤트 테이블이 없는 경우 기본값 반환
      return {
        totalEvents: 0,
        upcomingEvents: 0,
        pastEvents: 0,
      };
    }
  };

  /**
   * 초대 통계 가져오기
   */
  const fetchInviteStats = async () => {
    try {
      // 초대 테이블이 있다면 가져오기
      const { data: invites, error: invitesError } = await supabase
        .from('invites')
        .select('*');

      if (invitesError && invitesError.code !== 'PGRST116') {
        throw invitesError;
      }

      const pendingInvites = invites?.filter(i => i.status === 'pending').length || 0;
      const acceptedInvites = invites?.filter(i => i.status === 'accepted').length || 0;

      return {
        totalInvites: invites?.length || 0,
        pendingInvites,
        acceptedInvites,
      };
    } catch (err) {
      console.error('Error fetching invite stats:', err);
      return {
        totalInvites: 0,
        pendingInvites: 0,
        acceptedInvites: 0,
      };
    }
  };

  /**
   * 멤버 가입 추세 계산 (최근 6개월)
   */
  const calculateMemberTrends = (members) => {
    const trends = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleDateString('ko-KR', { month: 'short' });

      // created_at 필드가 있다고 가정
      const count = members.filter(m => {
        if (!m.created_at) return false;
        const memberDate = new Date(m.created_at);
        return (
          memberDate.getFullYear() === month.getFullYear() &&
          memberDate.getMonth() === month.getMonth()
        );
      }).length;

      trends.push({
        month: monthName,
        count,
      });
    }

    return trends;
  };

  /**
   * 역할별 멤버 분포 계산
   */
  const calculateMembersByRole = (members) => {
    const roles = {};

    members.forEach(m => {
      const role = m.role || 'Member';
      roles[role] = (roles[role] || 0) + 1;
    });

    return Object.entries(roles).map(([name, value]) => ({
      name,
      value,
    }));
  };

  /**
   * 모든 통계 데이터 가져오기
   */
  const fetchAllStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [memberData, eventData, inviteData] = await Promise.all([
        fetchMemberStats(),
        fetchEventStats(),
        fetchInviteStats(),
      ]);

      const memberTrends = calculateMemberTrends(memberData.members);
      const membersByRole = calculateMembersByRole(memberData.members);

      setStats({
        totalMembers: memberData.totalMembers,
        studentCount: memberData.studentCount,
        facultyCount: memberData.facultyCount,
        alumniCount: memberData.alumniCount,
        totalEvents: eventData.totalEvents,
        upcomingEvents: eventData.upcomingEvents,
        pastEvents: eventData.pastEvents,
        totalInvites: inviteData.totalInvites,
        pendingInvites: inviteData.pendingInvites,
        acceptedInvites: inviteData.acceptedInvites,
        memberTrends,
        membersByRole,
      });
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 통계 새로고침
   */
  const refreshStats = () => {
    fetchAllStats();
  };

  useEffect(() => {
    fetchAllStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats,
  };
};

export default useAdminStats;
