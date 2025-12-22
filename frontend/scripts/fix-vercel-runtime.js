// Script para corregir el runtime de Node.js en las funciones generadas por Astro
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', '.vercel', 'output');

function fixRuntime(dir) {
  if (!fs.existsSync(dir)) {
    console.log('⚠️  Directorio no encontrado:', dir);
    return;
  }

  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      // Ignorar directorios especiales del sistema
      if (item === 'proc' || item === 'sys' || item === 'dev') {
        continue;
      }

      const itemPath = path.join(dir, item);
      
      try {
        const stat = fs.statSync(itemPath, { throwIfNoEntry: false });
        
        if (!stat) {
          continue;
        }

        if (stat.isDirectory()) {
          // Buscar archivo .vc-config.json en cada función
          const configPath = path.join(itemPath, '.vc-config.json');
          if (fs.existsSync(configPath)) {
            try {
              const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
              if (config.runtime && (config.runtime.includes('18') || config.runtime === 'nodejs18.x')) {
                console.log(`🔧 Corrigiendo runtime en: ${item}`);
                config.runtime = 'nodejs20.x';
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                console.log(`✅ Runtime corregido a: ${config.runtime}`);
              }
            } catch (error) {
              console.error(`❌ Error procesando ${configPath}:`, error.message);
            }
          }
          // Buscar recursivamente (con try-catch para evitar errores en directorios especiales)
          try {
            fixRuntime(itemPath);
          } catch (error) {
            // Ignorar errores en directorios especiales
            if (error.code !== 'ENOENT' && !error.message.includes('proc') && !error.message.includes('sys')) {
              console.warn(`⚠️  Error accediendo a ${itemPath}:`, error.message);
            }
          }
        } else if (item.endsWith('.json')) {
          // También buscar en archivos JSON que puedan contener configuración de runtime
          try {
            const content = fs.readFileSync(itemPath, 'utf8');
            if (content.includes('nodejs18.x') || content.includes('"runtime": "nodejs18')) {
              console.log(`🔧 Corrigiendo runtime en archivo: ${item}`);
              const fixed = content.replace(/nodejs18\.x/g, 'nodejs20.x').replace(/"runtime":\s*"nodejs18/g, '"runtime": "nodejs20');
              fs.writeFileSync(itemPath, fixed);
              console.log(`✅ Runtime corregido en: ${item}`);
            }
          } catch (error) {
            // Ignorar errores de lectura
          }
        }
      } catch (error) {
        // Ignorar errores al acceder a enlaces simbólicos o archivos especiales
        if (error.code === 'ENOENT' || error.code === 'ELOOP' || error.message.includes('proc')) {
          continue;
        }
        console.warn(`⚠️  Error procesando ${itemPath}:`, error.message);
      }
    }
  } catch (error) {
    console.error(`❌ Error leyendo directorio ${dir}:`, error.message);
  }
}

console.log('🔍 Buscando funciones para corregir runtime...');
fixRuntime(outputDir);
console.log('✅ Proceso completado');
