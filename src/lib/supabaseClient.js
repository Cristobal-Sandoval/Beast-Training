import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isPlaceholderMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl.includes('placeholder-url');

const realSupabase = createClient(supabaseUrl, supabaseAnonKey);

// PERF-10: MockSupabase se importa estáticamente pero solo se instancia en modo placeholder.
// En producción con Supabase real configurado, isPlaceholderMode = false y el mock no se usa.
// Para excluir mockSupabase del bundle de producción, se requiere un refactoring más profundo
// (separar en entry points o usar next/dynamic). Actualmente es aceptable para el tamaño del proyecto.
import MockSupabaseClass from './mockSupabase';

const supabase = isPlaceholderMode ? new MockSupabaseClass() : realSupabase;

export { supabase };
