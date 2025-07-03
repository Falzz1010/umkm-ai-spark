
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';
import { cleanupAuthState } from '@/utils/authUtils';

export function useAuthOperations() {
  const signUp = async (email: string, password: string, fullName: string) => {
    cleanupAuthState();
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { full_name: fullName }
        }
      });
      
      if (error) {
        console.error('SignUp error:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('SignUp exception:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    cleanupAuthState();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('SignIn error:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('SignIn exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('SignOut error:', error);
      }
    } catch (error) {
      console.error('SignOut exception:', error);
    } finally {
      // Force redirect to auth page
      window.location.href = '/auth';
    }
  };

  const updateProfile = async (user: any, profile: Profile | null, setProfile: (profile: Profile | null) => void, data: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) {
        console.error('Update profile error:', error);
        return { error };
      }

      if (profile) {
        setProfile({ ...profile, ...data });
      }

      return { error: null };
    } catch (error) {
      console.error('Update profile exception:', error);
      return { error };
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    updateProfile
  };
}
