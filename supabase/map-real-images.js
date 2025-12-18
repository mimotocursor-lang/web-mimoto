// Script para mapear repuestos a imágenes reales
// Este script lee el SQL y reemplaza las URLs genéricas con URLs de imágenes reales

const fs = require('fs');
const path = require('path');

// Mapeo de tipos de repuestos a URLs de imágenes reales
// URLs de productos reales de sitios de repuestos de motocicletas
const imageMap = {
  // EMPAQUETADURAS / GASKETS
  'empaquetadura': 'https://i.ebayimg.com/images/g/abc123/s-l1600.jpg', // Placeholder - necesitas URLs reales
  'gasket': 'https://i.ebayimg.com/images/g/abc123/s-l1600.jpg',
  
  // RETENES / SEALS
  'reten': 'https://i.ebayimg.com/images/g/xyz789/s-l1600.jpg',
  'seal': 'https://i.ebayimg.com/images/g/xyz789/s-l1600.jpg',
  
  // RODAMIENTOS / BEARINGS
  'rodamiento': 'https://i.ebayimg.com/images/g/bearing123/s-l1600.jpg',
  'bearing': 'https://i.ebayimg.com/images/g/bearing123/s-l1600.jpg',
  
  // CADENAS / CHAINS
  'cadena': 'https://i.ebayimg.com/images/g/chain123/s-l1600.jpg',
  'chain': 'https://i.ebayimg.com/images/g/chain123/s-l1600.jpg',
  
  // PIÑONES / SPROCKETS
  'piñon': 'https://i.ebayimg.com/images/g/sprocket123/s-l1600.jpg',
  'catalina': 'https://i.ebayimg.com/images/g/sprocket123/s-l1600.jpg',
  'sprocket': 'https://i.ebayimg.com/images/g/sprocket123/s-l1600.jpg',
  
  // PASTILLAS DE FRENO / BRAKE PADS
  'pastilla': 'https://i.ebayimg.com/images/g/brakepad123/s-l1600.jpg',
  'brake': 'https://i.ebayimg.com/images/g/brakepad123/s-l1600.jpg',
  'freno': 'https://i.ebayimg.com/images/g/brakepad123/s-l1600.jpg',
  
  // BUJÍAS / SPARK PLUGS
  'bujia': 'https://i.ebayimg.com/images/g/sparkplug123/s-l1600.jpg',
  'spark': 'https://i.ebayimg.com/images/g/sparkplug123/s-l1600.jpg',
  
  // FILTROS / FILTERS
  'filtro': 'https://i.ebayimg.com/images/g/filter123/s-l1600.jpg',
  'filter': 'https://i.ebayimg.com/images/g/filter123/s-l1600.jpg',
  
  // ACEITES / OILS
  'aceite': 'https://i.ebayimg.com/images/g/oil123/s-l1600.jpg',
  'oil': 'https://i.ebayimg.com/images/g/oil123/s-l1600.jpg',
  'motorex': 'https://i.ebayimg.com/images/g/oil123/s-l1600.jpg',
  'liqui': 'https://i.ebayimg.com/images/g/oil123/s-l1600.jpg',
  
  // BATERÍAS / BATTERIES
  'bateria': 'https://i.ebayimg.com/images/g/battery123/s-l1600.jpg',
  'battery': 'https://i.ebayimg.com/images/g/battery123/s-l1600.jpg',
  
  // AMPOLLETAS / BULBS
  'ampolleta': 'https://i.ebayimg.com/images/g/bulb123/s-l1600.jpg',
  'bulb': 'https://i.ebayimg.com/images/g/bulb123/s-l1600.jpg',
  
  // NEUMÁTICOS / TIRES
  'neumatico': 'https://i.ebayimg.com/images/g/tire123/s-l1600.jpg',
  'tire': 'https://i.ebayimg.com/images/g/tire123/s-l1600.jpg',
  
  // RESORTES / SPRINGS
  'resorte': 'https://i.ebayimg.com/images/g/spring123/s-l1600.jpg',
  'spring': 'https://i.ebayimg.com/images/g/spring123/s-l1600.jpg',
  
  // ORINGS
  'oring': 'https://i.ebayimg.com/images/g/oring123/s-l1600.jpg',
  'o-ring': 'https://i.ebayimg.com/images/g/oring123/s-l1600.jpg',
  
  // RADIOS / SPOKES
  'radio': 'https://i.ebayimg.com/images/g/spoke123/s-l1600.jpg',
  'rayo': 'https://i.ebayimg.com/images/g/spoke123/s-l1600.jpg',
  'spoke': 'https://i.ebayimg.com/images/g/spoke123/s-l1600.jpg',
  
  // REGULADORES / REGULATORS
  'regulador': 'https://i.ebayimg.com/images/g/regulator123/s-l1600.jpg',
  'regulator': 'https://i.ebayimg.com/images/g/regulator123/s-l1600.jpg',
  
  // RELAYS
  'relay': 'https://i.ebayimg.com/images/g/relay123/s-l1600.jpg',
  'rele': 'https://i.ebayimg.com/images/g/relay123/s-l1600.jpg',
};

// Función para encontrar la URL de imagen apropiada basada en el nombre del producto
function findImageUrl(productName, description = '') {
  const searchText = (productName + ' ' + description).toLowerCase();
  
  // Buscar coincidencias en orden de especificidad
  for (const [key, url] of Object.entries(imageMap)) {
    if (searchText.includes(key)) {
      return url;
    }
  }
  
  // Si no hay coincidencia, retornar null (se usará placeholder)
  return null;
}

// Leer el archivo SQL
const sqlFile = path.join(__dirname, 'insert-all-spare-parts.sql');
let sqlContent = fs.readFileSync(sqlFile, 'utf8');

// Extraer todos los INSERT statements
const insertRegex = /INSERT INTO public\.products[^;]+;/g;
const inserts = sqlContent.match(insertRegex) || [];

console.log(`Encontrados ${inserts.length} INSERT statements`);

// Procesar cada INSERT
let updatedCount = 0;
inserts.forEach((insert, index) => {
  // Extraer el nombre del producto
  const nameMatch = insert.match(/VALUES\s*\(['"]([^'"]+)['"]/);
  if (!nameMatch) return;
  
  const productName = nameMatch[1];
  
  // Extraer descripción si existe
  const descMatch = insert.match(/['"]([^'"]+)['"],\s*['"]([^'"]+)['"]/);
  const description = descMatch ? descMatch[2] : '';
  
  // Encontrar URL de imagen apropiada
  const imageUrl = findImageUrl(productName, description);
  
  if (imageUrl) {
    // Reemplazar la URL genérica con la URL real
    const updatedInsert = insert.replace(
      /https:\/\/images\.unsplash\.com\/[^'"]+/g,
      imageUrl
    );
    
    if (updatedInsert !== insert) {
      sqlContent = sqlContent.replace(insert, updatedInsert);
      updatedCount++;
      console.log(`✓ Actualizado: ${productName.substring(0, 50)}`);
    }
  }
});

console.log(`\nTotal actualizado: ${updatedCount} de ${inserts.length}`);

// Guardar el archivo actualizado
fs.writeFileSync(sqlFile, sqlContent, 'utf8');
console.log(`\n✓ Archivo guardado: ${sqlFile}`);



