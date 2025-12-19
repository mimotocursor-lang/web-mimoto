import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Obtener variables de entorno con fallbacks seguros
function getSupabaseUrl(): string {
  // Intentar desde import.meta.env primero (tiempo de compilación)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_SUPABASE_URL) {
    return import.meta.env.PUBLIC_SUPABASE_URL;
  }
  // Fallback para entornos donde import.meta no está disponible
  if (typeof window !== 'undefined' && (window as any).PUBLIC_SUPABASE_URL) {
    return (window as any).PUBLIC_SUPABASE_URL;
  }
  // Fallback a valores por defecto del proyecto
  return 'https://prizpqahcluomioxnmex.supabase.co';
}

function getSupabaseAnonKey(): string {
  // Intentar desde import.meta.env primero (tiempo de compilación)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_SUPABASE_ANON_KEY) {
    return import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  }
  // Fallback para entornos donde import.meta no está disponible
  if (typeof window !== 'undefined' && (window as any).PUBLIC_SUPABASE_ANON_KEY) {
    return (window as any).PUBLIC_SUPABASE_ANON_KEY;
  }
  // Fallback a valores por defecto del proyecto
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByaXpwcWFoY2x1b21pb3hubWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3OTIxNjIsImV4cCI6MjA3MzM2ODE2Mn0.7qJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq';
}

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

// Validar que las variables estén disponibles
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas');
  console.error('PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Configurada' : 'Faltante');
  console.error('PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Configurada' : 'Faltante');
}

// Crear cliente de Supabase
let supabaseClientInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabaseClientInstance) {
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClientInstance;
}

export const supabaseClient: SupabaseClient = getSupabaseClient();




