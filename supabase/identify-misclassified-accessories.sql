-- Script para identificar accesorios que deberían ser repuestos
-- Ejecutar en Supabase SQL Editor

-- ============================================
-- PRODUCTOS MARCADOS COMO ACCESORIOS PERO QUE PARECEN REPUESTOS
-- ============================================

-- Lista de productos marcados como accesorios que tienen palabras clave de repuestos
SELECT 
  id,
  name,
  slug,
  description,
  sku,
  price,
  stock,
  is_accessory,
  is_spare_part,
  status,
  created_at
FROM public.products
WHERE is_accessory = true 
  AND status = 'active'
  AND (
    -- Palabras clave típicas de repuestos
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
-- RESUMEN POR TIPO DE REPUESTO DETECTADO
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
    WHEN name ILIKE '%aceite%' OR name ILIKE '%oil%' THEN 'Aceites/Lubricantes'
    WHEN name ILIKE '%bateria%' OR name ILIKE '%battery%' THEN 'Baterías'
    WHEN name ILIKE '%ampolleta%' OR name ILIKE '%bulb%' THEN 'Ampolletas'
    WHEN name ILIKE '%neumatico%' OR name ILIKE '%tire%' THEN 'Neumáticos'
    WHEN name ILIKE '%resorte%' OR name ILIKE '%spring%' THEN 'Resortes'
    WHEN name ILIKE '%oring%' OR name ILIKE '%o-ring%' THEN 'O-Rings'
    WHEN name ILIKE '%regulador%' OR name ILIKE '%regulator%' THEN 'Reguladores'
    WHEN name ILIKE '%relay%' OR name ILIKE '%rele%' THEN 'Relays'
    WHEN name ILIKE '%valvula%' OR name ILIKE '%valve%' THEN 'Válvulas'
    WHEN name ILIKE '%piston%' THEN 'Pistones'
    WHEN name ILIKE '%bomba%' OR name ILIKE '%pump%' THEN 'Bombas'
    WHEN name ILIKE '%anillo%' OR name ILIKE '%ring%' THEN 'Anillos'
    ELSE 'Otros Repuestos'
  END as "Tipo de Repuesto",
  COUNT(*) as "Cantidad",
  STRING_AGG(name, ', ' ORDER BY name) as "Productos"
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
    WHEN name ILIKE '%aceite%' OR name ILIKE '%oil%' THEN 'Aceites/Lubricantes'
    WHEN name ILIKE '%bateria%' OR name ILIKE '%battery%' THEN 'Baterías'
    WHEN name ILIKE '%ampolleta%' OR name ILIKE '%bulb%' THEN 'Ampolletas'
    WHEN name ILIKE '%neumatico%' OR name ILIKE '%tire%' THEN 'Neumáticos'
    WHEN name ILIKE '%resorte%' OR name ILIKE '%spring%' THEN 'Resortes'
    WHEN name ILIKE '%oring%' OR name ILIKE '%o-ring%' THEN 'O-Rings'
    WHEN name ILIKE '%regulador%' OR name ILIKE '%regulator%' THEN 'Reguladores'
    WHEN name ILIKE '%relay%' OR name ILIKE '%rele%' THEN 'Relays'
    WHEN name ILIKE '%valvula%' OR name ILIKE '%valve%' THEN 'Válvulas'
    WHEN name ILIKE '%piston%' THEN 'Pistones'
    WHEN name ILIKE '%bomba%' OR name ILIKE '%pump%' THEN 'Bombas'
    WHEN name ILIKE '%anillo%' OR name ILIKE '%ring%' THEN 'Anillos'
    ELSE 'Otros Repuestos'
  END
ORDER BY "Cantidad" DESC;

-- ============================================
-- SCRIPT PARA RECLASIFICAR (COMENTADO - REVISAR ANTES DE EJECUTAR)
-- ============================================

-- IMPORTANTE: Revisa los resultados de las consultas anteriores antes de ejecutar esto
-- Este script cambiará is_accessory = false e is_spare_part = true para los productos identificados

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

-- Verificar cambios
SELECT COUNT(*) as "Productos reclasificados"
FROM public.products
WHERE is_accessory = false 
  AND is_spare_part = true
  AND status = 'active';
*/


