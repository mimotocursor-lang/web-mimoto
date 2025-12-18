-- Script SQL para actualizar productos con URLs de imágenes reales
-- IMPORTANTE: Este script usa URLs de ejemplo. 
-- NECESITAS REEMPLAZAR estas URLs con URLs reales de imágenes de productos.

-- ============================================
-- ACTUALIZAR EMPAQUETADURAS / GASKETS
-- ============================================
UPDATE public.products
SET main_image_url = 'https://i.ebayimg.com/images/g/abc123/s-l1600.jpg' -- REEMPLAZAR CON URL REAL
WHERE is_spare_part = true 
  AND status = 'active'
  AND (name ILIKE '%empaquetadura%' OR name ILIKE '%gasket%')
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%');

-- ============================================
-- ACTUALIZAR RETENES / SEALS
-- ============================================
UPDATE public.products
SET main_image_url = 'https://i.ebayimg.com/images/g/xyz789/s-l1600.jpg' -- REEMPLAZAR CON URL REAL
WHERE is_spare_part = true 
  AND status = 'active'
  AND (name ILIKE '%reten%' OR name ILIKE '%seal%')
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%');

-- ============================================
-- ACTUALIZAR RODAMIENTOS / BEARINGS
-- ============================================
UPDATE public.products
SET main_image_url = 'https://i.ebayimg.com/images/g/bearing123/s-l1600.jpg' -- REEMPLAZAR CON URL REAL
WHERE is_spare_part = true 
  AND status = 'active'
  AND (name ILIKE '%rodamiento%' OR name ILIKE '%bearing%')
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%');

-- ============================================
-- ACTUALIZAR CADENAS / CHAINS
-- ============================================
UPDATE public.products
SET main_image_url = 'https://i.ebayimg.com/images/g/chain123/s-l1600.jpg' -- REEMPLAZAR CON URL REAL
WHERE is_spare_part = true 
  AND status = 'active'
  AND (name ILIKE '%cadena%' OR name ILIKE '%chain%')
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%');

-- ============================================
-- ACTUALIZAR PIÑONES / SPROCKETS
-- ============================================
UPDATE public.products
SET main_image_url = 'https://i.ebayimg.com/images/g/sprocket123/s-l1600.jpg' -- REEMPLAZAR CON URL REAL
WHERE is_spare_part = true 
  AND status = 'active'
  AND (name ILIKE '%piñon%' OR name ILIKE '%catalina%' OR name ILIKE '%sprocket%')
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%');

-- ============================================
-- ACTUALIZAR PASTILLAS DE FRENO / BRAKE PADS
-- ============================================
UPDATE public.products
SET main_image_url = 'https://i.ebayimg.com/images/g/brakepad123/s-l1600.jpg' -- REEMPLAZAR CON URL REAL
WHERE is_spare_part = true 
  AND status = 'active'
  AND (name ILIKE '%pastilla%' OR name ILIKE '%brake%' OR name ILIKE '%freno%')
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%');

-- ============================================
-- ACTUALIZAR BUJÍAS / SPARK PLUGS
-- ============================================
UPDATE public.products
SET main_image_url = 'https://i.ebayimg.com/images/g/sparkplug123/s-l1600.jpg' -- REEMPLAZAR CON URL REAL
WHERE is_spare_part = true 
  AND status = 'active'
  AND (name ILIKE '%bujia%' OR name ILIKE '%spark%')
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%');

-- ============================================
-- ACTUALIZAR FILTROS / FILTERS
-- ============================================
UPDATE public.products
SET main_image_url = 'https://i.ebayimg.com/images/g/filter123/s-l1600.jpg' -- REEMPLAZAR CON URL REAL
WHERE is_spare_part = true 
  AND status = 'active'
  AND (name ILIKE '%filtro%' OR name ILIKE '%filter%')
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%');

-- ============================================
-- ACTUALIZAR ACEITES / OILS
-- ============================================
UPDATE public.products
SET main_image_url = 'https://i.ebayimg.com/images/g/oil123/s-l1600.jpg' -- REEMPLAZAR CON URL REAL
WHERE is_spare_part = true 
  AND status = 'active'
  AND (name ILIKE '%aceite%' OR name ILIKE '%oil%' OR name ILIKE '%motorex%' OR name ILIKE '%liqui%')
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%');

-- ============================================
-- ACTUALIZAR BATERÍAS / BATTERIES
-- ============================================
UPDATE public.products
SET main_image_url = 'https://i.ebayimg.com/images/g/battery123/s-l1600.jpg' -- REEMPLAZAR CON URL REAL
WHERE is_spare_part = true 
  AND status = 'active'
  AND (name ILIKE '%bateria%' OR name ILIKE '%battery%')
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%');

-- ============================================
-- ACTUALIZAR AMPOLLETAS / BULBS
-- ============================================
UPDATE public.products
SET main_image_url = 'https://i.ebayimg.com/images/g/bulb123/s-l1600.jpg' -- REEMPLAZAR CON URL REAL
WHERE is_spare_part = true 
  AND status = 'active'
  AND (name ILIKE '%ampolleta%' OR name ILIKE '%bulb%')
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%');

-- ============================================
-- ACTUALIZAR NEUMÁTICOS / TIRES
-- ============================================
UPDATE public.products
SET main_image_url = 'https://i.ebayimg.com/images/g/tire123/s-l1600.jpg' -- REEMPLAZAR CON URL REAL
WHERE is_spare_part = true 
  AND status = 'active'
  AND (name ILIKE '%neumatico%' OR name ILIKE '%tire%')
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%');

-- ============================================
-- ACTUALIZAR RESORTES / SPRINGS
-- ============================================
UPDATE public.products
SET main_image_url = 'https://i.ebayimg.com/images/g/spring123/s-l1600.jpg' -- REEMPLAZAR CON URL REAL
WHERE is_spare_part = true 
  AND status = 'active'
  AND (name ILIKE '%resorte%' OR name ILIKE '%spring%')
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%');

-- ============================================
-- ACTUALIZAR O-RINGS
-- ============================================
UPDATE public.products
SET main_image_url = 'https://i.ebayimg.com/images/g/oring123/s-l1600.jpg' -- REEMPLAZAR CON URL REAL
WHERE is_spare_part = true 
  AND status = 'active'
  AND (name ILIKE '%oring%' OR name ILIKE '%o-ring%')
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%');

-- ============================================
-- ACTUALIZAR RADIOS / SPOKES
-- ============================================
UPDATE public.products
SET main_image_url = 'https://i.ebayimg.com/images/g/spoke123/s-l1600.jpg' -- REEMPLAZAR CON URL REAL
WHERE is_spare_part = true 
  AND status = 'active'
  AND (name ILIKE '%radio%' OR name ILIKE '%rayo%' OR name ILIKE '%spoke%')
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%');

-- ============================================
-- ACTUALIZAR REGULADORES / REGULATORS
-- ============================================
UPDATE public.products
SET main_image_url = 'https://i.ebayimg.com/images/g/regulator123/s-l1600.jpg' -- REEMPLAZAR CON URL REAL
WHERE is_spare_part = true 
  AND status = 'active'
  AND (name ILIKE '%regulador%' OR name ILIKE '%regulator%')
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%');

-- ============================================
-- ACTUALIZAR RELAYS
-- ============================================
UPDATE public.products
SET main_image_url = 'https://i.ebayimg.com/images/g/relay123/s-l1600.jpg' -- REEMPLAZAR CON URL REAL
WHERE is_spare_part = true 
  AND status = 'active'
  AND (name ILIKE '%relay%' OR name ILIKE '%rele%')
  AND (main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%');

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
SELECT 
  COUNT(*) as total_repuestos,
  COUNT(CASE WHEN main_image_url IS NOT NULL AND main_image_url != '' AND main_image_url NOT LIKE '%unsplash%' THEN 1 END) as con_imagen_real,
  COUNT(CASE WHEN main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%unsplash%' THEN 1 END) as sin_imagen_o_placeholder
FROM public.products 
WHERE is_spare_part = true AND status = 'active';



