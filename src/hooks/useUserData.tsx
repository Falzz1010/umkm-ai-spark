
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, Profile } from '@/types/database';

export function useUserData() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const fetchUserData = async (userId: string, retryCount = 0) => {
    try {
      console.log(`fetchUserData: Starting fetch for user ${userId}, retry count: ${retryCount}`);
      
      // Fetch profile first
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
      } else {
        console.warn('fetchUserData: No profile found for user', userId);
      }

      // Fetch role with better error handling
      try {
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .maybeSingle();

        if (roleError) {
          console.error('Error fetching role:', roleError);
          
          // Only retry on network-related errors and limit retries to 2
          const isNetworkError = 
            roleError.message?.includes('NetworkError') || 
            roleError.message?.includes('Failed to fetch') ||
            roleError.message?.includes('fetch') ||
            roleError.code === '' ||
            roleError.message?.includes('TypeError');
          
          if (isNetworkError && retryCount < 2) {
            const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s
            console.warn(`Network error fetching role, retrying in ${delay}ms... (attempt ${retryCount + 1})`);
            
            await new Promise((resolve) => setTimeout(resolve, delay));
            return fetchUserData(userId, retryCount + 1);
          } else {
            console.error('Failed to fetch role after retries or non-network error, setting userRole to null');
            setUserRole(null);
          }
        } else if (roleData && roleData.role) {
          setUserRole(roleData.role as UserRole);
          console.log("fetchUserData: userRole found:", roleData.role);
        } else {
          console.warn("fetchUserData: No roleData found for user", userId);
          setUserRole(null);
        }
      } catch (roleException: any) {
        console.error('Exception fetching role:', roleException);
        
        // Only retry on network-related exceptions
        const isNetworkException = 
          roleException.message?.includes('fetch') || 
          roleException.message?.includes('Network') ||
          roleException.message?.includes('TypeError');
          
        if (isNetworkException && retryCount < 2) {
          const delay = Math.pow(2, retryCount) * 1000;
          console.warn(`Exception during role fetch, retrying in ${delay}ms... (attempt ${retryCount + 1})`);
          
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchUserData(userId, retryCount + 1);
        } else {
          console.error('Failed to fetch role due to exception, setting userRole to null');
          setUserRole(null);
        }
      }
    } catch (error: any) {
      console.error('Error fetching user data (general exception):', error);
      
      // Final fallback - only retry once for general errors
      if (retryCount < 1) {
        const delay = 2000;
        console.warn(`General error, retrying in ${delay}ms... (attempt ${retryCount + 1})`);
        
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchUserData(userId, retryCount + 1);
      } else {
        console.error('Failed to fetch user data after final retry');
        setUserRole(null);
        setProfile(null);
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
