
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, Profile } from '@/types/database';

export function useUserData() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const fetchUserData = async (userId: string, retryCount = 0) => {
    try {
      console.log(`fetchUserData: Starting fetch for user ${userId}, retry count: ${retryCount}`);
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      } else if (profileData) {
        setProfile(profileData);
        console.log('fetchUserData: Profile found:', profileData);
      }

      // Fetch role with better error handling
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (roleError) {
        console.error('Error fetching role:', roleError);

        // Improved NetworkError detection and retry logic
        const isNetworkError = roleError.message?.includes('NetworkError') || 
                              roleError.message?.includes('Failed to fetch') ||
                              roleError.message?.includes('fetch');
        
        if (isNetworkError && retryCount < 2) {
          console.warn(`Network error fetching role, retrying... (attempt ${retryCount + 1})`);
          await new Promise((res) => setTimeout(res, 1000 * (retryCount + 1))); // Progressive delay
          return fetchUserData(userId, retryCount + 1);
        } else {
          console.error('Failed to fetch role after retries, setting userRole to null');
          setUserRole(null);
        }
      } else if (roleData && roleData.role) {
        setUserRole(roleData.role as UserRole);
        console.log("fetchUserData: userRole found:", roleData.role);
      } else {
        console.warn("fetchUserData: No roleData found for user", userId);
        setUserRole(null);
      }
    } catch (error: any) {
      console.error('Error fetching user data (exception):', error);
      
      // If it's a network error and we haven't exceeded retry limit, try again
      if (retryCount < 2 && (error.message?.includes('fetch') || error.message?.includes('Network'))) {
        console.warn(`Exception during fetch, retrying... (attempt ${retryCount + 1})`);
        await new Promise((res) => setTimeout(res, 1000 * (retryCount + 1)));
        return fetchUserData(userId, retryCount + 1);
      } else {
        setUserRole(null);
      }
    }
  };

  const clearUserData = () => {
    setProfile(null);
    setUserRole(null);
  };

  return {
    profile,
    userRole,
    setProfile,
    setUserRole,
    fetchUserData,
    clearUserData
  };
}
