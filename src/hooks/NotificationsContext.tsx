
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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

type NotificationsContextType = {
  notifications: Notification[];
  loading: boolean;
  markAllAsRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      setLoading(false);
      return;
    }
    setNotifications(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    const channelName = `public:notifications:user:${user.id}`;
    // Always ensure only ONE instance of this provider per user
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
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  // Actions
  const markAllAsRead = async () => {
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
    // fetchNotifications triggered by realtime event
  };
  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  };
  const deleteNotification = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        markAllAsRead,
        markAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

// Hook for children to consume context
export function useNotificationsCtx() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotificationsCtx must be used within NotificationsProvider");
  return ctx;
}
