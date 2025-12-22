/**
 * Helper para crear cliente de Supabase en scripts del cliente
 * Esto evita problemas con imports en producción
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function createSupabaseClient(): SupabaseClient {
  const supabaseUrl = 
    import.meta.env.PUBLIC_SUPABASE_URL || 
    (typeof window !== 'undefined' ? (window as any).PUBLIC_SUPABASE_URL : '') ||
    'https://prizpqahcluomioxnmex.supabase.co';
    
  const supabaseAnonKey = 
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 
    (typeof window !== 'undefined' ? (window as any).PUBLIC_SUPABASE_ANON_KEY : '') ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByaXpwcWFoY2x1b21pb3hubWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3OTIxNjIsImV4cCI6MjA3MzM2ODE2Mn0.7qJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq';

  return createClient(supabaseUrl, supabaseAnonKey);
}


