import { useState, useEffect } from 'react';
import {
  getCurrentUser,
  signInWithGoogle,
  signOut,
  onAuthStateChange,
  getMemberProfileByUserId,
} from '../services/authService';

/**
 * 인증 상태를 관리하는 커스텀 훅
 * @returns {Object} 인증 관련 상태 및 함수들
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * 사용자 프로필 로드
   */
  const loadUserProfile = async (userId) => {
    try {
      const { profile: memberProfile, error: profileError } =
        await getMemberProfileByUserId(userId);

      if (profileError) {
        console.error('Error loading user profile:', profileError);
        setProfile(null);
        return;
      }

      setProfile(memberProfile);
    } catch (err) {
      console.error('Unexpected error loading profile:', err);
      setProfile(null);
    }
  };

  /**
   * 현재 사용자 정보 로드
   */
  const loadUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const { user: currentUser, error: userError } = await getCurrentUser();

      if (userError) {
        console.error('Error loading user:', userError);
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
        setError(userError);
        return;
      }

      setUser(currentUser);
      setIsAuthenticated(!!currentUser);

      // 사용자가 있으면 프로필 로드
      if (currentUser) {
        await loadUserProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Unexpected error loading user:', err);
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Google OAuth 로그인 처리
   */
  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await signInWithGoogle();

      if (signInError) {
        console.error('Sign in error:', signInError);
        setError(signInError);
        return { success: false, error: signInError };
      }

      // OAuth 리디렉션이므로 여기서는 성공만 반환
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected sign in error:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 로그아웃 처리
   */
  const handleSignOut = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error: signOutError } = await signOut();

      if (signOutError) {
        console.error('Sign out error:', signOutError);
        setError(signOutError);
        return { success: false, error: signOutError };
      }

      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);

      return { success: true };
    } catch (err) {
      console.error('Unexpected sign out error:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 초기 사용자 로드 및 인증 상태 리스너 설정
   */
  useEffect(() => {
    // 초기 사용자 로드
    loadUser();

    // 인증 상태 변경 리스너
    const { data: authListener } = onAuthStateChange(
      async (event, session, authError) => {
        console.log('Auth state change event:', event);

        if (authError) {
          console.error('Auth state change error:', authError);
          setError(authError);
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          await loadUserProfile(session.user.id);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
        }
      }
    );

    // 클린업: 리스너 구독 해제
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated,
    signIn: handleSignIn,
    signOut: handleSignOut,
    refreshUser: loadUser,
  };
};

export default useAuth;
