
import { useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { UserRole, Profile } from '@/types/database';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const clearAuthState = useCallback(() => {
    setUser(null);
    setSession(null);
    setProfile(null);
    setUserRole(null);
  }, []);

  const setAuthData = useCallback((newSession: Session | null, newUser: User | null) => {
    setSession(newSession);
    setUser(newUser);
  }, []);

  return {
    user,
    session,
    loading,
    profile,
    userRole,
    setUser,
    setSession,
    setLoading,
    setProfile,
    setUserRole,
    clearAuthState,
    setAuthData
  };
}
