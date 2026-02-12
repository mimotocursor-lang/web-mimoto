/**
 * Script de verificación de conexión a Supabase
 * Ejecuta: node verificar-supabase.js
 * 
 * Requiere: npm install dotenv @supabase/supabase-js
 */

const { createClient } = require('@supabase/supabase-js');
const { config } = require('dotenv');
const path = require('path');

// Cargar variables de entorno
config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 'https://prizpqahcluomioxnmex.supabase.co';
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY || '';

console.log('🔍 Verificando conexión a Supabase...\n');
console.log('URL:', supabaseUrl);
console.log('Tiene clave:', !!supabaseAnonKey);
console.log('Longitud de clave:', supabaseAnonKey?.length || 0);
console.log('');

// Verificar que las variables estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Variables de entorno no configuradas');
  console.error('Crea un archivo .env en frontend/ con:');
  console.error('PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co');
  console.error('PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon');
  process.exit(1);
}

// Crear cliente
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Probar conexión
async function testConnection() {
  try {
    console.log('📡 Probando conexión a Supabase...');
    
    // Intentar una consulta simple
    const { data, error } = await supabase
      .from('banners')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Error de conexión:', error.message);
      
      if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
        console.error('\n🔍 Diagnóstico:');
        console.error('  - El DNS no puede resolver:', supabaseUrl);
        console.error('  - Posibles causas:');
        console.error('    1. La URL de Supabase es incorrecta');
        console.error('    2. El proyecto de Supabase fue eliminado');
        console.error('    3. Problemas de conexión a internet');
        console.error('    4. Problemas con el DNS local');
        console.error('\n💡 Soluciones:');
        console.error('  1. Verifica en https://supabase.com/dashboard que el proyecto existe');
        console.error('  2. Copia la URL correcta desde Settings → API');
        console.error('  3. Actualiza PUBLIC_SUPABASE_URL en tu archivo .env');
        console.error('  4. Reinicia el servidor después de cambiar .env');
      } else {
        console.error('\n💡 El error puede ser por:');
        console.error('  - Clave API incorrecta');
        console.error('  - Permisos insuficientes');
        console.error('  - Tabla no existe');
      }
      
      process.exit(1);
    }
    
    console.log('✅ Conexión exitosa a Supabase!');
    console.log('   Se pudo consultar la base de datos correctamente.');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('  1. Si el servidor está corriendo, reinícialo');
    console.log('  2. Verifica que no haya errores en la consola del navegador');
    console.log('  3. Si persisten los errores, verifica los logs del servidor');
    
  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    
    if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.error('\n🔍 Error de DNS: No se puede resolver el host');
      console.error('  Verifica que la URL de Supabase sea correcta');
    }
    
    process.exit(1);
  }
}

testConnection();

