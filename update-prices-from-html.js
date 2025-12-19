const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Intentar cargar variables de entorno desde múltiples ubicaciones
const envPaths = [
  path.join(__dirname, 'frontend', '.env.local'),
  path.join(__dirname, 'frontend', '.env'),
  path.join(__dirname, '.env.local'),
  path.join(__dirname, '.env')
];

let envLoaded = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log(`📁 Cargando variables de entorno desde: ${envPath}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.log('⚠️  No se encontró archivo .env, usando valores por defecto o variables del sistema');
}

// Configurar Supabase con valores por defecto si están disponibles
// Ignorar valores vacíos del .env
const getEnvVar = (keys, defaultValue) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim() !== '') {
      return value;
    }
  }
  return defaultValue;
};

const supabaseUrl = getEnvVar(
  ['PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL', 'SUPABASE_URL'],
  'https://prizpqahcluomioxnmex.supabase.co'
);

// Intentar obtener service_role_key primero, luego anon_key como fallback
const supabaseKey = getEnvVar(
  ['SUPABASE_SERVICE_ROLE_KEY', 'VITE_SUPABASE_SERVICE_ROLE_KEY'],
  getEnvVar(
    ['PUBLIC_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY'],
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByaXpwcWFoY2x1b21pb3hubWV4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzc5MjE2MiwiZXhwIjoyMDczMzY4MTYyfQ.wDrqbDNCtrNdNQ30RRaR1G6oySFUdLUWt0hb9CcUxbk'
  )
);

console.log(`\n🔧 Configuración de Supabase:`);
console.log(`   URL encontrada: ${supabaseUrl ? 'Sí' : 'No'} (${supabaseUrl ? supabaseUrl.substring(0, 40) + '...' : 'undefined'})`);
console.log(`   Key encontrada: ${supabaseKey ? 'Sí' : 'No'} (${supabaseKey ? supabaseKey.substring(0, 40) + '...' : 'undefined'})\n`);

// Verificar que los valores no estén vacíos
if (!supabaseUrl || supabaseUrl.trim() === '' || !supabaseKey || supabaseKey.trim() === '') {
  console.error('❌ Error: Faltan variables de entorno de Supabase');
  console.error('Necesitas: PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPuedes crear un archivo .env en la raíz o en frontend/.env.local con:');
  console.error('PUBLIC_SUPABASE_URL=tu_url_aqui');
  console.error('SUPABASE_SERVICE_ROLE_KEY=tu_key_aqui\n');
  console.error('Valores actuales:');
  console.error(`  supabaseUrl: "${supabaseUrl}"`);
  console.error(`  supabaseKey: "${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined'}"`);
  process.exit(1);
}

console.log(`✅ Supabase URL: ${supabaseUrl}`);
console.log(`✅ Service Role Key: ${supabaseKey.substring(0, 20)}...`);
if (!process.env.PUBLIC_SUPABASE_URL && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('⚠️  Usando valores por defecto del proyecto\n');
} else {
  console.log('');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Función para convertir número chileno a número
// Formato chileno: punto como separador de miles, coma como decimal (ej: "22.990" o "22.990,00")
function parseChileanNumber(str) {
  if (!str || str.trim() === '') return 0;
  
  let cleaned = str.trim();
  
  // Si tiene coma, es porque tiene decimales
  // Ejemplo: "22.990,00" -> remover punto de miles, mantener coma como decimal
  if (cleaned.includes(',')) {
    // Remover todos los puntos (separadores de miles)
    cleaned = cleaned.replace(/\./g, '');
    // Reemplazar coma por punto para parseFloat
    cleaned = cleaned.replace(',', '.');
  } else {
    // No tiene coma, solo puntos como separadores de miles
    // Ejemplo: "22.990" -> remover todos los puntos
    cleaned = cleaned.replace(/\./g, '');
  }
  
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Función para parsear un archivo HTML
function parseHTMLFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const products = [];
  
  // Extraer todos los divs con sus posiciones y contenido
  const allDivs = [];
  
  // Buscar todos los divs con style que contenga top y left
  // Necesitamos capturar el left que está en el mismo style que el top
  // Patrón mejorado: captura el style completo y luego extrae top y left
  const divPattern = /<div[^>]*style="([^"]*)"[^>]*>[\s\S]*?<span[^>]*>([^<]*)<\/span>/gi;
  let match;
  
  while ((match = divPattern.exec(content)) !== null) {
    const style = match[1];
    let text = match[2] || '';
    
    // Extraer top y left del style
    const topMatch = style.match(/top:\s*(\d+)px/);
    const leftMatch = style.match(/left:\s*(\d+)px/);
    
    if (!topMatch || !leftMatch) continue;
    
    const top = parseInt(topMatch[1]);
    const left = parseInt(leftMatch[1]);
    
    // Limpiar el texto
    text = text.trim()
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^\s+|\s+$/g, '');
    
    // Solo procesar filas de datos (no encabezados que están en top:64)
    // Y solo si tiene texto
    if (top > 64 && text && text.length > 0) {
      allDivs.push({ top, left, text });
    }
  }
  
  // Agrupar divs por posición top (cada fila tiene el mismo top)
  const rowsByTop = {};
  allDivs.forEach(div => {
    if (!rowsByTop[div.top]) {
      rowsByTop[div.top] = [];
    }
    rowsByTop[div.top].push(div);
  });
  
  // Procesar cada fila
  Object.keys(rowsByTop).sort((a, b) => parseInt(a) - parseInt(b)).forEach(top => {
    const divs = rowsByTop[top];
    
    // Identificar cada campo por su posición left
    let codigo = '';
    let descripcion = '';
    let stock = '';
    let precioVenta = ''; // Precio Bruto (precio de venta)
    
    divs.forEach(div => {
      const left = div.left;
      // Código: left entre 0-10 (puede ser 0 o 6)
      if (left >= 0 && left <= 10) {
        codigo = div.text;
      }
      // Descripción: left entre 103-110
      else if (left >= 103 && left <= 110) {
        descripcion = div.text;
      }
      // Stock: left entre 434-440
      else if (left >= 434 && left <= 440) {
        stock = div.text;
      }
      // Precio Bruto (precio de venta): left entre 696-705
      else if (left >= 696 && left <= 705) {
        precioVenta = div.text;
      }
    });
    
    // Solo agregar si tiene código y descripción (es una fila válida)
    // Excluir encabezados y filas vacías
    if (codigo && descripcion && 
        codigo !== 'Código' && 
        descripcion !== 'Descripción' &&
        codigo.trim().length > 0 &&
        descripcion.trim().length > 0) {
      
      // Limpiar y convertir valores
      const stockValue = parseChileanNumber(stock);
      const precioVentaValue = parseChileanNumber(precioVenta);
      
      // Solo agregar productos con stock > 0 (excluir 0 y negativos)
      // Redondear stock a entero (puede venir como decimal del HTML)
      const stockInt = Math.floor(stockValue);
      if (stockInt > 0 && precioVentaValue > 0) {
        products.push({
          codigo: codigo.trim(),
          descripcion: descripcion.trim(),
          stock: stockInt,
          precioNeto: precioVentaValue // Precio de venta (Precio Bruto)
        });
      }
    }
  });
  
  return products;
}

// Función para normalizar texto para matching
function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Función para generar slug único desde texto
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100); // Limitar longitud
}

// Función para hacer match de productos
function matchProduct(htmlProduct, dbProducts) {
  const htmlCodeNormalized = normalizeText(htmlProduct.codigo);
  const htmlNameNormalized = normalizeText(htmlProduct.descripcion);
  
  // 1. Match por SKU exacto (normalizado)
  const matchBySku = dbProducts.find(p => {
    if (!p.sku) return false;
    return normalizeText(p.sku) === htmlCodeNormalized;
  });
  
  if (matchBySku) {
    return { product: matchBySku, method: 'sku' };
  }
  
  // 2. Match por código en el nombre del producto
  const matchByCodeInName = dbProducts.find(p => {
    const dbNameNormalized = normalizeText(p.name);
    // Si el código HTML está en el nombre del producto DB
    return dbNameNormalized.includes(htmlCodeNormalized) && 
           htmlCodeNormalized.length > 3; // Solo si el código tiene más de 3 caracteres
  });
  
  if (matchByCodeInName) {
    return { product: matchByCodeInName, method: 'code-in-name' };
  }
  
  // 3. Match por nombre exacto (normalizado)
  const matchByNameExact = dbProducts.find(p => {
    const dbNameNormalized = normalizeText(p.name);
    return dbNameNormalized === htmlNameNormalized;
  });
  
  if (matchByNameExact) {
    return { product: matchByNameExact, method: 'name-exact' };
  }
  
  // 4. Match por nombre parcial (si uno contiene al otro y tienen al menos 5 caracteres en común)
  const matchByNamePartial = dbProducts.find(p => {
    const dbNameNormalized = normalizeText(p.name);
    // Calcular palabras comunes
    const htmlWords = htmlNameNormalized.split(/\s+/).filter(w => w.length > 2);
    const dbWords = dbNameNormalized.split(/\s+/).filter(w => w.length > 2);
    
    const commonWords = htmlWords.filter(w => dbWords.includes(w));
    
    // Si tienen al menos 2 palabras en común o una palabra larga en común
    return commonWords.length >= 2 || 
           (commonWords.length === 1 && commonWords[0].length >= 6);
  });
  
  if (matchByNamePartial) {
    return { product: matchByNamePartial, method: 'name-partial' };
  }
  
  return null;
}

// Función principal
async function main() {
  console.log('🚀 Iniciando actualización de precios desde archivos HTML...\n');
  
  // 1. Leer todos los archivos HTML
  const htmlDir = path.join(__dirname, 'listapreciomimoto');
  const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));
  
  console.log(`📁 Encontrados ${files.length} archivos HTML\n`);
  
  // 2. Parsear todos los archivos
  let allProducts = [];
  for (const file of files) {
    const filePath = path.join(htmlDir, file);
    console.log(`📄 Procesando ${file}...`);
    try {
      const products = parseHTMLFile(filePath);
      allProducts = allProducts.concat(products);
      console.log(`   ✓ ${products.length} productos con stock > 0 encontrados`);
    } catch (error) {
      console.error(`   ❌ Error procesando ${file}:`, error.message);
    }
  }
  
  console.log(`\n✅ Total de productos con stock > 0: ${allProducts.length}\n`);
  
  // 3. Eliminar duplicados (mismo código)
  const uniqueProducts = [];
  const seenCodes = new Set();
  
  for (const product of allProducts) {
    const codeKey = normalizeText(product.codigo);
    if (!seenCodes.has(codeKey)) {
      seenCodes.add(codeKey);
      uniqueProducts.push(product);
    }
  }
  
  console.log(`📊 Productos únicos (sin duplicados): ${uniqueProducts.length}\n`);
  
  // 4. Obtener todos los productos de la base de datos
  console.log('🔍 Obteniendo productos de la base de datos...');
  const { data: dbProducts, error: dbError } = await supabase
    .from('products')
    .select('id, name, sku, price, stock')
    .eq('status', 'active');
  
  if (dbError) {
    console.error('❌ Error obteniendo productos:', dbError);
    process.exit(1);
  }
  
  console.log(`✅ ${dbProducts.length} productos encontrados en la base de datos\n`);
  
  // 5. Hacer match y actualizar precios
  console.log('🔄 Haciendo match y actualizando precios...\n');
  
  let matched = 0;
  let updated = 0;
  let notFound = 0;
  let noChange = 0;
  const updates = [];
  const notFoundList = [];
  
  for (const htmlProduct of uniqueProducts) {
    const matchResult = matchProduct(htmlProduct, dbProducts);
    
    if (matchResult) {
      matched++;
      const matchedProduct = matchResult.product;
      
      // Solo actualizar si el precio es diferente (con tolerancia de 0.01 para redondeos)
      const priceDiff = Math.abs(matchedProduct.price - htmlProduct.precioNeto);
      if (priceDiff > 0.01) {
        updates.push({
          id: matchedProduct.id,
          name: matchedProduct.name,
          sku: matchedProduct.sku || 'N/A',
          oldPrice: matchedProduct.price,
          newPrice: htmlProduct.precioNeto,
          stock: htmlProduct.stock,
          codigo: htmlProduct.codigo,
          method: matchResult.method
        });
      } else {
        noChange++;
      }
    } else {
      notFound++;
      notFoundList.push({
        codigo: htmlProduct.codigo,
        descripcion: htmlProduct.descripcion,
        precio: htmlProduct.precioNeto,
        stock: htmlProduct.stock
      });
    }
  }
  
  console.log(`\n📊 Resumen de matching:`);
  console.log(`   ✓ Match encontrados: ${matched}`);
  console.log(`   🔄 A actualizar: ${updates.length}`);
  console.log(`   ➖ Sin cambios: ${noChange}`);
  console.log(`   ⚠️  No encontrados: ${notFound}\n`);
  
  if (notFoundList.length > 0 && notFoundList.length <= 20) {
    console.log('⚠️  Productos no encontrados (primeros 20):');
    notFoundList.slice(0, 20).forEach(p => {
      console.log(`   - ${p.codigo}: ${p.descripcion} (Stock: ${p.stock}, Precio: $${p.precio})`);
    });
    console.log('');
  }
  
  // 6. Actualizar precios en la base de datos
  if (updates.length > 0) {
    console.log('💾 Actualizando precios en la base de datos...\n');
    
    for (const update of updates) {
      const { error } = await supabase
        .from('products')
        .update({ 
          price: update.newPrice,
          stock: Math.floor(update.stock), // También actualizar stock
          updated_at: new Date().toISOString()
        })
        .eq('id', update.id);
      
      if (error) {
        console.error(`❌ Error actualizando ${update.name}:`, error.message);
      } else {
        updated++;
        const methodLabel = {
          'sku': 'SKU',
          'code-in-name': 'Código en nombre',
          'name-exact': 'Nombre exacto',
          'name-partial': 'Nombre parcial'
        };
        console.log(`✓ [${methodLabel[update.method]}] ${update.name} (SKU: ${update.sku}, Código: ${update.codigo}): $${update.oldPrice.toLocaleString('es-CL')} → $${update.newPrice.toLocaleString('es-CL')}`);
      }
    }
    
    console.log(`\n✅ ${updated} productos actualizados exitosamente`);
  } else {
    console.log('ℹ️  No hay precios para actualizar');
  }
  
  // 7. Crear productos nuevos que no se encontraron
  if (notFoundList.length > 0) {
    console.log(`\n🆕 Creando ${notFoundList.length} productos nuevos...\n`);
    
    let created = 0;
    let errors = 0;
    
    for (const product of notFoundList) {
      // Generar slug único
      let baseSlug = generateSlug(product.descripcion || product.codigo);
      let slug = baseSlug;
      let slugCounter = 1;
      
      // Verificar que el slug sea único
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('slug', slug)
        .limit(1);
      
      while (existing && existing.length > 0) {
        slug = `${baseSlug}-${slugCounter}`;
        slugCounter++;
        const { data: check } = await supabase
          .from('products')
          .select('id')
          .eq('slug', slug)
          .limit(1);
        if (!check || check.length === 0) break;
      }
      
      // Crear el producto
      const newProduct = {
        name: product.descripcion.trim(),
        slug: slug,
        description: product.descripcion.trim(),
        price: product.precio,
        stock: Math.floor(product.stock), // Asegurar que sea entero
        sku: product.codigo.trim() || null,
        status: 'active',
        is_accessory: false,
        is_spare_part: true, // Asumimos que son repuestos
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { error: createError } = await supabase
        .from('products')
        .insert([newProduct]);
      
      if (createError) {
        errors++;
        console.error(`❌ Error creando ${product.codigo} - ${product.descripcion}:`, createError.message);
      } else {
        created++;
        console.log(`✓ Creado: ${product.descripcion} (Código: ${product.codigo}, Stock: ${product.stock}, Precio: $${product.precio.toLocaleString('es-CL')})`);
      }
    }
    
    console.log(`\n✅ ${created} productos nuevos creados exitosamente`);
    if (errors > 0) {
      console.log(`⚠️  ${errors} errores al crear productos`);
    }
  }
  
  console.log('\n🎉 Proceso completado!');
}

// Ejecutar
main().catch(console.error);

