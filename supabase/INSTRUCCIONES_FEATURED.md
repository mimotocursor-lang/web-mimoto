# Instrucciones para Configurar Productos Destacados

## Paso 1: Agregar el campo 'featured' a la tabla products

Ejecuta el siguiente script SQL en el editor SQL de Supabase:

```sql
-- Ejecutar: supabase/add-featured-column.sql
```

O ejecuta directamente en Supabase:

```sql
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'featured'
  ) THEN
    ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT false NOT NULL;
    
    CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
    
    RAISE NOTICE 'Columna featured agregada exitosamente';
  ELSE
    RAISE NOTICE 'La columna featured ya existe';
  END IF;
END $$;
```

## Paso 2: Marcar productos actuales como destacados

Para identificar y marcar los productos que actualmente aparecen en el index, ejecuta:

```sql
-- Ejecutar: supabase/mark-current-featured-products.sql
```

Este script marcará como destacados los primeros 12 productos activos que tienen imágenes reales.

## Paso 3: Usar el panel de admin

Ahora puedes usar el panel de admin (`/admin/productos`) para:

1. **Agregar nuevos productos destacados**: Al crear o editar un producto, marca el checkbox "Producto Destacado"
2. **Ver productos destacados**: Los productos destacados mostrarán una etiqueta "Destacado" en la lista
3. **Gestionar destacados**: Puedes marcar/desmarcar productos como destacados desde el formulario de edición

## Notas importantes

- Solo los productos con `featured = true` aparecerán en la página de inicio
- Los productos destacados deben tener imágenes reales (no placeholders) para aparecer correctamente
- Puedes tener hasta 12 productos destacados visibles en el index (se muestran los más recientes primero)


