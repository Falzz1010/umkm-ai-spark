import { useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { cleanupAuthState } from '@/utils/authUtils';
import { Profile } from '@/types/database';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const { 
    profile, 
    userRole, 
    setProfile, 
    setUserRole, 
    fetchUserData, 
    clearUserData 
  } = useUserData();

  const { signUp, signIn, updateProfile: updateProfileOperation } = useAuthOperations();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_OUT' || !session) {
          setSession(null);
          setUser(null);
          clearUserData();
          setLoading(false);
          return;
        }

        if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
          setSession(session);
          setUser(session.user);
          
          // Fetch user data deferred to avoid blocking auth state update
          setTimeout(async () => {
            try {
              await fetchUserData(session.user.id);
            } catch (error) {
              console.error('Error fetching user data after auth:', error);
            }
          }, 0);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          // If there's an error getting session, clean up and reset state
          cleanupAuthState();
          setSession(null);
          setUser(null);
          clearUserData();
        } else if (session) {
          setSession(session);
          setUser(session.user);
          await fetchUserData(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        cleanupAuthState();
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => subscription.unsubscribe();
  }, [fetchUserData, clearUserData]);

  const signOut = async () => {
    try {
      setLoading(true);
      cleanupAuthState();
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      clearUserData();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
      // Force redirect to auth page
      window.location.href = '/auth';
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    return updateProfileOperation(user, profile, setProfile, data);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      userRole,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export { useAuth } from '@/contexts/AuthContext';
