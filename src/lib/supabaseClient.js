import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isPlaceholderMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl.includes('placeholder-url');

const realSupabase = createClient(supabaseUrl, supabaseAnonKey);

let supabase;

if (isPlaceholderMode && process.env.NODE_ENV === 'development') {
  const MockSupabase = require('./mockSupabase').default;
  supabase = new MockSupabase();
} else {
  supabase = realSupabase;
}

export { supabase };
