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
} else {
  // Log de diagnóstico (solo en desarrollo)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
    console.log('✅ Supabase configurado:', {
      url: supabaseUrl,
      hasKey: !!supabaseAnonKey,
      keyLength: supabaseAnonKey?.length || 0
    });
  }
}

// Crear cliente de Supabase
let supabaseClientInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabaseClientInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        '❌ Supabase no está configurado correctamente. ' +
        'Verifica que PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY estén definidas en tu archivo .env'
      );
    }
    
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      // Configuración adicional para mejor manejo de errores
      global: {
        headers: {
          'x-client-info': 'web-mimoto@1.0.0',
        },
      },
    });
  }
  return supabaseClientInstance;
}

// Función helper para manejar errores de conexión
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    // Intentar una consulta simple para verificar conectividad
    const { error } = await client.from('banners').select('id').limit(1);
    
    if (error) {
      console.error('❌ Error de conexión a Supabase:', error);
      if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
        console.error('🔍 Diagnóstico:');
        console.error('  - El DNS no puede resolver:', supabaseUrl);
        console.error('  - Verifica que la URL de Supabase sea correcta');
        console.error('  - Verifica tu conexión a internet');
        console.error('  - Verifica que el proyecto de Supabase exista en el dashboard');
      }
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('❌ Error inesperado al conectar con Supabase:', err);
    if (err.message?.includes('ENOTFOUND') || err.message?.includes('getaddrinfo')) {
      console.error('🔍 El host de Supabase no se puede resolver. Verifica:');
      console.error('  1. Que la URL en .env sea correcta');
      console.error('  2. Que el proyecto de Supabase exista');
      console.error('  3. Tu conexión a internet');
    }
    return false;
  }
}

export const supabaseClient: SupabaseClient = getSupabaseClient();




