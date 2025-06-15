
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Business {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface BusinessMember {
  id: string;
  business_id: string;
  user_id: string;
  role: "owner" | "admin" | "staff";
  status: "active" | "invited" | "removed";
  created_at: string;
  user_profile?: {
    full_name: string;
    email?: string;
  };
}

export function useBusinessTeam() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [members, setMembers] = useState<BusinessMember[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch businesses you own or are a member of
  const fetchBusinesses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("business_members")
      .select("businesses:business_id(id,name,owner_id,created_at)")
      .eq("user_id", user.id)
      .eq("status", "active");
    if (!error && data) {
      setBusinesses(data.map((row: any) => row.businesses));
    }
    setLoading(false);
  }, [user]);

  // Fetch team members for a business (by business_id)
  const fetchTeam = useCallback(async (business_id: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("business_members")
      .select("*, profiles:user_id(full_name)")
      .eq("business_id", business_id)
      .neq("status", "removed");
    if (!error && data) {
      setMembers(
        data.map((m: any) => ({
          ...m,
          user_profile: { full_name: m?.profiles?.full_name || "" },
        }))
      );
    }
    setLoading(false);
  }, []);

  // Create a new business
  const createBusiness = useCallback(async (name: string) => {
    if (!user) return { error: "Not logged in" };
    setLoading(true);
    const { data, error } = await supabase
      .from("businesses")
      .insert({ name, owner_id: user.id })
      .select()
      .single();
    setLoading(false);
    if (!error && data) {
      // Add owner as a member (role: owner)
      await supabase.from("business_members").insert({
        business_id: data.id,
        user_id: user.id,
        role: "owner",
        status: "active",
      });
      return { data };
    }
    return { error };
  }, [user]);

  // Invite a member (by user_id, with role)
  const inviteMember = useCallback(
    async (business_id: string, new_user_id: string, role: "admin" | "staff") => {
      setLoading(true);
      const { error } = await supabase.from("business_members").insert({
        business_id,
        user_id: new_user_id,
        role,
        status: "invited",
      });
      setLoading(false);
      return { error };
    },
    []
  );

  // Update member role/status
  const updateMember = useCallback(
    async (
      business_id: string,
      member_id: string,
      payload: Partial<Pick<BusinessMember, "role" | "status">>
    ) => {
      setLoading(true);
      const { error } = await supabase
        .from("business_members")
        .update(payload)
        .eq("id", member_id)
        .eq("business_id", business_id);
      setLoading(false);
      return { error };
    },
    []
  );

  // Remove member (set status to removed)
  const removeMember = useCallback(async (business_id: string, member_id: string) => {
    return updateMember(business_id, member_id, { status: "removed" });
  }, [updateMember]);

  return {
    businesses,
    members,
    loading,
    fetchBusinesses,
    fetchTeam,
    createBusiness,
    inviteMember,
    updateMember,
    removeMember,
  };
}
