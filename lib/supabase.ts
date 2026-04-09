import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // Check localStorage for manual overrides (useful if environment variables fail)
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('SUPABASE_URL_OVERRIDE') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('SUPABASE_KEY_OVERRIDE') : null;

  const url = envUrl && !envUrl.includes('placeholder') ? envUrl : (localUrl || 'https://placeholder.supabase.co');
  const key = envKey && !envKey.includes('placeholder') ? envKey : (localKey || 'placeholder-key');

  return { url, key, isConfigured: url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key' };
};

const config = getSupabaseConfig();

export const isSupabaseConfigured = config.isConfigured;

export const supabase = createClient(config.url, config.key);
