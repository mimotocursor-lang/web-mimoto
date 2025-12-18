-- Script para actualizar imágenes de productos desde la carpeta imagenes-repuestos-accesorios
-- Los nombres de las imágenes son intuitivos y corresponden a los nombres de los productos

-- Función auxiliar para normalizar nombres (eliminar acentos, convertir a minúsculas, etc.)
-- Nota: PostgreSQL no tiene una función nativa para eliminar acentos fácilmente,
-- así que usaremos ILIKE con patrones

-- Mapeo de imágenes a productos basado en nombres similares
-- Formato: /imagenes-repuestos-accesorios/NOMBRE_IMAGEN.png

-- Actualizar imágenes de aceites
UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/MotorbikeLiquimoly15W50.png'
WHERE (name ILIKE '%liqui moly%' OR name ILIKE '%liquimoly%') 
  AND (name ILIKE '%15w50%' OR name ILIKE '%15w-50%' OR name ILIKE '%15 w 50%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/AceiteElfMoto4Cruise10W-50.png'
WHERE (name ILIKE '%elf%' OR name ILIKE '%elf moto%') 
  AND (name ILIKE '%10w50%' OR name ILIKE '%10w-50%' OR name ILIKE '%10 w 50%')
  AND name ILIKE '%cruise%';

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/AceiteElfMoto4Cruise20W-50.png'
WHERE (name ILIKE '%elf%' OR name ILIKE '%elf moto%') 
  AND (name ILIKE '%20w50%' OR name ILIKE '%20w-50%' OR name ILIKE '%20 w 50%')
  AND name ILIKE '%cruise%';

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/Motorex10W50Sintetico4Tiempos.png'
WHERE (name ILIKE '%motorex%') 
  AND (name ILIKE '%10w50%' OR name ILIKE '%10w-50%')
  AND (name ILIKE '%sintetico%' OR name ILIKE '%sintético%')
  AND (name ILIKE '%4t%' OR name ILIKE '%4 tiempos%' OR name ILIKE '%4tiempos%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/Motorex0W50Sintetico4Tiempos.png'
WHERE (name ILIKE '%motorex%') 
  AND (name ILIKE '%0w50%' OR name ILIKE '%0w-50%')
  AND (name ILIKE '%sintetico%' OR name ILIKE '%sintético%')
  AND (name ILIKE '%4t%' OR name ILIKE '%4 tiempos%' OR name ILIKE '%4tiempos%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/MotorexTopSpeed15W50.png'
WHERE (name ILIKE '%motorex%') 
  AND (name ILIKE '%15w50%' OR name ILIKE '%15w-50%')
  AND (name ILIKE '%top speed%' OR name ILIKE '%topspeed%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/Motorex5WAceiteHorquillas.png'
WHERE (name ILIKE '%motorex%') 
  AND (name ILIKE '%5w%' OR name ILIKE '%5 w%')
  AND (name ILIKE '%horquilla%' OR name ILIKE '%fork%');

-- Actualizar imágenes de lubricantes y productos relacionados
UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/LubricantedeCadenaElfMotoChainLube400ml.png'
WHERE (name ILIKE '%elf%' OR name ILIKE '%elf moto%') 
  AND (name ILIKE '%cadena%' OR name ILIKE '%chain%')
  AND (name ILIKE '%lube%' OR name ILIKE '%lubricante%')
  AND (name ILIKE '%400%' OR name ILIKE '%400ml%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/MotorexChainLubeOffroad.png'
WHERE (name ILIKE '%motorex%') 
  AND (name ILIKE '%cadena%' OR name ILIKE '%chain%')
  AND (name ILIKE '%lube%' OR name ILIKE '%lubricante%')
  AND (name ILIKE '%offroad%' OR name ILIKE '%off-road%' OR name ILIKE '%off road%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/MotorexChainLubeAdventure.png'
WHERE (name ILIKE '%motorex%') 
  AND (name ILIKE '%cadena%' OR name ILIKE '%chain%')
  AND (name ILIKE '%lube%' OR name ILIKE '%lubricante%')
  AND (name ILIKE '%adventure%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/MotorexOilSpray750ML.png'
WHERE (name ILIKE '%motorex%') 
  AND (name ILIKE '%oil spray%' OR name ILIKE '%oilspray%' OR name ILIKE '%spray%')
  AND (name ILIKE '%750%' OR name ILIKE '%750ml%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/MotorexAceitedeFiltrodeAire.png'
WHERE (name ILIKE '%motorex%') 
  AND (name ILIKE '%filtro%' OR name ILIKE '%filter%')
  AND (name ILIKE '%aire%' OR name ILIKE '%air%')
  AND (name ILIKE '%aceite%' OR name ILIKE '%oil%');

-- Actualizar imágenes de refrigerantes
UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/MotorexCoolant5-0.png'
WHERE (name ILIKE '%motorex%') 
  AND (name ILIKE '%coolant%' OR name ILIKE '%refrigerante%')
  AND (name ILIKE '%5.0%' OR name ILIKE '%5-0%' OR name ILIKE '%5 0%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/MotorexCoolant3-0.png'
WHERE (name ILIKE '%motorex%') 
  AND (name ILIKE '%coolant%' OR name ILIKE '%refrigerante%')
  AND (name ILIKE '%3.0%' OR name ILIKE '%3-0%' OR name ILIKE '%3 0%');

-- Actualizar imágenes de limpieza
UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/LimpiezadeMotorLiquiMolyEngineFlush.png'
WHERE (name ILIKE '%liqui moly%' OR name ILIKE '%liquimoly%') 
  AND (name ILIKE '%engine flush%' OR name ILIKE '%engineflush%' OR name ILIKE '%limpieza%' OR name ILIKE '%flush%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/Motorbike4TShooter.png'
WHERE (name ILIKE '%4t shooter%' OR name ILIKE '%4t-shooter%' OR name ILIKE '%shooter%')
  AND (name ILIKE '%motorbike%' OR name ILIKE '%moto%');

-- Actualizar imágenes de filtros
UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/FiltrodeAireDNA11901290790890.png'
WHERE (name ILIKE '%dna%') 
  AND (name ILIKE '%filtro%' OR name ILIKE '%filter%')
  AND (name ILIKE '%aire%' OR name ILIKE '%air%')
  AND (name ILIKE '%1190%' OR name ILIKE '%1290%' OR name ILIKE '%790%' OR name ILIKE '%890%');

-- Actualizar imágenes de pastillas de freno
UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/PastillasdeFrenoGOLDfrenCeramicCarbon.png'
WHERE (name ILIKE '%pastilla%' OR name ILIKE '%brake%' OR name ILIKE '%freno%')
  AND (name ILIKE '%goldfren%' OR name ILIKE '%gold fren%' OR name ILIKE '%gold%')
  AND (name ILIKE '%ceramic%' OR name ILIKE '%cerámica%')
  AND (name ILIKE '%carbon%' OR name ILIKE '%carbón%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/PastillasdeFrenoMoto-MasterSinterPROSeries.png'
WHERE (name ILIKE '%pastilla%' OR name ILIKE '%brake%' OR name ILIKE '%freno%')
  AND (name ILIKE '%moto-master%' OR name ILIKE '%motomaster%' OR name ILIKE '%moto master%')
  AND (name ILIKE '%sinter%' OR name ILIKE '%pro%');

-- Actualizar imágenes de baterías
UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/BateríaFURATFT7B-4GEL12V6-8Ah.png'
WHERE (name ILIKE '%furat%' OR name ILIKE '%fura%')
  AND (name ILIKE '%bateria%' OR name ILIKE '%battery%')
  AND (name ILIKE '%ft7b%' OR name ILIKE '%t7b%')
  AND (name ILIKE '%gel%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/CargadordeBateríaFULBATFULLOAD1000.png'
WHERE (name ILIKE '%fulbat%' OR name ILIKE '%fulload%' OR name ILIKE '%full load%')
  AND (name ILIKE '%cargador%' OR name ILIKE '%charger%')
  AND (name ILIKE '%1000%');

-- Actualizar imágenes de accesorios - Puños
UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/JuegodePuñosKTM-Husqvarna.png'
WHERE (name ILIKE '%puño%' OR name ILIKE '%grip%')
  AND (name ILIKE '%ktm%' OR name ILIKE '%husqvarna%')
  AND (name ILIKE '%juego%' OR name ILIKE '%set%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/PuñosCircuitEquipmentNaranjas.png'
WHERE (name ILIKE '%puño%' OR name ILIKE '%grip%')
  AND (name ILIKE '%circuit%')
  AND (name ILIKE '%equipment%')
  AND (name ILIKE '%naranja%' OR name ILIKE '%orange%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/PuñosCircuitEquipmentGrises.png'
WHERE (name ILIKE '%puño%' OR name ILIKE '%grip%')
  AND (name ILIKE '%circuit%')
  AND (name ILIKE '%equipment%')
  AND (name ILIKE '%gris%' OR name ILIKE '%gray%' OR name ILIKE '%grey%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/PuñosCircuitEquipmentNegrosconAcentosRosados.png'
WHERE (name ILIKE '%puño%' OR name ILIKE '%grip%')
  AND (name ILIKE '%circuit%')
  AND (name ILIKE '%equipment%')
  AND (name ILIKE '%negro%' OR name ILIKE '%black%')
  AND (name ILIKE '%rosado%' OR name ILIKE '%pink%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/PuñosCircuitEquipmentnNegros.png'
WHERE (name ILIKE '%puño%' OR name ILIKE '%grip%')
  AND (name ILIKE '%circuit%')
  AND (name ILIKE '%equipment%')
  AND (name ILIKE '%negro%' OR name ILIKE '%black%')
  AND (name NOT ILIKE '%rosado%' AND name NOT ILIKE '%pink%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/PuñosCircuitIVGrises.png'
WHERE (name ILIKE '%puño%' OR name ILIKE '%grip%')
  AND (name ILIKE '%circuit%')
  AND (name ILIKE '%iv%' OR name ILIKE '%4%')
  AND (name ILIKE '%gris%' OR name ILIKE '%gray%' OR name ILIKE '%grey%');

-- Actualizar imágenes de calienta puños
UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/CalientaPuñosOxfordProAdventure.png'
WHERE (name ILIKE '%calienta%' OR name ILIKE '%heater%')
  AND (name ILIKE '%puño%' OR name ILIKE '%grip%')
  AND (name ILIKE '%oxford%')
  AND (name ILIKE '%pro%' OR name ILIKE '%adventure%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/CalientaPuñosOxford.png'
WHERE (name ILIKE '%calienta%' OR name ILIKE '%heater%')
  AND (name ILIKE '%puño%' OR name ILIKE '%grip%')
  AND (name ILIKE '%oxford%')
  AND (name NOT ILIKE '%pro%' AND name NOT ILIKE '%adventure%');

-- Actualizar imágenes de amarras
UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/AmarrasAcerbisRojas25mm.png'
WHERE (name ILIKE '%amarra%' OR name ILIKE '%strap%' OR name ILIKE '%tie%')
  AND (name ILIKE '%acerbis%')
  AND (name ILIKE '%roja%' OR name ILIKE '%red%')
  AND (name ILIKE '%25%' OR name ILIKE '%25mm%');

UPDATE public.products
SET main_image_url = '/imagenes-repuestos-accesorios/AmarrasAcerbisAzules25mm.png'
WHERE (name ILIKE '%amarra%' OR name ILIKE '%strap%' OR name ILIKE '%tie%')
  AND (name ILIKE '%acerbis%')
  AND (name ILIKE '%azul%' OR name ILIKE '%blue%')
  AND (name ILIKE '%25%' OR name ILIKE '%25mm%');

-- Verificar productos actualizados
SELECT 
  id,
  name,
  main_image_url,
  CASE 
    WHEN main_image_url LIKE '/imagenes-repuestos-accesorios/%' THEN 'Actualizado'
    ELSE 'Sin actualizar'
  END as estado
FROM public.products
WHERE main_image_url LIKE '/imagenes-repuestos-accesorios/%'
ORDER BY name;

-- Contar productos actualizados
SELECT 
  COUNT(*) as total_actualizados
FROM public.products
WHERE main_image_url LIKE '/imagenes-repuestos-accesorios/%';


