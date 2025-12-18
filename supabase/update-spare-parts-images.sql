-- Script para actualizar productos repuestos SIN imagen
-- Ejecutar después de insert-all-spare-parts.sql si algunos productos no tienen imagen

-- Verificar cuántos productos no tienen imagen
SELECT 
  COUNT(*) as total_repuestos,
  COUNT(CASE WHEN main_image_url IS NOT NULL AND main_image_url != '' THEN 1 END) as con_imagen,
  COUNT(CASE WHEN main_image_url IS NULL OR main_image_url = '' THEN 1 END) as sin_imagen
FROM public.products 
WHERE is_spare_part = true AND status = 'active';

-- Actualizar TODOS los repuestos sin imagen con una URL por defecto
UPDATE public.products
SET main_image_url = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
WHERE is_spare_part = true 
  AND status = 'active'
  AND (main_image_url IS NULL OR main_image_url = '');

-- Verificar después de la actualización
SELECT 
  COUNT(*) as total_repuestos,
  COUNT(CASE WHEN main_image_url IS NOT NULL AND main_image_url != '' THEN 1 END) as con_imagen,
  COUNT(CASE WHEN main_image_url IS NULL OR main_image_url = '' THEN 1 END) as sin_imagen
FROM public.products 
WHERE is_spare_part = true AND status = 'active';

-- Mostrar algunos ejemplos CON imagen URL
SELECT name, price, stock, sku, main_image_url
FROM public.products 
WHERE is_spare_part = true AND status = 'active'
  AND main_image_url IS NOT NULL AND main_image_url != ''
ORDER BY name
LIMIT 20;



