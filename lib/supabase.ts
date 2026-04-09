import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // Check localStorage for manual overrides
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('SUPABASE_URL_OVERRIDE') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('SUPABASE_KEY_OVERRIDE') : null;

  // Provided credentials as final fallback
  const fallbackUrl = "https://rwabptypnzvyjvzuzqde.supabase.co";
  const fallbackKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YWJwdHlwbnp2eWp2enV6cWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU";

  const url = (envUrl && !envUrl.includes('placeholder')) ? envUrl : (localUrl || fallbackUrl);
  const key = (envKey && !envKey.includes('placeholder')) ? envKey : (localKey || fallbackKey);

  return { url, key, isConfigured: url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key' };
};

const config = getSupabaseConfig();

export const isSupabaseConfigured = config.isConfigured;

export const supabase = createClient(config.url, config.key);
