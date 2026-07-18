import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isPlaceholderMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl.includes('placeholder-url');

const realSupabase = createClient(supabaseUrl, supabaseAnonKey);

// SEC-03: Reemplazado require() (CommonJS) por import estático ESM.
// MockSupabase se importa siempre pero solo se instancia en modo placeholder.
import MockSupabaseClass from './mockSupabase';

const supabase = isPlaceholderMode ? new MockSupabaseClass() : realSupabase;

export { supabase };
