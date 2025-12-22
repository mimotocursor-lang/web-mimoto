const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').join(__dirname, '..', 'frontend', '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 'https://prizpqahcluomioxnmex.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByaXpwcWFoY2x1b21pb3hubWV4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzc5MjE2MiwiZXhwIjoyMDczMzY4MTYyfQ.wDrqbDNCtrNdNQ30RRaR1G6oySFUdLUWt0hb9CcUxbk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function activateProductsWithPrice() {
  console.log('🚀 Activando productos con precio...\n');
  
  try {
    // Obtener todos los productos que tienen precio > 0
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, price, status')
      .gt('price', 0);
    
    if (error) {
      console.error('❌ Error obteniendo productos:', error);
      return;
    }
    
    console.log(`📊 Encontrados ${products.length} productos con precio > 0\n`);
    
    // Activar todos los productos con precio
    const { data: updated, error: updateError } = await supabase
      .from('products')
      .update({ status: 'active' })
      .gt('price', 0)
      .select('id, name, price');
    
    if (updateError) {
      console.error('❌ Error actualizando productos:', updateError);
      return;
    }
    
    console.log(`✅ ${updated.length} productos activados exitosamente\n`);
    
    // Mostrar algunos ejemplos
    if (updated.length > 0) {
      console.log('📦 Primeros 10 productos activados:');
      updated.slice(0, 10).forEach(p => {
        console.log(`   - ${p.name}: $${Number(p.price).toLocaleString('es-CL')}`);
      });
    }
    
    console.log('\n🎉 Proceso completado!');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

activateProductsWithPrice();


