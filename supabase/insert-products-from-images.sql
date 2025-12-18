-- Script para insertar productos identificados desde las imágenes
-- Ejecutar en Supabase SQL Editor

-- Función auxiliar para generar slug (simple)
-- Nota: En producción, usa una función más robusta

-- PRODUCTOS ÚNICOS IDENTIFICADOS

-- ============================================
-- ACCESORIOS - PUÑOS/GRIPS
-- ============================================

INSERT INTO public.products (name, slug, description, price, stock, status, is_accessory, is_spare_part, main_image_url) VALUES
('Puños Circuit Equipment Negros con Acentos Rosados', 'puños-circuit-equipment-negros-rosados', 'Puños de motocicleta Circuit Equipment en color negro con acentos rosados. Diseño ergonómico con textura para mejor agarre. Incluye flanges rosados y puntos decorativos. Marca fundada en 1984.', 15900, 4, 'active', true, false, NULL),
('Puños Circuit Equipment Grises', 'puños-circuit-equipment-grises', 'Par de puños Circuit Equipment en color gris con textura de diamante para máximo agarre. Incluye flanges claros. Diseño ergonómico y duradero.', 15900, 3, 'active', true, false, NULL),
('Puños Circuit Equipment Naranjos', 'puños-circuit-equipment-naranjos', 'Puños Circuit Equipment en vibrante color naranjo con textura estriada para mejor control. Flanges integrados. Ideal para personalización de tu moto.', 15900, 4, 'active', true, false, NULL),
('Puños Circuit IV Negros', 'puños-circuit-iv-negros', 'Puños Circuit IV con diseño de textura diamante. Incluye alambre inoxidable para fijación. Marca comprometida con la sostenibilidad. Tu manopla preferida desde 1984.', 18900, 3, 'active', true, false, NULL),
('Juego de Puños KTM/Husqvarna', 'juego-puños-ktm-husqvarna', 'Juego de puños compatibles con KTM y Husqvarna. Color gris oscuro con textura de diamante para máximo agarre. Incluye componente plástico blanco en la base.', 12900, 4, 'active', true, false, NULL);

-- ============================================
-- ACCESORIOS - MANILLARES CALEFACTABLES
-- ============================================

INSERT INTO public.products (name, slug, description, price, stock, status, is_accessory, is_spare_part, main_image_url) VALUES
('Manillares Calefactables Oxford HotGrips Pro Adventure', 'manillares-calefactables-oxford-hotgrips-pro-adventure', 'Manillares calefactables avanzados con controlador integrado. Incluye memoria de configuración de calor, modos de ahorro de batería y ajustes de temperatura responsivos. Ideal para aventura.', 89900, 3, 'active', true, false, NULL),
('Manillares Calefactables Oxford HotGrips Premium Adventure', 'manillares-calefactables-oxford-hotgrips-premium-adventure', 'Manillares calefactables premium con superficie ergonómica. 5 niveles de calor, protección inteligente de batería, fácil instalación. Diseño con texturas específicas para comodidad, sensación, agarre y control.', 109900, 3, 'active', true, false, NULL);

-- ============================================
-- ACCESORIOS - AMARRES/TIE DOWNS
-- ============================================

INSERT INTO public.products (name, slug, description, price, stock, status, is_accessory, is_spare_part, main_image_url) VALUES
('Amarras Acerbis Azules 25mm', 'amarras-acerbis-azules-25mm', 'Par de amarras Acerbis azules de 25mm de ancho. Incluye ganchos recubiertos de plástico negro y hebillas metálicas plateadas. Ideales para asegurar motocicletas durante el transporte.', 24900, 4, 'active', true, false, NULL),
('Amarras Acerbis Rojas 25mm', 'amarras-acerbis-rojas-25mm', 'Par de amarras Acerbis rojas de 25mm de ancho. Incluye ganchos recubiertos de plástico negro y hebillas metálicas. Perfectas para transporte seguro de motocicletas.', 24900, 3, 'active', true, false, NULL);

-- ============================================
-- ACCESORIOS - FILTROS DE AIRE
-- ============================================

INSERT INTO public.products (name, slug, description, price, stock, status, is_accessory, is_spare_part, main_image_url) VALUES
('Filtro de Aire DNA High Performance', 'filtro-aire-dna-high-performance', 'Filtro de aire de alto rendimiento DNA. Aumenta el rendimiento, proporciona máxima filtración, lavable y reutilizable, ahorra combustible, amigable con el medio ambiente, probado en competencia. Garantía de por vida.', 45900, 3, 'active', true, false, NULL);

-- ============================================
-- REPUESTOS - PASTILLAS DE FRENO
-- ============================================

INSERT INTO public.products (name, slug, description, price, stock, status, is_accessory, is_spare_part, main_image_url) VALUES
('Pastillas de Freno GOLD fren Ceramic Carbon', 'pastillas-freno-gold-fren-ceramic-carbon', 'Pastillas de freno de disco GOLD fren con tecnología Ceramic Carbon y Sintered Metal. Alta calidad, material AD, tecnología GF. Hecho en UE. Serie nueva.', 32900, 4, 'active', false, true, NULL),
('Pastillas de Freno Moto-Master Sinter PRO Series', 'pastillas-freno-moto-master-sinter-pro', 'Pastillas de freno de alto rendimiento Moto-Master Sinter PRO Series. Uso en pista, máxima potencia, larga duración. Compuesto Racing. Ideal para competición.', 38900, 3, 'active', false, true, NULL);

-- ============================================
-- REPUESTOS - BATERÍAS
-- ============================================

INSERT INTO public.products (name, slug, description, price, stock, status, is_accessory, is_spare_part, main_image_url) VALUES
('Batería FURAT FT7B-4 GEL 12V 6.8Ah', 'bateria-furat-ft7b-4-gel-12v', 'Batería FURAT FT7B-4 tecnología GEL. 12V, 6.8Ah (20h), 6.5Ah (10h), 110A (EN). No derramable. Ideal para motocicletas y scooters.', 45900, 3, 'active', false, true, NULL),
('Batería BS BATTERY BTZ12S SLA 12V', 'bateria-bs-battery-btz12s-sla-12v', 'Batería BS BATTERY BTZ12S tecnología SLA (Sealed Lead Acid). 12V, 215A (EN). No derramable. Batería sellada de plomo-ácido.', 42900, 4, 'active', false, true, NULL),
('Cargador de Batería FULBAT FULLOAD 1000', 'cargador-bateria-fulbat-fulload-1000', 'Cargador inteligente de batería FULBAT FULLOAD 1000. 1A, compatible 6V/12V. Para baterías de plomo-ácido y litio (LiFePO4). 4 modos de carga, pantalla LED fácil de leer, seguro y fácil de usar.', 34900, 3, 'active', true, false, NULL);

-- ============================================
-- REPUESTOS - ACEITES Y LUBRICANTES
-- ============================================

INSERT INTO public.products (name, slug, description, price, stock, status, is_accessory, is_spare_part, main_image_url) VALUES
('Aceite Motorex 4T Top Speed 15W-50', 'aceite-motorex-4t-top-speed-15w50', 'Aceite de motor Motorex 4T Top Speed. SAE 15W-50, JASO MA2, sintético de alto rendimiento. 1L. Oil of Switzerland.', 12900, 4, 'active', false, true, NULL),
('Aceite Motorex 4T Cross Power 10W-50', 'aceite-motorex-4t-cross-power-10w50', 'Aceite de motor Motorex 4T Cross Power. SAE 10W-50, JASO MA2, totalmente sintético. Diseñado para motocross. 1L. Oil of Switzerland.', 12900, 3, 'active', false, true, NULL),
('Aceite Motorex 4T Power Synt 10W-50', 'aceite-motorex-4t-power-synt-10w50', 'Aceite de motor Motorex 4T Power Synt. SAE 10W-50, JASO MA2, totalmente sintético. Alto rendimiento. 1L. Oil of Switzerland.', 12900, 4, 'active', false, true, NULL),
('Aceite Liqui Moly 4T Synth Offroad Race 10W-50', 'aceite-liqui-moly-4t-synth-offroad-race-10w50', 'Aceite de motor Liqui Moly 4T Synth Offroad Race. SAE 10W-50, totalmente sintético. Especificaciones: API SN PLUS, JASO MA2. Hecho en Alemania. 1L.', 11900, 3, 'active', false, true, NULL),
('Aceite Elf Moto 4 Cruise 20W-50', 'aceite-elf-moto-4-cruise-20w50', 'Aceite de motor Elf Moto 4 Cruise. 4T, SAE 20W-50, JASO MA2, API SL. Mineral. 1L. Ideal para cruceros y uso urbano.', 9900, 4, 'active', false, true, NULL),
('Aceite Elf Moto 4 Tech 10W-50', 'aceite-elf-moto-4-tech-10w50', 'Aceite de motor Elf Moto 4 Tech. 4T, SAE 10W-50, tecnología sintética. 1L. Alto rendimiento para motos deportivas.', 11900, 3, 'active', false, true, NULL);

-- ============================================
-- REPUESTOS - LUBRICANTES DE CADENA
-- ============================================

INSERT INTO public.products (name, slug, description, price, stock, status, is_accessory, is_spare_part, main_image_url) VALUES
('Lubricante de Cadena Motorex Adventure All Terrain 500ml', 'lubricante-cadena-motorex-adventure-all-terrain', 'Lubricante de cadena Motorex Adventure All Terrain. 500ml, 406g. Alto rendimiento, intervalo de re-lubricación 500 km. Para todo terreno y aventura.', 12900, 4, 'active', false, true, NULL),
('Lubricante de Cadena Motorex Off Road Fully Synthetic 500ml', 'lubricante-cadena-motorex-offroad-fully-synthetic', 'Lubricante de cadena Motorex Off Road Fully Synthetic. 500ml, totalmente sintético. Para uso off-road. Oil of Switzerland.', 12900, 3, 'active', false, true, NULL),
('Lubricante de Cadena Elf Moto Chain Lube 400ml', 'lubricante-cadena-elf-moto-chain-lube', 'Lubricante de cadena Elf Moto Chain Lube. 400ml. De larga duración, impermeable, propiedades adhesivas excepcionales. Compatible con moto, offroad, quad, supersport, scooter, moped.', 9900, 4, 'active', false, true, NULL);

-- ============================================
-- REPUESTOS - ACEITE DE HORQUILLA
-- ============================================

INSERT INTO public.products (name, slug, description, price, stock, status, is_accessory, is_spare_part, main_image_url) VALUES
('Aceite de Horquilla Motorex Racing Fork Oil 5W', 'aceite-horquilla-motorex-racing-fork-oil-5w', 'Aceite de horquilla Motorex Racing Fork Oil 5W. Desarrollado por Motorex Racing Lab. Tecnología 3D Response. 1L. Oil of Switzerland.', 14900, 3, 'active', false, true, NULL);

-- ============================================
-- REPUESTOS - ACEITE DE FILTRO DE AIRE
-- ============================================

INSERT INTO public.products (name, slug, description, price, stock, status, is_accessory, is_spare_part, main_image_url) VALUES
('Aceite de Filtro de Aire Motorex Oil 206 1L', 'aceite-filtro-aire-motorex-oil-206', 'Aceite de filtro de aire Motorex Oil 206. 1L (1.057qt / 33.8 fl.oz). Máximo flujo de aire, excelente adherencia. Oil of Switzerland.', 12900, 4, 'active', false, true, NULL),
('Aceite de Filtro de Aire Motorex 750ml Aerosol', 'aceite-filtro-aire-motorex-aerosol-750ml', 'Aceite de filtro de aire Motorex en aerosol. 750ml. Máximo flujo de aire, excelente adherencia. Fácil aplicación. Oil of Switzerland.', 11900, 3, 'active', false, true, NULL);

-- ============================================
-- REPUESTOS - REFRIGERANTE
-- ============================================

INSERT INTO public.products (name, slug, description, price, stock, status, is_accessory, is_spare_part, main_image_url) VALUES
('Refrigerante Motorex Coolant M5.0 Hybrid Technology', 'refrigerante-motorex-coolant-m50-hybrid', 'Refrigerante Motorex Coolant M5.0 con tecnología híbrida. Listo para usar. 1L. Biodegradable. Oil of Switzerland.', 11900, 4, 'active', false, true, NULL),
('Refrigerante Motorex Coolant M3.0 OAT Technology', 'refrigerante-motorex-coolant-m30-oat', 'Refrigerante Motorex Coolant M3.0 con tecnología OAT. Listo para usar. 1L. Biodegradable. Oil of Switzerland.', 11900, 3, 'active', false, true, NULL);

-- ============================================
-- ACCESORIOS - LIMPIEZA Y MANTENIMIENTO
-- ============================================

INSERT INTO public.products (name, slug, description, price, stock, status, is_accessory, is_spare_part, main_image_url) VALUES
('Limpiador Interior de Casco Liqui Moly Motorbike', 'limpiador-interior-casco-liqui-moly-motorbike', 'Limpiador interior de casco Liqui Moly para motocicletas. Con fragancia cítrica. Limpia a fondo las almohadillas del casco de sudor, grasa y suciedad. 400ml.', 11000, 4, 'active', true, false, NULL),
('Limpiador Interior de Casco Liqui Moly Racing', 'limpiador-interior-casco-liqui-moly-racing', 'Limpiador interior de casco Liqui Moly Racing. Con fragancia cítrica. Limpieza profunda de almohadillas. 400ml.', 11000, 3, 'active', true, false, NULL),
('Limpieza de Motor Liqui Moly Engine Flush', 'limpieza-motor-liqui-moly-engine-flush', 'Limpieza de motor Liqui Moly Engine Flush. Elimina depósitos y residuos perjudiciales del motor. Para motocicletas. 1L.', 12900, 4, 'active', false, true, NULL),
('Aditivo Combustible Liqui Moly 4T Additive Shooter', 'aditivo-combustible-liqui-moly-4t-additive-shooter', 'Aditivo para sistema de combustible Liqui Moly 4T Additive Shooter. Limpiador de sistema de combustible para motocicletas 4 tiempos. Hecho en Alemania.', 4500, 3, 'active', false, true, NULL);

-- Verificar productos insertados
SELECT COUNT(*) as total_productos FROM public.products WHERE status = 'active';




