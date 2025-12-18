-- Script para insertar motos usadas en la base de datos
-- Ejecutar en Supabase SQL Editor
-- Si necesitas evitar duplicados, elimina las motos existentes primero o usa el panel de admin

-- Voge DS800 X Rally (Nueva - 0 kms)
INSERT INTO public.used_motorcycles (
  title,
  brand,
  model,
  year,
  mileage,
  price,
  description,
  status,
  main_image_url,
  images_urls,
  featured
) VALUES (
  'Voge DS800 X Rally',
  'Voge',
  'DS800 X Rally',
  2024,
  0,
  NULL, -- Precio a consultar
  'Moto nueva con 0 kilómetros. Modelo DS800 X Rally de Voge, perfecta para aventura y off-road. Lista para estrenar.',
  'active',
  '/MOTOS/VOGEDS800RALLY-PORTADA.png',
  ARRAY[
    '/MOTOS/VOGEDS800RALLY-PORTADA.png',
    '/MOTOS/VOGEDS800RALLY-TABLERO.png',
    '/MOTOS/VOGEDS800RALLY-TRASERA.png'
  ]::TEXT[],
  true
);

-- Yamaha P7
INSERT INTO public.used_motorcycles (
  title,
  brand,
  model,
  year,
  mileage,
  price,
  description,
  status,
  main_image_url,
  images_urls,
  featured
) VALUES (
  'Yamaha P7',
  'Yamaha',
  'P7',
  2020,
  15000,
  NULL, -- Precio a consultar
  'Yamaha P7 en excelente estado. Revisada completamente en nuestro taller. Motor, transmisión, frenos y suspensión en perfectas condiciones.',
  'active',
  '/MOTOS/YAMAHAP7-PORTADA.png',
  ARRAY[
    '/MOTOS/YAMAHAP7-PORTADA.png',
    '/MOTOS/YAMAHAP7-TABLERO.png',
    '/MOTOS/YAMAHAP7-TRASERA.png',
    '/MOTOS/yamahap7-lateral.png'
  ]::TEXT[],
  false
);

-- KTM 1090
INSERT INTO public.used_motorcycles (
  title,
  brand,
  model,
  year,
  mileage,
  price,
  description,
  status,
  main_image_url,
  images_urls,
  featured
) VALUES (
  'KTM 1090 Adventure',
  'KTM',
  '1090 Adventure',
  2018,
  25000,
  NULL, -- Precio a consultar
  'KTM 1090 Adventure en muy buen estado. Moto de aventura con excelente historial de mantención. Revisada completamente en nuestro taller.',
  'active',
  '/MOTOS/KTM1090-PORTADA.png',
  ARRAY[
    '/MOTOS/KTM1090-PORTADA.png',
    '/MOTOS/KTM1090-LATERAL.png',
    '/MOTOS/KTM1090-TRASERA.png',
    '/MOTOS/KTM1090-TABLERO.png'
  ]::TEXT[],
  true
);

-- Bonneville SE (Triumph)
INSERT INTO public.used_motorcycles (
  title,
  brand,
  model,
  year,
  mileage,
  price,
  description,
  status,
  main_image_url,
  images_urls,
  featured
) VALUES (
  'Triumph Bonneville SE',
  'Triumph',
  'Bonneville SE',
  2019,
  18000,
  NULL, -- Precio a consultar
  'Triumph Bonneville SE en excelente estado. Moto clásica con estilo moderno. Revisada completamente en nuestro taller. Motor, transmisión y sistemas en perfectas condiciones.',
  'active',
  '/MOTOS/BONNEVILLETRIUMP-PORTADA.png',
  ARRAY[
    '/MOTOS/BONNEVILLETRIUMP-PORTADA.png',
    '/MOTOS/BONNEVILLETRIUMP-TRASERA.png',
    '/MOTOS/BONNEVILLETRIUMP-TABLERO.png'
  ]::TEXT[],
  false
);

-- Verificar las motos insertadas
SELECT 
  id,
  title,
  brand,
  model,
  year,
  mileage,
  price,
  status,
  featured,
  main_image_url
FROM public.used_motorcycles
WHERE status = 'active'
ORDER BY featured DESC, created_at DESC;
