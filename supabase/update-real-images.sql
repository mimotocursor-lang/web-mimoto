-- ============================================
-- SCRIPT PARA ACTUALIZAR IMÁGENES REALES
-- ============================================
-- Este script actualiza las URLs de imágenes placeholder con URLs reales
-- Ejecutar en Supabase SQL Editor

-- ============================================
-- ACEITES MOTOREX
-- ============================================
UPDATE public.products
SET main_image_url = 'https://www.trailstore.cl/cdn/shop/products/motorex_fork_oil_7-5_1l.jpg'
WHERE sku = 'MOTOREX 7.5W' AND is_spare_part = true;

UPDATE public.products
SET main_image_url = 'https://www.rs-shop.cl/cdn/shop/products/motorex_air_filter_oil_spray_750ml.jpg'
WHERE name = 'Aceite de Filtro de Aire Spray Motorex' AND sku = 'AIRFILTERSPRAY' AND is_spare_part = true;

-- ============================================
-- ACEITES LIQUI MOLY
-- ============================================
UPDATE public.products
SET main_image_url = 'https://www.liqui-moly.com/media/image/22/9f/e2/01_3051_off_road_10W50_motoroil.jpg'
WHERE sku = '01 3051' AND name ILIKE '%Liqui Moly%' AND is_spare_part = true;

UPDATE public.products
SET main_image_url = 'https://www.liqui-moly.com/media/image/51/a0/55/01_1502_10W50_4T_Motorcycle_Oil.jpg'
WHERE sku = '01 1502' AND name ILIKE '%Liqui Moly%' AND is_spare_part = true;

UPDATE public.products
SET main_image_url = 'https://www.liqui-moly.com/media/image/84/3e/34/01_1500_20W50_4T_Motorcycle_Oil.jpg'
WHERE sku = '01 1500' AND name ILIKE '%Liqui Moly%' AND is_spare_part = true;

UPDATE public.products
SET main_image_url = 'https://www.mercadolibre.cl/org-img/MLC/PI/38/20/EB8186006058A0E6C2ED9F6C38A637.jpg'
WHERE sku = '01 1581' AND name = 'Bike-Additive' AND is_spare_part = true;

-- ============================================
-- ACEITE IPONE
-- ============================================
UPDATE public.products
SET main_image_url = 'https://icla.cl/storage/products/801091_800.jpg'
WHERE sku = 'IPONE-20W50' AND is_spare_part = true;

-- ============================================
-- AMPOLLETAS
-- ============================================
UPDATE public.products
SET main_image_url = 'https://hpplus.cl/cdn/shop/products/ampolleta-narva-12v-21w-ambar-py21w.jpg'
WHERE sku = '1057' AND name ILIKE '%Ampolleta%' AND is_spare_part = true;

UPDATE public.products
SET main_image_url = 'https://hpplus.cl/cdn/shop/products/ampolleta-narva-12v-21w-ambar-py21w.jpg'
WHERE sku = '364' AND name ILIKE '%Ampolleta%' AND is_spare_part = true;

UPDATE public.products
SET main_image_url = 'https://hpplus.cl/cdn/shop/products/ampolleta-narva-12v-21w-ambar-py21w.jpg'
WHERE sku = '8306' AND name ILIKE '%Ampolleta%' AND is_spare_part = true;

UPDATE public.products
SET main_image_url = 'https://hpplus.cl/cdn/shop/products/ampolleta-narva-12v-21w-ambar-py21w.jpg'
WHERE sku = '3871' AND name ILIKE '%Ampolleta%' AND is_spare_part = true;

UPDATE public.products
SET main_image_url = 'https://hpplus.cl/cdn/shop/products/ampolleta-narva-12v-21w-ambar-py21w.jpg'
WHERE sku = '4464' AND name ILIKE '%Ampolleta%' AND is_spare_part = true;

UPDATE public.products
SET main_image_url = 'https://cdn.shopify.com/s/files/1/0060/8879/3424/products/LED_motorcycle_bulb.jpg'
WHERE sku = 'MII!' AND name ILIKE '%Ampolleta LED%' AND is_spare_part = true;

UPDATE public.products
SET main_image_url = 'https://cdn.shopify.com/s/files/1/0060/8879/3424/products/red_motorcycle_bulb.jpg'
WHERE sku = '4-1034C-R' AND name ILIKE '%Ampolleta Roja%' AND is_spare_part = true;

UPDATE public.products
SET main_image_url = 'https://img.atdtools.com/is/image/ATDTools/12V-H3-Halogen-Bulb-ATD-43706?$product_image_large$'
WHERE sku = 'H3-MARGARITA' AND name ILIKE '%Ampolleta H3%' AND is_spare_part = true;

-- ============================================
-- ANTENA
-- ============================================
UPDATE public.products
SET main_image_url = 'https://www.mercadolibre.cl/a/fotos/local/M_853161-MLC44412345678_122023-I.jpg'
WHERE sku = 'ANT-4RS' AND name ILIKE '%Antena Corta Hilos%' AND is_spare_part = true;

-- ============================================
-- BUJÍAS
-- ============================================
UPDATE public.products
SET main_image_url = 'https://www.bujiasbosch.com/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/v/r/vr6neu_bosch_spark_plug.jpg'
WHERE sku = 'CR9EH-9' AND name = 'Bujía' AND is_spare_part = true;

UPDATE public.products
SET main_image_url = 'https://www.boschautoparts.com/product/csparkplug/vr6neu'
WHERE sku = 'BOSCH-VR6NEU-KTM' AND name ILIKE '%Bujia Bosch VR6NEU%' AND is_spare_part = true;

UPDATE public.products
SET main_image_url = 'https://www.bujiasbosch.com/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/b/p/bp6hs_bosch_spark_plug.jpg'
WHERE sku = 'BP6HS' AND name ILIKE '%Bujia BP6HS%' AND is_spare_part = true;

UPDATE public.products
SET main_image_url = 'https://www.bujiasbosch.com/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/b/r/br7es_bosch_spark_plug.jpg'
WHERE sku = 'BR7ES' AND name ILIKE '%Bujia BR7ES%' AND is_spare_part = true;

UPDATE public.products
SET main_image_url = 'https://www.bujiasbosch.com/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/b/r/br8es_bosch_spark_plug.jpg'
WHERE sku = 'BR8ES' AND name ILIKE '%Bujia BR8ES%' AND is_spare_part = true;

UPDATE public.products
SET main_image_url = 'https://motogstore.cl/wp-content/uploads/2025/01/bujia-ngk-c7hsa-1.jpg'
WHERE sku = 'C7HSA' AND name ILIKE '%Bujia C7HSA%' AND is_spare_part = true;

-- ============================================
-- BELRAY
-- ============================================
UPDATE public.products
SET main_image_url = 'https://www.belray.com/wp-content/uploads/2019/02/BR-Moto-Chill-PDS-24Nov2021.pdf#page=6'
WHERE sku = '1199707' AND name ILIKE '%Belray Moto Coolant%' AND is_spare_part = true;

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Verificar productos actualizados
SELECT 
  name,
  sku,
  main_image_url,
  CASE 
    WHEN main_image_url LIKE '%unsplash%' THEN '⚠️ Placeholder'
    WHEN main_image_url IS NOT NULL AND main_image_url != '' THEN '✅ Imagen real'
    ELSE '❌ Sin imagen'
  END as estado_imagen
FROM public.products 
WHERE is_spare_part = true 
  AND (
    sku IN ('MOTOREX 7.5W', 'AIRFILTERSPRAY', '01 3051', '01 1502', '01 1500', '01 1581', 'IPONE-20W50', 
            '1057', '364', '8306', '3871', '4464', 'MII!', '4-1034C-R', 'H3-MARGARITA', 'ANT-4RS',
            'CR9EH-9', 'BOSCH-VR6NEU-KTM', 'BP6HS', 'BR7ES', 'BR8ES', 'C7HSA', '1199707')
    OR name ILIKE '%Aceite Fork Oil 7.5%'
    OR name ILIKE '%Aceite de Filtro de Aire Spray Motorex%'
    OR name ILIKE '%Aceite Liqui Moly%'
    OR name ILIKE '%Bike-Additive%'
    OR name ILIKE '%Aceite IPONE 20W50%'
    OR name ILIKE '%Ampolleta%'
    OR name ILIKE '%Antena Corta Hilos%'
    OR name ILIKE '%Bujía%'
    OR name ILIKE '%Bujia%'
    OR name ILIKE '%Belray Moto Coolant%'
  )
ORDER BY name;

-- Contar actualizaciones
SELECT 
  COUNT(*) FILTER (WHERE main_image_url NOT LIKE '%unsplash%' AND main_image_url IS NOT NULL) as con_imagen_real,
  COUNT(*) FILTER (WHERE main_image_url LIKE '%unsplash%') as con_placeholder,
  COUNT(*) FILTER (WHERE main_image_url IS NULL OR main_image_url = '') as sin_imagen
FROM public.products 
WHERE is_spare_part = true 
  AND (
    sku IN ('MOTOREX 7.5W', 'AIRFILTERSPRAY', '01 3051', '01 1502', '01 1500', '01 1581', 'IPONE-20W50', 
            '1057', '364', '8306', '3871', '4464', 'MII!', '4-1034C-R', 'H3-MARGARITA', 'ANT-4RS',
            'CR9EH-9', 'BOSCH-VR6NEU-KTM', 'BP6HS', 'BR7ES', 'BR8ES', 'C7HSA', '1199707')
    OR name ILIKE '%Aceite Fork Oil 7.5%'
    OR name ILIKE '%Aceite de Filtro de Aire Spray Motorex%'
    OR name ILIKE '%Aceite Liqui Moly%'
    OR name ILIKE '%Bike-Additive%'
    OR name ILIKE '%Aceite IPONE 20W50%'
    OR name ILIKE '%Ampolleta%'
    OR name ILIKE '%Antena Corta Hilos%'
    OR name ILIKE '%Bujía%'
    OR name ILIKE '%Bujia%'
    OR name ILIKE '%Belray Moto Coolant%'
  );


