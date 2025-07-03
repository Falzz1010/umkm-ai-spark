
import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, Profile } from '@/types/database';

export function useUserData(setProfile?: (profile: Profile | null) => void, setUserRole?: (role: UserRole | null) => void) {
  const [localProfile, setLocalProfile] = useState<Profile | null>(null);
  const [localUserRole, setLocalUserRole] = useState<UserRole | null>(null);

  // Use passed setters if available, otherwise use local state
  const profileSetter = setProfile || setLocalProfile;
  const roleSetter = setUserRole || setLocalUserRole;

  const fetchUserData = async (userId: string, session: Session, retryCount = 0) => {
    try {
      console.log(`fetchUserData: Starting fetch for user ${userId}, retry count: ${retryCount}`);
      
      // Check if we have a valid session before making requests
      if (!session || !session.access_token) {
        console.log('fetchUserData: No valid session, skipping data fetch');
        profileSetter(null);
        roleSetter(null);
        return;
      }
      
      // Fetch profile with timeout and better error handling
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .abortSignal(controller.signal)
          .maybeSingle();

        clearTimeout(timeoutId);

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            console.log('fetchUserData: No profile found, this is normal for new users');
          } else {
            console.error('Error fetching profile:', profileError);
          }
        } else if (profileData) {
          profileSetter(profileData);
          console.log('fetchUserData: Profile found:', profileData);
        } else {
          console.log('fetchUserData: No profile data for user', userId);
        }
      } catch (profileException: any) {
        if (profileException.name === 'AbortError') {
          console.warn('Profile fetch timed out');
        } else {
          console.error('Exception fetching profile:', profileException);
        }
        profileSetter(null);
      }

      // Fetch role with timeout and better error handling
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .abortSignal(controller.signal)
          .maybeSingle();

        clearTimeout(timeoutId);

        if (roleError) {
          // Handle 403 errors specifically
          if (roleError.code === '42501' || roleError.message?.includes('403')) {
            console.warn('Access denied fetching role - user may not have role assigned yet');
            roleSetter(null);
            return;
          }
          
          console.error('Error fetching role:', roleError);
          
          // Only retry on network-related errors and limit retries to 1
          const isNetworkError = 
            roleError.message?.includes('NetworkError') || 
            roleError.message?.includes('Failed to fetch') ||
            roleError.message?.includes('fetch') ||
            roleError.code === '' ||
            roleError.message?.includes('TypeError');
          
          if (isNetworkError && retryCount < 1) {
            const delay = 2000; // 2 seconds delay
            console.warn(`Network error fetching role, retrying in ${delay}ms... (attempt ${retryCount + 1})`);
            
            await new Promise((resolve) => setTimeout(resolve, delay));
            return fetchUserData(userId, session, retryCount + 1);
          } else {
            console.error('Failed to fetch role after retries or non-network error, setting userRole to null');
            roleSetter(null);
          }
        } else if (roleData && roleData.role) {
          roleSetter(roleData.role as UserRole);
          console.log("fetchUserData: userRole found:", roleData.role);
        } else {
          console.log("fetchUserData: No roleData found for user", userId);
          roleSetter(null);
        }
      } catch (roleException: any) {
        if (roleException.name === 'AbortError') {
          console.warn('Role fetch timed out');
          roleSetter(null);
          return;
        }
        
        console.error('Exception fetching role:', roleException);
        
        // Handle 403 specifically in exceptions too
        if (roleException.code === 403 || roleException.message?.includes('403')) {
          console.warn('403 error - user may not have proper permissions');
          roleSetter(null);
          return;
        }
        
        // Only retry on network-related exceptions once
        const isNetworkException = 
          roleException.message?.includes('fetch') || 
          roleException.message?.includes('Network') ||
          roleException.message?.includes('TypeError');
          
        if (isNetworkException && retryCount < 1) {
          const delay = 2000;
          console.warn(`Exception during role fetch, retrying in ${delay}ms... (attempt ${retryCount + 1})`);
          
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchUserData(userId, session, retryCount + 1);
        } else {
          console.error('Failed to fetch role due to exception, setting userRole to null');
          roleSetter(null);
        }
      }
    } catch (error: any) {
      console.error('Error fetching user data (general exception):', error);
      
      // Handle 403 at the top level too
      if (error.code === 403 || error.message?.includes('403')) {
        console.warn('403 error at top level - access denied');
        roleSetter(null);
        profileSetter(null);
        return;
      }
      
      // No retry for general errors - just set to null
      console.error('General error, setting data to null');
      roleSetter(null);
      profileSetter(null);
    }
  };

  const clearUserData = () => {
    profileSetter(null);
    roleSetter(null);
  };

  return {
    profile: localProfile,
    userRole: localUserRole,
    setProfile: profileSetter,
    setUserRole: roleSetter,
    fetchUserData,
    clearUserData
  };
}
