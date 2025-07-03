
import { supabase } from '@/integrations/supabase/client';

interface UseAuthStateListenerProps {
  mounted: React.MutableRefObject<boolean>;
  setSession: (session: any) => void;
  setUser: (user: any) => void;
  fetchUserData: (userId: string, session: any) => Promise<void>;
  clearUserData: () => void;
}

export function useAuthStateListener({
  mounted,
  setSession,
  setUser,
  fetchUserData,
  clearUserData
}: UseAuthStateListenerProps) {
  
  const setupAuthListener = () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted.current) return;
        
        console.log('Auth state changed:', event, session?.user?.id || 'no session');
        
        // Handle explicit sign out
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          clearUserData();
          return;
        }

        // Handle valid sessions - only process SIGNED_IN and TOKEN_REFRESHED
        if (session && session.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          setSession(session);
          setUser(session.user);
          
          // Fetch user data with delay to prevent blocking and only if session is valid
          if (session.access_token) {
            setTimeout(async () => {
              if (mounted.current && session) {
                try {
                  await fetchUserData(session.user.id, session);
                } catch (error) {
                  console.error('Error fetching user data after auth:', error);
                  // Don't clear user data on fetch error, just log it
                }
              }
            }, 500); // Increased delay to 500ms
          }
        }
        
        // Ignore INITIAL_SESSION events since we handle those separately
        if (event === 'INITIAL_SESSION') {
          console.log('Ignoring INITIAL_SESSION event, already handled in initAuth');
          return;
        }
      }
    );

    return subscription;
  };

  return { setupAuthListener };
}
