import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          const s: Record<string, string> = {};
          data.forEach(item => s[item.id] = item.value);
          setSettings(s);
        }
      } catch (err) {
        console.error('Error fetching site settings:', err);
      } finally {
        setLoading(loading);
        setLoading(false);
      }
    }

    fetchSettings();

    // Subscribe to changes
    const channelId = Math.random().toString(36).substring(7);
    const channel = supabase
      .channel(`site_settings_changes_${channelId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
        fetchSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading };
}
