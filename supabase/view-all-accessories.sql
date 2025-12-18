-- Script para ver todos los accesorios en la base de datos
-- Ejecutar en Supabase SQL Editor

-- ============================================
-- LISTA COMPLETA DE ACCESORIOS
-- ============================================

SELECT 
  id,
  name,
  slug,
  description,
  price,
  stock,
  sku,
  status,
  is_accessory,
  is_spare_part,
  main_image_url,
  created_at
FROM public.products
WHERE is_accessory = true
ORDER BY created_at DESC;

-- ============================================
-- RESUMEN DE ACCESORIOS
-- ============================================

SELECT 
  COUNT(*) as "Total Accesorios",
  COUNT(CASE WHEN status = 'active' THEN 1 END) as "Activos",
  COUNT(CASE WHEN status = 'inactive' THEN 1 END) as "Inactivos",
  COUNT(CASE WHEN price > 0 THEN 1 END) as "Con Precio",
  COUNT(CASE WHEN price = 0 THEN 1 END) as "Precio a Consultar",
  COUNT(CASE WHEN stock > 0 THEN 1 END) as "Con Stock",
  COUNT(CASE WHEN stock = 0 THEN 1 END) as "Sin Stock",
  SUM(price) as "Valor Total Inventario",
  COUNT(CASE WHEN main_image_url IS NOT NULL AND main_image_url != '' THEN 1 END) as "Con Imagen",
  COUNT(CASE WHEN main_image_url IS NULL OR main_image_url = '' THEN 1 END) as "Sin Imagen"
FROM public.products
WHERE is_accessory = true;

-- ============================================
-- ACCESORIOS SIN IMAGEN
-- ============================================

SELECT 
  id,
  name,
  sku,
  price,
  stock,
  status
FROM public.products
WHERE is_accessory = true 
  AND (main_image_url IS NULL OR main_image_url = '')
ORDER BY name;

-- ============================================
-- ACCESORIOS POR CATEGORÍA (basado en nombre)
-- ============================================

SELECT 
  CASE 
    WHEN name ILIKE '%casco%' OR name ILIKE '%helmet%' THEN 'Cascos'
    WHEN name ILIKE '%guante%' OR name ILIKE '%glove%' THEN 'Guantes'
    WHEN name ILIKE '%chaqueta%' OR name ILIKE '%jacket%' THEN 'Chaquetas'
    WHEN name ILIKE '%pantalon%' OR name ILIKE '%pant%' THEN 'Pantalones'
    WHEN name ILIKE '%bota%' OR name ILIKE '%boot%' THEN 'Botas'
    WHEN name ILIKE '%maleta%' OR name ILIKE '%bag%' OR name ILIKE '%alforja%' THEN 'Maletas/Alforjas'
    WHEN name ILIKE '%porta%' OR name ILIKE '%holder%' THEN 'Porta Objetos'
    WHEN name ILIKE '%luz%' OR name ILIKE '%light%' OR name ILIKE '%led%' THEN 'Iluminación'
    WHEN name ILIKE '%gps%' OR name ILIKE '%navegador%' THEN 'GPS/Navegadores'
    WHEN name ILIKE '%alarma%' OR name ILIKE '%alarm%' THEN 'Alarmas'
    WHEN name ILIKE '%candado%' OR name ILIKE '%lock%' THEN 'Seguridad'
    WHEN name ILIKE '%cubre%' OR name ILIKE '%cover%' THEN 'Cubiertas'
    WHEN name ILIKE '%pegatina%' OR name ILIKE '%sticker%' THEN 'Pegatinas/Stickers'
    WHEN name ILIKE '%manillar%' OR name ILIKE '%handlebar%' THEN 'Manillares'
    WHEN name ILIKE '%asiento%' OR name ILIKE '%seat%' THEN 'Asientos'
    WHEN name ILIKE '%escape%' OR name ILIKE '%exhaust%' THEN 'Escapes'
    WHEN name ILIKE '%filtro%' OR name ILIKE '%filter%' THEN 'Filtros'
    WHEN name ILIKE '%aceite%' OR name ILIKE '%oil%' THEN 'Aceites/Lubricantes'
    WHEN name ILIKE '%bateria%' OR name ILIKE '%battery%' THEN 'Baterías'
    WHEN name ILIKE '%neumatico%' OR name ILIKE '%tire%' THEN 'Neumáticos'
    ELSE 'Otros'
  END as "Categoría",
  COUNT(*) as "Cantidad",
  COUNT(CASE WHEN main_image_url IS NOT NULL AND main_image_url != '' AND main_image_url NOT LIKE '%unsplash%' THEN 1 END) as "Con Imagen Real",
  COUNT(CASE WHEN main_image_url LIKE '%unsplash%' THEN 1 END) as "Con Placeholder",
  COUNT(CASE WHEN main_image_url IS NULL OR main_image_url = '' THEN 1 END) as "Sin Imagen"
FROM public.products 
WHERE is_accessory = true AND status = 'active'
GROUP BY 
  CASE 
    WHEN name ILIKE '%casco%' OR name ILIKE '%helmet%' THEN 'Cascos'
    WHEN name ILIKE '%guante%' OR name ILIKE '%glove%' THEN 'Guantes'
    WHEN name ILIKE '%chaqueta%' OR name ILIKE '%jacket%' THEN 'Chaquetas'
    WHEN name ILIKE '%pantalon%' OR name ILIKE '%pant%' THEN 'Pantalones'
    WHEN name ILIKE '%bota%' OR name ILIKE '%boot%' THEN 'Botas'
    WHEN name ILIKE '%maleta%' OR name ILIKE '%bag%' OR name ILIKE '%alforja%' THEN 'Maletas/Alforjas'
    WHEN name ILIKE '%porta%' OR name ILIKE '%holder%' THEN 'Porta Objetos'
    WHEN name ILIKE '%luz%' OR name ILIKE '%light%' OR name ILIKE '%led%' THEN 'Iluminación'
    WHEN name ILIKE '%gps%' OR name ILIKE '%navegador%' THEN 'GPS/Navegadores'
    WHEN name ILIKE '%alarma%' OR name ILIKE '%alarm%' THEN 'Alarmas'
    WHEN name ILIKE '%candado%' OR name ILIKE '%lock%' THEN 'Seguridad'
    WHEN name ILIKE '%cubre%' OR name ILIKE '%cover%' THEN 'Cubiertas'
    WHEN name ILIKE '%pegatina%' OR name ILIKE '%sticker%' THEN 'Pegatinas/Stickers'
    WHEN name ILIKE '%manillar%' OR name ILIKE '%handlebar%' THEN 'Manillares'
    WHEN name ILIKE '%asiento%' OR name ILIKE '%seat%' THEN 'Asientos'
    WHEN name ILIKE '%escape%' OR name ILIKE '%exhaust%' THEN 'Escapes'
    WHEN name ILIKE '%filtro%' OR name ILIKE '%filter%' THEN 'Filtros'
    WHEN name ILIKE '%aceite%' OR name ILIKE '%oil%' THEN 'Aceites/Lubricantes'
    WHEN name ILIKE '%bateria%' OR name ILIKE '%battery%' THEN 'Baterías'
    WHEN name ILIKE '%neumatico%' OR name ILIKE '%tire%' THEN 'Neumáticos'
    ELSE 'Otros'
  END
ORDER BY "Cantidad" DESC;

-- ============================================
-- ACCESORIOS CON PRECIO Y STOCK
-- ============================================

SELECT 
  name,
  sku,
  price,
  stock,
  CASE 
    WHEN stock > 10 THEN 'Stock Alto'
    WHEN stock > 5 THEN 'Stock Medio'
    WHEN stock > 0 THEN 'Stock Bajo'
    ELSE 'Sin Stock'
  END as "Estado Stock"
FROM public.products
WHERE is_accessory = true 
  AND status = 'active'
ORDER BY price DESC, stock DESC;

-- ============================================
-- ACCESORIOS SIN SKU
-- ============================================

SELECT 
  id,
  name,
  price,
  stock,
  status
FROM public.products
WHERE is_accessory = true 
  AND (sku IS NULL OR sku = '')
ORDER BY name;

-- ============================================
-- EXPORTAR LISTA COMPLETA (CSV ready)
-- ============================================

SELECT 
  id,
  name as "Nombre",
  sku as "SKU",
  description as "Descripción",
  price as "Precio",
  stock as "Stock",
  status as "Estado",
  main_image_url as "URL Imagen",
  created_at as "Fecha Creación"
FROM public.products
WHERE is_accessory = true
ORDER BY name;


