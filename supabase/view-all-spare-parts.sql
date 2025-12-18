-- ============================================
-- CONSULTA PARA VER TODOS LOS REPUESTOS
-- ============================================
-- Ejecutar en Supabase SQL Editor

-- Vista completa de todos los repuestos con estadísticas
SELECT 
  id,
  name as "Nombre",
  sku as "SKU",
  price as "Precio",
  stock as "Stock",
  status as "Estado",
  CASE 
    WHEN main_image_url IS NOT NULL AND main_image_url != '' AND main_image_url NOT LIKE '%unsplash%' THEN '✅ Con imagen real'
    WHEN main_image_url LIKE '%unsplash%' THEN '⚠️ Imagen placeholder'
    ELSE '❌ Sin imagen'
  END as "Estado Imagen",
  main_image_url as "URL Imagen",
  description as "Descripción",
  created_at as "Fecha Creación"
FROM public.products 
WHERE is_spare_part = true
ORDER BY 
  CASE 
    WHEN main_image_url IS NOT NULL AND main_image_url != '' AND main_image_url NOT LIKE '%unsplash%' THEN 1
    WHEN main_image_url LIKE '%unsplash%' THEN 2
    ELSE 3
  END,
  name ASC;

-- ============================================
-- ESTADÍSTICAS GENERALES
-- ============================================
SELECT 
  COUNT(*) as "Total Repuestos",
  COUNT(CASE WHEN status = 'active' THEN 1 END) as "Activos",
  COUNT(CASE WHEN status = 'inactive' THEN 1 END) as "Inactivos",
  COUNT(CASE WHEN price = 0 THEN 1 END) as "Sin Precio (Consultar)",
  COUNT(CASE WHEN price > 0 THEN 1 END) as "Con Precio",
  COUNT(CASE WHEN stock > 0 THEN 1 END) as "Con Stock",
  COUNT(CASE WHEN stock = 0 THEN 1 END) as "Sin Stock",
  COUNT(CASE WHEN main_image_url IS NOT NULL AND main_image_url != '' AND main_image_url NOT LIKE '%unsplash%' THEN 1 END) as "Con Imagen Real",
  COUNT(CASE WHEN main_image_url LIKE '%unsplash%' THEN 1 END) as "Con Imagen Placeholder",
  COUNT(CASE WHEN main_image_url IS NULL OR main_image_url = '' THEN 1 END) as "Sin Imagen"
FROM public.products 
WHERE is_spare_part = true;

-- ============================================
-- REPUESTOS SIN IMAGEN (para priorizar)
-- ============================================
SELECT 
  id,
  name as "Nombre",
  sku as "SKU",
  price as "Precio",
  stock as "Stock"
FROM public.products 
WHERE is_spare_part = true 
  AND status = 'active'
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%')
ORDER BY name ASC;

-- ============================================
-- REPUESTOS POR CATEGORÍA (basado en nombre)
-- ============================================
SELECT 
  CASE 
    WHEN name ILIKE '%empaquetadura%' OR name ILIKE '%gasket%' THEN 'Empaquetaduras'
    WHEN name ILIKE '%reten%' OR name ILIKE '%seal%' THEN 'Retenes'
    WHEN name ILIKE '%rodamiento%' OR name ILIKE '%bearing%' THEN 'Rodamientos'
    WHEN name ILIKE '%cadena%' OR name ILIKE '%chain%' THEN 'Cadenas'
    WHEN name ILIKE '%piñon%' OR name ILIKE '%catalina%' OR name ILIKE '%sprocket%' THEN 'Piñones/Catalinas'
    WHEN name ILIKE '%pastilla%' OR name ILIKE '%brake%' OR name ILIKE '%freno%' THEN 'Pastillas de Freno'
    WHEN name ILIKE '%bujia%' OR name ILIKE '%spark%' THEN 'Bujías'
    WHEN name ILIKE '%filtro%' OR name ILIKE '%filter%' THEN 'Filtros'
    WHEN name ILIKE '%aceite%' OR name ILIKE '%oil%' OR name ILIKE '%motorex%' OR name ILIKE '%liqui%' THEN 'Aceites/Lubricantes'
    WHEN name ILIKE '%bateria%' OR name ILIKE '%battery%' THEN 'Baterías'
    WHEN name ILIKE '%ampolleta%' OR name ILIKE '%bulb%' THEN 'Ampolletas'
    WHEN name ILIKE '%neumatico%' OR name ILIKE '%tire%' THEN 'Neumáticos'
    WHEN name ILIKE '%resorte%' OR name ILIKE '%spring%' THEN 'Resortes'
    WHEN name ILIKE '%oring%' OR name ILIKE '%o-ring%' THEN 'O-Rings'
    WHEN name ILIKE '%radio%' OR name ILIKE '%rayo%' OR name ILIKE '%spoke%' THEN 'Radios/Rayos'
    WHEN name ILIKE '%regulador%' OR name ILIKE '%regulator%' THEN 'Reguladores'
    WHEN name ILIKE '%relay%' OR name ILIKE '%rele%' THEN 'Relays'
    ELSE 'Otros'
  END as "Categoría",
  COUNT(*) as "Cantidad",
  COUNT(CASE WHEN main_image_url IS NOT NULL AND main_image_url != '' AND main_image_url NOT LIKE '%unsplash%' THEN 1 END) as "Con Imagen Real",
  COUNT(CASE WHEN main_image_url LIKE '%unsplash%' THEN 1 END) as "Con Placeholder",
  COUNT(CASE WHEN main_image_url IS NULL OR main_image_url = '' THEN 1 END) as "Sin Imagen"
FROM public.products 
WHERE is_spare_part = true AND status = 'active'
GROUP BY 
  CASE 
    WHEN name ILIKE '%empaquetadura%' OR name ILIKE '%gasket%' THEN 'Empaquetaduras'
    WHEN name ILIKE '%reten%' OR name ILIKE '%seal%' THEN 'Retenes'
    WHEN name ILIKE '%rodamiento%' OR name ILIKE '%bearing%' THEN 'Rodamientos'
    WHEN name ILIKE '%cadena%' OR name ILIKE '%chain%' THEN 'Cadenas'
    WHEN name ILIKE '%piñon%' OR name ILIKE '%catalina%' OR name ILIKE '%sprocket%' THEN 'Piñones/Catalinas'
    WHEN name ILIKE '%pastilla%' OR name ILIKE '%brake%' OR name ILIKE '%freno%' THEN 'Pastillas de Freno'
    WHEN name ILIKE '%bujia%' OR name ILIKE '%spark%' THEN 'Bujías'
    WHEN name ILIKE '%filtro%' OR name ILIKE '%filter%' THEN 'Filtros'
    WHEN name ILIKE '%aceite%' OR name ILIKE '%oil%' OR name ILIKE '%motorex%' OR name ILIKE '%liqui%' THEN 'Aceites/Lubricantes'
    WHEN name ILIKE '%bateria%' OR name ILIKE '%battery%' THEN 'Baterías'
    WHEN name ILIKE '%ampolleta%' OR name ILIKE '%bulb%' THEN 'Ampolletas'
    WHEN name ILIKE '%neumatico%' OR name ILIKE '%tire%' THEN 'Neumáticos'
    WHEN name ILIKE '%resorte%' OR name ILIKE '%spring%' THEN 'Resortes'
    WHEN name ILIKE '%oring%' OR name ILIKE '%o-ring%' THEN 'O-Rings'
    WHEN name ILIKE '%radio%' OR name ILIKE '%rayo%' OR name ILIKE '%spoke%' THEN 'Radios/Rayos'
    WHEN name ILIKE '%regulador%' OR name ILIKE '%regulator%' THEN 'Reguladores'
    WHEN name ILIKE '%relay%' OR name ILIKE '%rele%' THEN 'Relays'
    ELSE 'Otros'
  END
ORDER BY "Cantidad" DESC;

-- ============================================
-- EXPORTAR LISTA COMPLETA (CSV ready)
-- ============================================
SELECT 
  id,
  name,
  sku,
  description,
  price,
  stock,
  status,
  main_image_url,
  created_at
FROM public.products 
WHERE is_spare_part = true
ORDER BY name ASC;



