# 📸 Instrucciones para Subir Imágenes de Productos

## Opción 1: Panel de Admin (Recomendado - Más Rápido)

### Pasos:
1. **Ejecuta el script SQL primero:**
   - Ve a Supabase Dashboard → SQL Editor
   - Ejecuta el archivo `supabase/insert-products-from-images.sql`
   - Esto creará todos los productos sin imágenes

2. **Sube las imágenes desde el panel admin:**
   - Ve a `http://localhost:4321/admin/productos` (o tu URL de producción)
   - Inicia sesión como admin
   - Para cada producto:
     - Haz clic en "Editar"
     - En "Imagen del Producto", selecciona la foto correspondiente desde tu dispositivo
     - Haz clic en "Guardar"
     - La imagen se subirá automáticamente a Supabase Storage

### Ventajas:
- ✅ Interfaz visual
- ✅ Preview de la imagen antes de guardar
- ✅ Validación automática
- ✅ No necesitas conocer rutas de archivos

### Tiempo estimado:
- ~2-3 minutos por producto
- Total: ~1-2 horas para todos los productos

---

## Opción 2: Supabase Storage Dashboard (Rápido si tienes muchas imágenes)

### Pasos:
1. **Prepara las imágenes:**
   - Renombra las imágenes con nombres descriptivos (ej: `puños-circuit-negros-rosados.jpg`)
   - Organízalas en una carpeta

2. **Sube a Supabase Storage:**
   - Ve a Supabase Dashboard → Storage → `product-images`
   - Crea una carpeta `products/` si no existe
   - Arrastra y suelta todas las imágenes a la vez
   - Supabase permite subir múltiples archivos simultáneamente

3. **Actualiza las URLs en la base de datos:**
   - Copia la URL pública de cada imagen
   - Ejecuta este SQL (reemplaza los valores):

```sql
-- Ejemplo: Actualizar imagen de un producto
UPDATE public.products 
SET main_image_url = 'https://tu-proyecto.supabase.co/storage/v1/object/public/product-images/products/puños-circuit-negros-rosados.jpg'
WHERE slug = 'puños-circuit-equipment-negros-rosados';
```

### Ventajas:
- ✅ Subida masiva de imágenes
- ✅ Más rápido si tienes muchas imágenes

### Desventajas:
- ⚠️ Necesitas actualizar manualmente las URLs en la BD
- ⚠️ No hay preview automático

---

## Opción 3: Script Automático (Para desarrolladores)

### Requisitos:
- Node.js instalado
- Variables de entorno configuradas (`.env.local`)

### Pasos:
1. **Crea una carpeta con las imágenes:**
   ```
   frontend/public/product-images/
   ├── puños-circuit-negros-rosados.jpg
   ├── puños-circuit-grises.jpg
   ├── aceite-motorex-top-speed.jpg
   └── ...
   ```

2. **Crea un script de subida:**
   - Puedo crear un script Node.js que:
     - Lee todas las imágenes de la carpeta
     - Las sube a Supabase Storage
     - Actualiza automáticamente las URLs en la BD
     - Mapea nombres de archivo a slugs de productos

3. **Ejecuta el script:**
   ```bash
   node scripts/upload-product-images.js
   ```

### Ventajas:
- ✅ Automatización completa
- ✅ Mapeo automático de nombres a productos
- ✅ Ideal para muchos productos

---

## Opción 4: Bulk Upload con Supabase CLI (Avanzado)

Si tienes Supabase CLI configurado:

```bash
# Subir todas las imágenes de una carpeta
supabase storage upload product-images/products ./product-images/ --bucket product-images
```

Luego actualiza las URLs con un script SQL.

---

## 📋 Mapeo de Imágenes a Productos

Para facilitar la subida, aquí está el mapeo sugerido:

| Nombre de Archivo Sugerido | Slug del Producto |
|---------------------------|-------------------|
| `puños-circuit-negros-rosados.jpg` | `puños-circuit-equipment-negros-rosados` |
| `puños-circuit-grises.jpg` | `puños-circuit-equipment-grises` |
| `puños-circuit-naranjos.jpg` | `puños-circuit-equipment-naranjos` |
| `puños-circuit-iv-negros.jpg` | `puños-circuit-iv-negros` |
| `juego-puños-ktm-husqvarna.jpg` | `juego-puños-ktm-husqvarna` |
| `manillares-oxford-hotgrips-pro.jpg` | `manillares-calefactables-oxford-hotgrips-pro-adventure` |
| `manillares-oxford-hotgrips-premium.jpg` | `manillares-calefactables-oxford-hotgrips-premium-adventure` |
| `amarras-acerbis-azules.jpg` | `amarras-acerbis-azules-25mm` |
| `amarras-acerbis-rojas.jpg` | `amarras-acerbis-rojas-25mm` |
| `filtro-aire-dna.jpg` | `filtro-aire-dna-high-performance` |
| `pastillas-freno-gold-fren.jpg` | `pastillas-freno-gold-fren-ceramic-carbon` |
| `pastillas-freno-moto-master.jpg` | `pastillas-freno-moto-master-sinter-pro` |
| `bateria-furat.jpg` | `bateria-furat-ft7b-4-gel-12v` |
| `bateria-bs-battery.jpg` | `bateria-bs-battery-btz12s-sla-12v` |
| `cargador-fulbat.jpg` | `cargador-bateria-fulbat-fulload-1000` |
| `aceite-motorex-top-speed.jpg` | `aceite-motorex-4t-top-speed-15w50` |
| `aceite-motorex-cross-power.jpg` | `aceite-motorex-4t-cross-power-10w50` |
| `aceite-motorex-power-synt.jpg` | `aceite-motorex-4t-power-synt-10w50` |
| `aceite-liqui-moly-offroad.jpg` | `aceite-liqui-moly-4t-synth-offroad-race-10w50` |
| `aceite-elf-cruise.jpg` | `aceite-elf-moto-4-cruise-20w50` |
| `aceite-elf-tech.jpg` | `aceite-elf-moto-4-tech-10w50` |
| `lubricante-cadena-motorex-adventure.jpg` | `lubricante-cadena-motorex-adventure-all-terrain` |
| `lubricante-cadena-motorex-offroad.jpg` | `lubricante-cadena-motorex-offroad-fully-synthetic` |
| `lubricante-cadena-elf.jpg` | `lubricante-cadena-elf-moto-chain-lube` |
| `aceite-horquilla-motorex.jpg` | `aceite-horquilla-motorex-racing-fork-oil-5w` |
| `aceite-filtro-aire-motorex-1l.jpg` | `aceite-filtro-aire-motorex-oil-206` |
| `aceite-filtro-aire-motorex-aerosol.jpg` | `aceite-filtro-aire-motorex-aerosol-750ml` |
| `refrigerante-motorex-m50.jpg` | `refrigerante-motorex-coolant-m50-hybrid` |
| `refrigerante-motorex-m30.jpg` | `refrigerante-motorex-coolant-m30-oat` |
| `limpiador-casco-liqui-moly-motorbike.jpg` | `limpiador-interior-casco-liqui-moly-motorbike` |
| `limpiador-casco-liqui-moly-racing.jpg` | `limpiador-interior-casco-liqui-moly-racing` |
| `limpieza-motor-liqui-moly.jpg` | `limpieza-motor-liqui-moly-engine-flush` |
| `aditivo-liqui-moly-shooter.jpg` | `aditivo-combustible-liqui-moly-4t-additive-shooter` |

---

## 🚀 Recomendación Final

**Para la mayoría de casos, usa la Opción 1 (Panel de Admin):**
- Es la más simple
- Tienes control visual
- No necesitas conocimientos técnicos avanzados
- Puedes hacerlo mientras revisas cada producto

**Si tienes 30+ productos, considera la Opción 2 o 3:**
- Más eficiente para grandes volúmenes
- Requiere un poco más de configuración inicial

---

## ⚠️ Notas Importantes

1. **Formato de imágenes:**
   - Formatos soportados: JPG, PNG, WebP
   - Tamaño recomendado: máximo 2MB por imagen
   - Resolución recomendada: 800x800px o superior

2. **Nombres de archivos:**
   - Usa nombres descriptivos sin espacios
   - Evita caracteres especiales (excepto guiones y guiones bajos)
   - Ejemplo: `puños-circuit-negros-rosados.jpg` ✅
   - Evita: `puños circuit negros rosados.jpg` ❌

3. **Verificación:**
   - Después de subir, verifica que las imágenes se vean correctamente en:
     - `/tienda` (página de productos)
     - `/admin/productos` (panel de admin)




