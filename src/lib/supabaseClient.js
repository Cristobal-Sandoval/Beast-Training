import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isPlaceholderMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl.includes('placeholder-url');

const realSupabase = createClient(supabaseUrl, supabaseAnonKey);

// SEC: el mock es solo para desarrollo local (sin secretos reales).
// En producción sin env vars, fallar fuerte en vez de levantar auth simulada.
import MockSupabaseClass from './mockSupabase';

let supabase;
if (isPlaceholderMode) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY en producción. ' +
      'El modo mock está prohibido fuera de desarrollo.'
    );
  }
  supabase = new MockSupabaseClass();
} else {
  supabase = realSupabase;
}

export { supabase };
