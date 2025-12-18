-- Script para hacer matching inteligente entre imágenes y productos
-- Este script ayuda a identificar qué productos coinciden con las imágenes disponibles

-- Primero, crear una función auxiliar para normalizar nombres
CREATE OR REPLACE FUNCTION normalize_product_name(name_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(name_text, '[áàäâ]', 'a', 'gi'),
          '[éèëê]', 'e', 'gi'
        ),
        '[íìïî]', 'i', 'gi'
      ),
      '[óòöô]', 'o', 'gi'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Vista temporal con nombres normalizados de productos
WITH product_names AS (
  SELECT 
    id,
    name,
    normalize_product_name(name) as normalized_name,
    main_image_url
  FROM public.products
  WHERE status = 'active'
),
image_mappings AS (
  SELECT 
    'AceiteElfMoto4Cruise10W-50' as image_name,
    ARRAY['elf', 'cruise', '10w50', '10w-50', '10 w 50'] as keywords
  UNION ALL SELECT 'AceiteElfMoto4Cruise20W-50', ARRAY['elf', 'cruise', '20w50', '20w-50', '20 w 50']
  UNION ALL SELECT 'MotorbikeLiquimoly15W50', ARRAY['liqui moly', 'liquimoly', '15w50', '15w-50']
  UNION ALL SELECT 'Motorex10W50Sintetico4Tiempos', ARRAY['motorex', '10w50', 'sintetico', '4t', '4 tiempos']
  UNION ALL SELECT 'Motorex0W50Sintetico4Tiempos', ARRAY['motorex', '0w50', 'sintetico', '4t', '4 tiempos']
  UNION ALL SELECT 'MotorexTopSpeed15W50', ARRAY['motorex', '15w50', 'top speed', 'topspeed']
  UNION ALL SELECT 'Motorex5WAceiteHorquillas', ARRAY['motorex', '5w', 'horquilla', 'fork']
  UNION ALL SELECT 'LubricantedeCadenaElfMotoChainLube400ml', ARRAY['elf', 'cadena', 'chain', 'lube', '400']
  UNION ALL SELECT 'MotorexChainLubeOffroad', ARRAY['motorex', 'chain', 'cadena', 'lube', 'offroad', 'off-road']
  UNION ALL SELECT 'MotorexChainLubeAdventure', ARRAY['motorex', 'chain', 'cadena', 'lube', 'adventure']
  UNION ALL SELECT 'MotorexOilSpray750ML', ARRAY['motorex', 'oil spray', 'spray', '750']
  UNION ALL SELECT 'MotorexAceitedeFiltrodeAire', ARRAY['motorex', 'filtro', 'filter', 'aire', 'air', 'aceite', 'oil']
  UNION ALL SELECT 'MotorexCoolant5-0', ARRAY['motorex', 'coolant', 'refrigerante', '5.0', '5-0']
  UNION ALL SELECT 'MotorexCoolant3-0', ARRAY['motorex', 'coolant', 'refrigerante', '3.0', '3-0']
  UNION ALL SELECT 'LimpiezadeMotorLiquiMolyEngineFlush', ARRAY['liqui moly', 'liquimoly', 'engine flush', 'limpieza', 'flush']
  UNION ALL SELECT 'Motorbike4TShooter', ARRAY['4t shooter', 'shooter', 'motorbike']
  UNION ALL SELECT 'FiltrodeAireDNA11901290790890', ARRAY['dna', 'filtro', 'filter', 'aire', 'air', '1190', '1290', '790', '890']
  UNION ALL SELECT 'PastillasdeFrenoGOLDfrenCeramicCarbon', ARRAY['pastilla', 'brake', 'freno', 'goldfren', 'gold fren', 'ceramic', 'carbon']
  UNION ALL SELECT 'PastillasdeFrenoMoto-MasterSinterPROSeries', ARRAY['pastilla', 'brake', 'freno', 'moto-master', 'motomaster', 'sinter', 'pro']
  UNION ALL SELECT 'BateríaFURATFT7B-4GEL12V6-8Ah', ARRAY['furat', 'fura', 'bateria', 'battery', 'ft7b', 't7b', 'gel']
  UNION ALL SELECT 'CargadordeBateríaFULBATFULLOAD1000', ARRAY['fulbat', 'fulload', 'full load', 'cargador', 'charger', '1000']
  UNION ALL SELECT 'JuegodePuñosKTM-Husqvarna', ARRAY['puño', 'grip', 'ktm', 'husqvarna', 'juego', 'set']
  UNION ALL SELECT 'PuñosCircuitEquipmentNaranjas', ARRAY['puño', 'grip', 'circuit', 'equipment', 'naranja', 'orange']
  UNION ALL SELECT 'PuñosCircuitEquipmentGrises', ARRAY['puño', 'grip', 'circuit', 'equipment', 'gris', 'gray', 'grey']
  UNION ALL SELECT 'PuñosCircuitEquipmentNegrosconAcentosRosados', ARRAY['puño', 'grip', 'circuit', 'equipment', 'negro', 'black', 'rosado', 'pink']
  UNION ALL SELECT 'PuñosCircuitEquipmentnNegros', ARRAY['puño', 'grip', 'circuit', 'equipment', 'negro', 'black']
  UNION ALL SELECT 'PuñosCircuitIVGrises', ARRAY['puño', 'grip', 'circuit', 'iv', '4', 'gris', 'gray', 'grey']
  UNION ALL SELECT 'CalientaPuñosOxfordProAdventure', ARRAY['calienta', 'heater', 'puño', 'grip', 'oxford', 'pro', 'adventure']
  UNION ALL SELECT 'CalientaPuñosOxford', ARRAY['calienta', 'heater', 'puño', 'grip', 'oxford']
  UNION ALL SELECT 'AmarrasAcerbisRojas25mm', ARRAY['amarra', 'strap', 'tie', 'acerbis', 'roja', 'red', '25']
  UNION ALL SELECT 'AmarrasAcerbisAzules25mm', ARRAY['amarra', 'strap', 'tie', 'acerbis', 'azul', 'blue', '25']
)
-- Buscar coincidencias
SELECT 
  im.image_name,
  '/imagenes-repuestos-accesorios/' || im.image_name || '.png' as image_path,
  pn.id as product_id,
  pn.name as product_name,
  pn.main_image_url as current_image_url,
  -- Contar cuántas keywords coinciden
  (
    SELECT COUNT(*)
    FROM unnest(im.keywords) as keyword
    WHERE pn.normalized_name LIKE '%' || keyword || '%'
  ) as match_score
FROM image_mappings im
CROSS JOIN product_names pn
WHERE (
  SELECT COUNT(*)
  FROM unnest(im.keywords) as keyword
  WHERE pn.normalized_name LIKE '%' || keyword || '%'
) >= 2  -- Mínimo 2 keywords deben coincidir
ORDER BY 
  im.image_name,
  match_score DESC,
  pn.name;

-- Limpiar función temporal
DROP FUNCTION IF EXISTS normalize_product_name(TEXT);


