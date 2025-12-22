-- Script para marcar como destacados los productos que actualmente aparecen en el index
-- Este script identifica productos activos con imágenes reales y los marca como featured

-- Primero, desmarcar todos los productos (opcional, para empezar limpio)
-- UPDATE products SET featured = false;

-- Marcar como destacados los productos activos que tienen imágenes reales
-- (productos que probablemente están apareciendo en el index actualmente)
-- Nota: Este script marca los primeros productos activos con imágenes como destacados
-- Ajusta el LIMIT según cuántos productos quieres destacar

UPDATE products 
SET featured = true
WHERE id IN (
  SELECT id 
  FROM products
  WHERE status = 'active'
    AND main_image_url IS NOT NULL
    AND main_image_url != ''
    AND (
      main_image_url LIKE '/%' OR 
      main_image_url LIKE '%supabase.co/storage%'
    )
    AND (
      is_accessory = true OR 
      is_spare_part = true
    )
  ORDER BY created_at DESC
  LIMIT 12
);

-- Verificar los productos marcados como destacados
SELECT 
  id,
  name,
  featured,
  main_image_url,
  is_accessory,
  is_spare_part,
  status,
  created_at
FROM products
WHERE featured = true
ORDER BY created_at DESC;





