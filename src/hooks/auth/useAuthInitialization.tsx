
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authUtils';

interface UseAuthInitializationProps {
  mounted: React.MutableRefObject<boolean>;
  setSession: (session: any) => void;
  setUser: (user: any) => void;
  setLoading: (loading: boolean) => void;
  fetchUserData: (userId: string, session: any) => Promise<void>;
  clearUserData: () => void;
}

export function useAuthInitialization({
  mounted,
  setSession,
  setUser,
  setLoading,
  fetchUserData,
  clearUserData
}: UseAuthInitializationProps) {
  
  const initAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (!mounted.current) return;
      
      if (error) {
        console.error('Error getting session:', error);
        cleanupAuthState();
        setSession(null);
        setUser(null);
        clearUserData();
      } else if (session && session.user) {
        console.log('Initial session found:', session.user.id);
        setSession(session);
        setUser(session.user);
        
        try {
          await fetchUserData(session.user.id, session);
        } catch (error) {
          console.error('Error fetching user data during init:', error);
        }
      } else {
        console.log('No initial session found');
        setSession(null);
        setUser(null);
        clearUserData();
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      if (mounted.current) {
        cleanupAuthState();
        setSession(null);
        setUser(null);
        clearUserData();
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  return { initAuth };
}
