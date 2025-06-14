
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifikasi
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Gagal mengambil notifikasi:", error);
      setLoading(false);
      return;
    }
    setNotifications(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    // UNIQUE channel name per user session to avoid double subscribe
    const channelName = `public:notifications:user:${user.id}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Update notifications on any change
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      // Clean up channel when the component unmounts or user changes
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  // Action: Tandai semua dibaca
  const markAllAsRead = async () => {
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
    // fetchNotifications() akan otomatis dipanggil via realtime
  };
  // Action: Tandai satu dibaca
  const markAsRead = async (id: string) => {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);
  };
  // Action: Hapus
  const deleteNotification = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
  };

  return {
    notifications,
    loading,
    markAllAsRead,
    markAsRead,
    deleteNotification,
  };
}
