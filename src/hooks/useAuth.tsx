
import { useEffect, useRef, ReactNode } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { useAuthState } from '@/hooks/auth/useAuthState';
import { useAuthInitialization } from '@/hooks/auth/useAuthInitialization';
import { useAuthStateListener } from '@/hooks/auth/useAuthStateListener';
import { cleanupAuthState } from '@/utils/authUtils';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';

export function AuthProvider({ children }: { children: ReactNode }) {
  const mounted = useRef(true);
  const {
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
    clearAuthState
  } = useAuthState();

  const { 
    fetchUserData, 
    clearUserData 
  } = useUserData(setProfile, setUserRole);

  const { signUp, signIn, updateProfile: updateProfileOperation } = useAuthOperations();

  const { initAuth } = useAuthInitialization({
    mounted,
    setSession,
    setUser,
    setLoading,
    fetchUserData,
    clearUserData
  });

  const { setupAuthListener } = useAuthStateListener({
    mounted,
    setSession,
    setUser,
    fetchUserData,
    clearUserData
  });

  useEffect(() => {
    mounted.current = true;

    // Setup auth listener first
    const subscription = setupAuthListener();
    
    // Then initialize auth
    initAuth();

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      cleanupAuthState();
      await supabase.auth.signOut();
      clearAuthState();
      clearUserData();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
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
