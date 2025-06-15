
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeSubscriptionConfig } from '@/types/dashboard';

export function useRealtimeSubscription(
  configs: RealtimeSubscriptionConfig[],
  dependencies: any[] = []
) {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (configs.length === 0) return;

    // Create unique channel name
    const channelName = `realtime-${Date.now()}-${Math.random()}`;
    
    console.log('Setting up real-time subscriptions:', configs.map(c => c.table));

    // Create channel
    const channel = supabase.channel(channelName);

    // Add all subscriptions to the same channel
    configs.forEach((config) => {
      channel.on(
        'postgres_changes',
        {
          event: config.event,
          schema: 'public',
          table: config.table,
          filter: config.filter,
        },
        (payload) => {
          console.log(`Real-time ${config.table} change:`, payload);
          config.callback(payload);
        }
      );
    });

    // Subscribe and store channel reference
    channel.subscribe((status) => {
      console.log('Subscription status:', status);
    });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        console.log('Cleaning up real-time subscriptions');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, dependencies);

  return channelRef.current;
}
