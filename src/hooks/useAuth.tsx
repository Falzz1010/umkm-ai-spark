
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
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id || 'no session');
        
        // Handle explicit sign out
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          clearUserData();
          setLoading(false);
          return;
        }

        // Handle valid sessions - only process SIGNED_IN and TOKEN_REFRESHED
        if (session && session.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          setSession(session);
          setUser(session.user);
          
          // Fetch user data with delay to prevent blocking - only if we have a session
          setTimeout(async () => {
            if (mounted && session) {
              try {
                await fetchUserData(session.user.id, session);
              } catch (error) {
                console.error('Error fetching user data after auth:', error);
              }
            }
          }, 100);
        }
        
        // Ignore INITIAL_SESSION events - we handle those separately
        if (event === 'INITIAL_SESSION') {
          console.log('Ignoring INITIAL_SESSION event, will handle with getSession()');
          return;
        }
        
        setLoading(false);
      }
    );

    // Check for existing session on mount
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
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
          
          // Fetch user data only if we have a valid session
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
        if (mounted) {
          cleanupAuthState();
          setSession(null);
          setUser(null);
          clearUserData();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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
