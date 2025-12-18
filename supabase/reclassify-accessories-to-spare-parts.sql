-- Script para RECLASIFICAR accesorios mal clasificados como repuestos
-- IMPORTANTE: Ejecuta primero identify-misclassified-accessories.sql para revisar
-- Este script cambia is_accessory = false e is_spare_part = true

-- ============================================
-- PASO 1: VER QUÉ SE VA A CAMBIAR (EJECUTAR PRIMERO)
-- ============================================

SELECT 
  id,
  name,
  slug,
  sku,
  price,
  is_accessory as "Actualmente Accesorio",
  is_spare_part as "Actualmente Repuesto",
  'Se cambiará a: is_accessory=false, is_spare_part=true' as "Acción"
FROM public.products
WHERE is_accessory = true 
  AND status = 'active'
  AND (
    name ILIKE '%empaquetadura%' OR
    name ILIKE '%gasket%' OR
    name ILIKE '%reten%' OR
    name ILIKE '%seal%' OR
    name ILIKE '%rodamiento%' OR
    name ILIKE '%bearing%' OR
    name ILIKE '%cadena%' OR
    name ILIKE '%chain%' OR
    name ILIKE '%piñon%' OR
    name ILIKE '%catalina%' OR
    name ILIKE '%sprocket%' OR
    name ILIKE '%pastilla%' OR
    name ILIKE '%brake%' OR
    name ILIKE '%freno%' OR
    name ILIKE '%bujia%' OR
    name ILIKE '%spark%' OR
    name ILIKE '%filtro%' OR
    name ILIKE '%filter%' OR
    name ILIKE '%aceite%' OR
    name ILIKE '%oil%' OR
    name ILIKE '%bateria%' OR
    name ILIKE '%battery%' OR
    name ILIKE '%ampolleta%' OR
    name ILIKE '%bulb%' OR
    name ILIKE '%neumatico%' OR
    name ILIKE '%tire%' OR
    name ILIKE '%resorte%' OR
    name ILIKE '%spring%' OR
    name ILIKE '%oring%' OR
    name ILIKE '%o-ring%' OR
    name ILIKE '%radio%' OR
    name ILIKE '%rayo%' OR
    name ILIKE '%spoke%' OR
    name ILIKE '%regulador%' OR
    name ILIKE '%regulator%' OR
    name ILIKE '%relay%' OR
    name ILIKE '%rele%' OR
    name ILIKE '%valvula%' OR
    name ILIKE '%valve%' OR
    name ILIKE '%piston%' OR
    name ILIKE '%bomba%' OR
    name ILIKE '%pump%' OR
    name ILIKE '%anillo%' OR
    name ILIKE '%ring%' OR
    name ILIKE '%junta%' OR
    name ILIKE '%kit reparacion%' OR
    name ILIKE '%repair kit%' OR
    description ILIKE '%empaquetadura%' OR
    description ILIKE '%reten%' OR
    description ILIKE '%repuesto%' OR
    description ILIKE '%spare part%'
  )
ORDER BY name;

-- ============================================
-- PASO 2: EJECUTAR LA RECLASIFICACIÓN
-- ============================================
-- Descomenta las siguientes líneas DESPUÉS de revisar el resultado del PASO 1

/*
UPDATE public.products
SET 
  is_accessory = false,
  is_spare_part = true,
  updated_at = NOW()
WHERE is_accessory = true 
  AND status = 'active'
  AND (
    name ILIKE '%empaquetadura%' OR
    name ILIKE '%gasket%' OR
    name ILIKE '%reten%' OR
    name ILIKE '%seal%' OR
    name ILIKE '%rodamiento%' OR
    name ILIKE '%bearing%' OR
    name ILIKE '%cadena%' OR
    name ILIKE '%chain%' OR
    name ILIKE '%piñon%' OR
    name ILIKE '%catalina%' OR
    name ILIKE '%sprocket%' OR
    name ILIKE '%pastilla%' OR
    name ILIKE '%brake%' OR
    name ILIKE '%freno%' OR
    name ILIKE '%bujia%' OR
    name ILIKE '%spark%' OR
    name ILIKE '%filtro%' OR
    name ILIKE '%filter%' OR
    name ILIKE '%aceite%' OR
    name ILIKE '%oil%' OR
    name ILIKE '%bateria%' OR
    name ILIKE '%battery%' OR
    name ILIKE '%ampolleta%' OR
    name ILIKE '%bulb%' OR
    name ILIKE '%neumatico%' OR
    name ILIKE '%tire%' OR
    name ILIKE '%resorte%' OR
    name ILIKE '%spring%' OR
    name ILIKE '%oring%' OR
    name ILIKE '%o-ring%' OR
    name ILIKE '%radio%' OR
    name ILIKE '%rayo%' OR
    name ILIKE '%spoke%' OR
    name ILIKE '%regulador%' OR
    name ILIKE '%regulator%' OR
    name ILIKE '%relay%' OR
    name ILIKE '%rele%' OR
    name ILIKE '%valvula%' OR
    name ILIKE '%valve%' OR
    name ILIKE '%piston%' OR
    name ILIKE '%bomba%' OR
    name ILIKE '%pump%' OR
    name ILIKE '%anillo%' OR
    name ILIKE '%ring%' OR
    name ILIKE '%junta%' OR
    name ILIKE '%kit reparacion%' OR
    name ILIKE '%repair kit%' OR
    description ILIKE '%empaquetadura%' OR
    description ILIKE '%reten%' OR
    description ILIKE '%repuesto%' OR
    description ILIKE '%spare part%'
  );

-- ============================================
-- PASO 3: VERIFICAR LOS CAMBIOS
-- ============================================

SELECT 
  COUNT(*) as "Total productos reclasificados",
  SUM(price) as "Valor total",
  COUNT(DISTINCT CASE WHEN price > 0 THEN id END) as "Con precio",
  COUNT(DISTINCT CASE WHEN price = 0 THEN id END) as "Sin precio (consultar)"
FROM public.products
WHERE is_accessory = false 
  AND is_spare_part = true
  AND status = 'active'
  AND (
    name ILIKE '%empaquetadura%' OR
    name ILIKE '%gasket%' OR
    name ILIKE '%reten%' OR
    name ILIKE '%seal%' OR
    name ILIKE '%rodamiento%' OR
    name ILIKE '%bearing%' OR
    name ILIKE '%cadena%' OR
    name ILIKE '%chain%' OR
    name ILIKE '%piñon%' OR
    name ILIKE '%catalina%' OR
    name ILIKE '%sprocket%' OR
    name ILIKE '%pastilla%' OR
    name ILIKE '%brake%' OR
    name ILIKE '%freno%' OR
    name ILIKE '%bujia%' OR
    name ILIKE '%spark%' OR
    name ILIKE '%filtro%' OR
    name ILIKE '%filter%' OR
    name ILIKE '%aceite%' OR
    name ILIKE '%oil%' OR
    name ILIKE '%bateria%' OR
    name ILIKE '%battery%' OR
    name ILIKE '%ampolleta%' OR
    name ILIKE '%bulb%' OR
    name ILIKE '%neumatico%' OR
    name ILIKE '%tire%' OR
    name ILIKE '%resorte%' OR
    name ILIKE '%spring%' OR
    name ILIKE '%oring%' OR
    name ILIKE '%o-ring%' OR
    name ILIKE '%radio%' OR
    name ILIKE '%rayo%' OR
    name ILIKE '%spoke%' OR
    name ILIKE '%regulador%' OR
    name ILIKE '%regulator%' OR
    name ILIKE '%relay%' OR
    name ILIKE '%rele%' OR
    name ILIKE '%valvula%' OR
    name ILIKE '%valve%' OR
    name ILIKE '%piston%' OR
    name ILIKE '%bomba%' OR
    name ILIKE '%pump%' OR
    name ILIKE '%anillo%' OR
    name ILIKE '%ring%' OR
    name ILIKE '%junta%' OR
    name ILIKE '%kit reparacion%' OR
    name ILIKE '%repair kit%' OR
    description ILIKE '%empaquetadura%' OR
    description ILIKE '%reten%' OR
    description ILIKE '%repuesto%' OR
    description ILIKE '%spare part%'
  );
*/


