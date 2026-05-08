/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const effectiveUrl = isValidUrl(supabaseUrl) ? supabaseUrl! : 'https://placeholder.supabase.co';
const effectiveKey = supabaseAnonKey || 'placeholder';

export const isConfigured = isValidUrl(supabaseUrl) && !!supabaseAnonKey;

if (!isConfigured) {
  console.warn('Supabase credentials missing or invalid. Auth features will be disabled.');
}

export const supabase = createClient(effectiveUrl, effectiveKey);
