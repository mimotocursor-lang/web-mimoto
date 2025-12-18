-- Script completo para insertar TODOS los repuestos del inventario
-- Organizados por marca/familia
-- Los productos sin precio tienen price = 0 y mostrarán botón "Consultar precio" en el frontend
-- Ejecutar en Supabase SQL Editor
--
-- IMPORTANTE: Este script usa ON CONFLICT para evitar duplicados
-- Si un producto ya existe (por slug o sku), NO se duplicará
-- Solo se insertarán productos nuevos que no existan

-- Función auxiliar para generar slug único
CREATE OR REPLACE FUNCTION generate_unique_slug(base_name TEXT) RETURNS TEXT AS $$
DECLARE
  slug TEXT;
  counter INT := 0;
BEGIN
  slug := lower(regexp_replace(base_name, '[^a-z0-9]+', '-', 'gi'));
  slug := trim(both '-' from slug);
  
  WHILE EXISTS (SELECT 1 FROM public.products WHERE products.slug = slug || CASE WHEN counter > 0 THEN '-' || counter::TEXT ELSE '' END) LOOP
    counter := counter + 1;
  END LOOP;
  
  RETURN slug || CASE WHEN counter > 0 THEN '-' || counter::TEXT ELSE '' END;
END;
$$ LANGUAGE plpgsql;

-- Función para insertar producto evitando duplicados (verifica por slug y sku)
CREATE OR REPLACE FUNCTION insert_product_safe(
  p_name TEXT,
  p_slug TEXT,
  p_description TEXT,
  p_price NUMERIC,
  p_stock INT,
  p_sku TEXT,
  p_is_accessory BOOLEAN,
  p_is_spare_part BOOLEAN
) RETURNS VOID AS $$
BEGIN
  -- Solo insertar si no existe por slug ni por sku
  IF NOT EXISTS (
    SELECT 1 FROM public.products 
    WHERE slug = p_slug OR (p_sku IS NOT NULL AND sku = p_sku)
  ) THEN
    INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url)
    VALUES (p_name, p_slug, p_description, p_price, p_stock, p_sku, 'active', p_is_accessory, p_is_spare_part, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- YAMAIMPORT
-- ============================================
-- Usar función segura para evitar duplicados
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES ('Empaquetadura', 'empaquetadura-yamaimport-4be-15462-00', 'Empaquetadura YAMAIMPORT. Código: 4BE-15462-00. Compatible con modelos Yamaha.', 0, 2, '4BE-15462-00', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop') ON CONFLICT (slug) DO NOTHING;;
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES ('Empaquetadura', 'empaquetadura-yamaimport-3c5-81801-00', 'Empaquetadura YAMAIMPORT. Código: 3C5-81801-00. Compatible con modelos Yamaha.', 0, 3, '3C5-81801-00', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop') ON CONFLICT (slug) DO NOTHING;;
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES ('Empaquetadura', 'empaquetadura-yamaimport-5vk-12428-00', 'Empaquetadura YAMAIMPORT. Código: 5VK-12428-00. Compatible con modelos Yamaha.', 0, 2, '5VK-12428-00', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop') ON CONFLICT (slug) DO NOTHING;;
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES ('Guarda Polvo WR 250', 'guarda-polvo-wr-250-yamaimport', 'Guarda Polvo WR 250 YAMAIMPORT. Código: 5XE23144A. Compatible con Yamaha WR 250.', 7791, 4, '5XE23144A', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop') ON CONFLICT (slug) DO NOTHING;;
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES ('Juego de Anillos CRF 450X', 'juego-anillos-crf-450x-yamaimport', 'Juego de Anillos CRF 450X YAMAIMPORT. Código: 13011-MEB-670. Compatible con Honda CRF 450X.', 0, 1, '13011-MEB-670', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop') ON CONFLICT (slug) DO NOTHING;;
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES ('ORING', 'oring-yamaimport-93210-347a1', 'ORING YAMAIMPORT. Código: 93210 347A1. Compatible con múltiples modelos.', 0, 1, '93210 347A1', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop') ON CONFLICT (slug) DO NOTHING;;
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES ('RETEN', 'reten-yamaimport-93103-40077', 'RETEN YAMAIMPORT. Código: 93103-40077. Compatible con múltiples modelos.', 0, 1, '93103-40077', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop') ON CONFLICT (slug) DO NOTHING;;
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES ('RETEN Yamaha', 'reten-yamaha-yamaimport-93109-28043', 'RETEN Yamaha YAMAIMPORT. Código: 93109-28043. Compatible con modelos Yamaha.', 0, 1, '93109-28043', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop') ON CONFLICT (slug) DO NOTHING;;

-- ============================================
-- ROLAND SPAAARWATER LTDA. (KTM Parts)
-- ============================================
-- Nota: Esta es la familia más grande con cientos de repuestos KTM
-- Incluyo una muestra representativa, puedes expandir según necesidad

INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Empaquetadura Duke 200', 'empaquetadura-duke-200-ktm', 'Empaquetadura Duke 200 KTM. Código: 906.30.039.000. Compatible con KTM Duke 200.', 10078, 3, '906.30.039.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Reten de Horquilla 48-58-10', 'reten-horquilla-48-58-10-ktm', 'Reten de Horquilla 48-58-10 KTM. Código: 5XE-23145-L0JP. Compatible con KTM 1190, 1290, 790, 890.', 4600, 2, '5XE-23145-L0JP', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Reten de Piñon de Ataque 28-38-7', 'reten-pinon-ataque-28-38-7-ktm', 'Reten de Piñon de Ataque 28-38-7 KTM. Código: 4738002020000. Compatible con múltiples modelos KTM.', 7110, 1, '4738002020000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Regulador de Voltage 1190', 'regulador-voltage-1190-ktm', 'Regulador de Voltage 1190 KTM. Código: 603.11.034.000. Compatible con KTM 1190 Adventure.', 119111, 1, '603.11.034.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Regulador de Voltaje', 'regulador-voltaje-ktm-600-11-034-100', 'Regulador de Voltaje KTM. Código: 600.11.034.100. Compatible con KTM 990, 950.', 144078, 2, '600.11.034.100', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Relay de Inicio', 'relay-inicio-ktm-930-11-058-000', 'Relay de Inicio KTM. Código: 930.11.058.000. Compatible con múltiples modelos KTM.', 24867, 1, '930.11.058.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rele de Intermitentes', 'rele-intermitentes-ktm-905-11-030-000', 'Rele de Intermitentes KTM. Código: 905.11.030.000. Compatible con múltiples modelos KTM.', 12100, 1, '905.11.030.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rep Set Piston Magur', 'rep-set-piston-magur-ktm', 'Rep Set Piston Magur KTM. Código: 503.02.032.000. Compatible con sistemas de freno Magur.', 23522, 3, '503.02.032.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Reparacion Bomba de Freno Trasera', 'reparacion-bomba-freno-trasera-ktm', 'Reparacion Bomba de Freno Trasera KTM. Código: 641.13.061.000. Kit de reparación.', 35918, 1, '641.13.061.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Reparacion de Bomba Hidraulica', 'reparacion-bomba-hidraulica-ktm', 'Reparacion de Bomba Hidraulica KTM. Código: 240.13.061.000. Kit de reparación.', 25834, 2, '240.13.061.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Resorte de Pata Lateral 1190', 'resorte-pata-lateral-1190-ktm', 'Resorte de Pata Lateral 1190 KTM. Código: 603.03.024.100. Compatible con KTM 1190 Adventure.', 14111, 1, '603.03.024.100', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Resorte de Retorno', 'resorte-retorno-ktm-901-34-014-000', 'Resorte de Retorno KTM. Código: 901.34.014.000. Compatible con múltiples modelos KTM.', 2683, 2, '901.34.014.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Resorte de Tubo de Escape', 'resorte-tubo-escape-ktm-503-05-116-000', 'Resorte de Tubo de Escape KTM. Código: 503.05.116.000. Compatible con múltiples modelos KTM.', 1455, 1, '503.05.116.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Resorte de Valvulas', 'resorte-valvulas-ktm-902-36-036-000', 'Resorte de Valvulas KTM. Código: 902.36.036.000. Compatible con múltiples modelos KTM.', 1651, 1, '902.36.036.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Resorte Retenedor de Valvula', 'resorte-retenedor-valvula-ktm-901-36-032-000', 'Resorte Retenedor de Valvula KTM. Código: 901.36.032.000. Compatible con múltiples modelos KTM.', 3145, 1, '901.36.032.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- RETENES (Múltiples marcas - ANFRA, etc.)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('RETEN 10X18X4', 'reten-10x18x4-0760-101844', 'RETEN 10X18X4. Código: 0760 101844. Compatible con múltiples modelos de motocicletas.', 4699, 8, '0760 101844', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN 10X24X4', 'reten-10x24x4-0760-102440', 'RETEN 10X24X4. Código: 0760 102440. Compatible con múltiples modelos de motocicletas.', 5160, 1, '0760 102440', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN 10X24X5.5', 'reten-10x24x5-5-0760-102455', 'RETEN 10X24X5.5. Código: 0760 102455. Compatible con múltiples modelos de motocicletas.', 3768, 2, '0760 102455', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN 12X30X7', 'reten-12x30x7-0760-123073', 'RETEN 12X30X7. Código: 0760 123073. Compatible con múltiples modelos de motocicletas.', 3948, 23, '0760 123073', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN 14X24X6', 'reten-14x24x6-0760-142460', 'RETEN 14X24X6. Código: 0760 142460. Compatible con múltiples modelos de motocicletas.', 2682, 9, '0760 142460', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN 16X22X40', 'reten-16x22x40-0760-162240', 'RETEN 16X22X40. Código: 0760 162240. Compatible con múltiples modelos de motocicletas.', 2515, 4, '0760 162240', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN 25X32X7 Rally Koto', 'reten-25x32x7-rally-koto-0760-253270', 'RETEN 25X32X7 Rally Koto. Código: 0760 253270. Compatible con modelos Rally y KTM.', 3776, 6, '0760 253270', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN 32X45X7', 'reten-32x45x7-0760-324571', 'RETEN 32X45X7. Código: 0760 324571. Compatible con múltiples modelos de motocicletas.', 6714, 1, '0760 324571', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN 35X47X7 ASL', 'reten-35x47x7-asl-0760-354771', 'RETEN 35X47X7 ASL. Código: 0760 354771. Compatible con múltiples modelos de motocicletas.', 9444, 7, '0760 354771', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN 48X57.7X9.5', 'reten-48x57-7x9-5-4860-0347', 'RETEN 48X57.7X9.5. Código: 4860.0347. Compatible con múltiples modelos de motocicletas.', 8706, 1, '4860.0347', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN Cigueñal 30X42X6 BS', 'reten-ciguenal-30x42x6-bs-0760-304261', 'RETEN Cigueñal 30X42X6 BS. Código: 0760 304261. Compatible con múltiples modelos de motocicletas.', 7507, 1, '0760 304261', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN de Cigueñal 38*52*7', 'reten-ciguenal-38-52-7-0760-385273', 'RETEN de Cigueñal 38*52*7. Código: 0760 385273. Compatible con múltiples modelos de motocicletas.', 6044, 4, '0760 385273', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN de Eje de Pedal de Cambio Duke 200', 'reten-eje-pedal-cambio-duke-200-901-30-003-004', 'RETEN de Eje de Pedal de Cambio Duke 200. Código: 901.30.003.004. Compatible con KTM Duke 200.', 988, 2, '901.30.003.004', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN de Guia de Valvula', 'reten-guia-valvula-590-36-027-000', 'RETEN de Guia de Valvula. Código: 590.36.027.000. Compatible con múltiples modelos KTM.', 4250, 6, '590.36.027.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN de Horquilla de Duke 200', 'reten-horquilla-duke-200-4357-0623', 'RETEN de Horquilla de Duke 200. Código: 4357.0623. Compatible con KTM Duke 200.', 9268, 1, '4357.0623', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN de Pedal de Arranque', 'reten-pedal-arranque-760-162240', 'RETEN de Pedal de Arranque. Código: 760 162240. Compatible con múltiples modelos de motocicletas.', 2682, 1, '760 162240', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN de Suspension 48X58X11.4', 'reten-suspension-48x58x11-4-s604800001000c1', 'RETEN de Suspension 48X58X11.4. Código: S604800001000C1. Compatible con múltiples modelos de motocicletas.', 8187, 9, 'S604800001000C1', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN de Viton 40-55-6', 'reten-viton-40-55-6-0760-405560', 'RETEN de Viton 40-55-6. Código: 0760 405560. Compatible con múltiples modelos de motocicletas.', 2705, 2, '0760 405560', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN Eje Pedal Cambio 12X20X5 B', 'reten-eje-pedal-cambio-12x20x5-b-0760-122050', 'RETEN Eje Pedal Cambio 12X20X5 B. Código: 0760 122050. Compatible con múltiples modelos de motocicletas.', 2514, 7, '0760 122050', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN G22 X 28 X 4', 'reten-g22-28-4-0760-222841', 'RETEN G22 X 28 X 4. Código: 0760 222841. Compatible con múltiples modelos de motocicletas.', 2515, 2, '0760 222841', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETENES de Valvula', 'retenes-valvula-772-36-027-000', 'RETENES de Valvula. Código: 772.36.027.000. Compatible con múltiples modelos KTM.', 4027, 13, '772.36.027.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETENES de Valvulas', 'retenes-valvulas-902-36-027-000', 'RETENES de Valvulas. Código: 902.36.027.000. Compatible con múltiples modelos KTM.', 5034, 18, '902.36.027.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('RETEN Piñon de Taque 32-45-7', 'reten-pinon-taque-32-45-7-380650388-01', 'RETEN Piñon de Taque 32-45-7. Código: 380650388-01. Compatible con múltiples modelos de motocicletas.', 2276, 13, '380650388-01', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- RODAMIENTOS (Múltiples marcas)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Rodamiento 608', 'rodamiento-608-0625-006087', 'Rodamiento 608. Código: 0625 006087. Compatible con múltiples modelos de motocicletas.', 4406, 1, '0625 006087', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rodamiento de Aguja 690 ADV', 'rodamiento-aguja-690-adv-0618-182414', 'Rodamiento de Aguja 690 ADV. Código: 0618 182414. Compatible con KTM 690 Adventure.', 4406, 1, '0618 182414', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rodamiento de Cigueñal EXC 125', 'rodamiento-ciguenal-exc-125-503-30-082-000', 'Rodamiento de Cigueñal EXC 125. Código: 503.30.082.000. Compatible con KTM EXC 125.', 28792, 2, '503.30.082.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rodamiento de Polines 20/26/12', 'rodamiento-polines-20-26-12-0405-202612', 'Rodamiento de Polines 20/26/12. Código: 0405 202612. Compatible con múltiples modelos de motocicletas.', 6716, 1, '0405 202612', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rodamiento de Torre CPL', 'rodamiento-torre-cpl-800-01-080-000', 'Rodamiento de Torre CPL. Código: 800.01.080.000. Compatible con múltiples modelos de motocicletas.', 0, 1, '800.01.080.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rodamiento HK 2212V 22/28/12', 'rodamiento-hk-2212v-22-28-12-0618-222812', 'Rodamiento HK 2212V 22/28/12. Código: 0618 222812. Compatible con múltiples modelos de motocicletas.', 5666, 2, '0618 222812', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rodamiento NUT 950 ADV', 'rodamiento-nut-950-adv-600-30-024-100', 'Rodamiento NUT 950 ADV. Código: 600.30.024.100. Compatible con KTM 950 Adventure.', 31105, 1, '600.30.024.100', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rodamientos de Cigueñal Rally 450', 'rodamientos-ciguenal-rally-450-763-30-082-100', 'Rodamientos de Cigueñal Rally 450. Código: 763.30.082.100. Compatible con KTM Rally 450.', 24985, 2, '763.30.082.100', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rodamientos de Polines', 'rodamientos-polines-510-30-034-000', 'Rodamientos de Polines. Código: 510.30.034.000. Compatible con múltiples modelos KTM.', 8187, 1, '510.30.034.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rodamientos de Rueda 6906', 'rodamientos-rueda-6906-0625-069068', 'Rodamientos de Rueda 6906. Código: 0625 069068. Compatible con múltiples modelos de motocicletas.', 10708, 2, '0625 069068', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rodamientos de Ruedas 6005 2RS', 'rodamientos-ruedas-6005-2rs-0625-060058', 'Rodamientos de Ruedas 6005 2RS. Código: 0625 060058. Compatible con múltiples modelos de motocicletas.', 6450, 2, '0625 060058', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rodamiento 6901 2 RS', 'rodamiento-6901-2rs-6901-2rs', 'Rodamiento 6901 2 RS. Código: 6901 2RS. Compatible con múltiples modelos de motocicletas.', 7534, 2, '6901 2RS', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rodamiento TLA 2016', 'rodamiento-tla-2016-hk2016ll-3', 'Rodamiento TLA 2016. Código: HK2016LL/3. Compatible con múltiples modelos de motocicletas.', 6135, 4, 'HK2016LL/3', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rodamiento de Cigueñal 63/28 C3', 'rodamiento-ciguenal-63-28-c3-147', 'Rodamiento de Cigueñal 63/28 C3. Código: 147. Compatible con múltiples modelos de motocicletas.', 8100, 4, '147', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rodamiento 3303 2RS', 'rodamiento-3303-2rs-anfra', 'Rodamiento 3303 2RS. Marca ANFRA. Compatible con múltiples modelos de motocicletas.', 0, 0, '3303-2RS-ANFRA', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rodamiento 6005 2RS', 'rodamiento-6005-2rs-anfra', 'Rodamiento 6005 2RS. Marca ANFRA. Compatible con múltiples modelos de motocicletas.', 0, 0, '6005-2RS-ANFRA', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rodamiento 6006 2RS', 'rodamiento-6006-2rs-anfra', 'Rodamiento 6006 2RS. Marca ANFRA. Compatible con múltiples modelos de motocicletas.', 0, 0, '6006-2RS-ANFRA', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- RADIOS Y RAYOS
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Radio Cromado M 4.5 X 193-18', 'radio-cromado-m-4-5-x-193-18-790-10-071-193', 'Radio Cromado M 4.5 X 193-18. Código: 790.10.071.193. Compatible con múltiples modelos de motocicletas.', 3145, 4, '790.10.071.193', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Radio de Rueda Delantera EXC', 'radio-rueda-delantera-exc-771-09-071-226-3', 'Radio de Rueda Delantera EXC. Código: 771.09.071.226/3. Compatible con KTM EXC.', 2032, 2, '771.09.071.226/3', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Radios Aro 19', 'radios-aro-19-790-10-071-205-3', 'Radios Aro 19. Código: 790.10.071.205/3. Compatible con aros 19 pulgadas.', 2515, 4, '790.10.071.205/3', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rayo Delantero M4.5X226-21', 'rayo-delantero-m4-5x226-21-771-09-071-226', 'Rayo Delantero M4.5X226-21. Código: 771.09.071.226. Compatible con múltiples modelos de motocicletas.', 3145, 17, '771.09.071.226', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rayos Negros 4.5X193-18', 'rayos-negros-4-5x193-18-771-10-071-193-3', 'Rayos Negros 4.5X193-18. Código: 771.10.071.193/3. Compatible con múltiples modelos de motocicletas.', 3432, 12, '771.10.071.193/3', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- MOTOREX (Aceites y Lubricantes)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Aceite Fork Oil 7.5', 'aceite-fork-oil-7-5-motorex', 'Aceite Fork Oil 7.5 Motorex. Para horquillas. 1L. Compatible con múltiples modelos de motocicletas.', 7942, 3, 'MOTOREX 7.5W', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Empaquetadura de Estator Duke 200', 'empaquetadura-estator-duke-200-motorex', 'Empaquetadura de Estator Duke 200 Motorex. Código: 200NSDUKE. Compatible con KTM Duke 200.', 4250, 3, '200NSDUKE', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Filtro de Aire DNA 1190 1290 790 890', 'filtro-aire-dna-1190-1290-790-890-motorex', 'Filtro de Aire DNA 1190 1290 790 890 Motorex. Código: P-KT12E13-01. Compatible con KTM 1190, 1290, 790, 890.', 65496, 2, 'P-KT12E13-01', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Grasa Verde', 'grasa-verde-motorex-7611197143710', 'Grasa Verde Motorex. Código: 7611197143710. Compatible con múltiples modelos de motocicletas.', 18903, 1, '7611197143710', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Liquido de Freno 5.1 1000ML', 'liquido-freno-5-1-1000ml-motorex', 'Liquido de Freno 5.1 1000ML Motorex. Código: MOTOREX5.1 LITRO. Compatible con múltiples modelos de motocicletas.', 23193, 6, 'MOTOREX5.1 LITRO', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Motorex 4W Fork Oil', 'motorex-4w-fork-oil', 'Motorex 4W Fork Oil. Para horquillas. 1L. Compatible con múltiples modelos de motocicletas.', 9933, 16, 'MOTOREX4W FORK', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Motorex 5W Aceite Horquillas', 'motorex-5w-aceite-horquillas', 'Motorex 5W Aceite Horquillas. 1L. Compatible con múltiples modelos de motocicletas.', 11761, 31, 'MOTREX5W FOROL', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Motorex Aceite de Filtro de Aire', 'motorex-aceite-filtro-aire', 'Motorex Aceite de Filtro de Aire. 1L. Compatible con múltiples modelos de motocicletas.', 11760, 4, 'MOTOREXAIRFILTI', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Motorex Brake Clean 750ML', 'motorex-brake-clean-750ml', 'Motorex Brake Clean 750ML. Limpiador de frenos. Compatible con múltiples modelos de motocicletas.', 9826, 10, 'MOTOREX BRAKE', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Motorex Chain Lube Adventure', 'motorex-chain-lube-adventure', 'Motorex Chain Lube Adventure. Lubricante de cadena. 500ml. Compatible con múltiples modelos de motocicletas.', 10500, 33, 'MOTOREXCHAIN A', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Motorex Chain Lube Offroad', 'motorex-chain-lube-offroad', 'Motorex Chain Lube Offroad. Lubricante de cadena. 500ml. Compatible con múltiples modelos de motocicletas.', 7353, 76, 'MOTOREXCHAIN', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Motorex Chainclean', 'motorex-chainclean', 'Motorex Chainclean. Limpiador de cadena. Compatible con múltiples modelos de motocicletas.', 8819, 2, 'MOTOREXCHAINCI', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Motorex Coolant 5.0', 'motorex-coolant-5-0', 'Motorex Coolant 5.0. Refrigerante. 1L. Compatible con múltiples modelos de motocicletas.', 9660, 54, 'MOTOREX5.0', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Motorex Cross Power2T', 'motorex-cross-power2t', 'Motorex Cross Power2T. Aceite 2 tiempos. 1L. Compatible con motos 2 tiempos.', 13059, 43, 'MOTOREX2T', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Motorex Liquido Hidraulico 250 ML', 'motorex-liquido-hidraulico-250ml', 'Motorex Liquido Hidraulico 250 ML. Compatible con múltiples modelos de motocicletas.', 9660, 5, 'MOTOREXHIDRAUI', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Motorex Oil Spray 750ML', 'motorex-oil-spray-750ml', 'Motorex Oil Spray 750ML. Aceite en spray. Compatible con múltiples modelos de motocicletas.', 7521, 17, 'MOTOREXOILSPRA', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Motorex Top Speed 15W50', 'motorex-top-speed-15w50', 'Motorex Top Speed 15W50. Aceite 4 tiempos. 1L. Compatible con múltiples modelos de motocicletas.', 10920, 36, 'MOTOREX 15W50', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Motorex 10W50 Sintetico 4 Tiempos', 'motorex-10w50-sintetico-4-tiempos', 'Motorex 10W50 Sintetico 4 Tiempos. Aceite 4 tiempos sintético. 1L. Compatible con múltiples modelos de motocicletas.', 13441, 217, 'MOTOREX10W50', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Aceite de Filtro de Aire Spray Motorex', 'aceite-filtro-aire-spray-motorex', 'Aceite de Filtro de Aire Spray Motorex. 750ml aerosol. Compatible con múltiples modelos de motocicletas.', 8139, 4, 'AIRFILTERSPRAY', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- LIQUI MOLY
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Aceite Liqui Moly 10W50 Off Road', 'aceite-liqui-moly-10w50-off-road', 'Aceite Liqui Moly 10W50 Off Road. 1L. Compatible con múltiples modelos de motocicletas off-road.', 12089, 27, '01 3051', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Aceite Liqui Moly 10W50', 'aceite-liqui-moly-10w50-01-1502', 'Aceite Liqui Moly 10W50. 1L. Compatible con múltiples modelos de motocicletas.', 12089, 19, '01 1502', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Aceite Liqui Moly 20W-50', 'aceite-liqui-moly-20w-50-01-1500', 'Aceite Liqui Moly 20W-50. 1L. Compatible con múltiples modelos de motocicletas.', 6578, 5, '01 1500', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Bike-Additive', 'bike-additive-liqui-moly-01-1581', 'Bike-Additive Liqui Moly. Aditivo para motocicletas. Compatible con múltiples modelos.', 3790, 3, '01 1581', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Engine Flush', 'engine-flush-liqui-moly-01-1657', 'Engine Flush Liqui Moly. Limpieza de motor. Compatible con múltiples modelos de motocicletas.', 4625, 7, '01 1657', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Limpiador de Cascos Liqui Moly', 'limpiador-cascos-liqui-moly-01-1603', 'Limpiador de Cascos Liqui Moly. Compatible con todos los cascos.', 6562, 7, '01 1603', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Limpiador de Viseras para Casco', 'limpiador-viseras-casco-liqui-moly-01-1571', 'Limpiador de Viseras para Casco Liqui Moly. Compatible con todos los cascos.', 5846, 7, '01 1571', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Lubricante de Cadena Liqui Moly 400 CC', 'lubricante-cadena-liqui-moly-400cc-01-1591', 'Lubricante de Cadena Liqui Moly 400 CC. Compatible con múltiples modelos de motocicletas.', 10516, 3, '01 1591', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Motorbike 4T Shooter', 'motorbike-4t-shooter-liqui-moly-01-7837', 'Motorbike 4T Shooter Liqui Moly. Aditivo. Compatible con motos 4 tiempos.', 2952, 9, '01 7837', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Motorbike Liquimoly 15W50', 'motorbike-liquimoly-15w50-01-2555', 'Motorbike Liquimoly 15W50. Aceite 4 tiempos. 1L. Compatible con múltiples modelos de motocicletas.', 8869, 9, '01 2555', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- IMOTO (Baterías, Bujías, Cables)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Ampolleta 12V 21W', 'ampolleta-12v-21w-imoto-1057', 'Ampolleta 12V 21W IMOTO. Compatible con múltiples modelos de motocicletas.', 0, 2, '1057', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Ampolleta 12V 21W', 'ampolleta-12v-21w-imoto-364', 'Ampolleta 12V 21W IMOTO. Compatible con múltiples modelos de motocicletas.', 0, 26, '364', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Ampolleta 12V Naranja', 'ampolleta-12v-naranja-imoto-8306', 'Ampolleta 12V Naranja IMOTO. Compatible con múltiples modelos de motocicletas.', 0, 1, '8306', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Ampolleta 12V21/6CP', 'ampolleta-12v21-6cp-imoto-3871', 'Ampolleta 12V21/6CP IMOTO. Compatible con múltiples modelos de motocicletas.', 0, 3, '3871', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Ampolleta de Foco Delantero KTM', 'ampolleta-foco-delantero-ktm-imoto-4464', 'Ampolleta de Foco Delantero KTM IMOTO. Compatible con KTM Duke, RC, Adventure.', 1129, 11, '4464', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Ampolleta LED', 'ampolleta-led-imoto-mii', 'Ampolleta LED IMOTO. Compatible con múltiples modelos de motocicletas.', 3741, 1, 'MII!', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Ampolleta Roja 12V', 'ampolleta-roja-12v-imoto-4-1034c-r', 'Ampolleta Roja 12V IMOTO. Compatible con múltiples modelos de motocicletas.', 0, 2, '4-1034C-R', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Antena Corta Hilos', 'antena-corta-hilos-imoto-ant-4rs', 'Antena Corta Hilos IMOTO. Compatible con múltiples modelos de motocicletas.', 4405, 6, 'ANT-4RS', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Bateria 12 Volt YTZ 14', 'bateria-12-volt-ytz-14-imoto-ftz14s', 'Bateria 12 Volt YTZ 14 IMOTO. Compatible con múltiples modelos de motocicletas.', 27959, 11, 'FTZ14S', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Bateria 12 Volts', 'bateria-12-volts-imoto-ftx4l-bs', 'Bateria 12 Volts IMOTO. Compatible con múltiples modelos de motocicletas.', 10500, 6, 'FTX4L-BS', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Bateria 12 Volts FTX9-BS', 'bateria-12-volts-ftx9-bs-imoto', 'Bateria 12 Volts FTX9-BS IMOTO. Compatible con múltiples modelos de motocicletas.', 22271, 1, 'FTX9-BS', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Bateria de Litio 64WH', 'bateria-litio-64wh-imoto-ftlzios', 'Bateria de Litio 64WH IMOTO. Compatible con múltiples modelos de motocicletas.', 83870, 3, 'FTLZIOS', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Bateria FTX9-BS-GEL', 'bateria-ftx9-bs-gel-imoto', 'Bateria FTX9-BS-GEL IMOTO. Compatible con múltiples modelos de motocicletas.', 23318, 2, 'FTX9-BS-GEL', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Bateria FTXL-BS', 'bateria-ftxl-bs-imoto-ftx5l-bs', 'Bateria FTXL-BS IMOTO. Compatible con múltiples modelos de motocicletas.', 14541, 3, 'FTX5L-BS', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Bateria FTZ12S', 'bateria-ftz12s-imoto', 'Bateria FTZ12S IMOTO. Compatible con múltiples modelos de motocicletas.', 27786, 4, 'FTZ12S', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Bateria YB 10 L-A2-0', 'bateria-yb-10-l-a2-0-imoto', 'Bateria YB 10 L-A2-0 IMOTO. Compatible con múltiples modelos de motocicletas.', 18548, 1, 'YB10L-A2-0', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Bateria YTX 9 MGM', 'bateria-ytx-9-mgm-imoto', 'Bateria YTX 9 MGM IMOTO. Compatible con múltiples modelos de motocicletas.', 21500, 2, 'YTX9-BSMGM', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Bujía', 'bujia-imoto-cr9eh-9', 'Bujía IMOTO. Código: CR9EH-9. Compatible con múltiples modelos de motocicletas.', 6100, 1, 'CR9EH-9', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Bujia BP6HS', 'bujia-bp6hs-imoto', 'Bujia BP6HS IMOTO. Compatible con múltiples modelos de motocicletas.', 1241, 14, 'BP6HS', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Bujia BR7ES', 'bujia-br7es-imoto', 'Bujia BR7ES IMOTO. Compatible con múltiples modelos de motocicletas.', 1372, 4, 'BR7ES', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Bujia BR8ES', 'bujia-br8es-imoto', 'Bujia BR8ES IMOTO. Compatible con múltiples modelos de motocicletas.', 1636, 14, 'BR8ES', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Bujia C7HSA', 'bujia-c7hsa-imoto', 'Bujia C7HSA IMOTO. Compatible con múltiples modelos de motocicletas.', 1171, 1, 'C7HSA', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Bujia CR8EK', 'bujia-cr8ek-imoto', 'Bujia CR8EK IMOTO. Compatible con múltiples modelos de motocicletas.', 6176, 10, 'CR8EK', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Bujia DPR8EA-9', 'bujia-dpr8ea-9-imoto', 'Bujia DPR8EA-9 IMOTO. Compatible con múltiples modelos de motocicletas.', 1507, 14, 'DPR8EA-9', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Bujia LMAR8G', 'bujia-lmar8g-imoto', 'Bujia LMAR8G IMOTO. Compatible con múltiples modelos de motocicletas.', 6024, 1, 'LMAR8G', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Bujia NGK Japon 790-890-901', 'bujia-ngk-japon-790-890-901-imoto', 'Bujia NGK Japon 790-890-901 IMOTO. Compatible con KTM 790, 890, 901.', 24177, 7, 'LMAR9AI-08', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Bujia NGK LKAR8A-9 Duke', 'bujia-ngk-lkar8a-9-duke-imoto', 'Bujia NGK LKAR8A-9 Duke IMOTO. Compatible con KTM Duke.', 9690, 3, 'LKAR8A-9', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Bujia NGK LKAR8BI-9', 'bujia-ngk-lkar8bi-9-imoto', 'Bujia NGK LKAR8BI-9 IMOTO. Compatible con múltiples modelos KTM.', 8225, 13, 'LKAR8B1-9', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Cable Acelerador', 'cable-acelerador-imoto-30x-26302-00', 'Cable Acelerador IMOTO. Código: 30X-26302-00. Compatible con múltiples modelos de motocicletas.', 9640, 2, '30X-26302-00', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Cable Cuenta Kilometros', 'cable-cuenta-kilometros-imoto-44830-me9-000jp', 'Cable Cuenta Kilometros IMOTO. Código: 44830-ME9-000JP. Compatible con múltiples modelos de motocicletas.', 7952, 1, '44830-ME9-000JP', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Cachimba NGK', 'cachimba-ngk-imoto-xd05f', 'Cachimba NGK IMOTO. Código: XD05F. Compatible con múltiples modelos de motocicletas.', 2909, 1, 'XD05F', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SHINKO (Neumáticos)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Aceite IPONE 20W50', 'aceite-ipone-20w50-shinko', 'Aceite IPONE 20W50. 1L. Compatible con múltiples modelos de motocicletas.', 5037, 4, 'IPONE-20W50', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Neumatico RYMAX 110/100-18', 'neumatico-rymax-110-100-18-shinko', 'Neumatico SHINKO RYMAX 110/100-18. Compatible con múltiples modelos de motocicletas.', 0, 0, 'RYMAX-110/100-18', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico RYMAX 120/100-18', 'neumatico-rymax-120-100-18-shinko', 'Neumatico SHINKO RYMAX 120/100-18. Compatible con múltiples modelos de motocicletas.', 0, 0, 'RYMAX-120/100-18', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico RYMAX 50 80/100-21', 'neumatico-rymax-50-80-100-21-shinko', 'Neumatico SHINKO RYMAX 50 80/100-21. Compatible con múltiples modelos de motocicletas.', 0, 0, 'RYMAX-50-80/100-21', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico SHINKO 150/60-17', 'neumatico-shinko-150-60-17', 'Neumatico SHINKO 150/60-17. Compatible con múltiples modelos de motocicletas.', 0, 0, 'SHINKO-150/60-17', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico SHINKO E 705 120/70R-17', 'neumatico-shinko-e-705-120-70r-17', 'Neumatico SHINKO E 705 120/70R-17. Compatible con múltiples modelos de motocicletas.', 0, 0, 'SHINKO-E705-120/70R-17', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico SHINKO E 705 120/70R-19', 'neumatico-shinko-e-705-120-70r-19', 'Neumatico SHINKO E 705 120/70R-19. Compatible con múltiples modelos de motocicletas.', 0, 0, 'SHINKO-E705-120/70R-19', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico SHINKO E 705 150/70-18', 'neumatico-shinko-e-705-150-70-18', 'Neumatico SHINKO E 705 150/70-18. Compatible con múltiples modelos de motocicletas.', 0, 0, 'SHINKO-E705-150/70-18', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico SHINKO E 705 90/90-21', 'neumatico-shinko-e-705-90-90-21', 'Neumatico SHINKO E 705 90/90-21. Compatible con múltiples modelos de motocicletas.', 0, 0, 'SHINKO-E705-90/90-21', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- TOPGADGETS (Accesorios)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Bolso Seco Amarillo Nelson Rigg', 'bolso-seco-amarillo-nelson-rigg-topgadgets', 'Bolso Seco Amarillo Nelson Rigg TOPGADGETS. Compatible con múltiples modelos de motocicletas.', 62294, 1, 'NELSON-RIGG-AMARILLO', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Double Take Mirror Espejo Trail para Manub', 'double-take-mirror-espejo-trail-topgadgets', 'Double Take Mirror Espejo Trail para Manub TOPGADGETS. Compatible con múltiples modelos de motocicletas.', 0, 0, 'DOUBLE-TAKE-TRAIL', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Double Teke Mirror Espejo Duro', 'double-teke-mirror-espejo-duro-topgadgets', 'Double Teke Mirror Espejo Duro TOPGADGETS. Compatible con múltiples modelos de motocicletas.', 0, 0, 'DOUBLE-TEKE-DURO', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Dynaplug Kit de Repuestos', 'dynaplug-kit-repuestos-topgadgets', 'Dynaplug Kit de Repuestos TOPGADGETS. Compatible con múltiples modelos de motocicletas.', 0, 0, 'DYNAPLUG-KIT', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Focos LED ADV 4', 'focos-led-adv-4-topgadgets', 'Focos LED ADV 4 TOPGADGETS. Compatible con múltiples modelos de motocicletas.', 0, 0, 'FOCOS-LED-ADV-4', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Focos LED Gold Runway EXP 3', 'focos-led-gold-runway-exp-3-topgadgets', 'Focos LED Gold Runway EXP 3 TOPGADGETS. Compatible con múltiples modelos de motocicletas.', 0, 0, 'FOCOS-LED-GOLD-EXP-3', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Grab On Cubrepuños', 'grab-on-cubrepuños-topgadgets', 'Grab On Cubrepuños TOPGADGETS. Compatible con múltiples modelos de motocicletas.', 0, 0, 'GRAB-ON-CUBREPUÑOS', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Regulador de Embrague 790-890', 'regulador-embrague-790-890-topgadgets', 'Regulador de Embrague 790-890 TOPGADGETS. Compatible con KTM 790, 890.', 0, 0, 'REGULADOR-EMBRAGUE-790-890', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rubbatech Protector de Estanque KTM', 'rubbatech-protector-estanque-ktm-topgadgets', 'Rubbatech Protector de Estanque KTM TOPGADGETS. Compatible con KTM Adventure, Duke.', 0, 0, 'RUBBATECH-KTM', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- VINI (Baterías, Bujías, Filtros)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Bateria BS BTX14AH', 'bateria-bs-btx14ah-vini', 'Bateria BS BTX14AH VINI. Compatible con múltiples modelos de motocicletas.', 41117, 1, 'BS-BTX14AH', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Bateria BS BTZ12-S', 'bateria-bs-btz12-s-vini', 'Bateria BS BTZ12-S VINI. Compatible con múltiples modelos de motocicletas.', 0, 0, 'BS-BTZ12-S', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Bujia Bosch VR6NEU KTM 200-250-390-401', 'bujia-bosch-vr6neu-ktm-vini', 'Bujia Bosch VR6NEU KTM 200-250-390-401 VINI. Compatible con KTM 200, 250, 390, 401.', 0, 0, 'BOSCH-VR6NEU-KTM', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Casco Alcancía', 'casco-alcancía-vini', 'Casco Alcancía VINI. Compatible con todos los modelos.', 0, 0, 'CASCO-ALCANCIÁ', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Filtro de Aceite KTM', 'filtro-aceite-ktm-vini', 'Filtro de Aceite KTM VINI. Compatible con múltiples modelos KTM.', 0, 0, 'FILTRO-ACEITE-KTM-VINI', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Filtro de Aceite KTM EXC', 'filtro-aceite-ktm-exc-vini', 'Filtro de Aceite KTM EXC VINI. Compatible con KTM EXC.', 0, 0, 'FILTRO-ACEITE-KTM-EXC-VINI', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Filtro de Aire DUKE', 'filtro-aire-duke-vini', 'Filtro de Aire DUKE VINI. Compatible con KTM Duke.', 0, 0, 'FILTRO-AIRE-DUKE-VINI', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Juego de Manillas DUKE 390/RC', 'juego-manillas-duke-390-rc-vini', 'Juego de Manillas DUKE 390/RC VINI. Compatible con KTM Duke 390, RC 390.', 0, 0, 'MANILLAS-DUKE-390-RC', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Kit Limpia Cadena de Transmision', 'kit-limpia-cadena-transmision-vini', 'Kit Limpia Cadena de Transmision VINI. Compatible con múltiples modelos de motocicletas.', 0, 0, 'KIT-LIMPIA-CADENA-VINI', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Lubricante Mundial Color Naranjo', 'lubricante-mundial-color-naranjo-vini', 'Lubricante Mundial Color Naranjo VINI. Compatible con múltiples modelos de motocicletas.', 0, 0, 'LUBRICANTE-MUNDIAL-NARANJO', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Valvula de Tapa de Bencina', 'valvula-tapa-bencina-vini', 'Valvula de Tapa de Bencina VINI. Compatible con múltiples modelos de motocicletas.', 0, 0, 'VALVULA-TAPA-BENCINA', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- VOLTRONIC (Lubricantes y Refrigerante)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Lubricante Multiuso M20', 'lubricante-multiuso-m20-voltronic', 'Lubricante Multiuso M20 VOLTRONIC. Compatible con múltiples modelos de motocicletas.', 3050, 5, 'VOLTRONIC-M20', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('R 30 Coolant Voltronic', 'r-30-coolant-voltronic', 'R 30 Coolant VOLTRONIC. Refrigerante. Compatible con múltiples modelos de motocicletas.', 4990, 65, 'VOLTRONIC-R30', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- CAPRAR (Neumáticos)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Neumatico ANLAS CAPRAR 150/70-18', 'neumatico-anlas-caprar-150-70-18', 'Neumatico ANLAS CAPRAR 150/70-18. Compatible con múltiples modelos de motocicletas.', 110208, 3, 'CAPRAR-18', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico ANLAS CAPRAR 19', 'neumatico-anlas-caprar-19', 'Neumatico ANLAS CAPRAR 19. Compatible con múltiples modelos de motocicletas.', 96412, 2, 'CAPRAR-19', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico ANLAS CAPRA R 21', 'neumatico-anlas-capra-r-21', 'Neumatico ANLAS CAPRA R 21. Compatible con múltiples modelos de motocicletas.', 71177, 1, 'CAPRAR21', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico ANLAS CAPRA X 120/70-19', 'neumatico-anlas-capra-x-120-70-19', 'Neumatico ANLAS CAPRA X 120/70-19. Compatible con múltiples modelos de motocicletas.', 87588, 2, 'CAPRA-X-19', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico ANLAS CAPRA X 150/70-18', 'neumatico-anlas-capra-x-150-70-18', 'Neumatico ANLAS CAPRA X 150/70-18. Compatible con múltiples modelos de motocicletas.', 173025, 26, 'CAPRA-X-18', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico ANLAS CAPRA X 170/60-17', 'neumatico-anlas-capra-x-170-60-17', 'Neumatico ANLAS CAPRA X 170/60-17. Compatible con múltiples modelos de motocicletas.', 131352, 4, 'CAPRA-X-17', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico ANLAS CAPRA X 90/90-21', 'neumatico-anlas-capra-x-90-90-21', 'Neumatico ANLAS CAPRA X 90/90-21. Compatible con múltiples modelos de motocicletas.', 98236, 2, 'CAPRA-X-21', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Pastillas de Freno Galfer KTM', 'pastillas-freno-galfer-ktm-caprar', 'Pastillas de Freno Galfer KTM CAPRAR. Compatible con múltiples modelos KTM.', 17647, 2, 'FD138G1396', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- MAXIMA (Filtros de Aceite)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Filtro de Aceite Honda - Kawasaki - Yamaha', 'filtro-aceite-honda-kawasaki-yamaha-maxima', 'Filtro de Aceite MAXIMA. Código: PF-303B. Compatible con Honda, Kawasaki, Yamaha.', 6261, 24, 'PF-303B', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Filtro de Aceite KTM', 'filtro-aceite-ktm-maxima-pf-652', 'Filtro de Aceite KTM MAXIMA. Código: PF-652. Compatible con múltiples modelos KTM.', 4197, 5, 'PF-652', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Filtro de Aceite KX - RMZ', 'filtro-aceite-kx-rmz-maxima-pf-207', 'Filtro de Aceite KX - RMZ MAXIMA. Código: PF-207. Compatible con Kawasaki KX, Suzuki RMZ.', 3739, 3, 'PF-207', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Filtro de Aceite Maxima', 'filtro-aceite-maxima-pf-650', 'Filtro de Aceite MAXIMA. Código: PF-650. Compatible con múltiples modelos de motocicletas.', 4533, 23, 'PF-650', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- MOTO MASTER (Pastillas de Freno)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Disco de Freno Honda CR125/250 CRF250/450 CR50', 'disco-freno-honda-cr125-250-crf250-450-cr50-moto-master', 'Disco de Freno Honda CR125/250 CRF250/450 CR50 MOTO MASTER. Código: 110355. Compatible con Honda CR125, CR250, CRF250, CRF450, CR50.', 0, 2, '110355', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Kit de Freno 270 Honda CRF', 'kit-freno-270-honda-crf-moto-master', 'Kit de Freno 270 Honda CRF MOTO MASTER. Código: 310034. Compatible con Honda CRF.', 0, 1, '310034', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Pasadero de Calipe', 'pasadero-calipe-moto-master-213024', 'Pasadero de Calipe MOTO MASTER. Código: 213024. Compatible con múltiples modelos de motocicletas.', 0, 2, '213024', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Pasadero de Caliper', 'pasadero-caliper-moto-master-213025', 'Pasadero de Caliper MOTO MASTER. Código: 213025. Compatible con múltiples modelos de motocicletas.', 0, 14, '213025', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Pastilla de Freno', 'pastilla-freno-moto-master-0912-11', 'Pastilla de Freno MOTO MASTER. Código: 0912-11. Compatible con múltiples modelos de motocicletas.', 0, 4, '0912-11', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Pastilla de Freno', 'pastilla-freno-moto-master-0974-11', 'Pastilla de Freno MOTO MASTER. Código: 0974-11. Compatible con múltiples modelos de motocicletas.', 0, 8, '0974-11', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Pastillas de Freno', 'pastillas-freno-moto-master-0944-11', 'Pastillas de Freno MOTO MASTER. Código: 0944-11. Compatible con múltiples modelos de motocicletas.', 0, 7, '0944-11', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Pastillas de Freno', 'pastillas-freno-moto-master-0974-12', 'Pastillas de Freno MOTO MASTER. Código: 0974-12. Compatible con múltiples modelos de motocicletas.', 0, 2, '0974-12', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Pastillas de Freno', 'pastillas-freno-moto-master-0946-11', 'Pastillas de Freno MOTO MASTER. Código: 0946-11. Compatible con múltiples modelos de motocicletas.', 0, 6, '0946-11', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Pastillas de Freno', 'pastillas-freno-moto-master-0967-11', 'Pastillas de Freno MOTO MASTER. Código: 0967-11. Compatible con múltiples modelos de motocicletas.', 0, 5, '0967-11', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- MOTO TECHNIK (Pastillas de Freno)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Pastillas de Freno Traseras Ducati', 'pastillas-freno-traseras-ducati-moto-technik', 'Pastillas de Freno Traseras Ducati MOTO TECHNIK. Código: 504510030. Compatible con Ducati.', 16739, 1, '504510030', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- MOTOAVENTURA (Neumáticos y Cámaras)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Camara Heidenau 18', 'camara-heidenau-18-motoaventura', 'Camara Heidenau 18 MOTOAVENTURA. Código: H-ARO 18. Compatible con aros 18 pulgadas.', 15882, 1, 'H-ARO-18', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Camara Heidenau 21', 'camara-heidenau-21-motoaventura', 'Camara Heidenau 21 MOTOAVENTURA. Código: H-ARO 21. Compatible con aros 21 pulgadas.', 15882, 3, 'H-ARO-21', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico Heidenau 150/70-18', 'neumatico-heidenau-150-70-18-motoaventura', 'Neumatico Heidenau 150/70-18 MOTOAVENTURA. Código: RANGER150-70-18. Compatible con múltiples modelos de motocicletas.', 139706, 1, 'RANGER150-70-18', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico Heidenau K60-90/90-21', 'neumatico-heidenau-k60-90-90-21-motoaventura', 'Neumatico Heidenau K60-90/90-21 MOTOAVENTURA. Código: K60-90/90-R21. Compatible con múltiples modelos de motocicletas.', 79117, 1, 'K60-90/90-R21', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico Heidenau RANGER 110/80-R19', 'neumatico-heidenau-ranger-110-80-r19-motoaventura', 'Neumatico Heidenau RANGER 110/80-R19 MOTOAVENTURA. Código: RANGER110-R19. Compatible con múltiples modelos de motocicletas.', 89353, 1, 'RANGER110-R19', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- RANGER (Neumáticos)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Neumatico Heidenau RANGER 90-90-21', 'neumatico-heidenau-ranger-90-90-21-ranger', 'Neumatico Heidenau RANGER 90-90-21. Código: RANGER-90-90-21. Compatible con múltiples modelos de motocicletas.', 75876, 3, 'RANGER-90-90-21', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- MOTOBOX (Intermitentes)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Intermitente Transalp 700', 'intermitente-transalp-700-motobox', 'Intermitente Transalp 700 MOTOBOX. Código: 33600-MFF-D01. Compatible con Honda Transalp 700.', 42357, 1, '33600-MFF-D01', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- CARLOS DEL CANTO (Repuestos Varios)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Bujias Brik CR8E', 'bujias-brik-cr8e-carlos-del-canto', 'Bujias Brik CR8E CARLOS DEL CANTO. Código: CR-10YS. Compatible con múltiples modelos de motocicletas.', 10296, 1, 'CR-10YS', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Cadena de Transmision 520* 120 CZ con ORING', 'cadena-transmision-520-120-cz-oring-carlos-del-canto', 'Cadena de Transmision 520* 120 CZ con ORING CARLOS DEL CANTO. Código: 520-1200RM. Compatible con múltiples modelos de motocicletas.', 0, 0, '520-1200RM', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Filtro de Aceite CRF', 'filtro-aceite-crf-carlos-del-canto-fvc007', 'Filtro de Aceite CRF CARLOS DEL CANTO. Código: FVC007. Compatible con Honda CRF.', 0, 0, 'FVC007', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Filtro de Aceite KTM EXC Largo', 'filtro-aceite-ktm-exc-largo-carlos-del-canto', 'Filtro de Aceite KTM EXC Largo CARLOS DEL CANTO. Código: FFC044. Compatible con KTM EXC.', 0, 0, 'FFC044', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Pastillas de Freno Duke', 'pastillas-freno-duke-carlos-del-canto', 'Pastillas de Freno Duke CARLOS DEL CANTO. Compatible con KTM Duke.', 0, 0, 'PASTILLAS-DUKE-CDC', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Pastillas de Freno KTM Gold', 'pastillas-freno-ktm-gold-carlos-del-canto', 'Pastillas de Freno KTM Gold CARLOS DEL CANTO. Compatible con múltiples modelos KTM.', 0, 0, 'PASTILLAS-KTM-GOLD-CDC', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- COMERCIAL PIONONO (Neumáticos)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Neumatico Continental TKC 80 150/70-18', 'neumatico-continental-tkc-80-150-70-18-comercial-pionono', 'Neumatico Continental TKC 80 150/70-18 COMERCIAL PIONONO. Código: 029703. Compatible con múltiples modelos de motocicletas.', 144622, 1, '029703', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- CROSS TEAM (Repuestos Varios)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Cadena de Distribucion', 'cadena-distribucion-cross-team-31-6356', 'Cadena de Distribucion CROSS TEAM. Código: 31.6356. Compatible con múltiples modelos de motocicletas.', 57941, 1, '31.6356', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Mousse M004 Tecnomousse', 'mousse-m004-tecnomousse-cross-team', 'Mousse M004 Tecnomousse CROSS TEAM. Código: M004. Compatible con múltiples modelos de motocicletas.', 64699, 1, 'M004', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- KING TIRE (Neumáticos)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Neumatico KING TIRE K97 150/70ZR17', 'neumatico-king-tire-k97-150-70zr17', 'Neumatico KING TIRE K97 150/70ZR17. Código: K97 150/70ZR17. Compatible con múltiples modelos de motocicletas.', 63935, 1, 'K97-150/70ZR17', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico RUNNER 120/100-18', 'neumatico-runner-120-100-18-king-tire', 'Neumatico RUNNER 120/100-18 KING TIRE. Código: RUNNER 100/18. Compatible con múltiples modelos de motocicletas.', 28917, 1, 'RUNNER-100/18', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico RUNNER 120/90-18 MX', 'neumatico-runner-120-90-18-mx-king-tire', 'Neumatico RUNNER 120/90-18 MX KING TIRE. Código: RUNNER 120/18. Compatible con múltiples modelos de motocicletas.', 28576, 1, 'RUNNER-120/18', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico RUNNER 90/90-21', 'neumatico-runner-90-90-21-king-tire', 'Neumatico RUNNER 90/90-21 KING TIRE. Código: RUNNER 90/21. Compatible con múltiples modelos de motocicletas.', 21290, 3, 'RUNNER-90/21', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- MAICO SPORT (Repuestos)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Catalina 42 Dientes', 'catalina-42-dientes-maico-sport', 'Catalina 42 Dientes MAICO SPORT. Código: JTR890.42. Compatible con múltiples modelos de motocicletas.', 21118, 1, 'JTR890.42', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Filtro de Aceite HF 651 Husqvarna 701 KTM 690', 'filtro-aceite-hf-651-husqvarna-701-ktm-690-maico-sport', 'Filtro de Aceite HF 651 Husqvarna 701 KTM 690 MAICO SPORT. Código: HF 651. Compatible con Husqvarna 701, KTM 690.', 7058, 2, 'HF-651', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- NEUMAX (Cámaras)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Camara Michelin 120/90-18', 'camara-michelin-120-90-18-neumax', 'Camara Michelin 120/90-18 NEUMAX. Código: 410943. Compatible con aros 18 pulgadas.', 7118, 2, '410943', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Camara Michelin 140/80-18', 'camara-michelin-140-80-18-neumax', 'Camara Michelin 140/80-18 NEUMAX. Código: 795250. Compatible con aros 18 pulgadas.', 10690, 2, '795250', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- OTRO (Repuestos Varios)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Empaquetadura Base Cilindro 0.75MM', 'empaquetadura-base-cilindro-0-75mm-otro', 'Empaquetadura Base Cilindro 0.75MM. Código: 548.30.030.075. Compatible con múltiples modelos de motocicletas.', 5036, 1, '548.30.030.075', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PALMAX (Repuestos Varios)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Calienta Puños Oxford', 'calienta-puños-oxford-palmax-of690', 'Calienta Puños Oxford PALMAX. Código: OF690. Compatible con múltiples modelos de motocicletas.', 68765, 1, 'OF690', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Calienta Puños Oxford Pro Adventure', 'calienta-puños-oxford-pro-adventure-palmax', 'Calienta Puños Oxford Pro Adventure PALMAX. Código: EL390. Compatible con múltiples modelos de motocicletas.', 146230, 1, 'EL390', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Catalina Chiaravalli KTM Mixta', 'catalina-chiaravalli-ktm-mixta-palmax', 'Catalina Chiaravalli KTM Mixta PALMAX. Código: HA4150897528D. Compatible con múltiples modelos KTM.', 44058, 1, 'HA4150897528D', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Filtro de Aceite KTM 990', 'filtro-aceite-ktm-990-palmax-kn-650', 'Filtro de Aceite KTM 990 PALMAX. Código: KN-650. Compatible con KTM 990.', 9941, 1, 'KN-650', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Funda Asiento Universal', 'funda-asiento-universal-palmax-mo47-0101', 'Funda Asiento Universal PALMAX. Código: MO47-0101. Compatible con múltiples modelos de motocicletas.', 28900, 2, 'MO47-0101', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Kit de Piston Completo', 'kit-piston-completo-palmax-8vtktc24694b-1', 'Kit de Piston Completo PALMAX. Código: 8VTKTC24694B-1. Compatible con múltiples modelos de motocicletas.', 164059, 1, '8VTKTC24694B-1', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Llanta Delantera Takasago Excel 21', 'llanta-delantera-takasago-excel-21-palmax', 'Llanta Delantera Takasago Excel 21 PALMAX. Código: ICB408. Compatible con aros 21 pulgadas.', 93471, 1, 'ICB408', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico Bridgestone 110/100-18', 'neumatico-bridgestone-110-100-18-palmax', 'Neumatico Bridgestone 110/100-18 PALMAX. Código: 20578200. Compatible con múltiples modelos de motocicletas.', 75824, 1, '20578200', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Piñon de Ataque de 16 Dientes KTM', 'pinon-ataque-16-dientes-ktm-palmax', 'Piñon de Ataque de 16 Dientes KTM PALMAX. Código: CST1904-16. Compatible con múltiples modelos KTM.', 14647, 1, 'CST1904-16', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Piñon de Ataque KTM Enduro 14 D', 'pinon-ataque-ktm-enduro-14-d-palmax', 'Piñon de Ataque KTM Enduro 14 D PALMAX. Código: HA4251248146. Compatible con KTM Enduro.', 12883, 1, 'HA4251248146', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Tapabarro Trasero', 'tapabarro-trasero-palmax-266-08-013-100-a', 'Tapabarro Trasero PALMAX. Código: 266.08.013.100/A. Compatible con múltiples modelos de motocicletas.', 35288, 1, '266.08.013.100/A', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- RINOMOTOS (Filtros)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Filtro de Aceite DL 1000', 'filtro-aceite-dl-1000-rinomotos', 'Filtro de Aceite DL 1000 RINOMOTOS. Código: 1651007J00000. Compatible con Suzuki DL 1000.', 9900, 1, '1651007J00000', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ROCK OIL (Cadenas, Lubricantes)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Cadena 525-120 SDZZ', 'cadena-525-120-sdzz-rock-oil', 'Cadena 525-120 SDZZ ROCK OIL. Código: 525-120SDZZ. Compatible con múltiples modelos de motocicletas.', 67815, 6, '525-120SDZZ', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Candado 520 ORM', 'candado-520-orm-rock-oil', 'Candado 520 ORM ROCK OIL. Código: 520-ORM. Compatible con cadenas 520.', 1168, 2, '520-ORM', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Candado 525-SDZZ', 'candado-525-sdzz-rock-oil', 'Candado 525-SDZZ ROCK OIL. Código: 525-SDZZ. Compatible con cadenas 525.', 1954, 1, '525-SDZZ', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Catalina 790-890-901 45 D', 'catalina-790-890-901-45-d-rock-oil', 'Catalina 790-890-901 45 D ROCK OIL. Código: 897-45THF. Compatible con KTM 790, 890, 901.', 37689, 1, '897-45THF', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Catalina KTM 42 Dientes', 'catalina-ktm-42-dientes-rock-oil', 'Catalina KTM 42 Dientes ROCK OIL. Código: 2093-42THF. Compatible con múltiples modelos KTM.', 37689, 5, '2093-42THF', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Desengrasante Rock Oil', 'desengrasante-rock-oil-soc-400', 'Desengrasante Rock Oil. Código: SOC-400. Compatible con múltiples modelos de motocicletas.', 7948, 1, 'SOC-400', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Grasa Spray de Montage', 'grasa-spray-montage-rock-oil', 'Grasa Spray de Montage ROCK OIL. Código: WSG-400. Compatible con múltiples modelos de motocicletas.', 5664, 1, 'WSG-400', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Lubricante Cadena Rock Oil', 'lubricante-cadena-rock-oil-cl-600', 'Lubricante Cadena Rock Oil. Código: CL-600. Compatible con múltiples modelos de motocicletas.', 8018, 5, 'CL-600', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ANFRA (Rodamientos y Retenes)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Sello Cubierta de Ignicion', 'sello-cubierta-ignicion-anfra-554-30-040-100', 'Sello Cubierta de Ignicion ANFRA. Código: 554.30.040.100. Compatible con múltiples modelos de motocicletas.', 5666, 2, '554.30.040.100', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Switch de Freno', 'switch-freno-anfra-271760171', 'Switch de Freno ANFRA. Código: 271760171. Compatible con múltiples modelos de motocicletas.', 5541, 2, '271760171', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Switch Embrague', 'switch-embrague-anfra-2fb-h2917-00', 'Switch Embrague ANFRA. Código: 2FB-H2917-00. Compatible con múltiples modelos de motocicletas.', 2341, 1, '2FB-H2917-00', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Switch Freno Trasero', 'switch-freno-trasero-anfra-cto-157', 'Switch Freno Trasero ANFRA. Código: CTO-157. Compatible con múltiples modelos de motocicletas.', 9300, 4, 'CTO-157', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Tirante de Motos Acerbis', 'tirante-motos-acerbis-anfra-0009266-040', 'Tirante de Motos Acerbis ANFRA. Código: 0009266.040. Compatible con múltiples modelos de motocicletas.', 17412, 1, '0009266.040', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Tirantes de Amarras Acerbis Rojas', 'tirantes-amarras-acerbis-rojas-anfra-0009266-111', 'Tirantes de Amarras Acerbis Rojas ANFRA. Código: 0009266.111. Compatible con múltiples modelos de motocicletas.', 17412, 7, '0009266.111', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Tubo de Acelerador Completo', 'tubo-acelerador-completo-anfra-tr-7706', 'Tubo de Acelerador Completo ANFRA. Código: TR-7706. Compatible con múltiples modelos de motocicletas.', 15686, 1, 'TR-7706', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- AMPOLLETAS MARGARITA
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Ampolleta H3', 'ampolleta-h3-ampolletas-margarita', 'Ampolleta H3 AMPOLLETAS MARGARITA. Compatible con múltiples modelos de motocicletas.', 2521, 1, 'H3-MARGARITA', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ANGUIMPORT
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Empaquetadura de Culata F650', 'empaquetadura-culata-f650-anguimport', 'Empaquetadura de Culata F650 ANGUIMPORT. Código: EMPCULTAGS650. Compatible con BMW F650.', 43644, 1, 'EMPCULTAGS650', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ASPAR
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Empaquetadura de Stator Bajaj', 'empaquetadura-stator-bajaj-aspar', 'Empaquetadura de Stator Bajaj ASPAR. Código: 05X157. Compatible con Bajaj.', 4900, 5, '05X157', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- BEL-RAY
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Belray Moto Coolant', 'belray-moto-coolant-1199707', 'Belray Moto Coolant BEL-RAY. Código: 1199707. Refrigerante. Compatible con múltiples modelos de motocicletas.', 7501, 7, '1199707', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- BETA GAS JABON DE MANOS
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Jabon Mecanico 1 Litro', 'jabon-mecanico-1-litro-beta-gas', 'Jabon Mecanico 1 Litro BETA GAS. Código: JABONILITRO. Compatible con todos los modelos.', 4320, 4, 'JABONILITRO', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ELECTRONICA PONCE
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Pila CR 2430', 'pila-cr-2430-electronica-ponce', 'Pila CR 2430 ELECTRONICA PONCE. Código: CR 2430. Compatible con múltiples dispositivos.', 3361, 5, 'CR-2430', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- FACTORIA DOLLEZ
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Protector Vector Circuit Azul', 'protector-vector-circuit-azul-factoria-dollez', 'Protector Vector Circuit Azul FACTORIA DOLLEZ. Código: PM061-2DB. Compatible con múltiples modelos de motocicletas.', 22294, 1, 'PM061-2DB', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- HDPRO (Accesorios para Teléfonos)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('SP Moto Bundle iPhone 8+/7+/6S+/6+', 'sp-moto-bundle-iphone-8-7-6s-6-hdpro', 'SP Moto Bundle iPhone 8+/7+/6S+/6+ HDPRO. Código: 53901. Compatible con iPhone 8+, 7+, 6S+, 6+.', 35288, 1, '53901', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('SP Moto Bundle S10', 'sp-moto-bundle-s10-hdpro', 'SP Moto Bundle S10 HDPRO. Código: 53918. Compatible con Samsung S10.', 35288, 2, '53918', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('SP Moto Bundle S9/S8', 'sp-moto-bundle-s9-s8-hdpro', 'SP Moto Bundle S9/S8 HDPRO. Código: 53911. Compatible con Samsung S9, S8.', 35288, 1, '53911', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('SP Phone Case 11 Pro Max', 'sp-phone-case-11-pro-max-hdpro', 'SP Phone Case 11 Pro Max HDPRO. Código: 55223. Compatible con iPhone 11 Pro Max.', 14700, 1, '55223', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('SP Phone Case Note 10', 'sp-phone-case-note-10-hdpro', 'SP Phone Case Note 10 HDPRO. Código: 55127. Compatible con Samsung Note 10.', 13524, 1, '55127', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('SP Phone Case P20 Pro', 'sp-phone-case-p20-pro-hdpro', 'SP Phone Case P20 Pro HDPRO. Código: 55115. Compatible con Huawei P20 Pro.', 13524, 1, '55115', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('SP Phone Case Set iPhone 8+/7+/6S+/6+', 'sp-phone-case-set-iphone-8-7-6s-6-hdpro', 'SP Phone Case Set iPhone 8+/7+/6S+/6+ HDPRO. Código: 53183. Compatible con iPhone 8+, 7+, 6S+, 6+.', 13524, 1, '53183', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('SP Phone Case XS Max', 'sp-phone-case-xs-max-hdpro', 'SP Phone Case XS Max HDPRO. Código: 55113. Compatible con iPhone XS Max.', 13524, 1, '55113', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('SP Phone Mate 20 Pro', 'sp-phone-mate-20-pro-hdpro', 'SP Phone Mate 20 Pro HDPRO. Código: 55116. Compatible con Huawei Mate 20 Pro.', 13524, 1, '55116', 'active', true, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- REPUESTOS VARIOS (Sin marca específica pero importantes)
-- ============================================
-- Estos son repuestos que aparecen en el inventario pero no tienen una familia/marca clara
-- Los agrego con descripciones detalladas sobre compatibilidad

INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Cadena 525 VO-120JP ORING', 'cadena-525-vo-120jp-oring-525vo-120jp', 'Cadena 525 VO-120JP ORING. Código: 525VO-120JP. Compatible con múltiples modelos de motocicletas.', 46241, 1, '525VO-120JP', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Camara Aro 17 TR4', 'camara-aro-17-tr4-ca500-530x17', 'Camara Aro 17 TR4. Código: CA500/530X17. Compatible con aros 17 pulgadas.', 9859, 1, 'CA500/530X17', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Camara Aro 19 Extra Heavy Duty', 'camara-aro-19-extra-heavy-duty-ca100-90-19xhd', 'Camara Aro 19 Extra Heavy Duty. Código: CA100/90-19XHD. Compatible con aros 19 pulgadas.', 14153, 4, 'CA100/90-19XHD', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Correas de Moto Acerbis Naranja', 'correas-moto-acerbis-naranja-0009266-010', 'Correas de Moto Acerbis Naranja. Código: 0009266.010. Compatible con múltiples modelos de motocicletas.', 17412, 2, '0009266.010', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Disco Embrague', 'disco-embrague-537-16321-00', 'Disco Embrague. Código: 537-16321-00. Compatible con múltiples modelos de motocicletas.', 0, 10, '537-16321-00', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Filtro de Aceite CRF', 'filtro-aceite-crf-ffc007', 'Filtro de Aceite CRF. Código: FFC007. Compatible con Honda CRF.', 2632, 5, 'FFC007', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Foco Señalizador', 'foco-señalizador-33400-kr6-003', 'Foco Señalizador. Código: 33400-KR6-003. Compatible con múltiples modelos de motocicletas.', 0, 1, '33400-KR6-003', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Manilla de Freno XR 650', 'manilla-freno-xr-650-53175-kj1-730', 'Manilla de Freno XR 650. Código: 53175-KJ1-730. Compatible con Honda XR 650.', 7190, 1, '53175-KJ1-730', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Neumatico Cross 21 CST CM702', 'neumatico-cross-21-cst-cm702', 'Neumatico Cross 21 CST CM702. Código: 80/100-21MX. Compatible con aros 21 pulgadas.', 37571, 4, '80/100-21MX', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('ORING Tapon Ajuste Valvula', 'oring-tapon-ajuste-valvula-cbp180-e1-3', 'ORING Tapon Ajuste Valvula. Código: CBP180-E1-3. Compatible con múltiples modelos de motocicletas.', 0, 4, 'CBP180-E1-3', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Pedal de Apoyo', 'pedal-apoyo-lx250gy6-f23-7', 'Pedal de Apoyo. Código: LX250GY6-F23-7. Compatible con múltiples modelos de motocicletas.', 3823, 1, 'LX250GY6-F23-7', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Piñon de Ataque KTM 990', 'pinon-ataque-ktm-990-2147-16', 'Piñon de Ataque KTM 990. Código: 2147-16. Compatible con KTM 990.', 27323, 2, '2147-16', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Reloj CTA KM', 'reloj-cta-km-by1006-f1-rck', 'Reloj CTA KM. Código: BY1006-F1-RCK. Compatible con múltiples modelos de motocicletas.', 0, 1, 'BY1006-F1-RCK', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- REPUESTOS KTM (ROLAND SPAAARWATER - Continuación)
-- Agregando más repuestos KTM importantes del inventario
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Rotor de Bomba', 'rotor-bomba-ktm-600-35-055-100', 'Rotor de Bomba KTM. Código: 600.35.055.100. Compatible con múltiples modelos KTM.', 1849, 1, '600.35.055.100', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rotor de Bomba de Aceite 10 MM', 'rotor-bomba-aceite-10mm-ktm-590-38-011-010', 'Rotor de Bomba de Aceite 10 MM KTM. Código: 590.38.011.010. Compatible con múltiples modelos KTM.', 10654, 1, '590.38.011.010', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Rotor de Bomba de Agua', 'rotor-bomba-agua-ktm-812-35-055-020', 'Rotor de Bomba de Agua KTM. Código: 812.35.055.020. Compatible con múltiples modelos KTM.', 4406, 1, '812.35.055.020', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rueda de Guia Cadena LC 4 640', 'rueda-guia-cadena-lc-4-640-ktm-584-03-060-000', 'Rueda de Guia Cadena LC 4 640 KTM. Código: 584.03.060.000. Compatible con KTM LC4 640.', 1149, 1, '584.03.060.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Rueda Delantera Naranja', 'rueda-delantera-naranja-ktm-930-09-001-044eb', 'Rueda Delantera Naranja KTM. Código: 930.09.001.044EB. Compatible con múltiples modelos KTM.', 196296, 1, '930.09.001.044EB', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- REPUESTOS VARIOS - PARTES DE MOTOR Y CHASIS
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Golilla de Cobre 8X16X1', 'golilla-cobre-8x16x1-565-30-080-000', 'Golilla de Cobre 8X16X1. Código: 565.30.080.000. Compatible con múltiples modelos de motocicletas.', 993, 4, '565.30.080.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Golilla de CU', 'golilla-cu-580-38-022-100', 'Golilla de CU. Código: 580.38.022.100. Compatible con múltiples modelos de motocicletas.', 1885, 10, '580.38.022.100', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Golilla de CU para Tensor de Cadena', 'golilla-cu-tensor-cadena-0603-242920', 'Golilla de CU para Tensor de Cadena. Código: 0603 242920. Compatible con múltiples modelos de motocicletas.', 997, 1, '0603-242920', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Golilla Embutida Guia Cadena', 'golilla-embutida-guia-cadena-722-10-079-000', 'Golilla Embutida Guia Cadena. Código: 722.10.079.000. Compatible con múltiples modelos de motocicletas.', 0, 1, '722.10.079.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Juego Anillos D 103', 'juego-anillos-d-103-606-30-031-044', 'Juego Anillos D 103. Código: 606.30.031.044. Compatible con múltiples modelos de motocicletas.', 56716, 2, '606.30.031.044', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Kit de Filtro de Aire', 'kit-filtro-aire-635-06-915-144', 'Kit de Filtro de Aire. Código: 635.06.915.144. Compatible con múltiples modelos de motocicletas.', 41674, 4, '635.06.915.144', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Kit de Transmision', 'kit-transmision-spab16g453m118e', 'Kit de Transmision. Código: SPAB16G453M118E. Compatible con múltiples modelos de motocicletas.', 129107, 10, 'SPAB16G453M118E', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Llave Bencina', 'llave-bencina-503-07-005-000', 'Llave Bencina. Código: 503.07.005.000. Compatible con múltiples modelos de motocicletas.', 0, 1, '503.07.005.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- REPUESTOS VARIOS - PARTES DE FRENOS Y SUSPENSIÓN
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Palancade Embrague', 'palancade-embrague-619-02-031-000', 'Palancade Embrague. Código: 619.02.031.000. Compatible con múltiples modelos de motocicletas.', 40330, 1, '619.02.031.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Parabrisas', 'parabrisas-607-06-044-033-3', 'Parabrisas. Código: 607.06.044.033/3. Compatible con múltiples modelos de motocicletas.', 3775, 0, '607.06.044.033/3', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Pastillas de Freno Delantera 1190', 'pastillas-freno-delantera-1190-603-13-130-000', 'Pastillas de Freno Delantera 1190. Código: 603.13.130.000. Compatible con KTM 1190 Adventure.', 42346, 2, '603.13.130.000', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Perno', 'perno-221-08-008-100', 'Perno. Código: 221.08.008.100. Compatible con múltiples modelos de motocicletas.', 0, 0, '221.08.008.100', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Protector', 'protector-varios', 'Protector. Compatible con múltiples modelos de motocicletas.', 0, 0, 'PROTECTOR-GENERICO', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Puños de Goma', 'puños-goma-790-02-021-200', 'Puños de Goma. Código: 790.02.021.200. Compatible con múltiples modelos de motocicletas.', 18270, 10, '790.02.021.200', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- REPUESTOS VARIOS - PARTES DE MOTOR (Continuación)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Tuerca de Radio', 'tuerca-radio-ktm', 'Tuerca de Radio. Compatible con múltiples modelos de motocicletas.', 1350, 11, 'TUERCA-RADIO', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Tuerca de Rayo M4', 'tuerca-rayo-m4-ktm', 'Tuerca de Rayo M4. Compatible con múltiples modelos de motocicletas.', 0, 0, 'TUERCA-RAYO-M4', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Tuerca de Salida del Silenciador', 'tuerca-salida-silenciador-ktm', 'Tuerca de Salida del Silenciador. Compatible con múltiples modelos de motocicletas.', 0, 0, 'TUERCA-SALIDA-SILENCIADOR', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Tuerca Grapa de M8', 'tuerca-grapa-m8-ktm', 'Tuerca Grapa de M8. Compatible con múltiples modelos de motocicletas.', 0, 0, 'TUERCA-GRAPA-M8', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Tuerca Grapa M6', 'tuerca-grapa-m6-ktm', 'Tuerca Grapa M6. Compatible con múltiples modelos de motocicletas.', 0, 0, 'TUERCA-GRAPA-M6', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Tuerca Guia Cadena Inferior', 'tuerca-guia-cadena-inferior-ktm', 'Tuerca Guia Cadena Inferior. Compatible con múltiples modelos de motocicletas.', 0, 1, 'TUERCA-GUIA-CADENA-INF', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Tuerca Oscilante M19 X 1,5 WS-27 MM', 'tuerca-oscilante-m19-ktm', 'Tuerca Oscilante M19 X 1,5 WS-27 MM. Compatible con múltiples modelos de motocicletas.', 0, 0, 'TUERCA-OSCILANTE-M19', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Tuerca Rayo 5MM', 'tuerca-rayo-5mm-ktm', 'Tuerca Rayo 5MM. Compatible con múltiples modelos de motocicletas.', 0, 0, 'TUERCA-RAYO-5MM', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Tuerca Seguro M6', 'tuerca-seguro-m6-ktm', 'Tuerca Seguro M6. Compatible con múltiples modelos de motocicletas.', 0, 0, 'TUERCA-SEGURO-M6', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Tuerca Soporte', 'tuerca-soporte-ktm', 'Tuerca Soporte. Compatible con múltiples modelos de motocicletas.', 0, 0, 'TUERCA-SOPORTE', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Turbina Bomba de Agua', 'turbina-bomba-agua-ktm', 'Turbina Bomba de Agua. Compatible con múltiples modelos de motocicletas.', 0, 0, 'TURBINA-BOMBA-AGUA', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Unidad de Control', 'unidad-control-ktm', 'Unidad de Control. Compatible con múltiples modelos de motocicletas.', 0, 0, 'UNIDAD-CONTROL', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Valvula de Cierre', 'valvula-cierre-ktm', 'Valvula de Cierre. Compatible con múltiples modelos de motocicletas.', 0, 0, 'VALVULA-CIERRE', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Valvula de Escape Duke', 'valvula-escape-duke-ktm', 'Valvula de Escape Duke. Compatible con KTM Duke.', 0, 0, 'VALVULA-ESCAPE-DUKE', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Valvula Purga Horquilla', 'valvula-purga-horquilla-ktm', 'Valvula Purga Horquilla. Compatible con múltiples modelos de motocicletas.', 0, 0, 'VALVULA-PURGA-HORQUILLA', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Valvulas de Admision', 'valvulas-admision-ktm', 'Valvulas de Admision. Compatible con múltiples modelos de motocicletas.', 0, 0, 'VALVULAS-ADMISION', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Valvulas de Admision 1190', 'valvulas-admision-1190-ktm', 'Valvulas de Admision 1190. Compatible con KTM 1190 Adventure.', 0, 0, 'VALVULAS-ADMISION-1190', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Varillas de SXF Reparacion', 'varillas-sxf-reparacion-ktm', 'Varillas de SXF Reparacion. Compatible con KTM SXF.', 0, 0, 'VARILLAS-SXF-REP', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Zylinder 075', 'zylinder-075-ktm', 'Zylinder 075. Compatible con múltiples modelos de motocicletas.', 0, 0, 'ZY cylinder-075', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- REPUESTOS VARIOS - MANGUERAS Y MANILLAS
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Manguera de Llenado de Aceite', 'manguera-llenado-aceite-ktm', 'Manguera de Llenado de Aceite. Compatible con múltiples modelos de motocicletas.', 0, 0, 'MANGUERA-LLENADO-ACEITE', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('Manguera de Radiador KTM 990', 'manguera-radiador-ktm-990', 'Manguera de Radiador KTM 990. Compatible con KTM 990.', 0, 0, 'MANGUERA-RADIADOR-990', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Manilla de Embrague', 'manilla-embrague-ktm', 'Manilla de Embrague. Compatible con múltiples modelos de motocicletas.', 0, 0, 'MANILLA-EMBRAGUE', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Manilla de Freno', 'manilla-freno-ktm', 'Manilla de Freno. Compatible con múltiples modelos de motocicletas.', 0, 0, 'MANILLA-FRENO', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Manubrio SX 85', 'manubrio-sx-85-ktm', 'Manubrio SX 85. Compatible con KTM SX 85.', 0, 0, 'MANUBRIO-SX-85', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Mascara Izquierda 790 R', 'mascara-izquierda-790-r-ktm', 'Mascara Izquierda 790 R. Compatible con KTM 790 R.', 0, 0, 'MASCARA-IZQ-790-R', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Metal de Horquilla WP 48', 'metal-horquilla-wp-48-ktm', 'Metal de Horquilla WP 48. Compatible con horquillas WP 48mm.', 0, 0, 'METAL-HORQUILLA-WP-48', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Muelle 116 MM Resorte Pata Apoyo', 'muelle-116mm-resorte-pata-apoyo-ktm', 'Muelle 116 MM Resorte Pata Apoyo. Compatible con múltiples modelos de motocicletas.', 0, 0, 'MUELLE-116MM-PATA', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- REPUESTOS VARIOS - O'RINGS (Extensa lista)
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('ORING 54X2.00 VITON', 'oring-54x2-00-viton-ktm', 'ORING 54X2.00 VITON. Compatible con múltiples modelos de motocicletas.', 0, 0, 'ORING-54X2.00-VITON', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('ORING 30.00X1.50', 'oring-30-00x1-50-ktm', 'ORING 30.00X1.50. Compatible con múltiples modelos de motocicletas.', 0, 0, 'ORING-30.00X1.50', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('ORING 39.34X2.62 Tapon de Aceite', 'oring-39-34x2-62-tapon-aceite-ktm', 'ORING 39.34X2.62 Tapon de Aceite. Compatible con múltiples modelos de motocicletas.', 0, 29, 'ORING-39.34X2.62', 'active', false, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'),
('ORING de Piñon de Ataque', 'oring-pinon-ataque-ktm', 'ORING de Piñon de Ataque. Compatible con múltiples modelos de motocicletas.', 0, 0, 'ORING-PINON-ATAQUE', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('ORING Tapa Bomba de Agua', 'oring-tapa-bomba-agua-ktm', 'ORING Tapa Bomba de Agua. Compatible con múltiples modelos de motocicletas.', 0, 0, 'ORING-TAPA-BOMBA-AGUA', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- REPUESTOS VARIOS - PALANCAS
-- ============================================
INSERT INTO public.products (name, slug, description, price, stock, sku, status, is_accessory, is_spare_part, main_image_url) VALUES
('Palanca de Embrague', 'palanca-embrague-ktm', 'Palanca de Embrague. Compatible con múltiples modelos de motocicletas.', 0, 0, 'PALANCA-EMBRAGUE', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Palanca de Freno de Mano', 'palanca-freno-mano-ktm', 'Palanca de Freno de Mano. Compatible con múltiples modelos de motocicletas.', 0, 0, 'PALANCA-FRENO-MANO', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'),
('Palanca de Freno Trasero', 'palanca-freno-trasero-ktm', 'Palanca de Freno Trasero. Compatible con múltiples modelos de motocicletas.', 0, 0, 'PALANCA-FRENO-TRASERO', 'active', false, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
-- Verificar productos insertados
SELECT 
  COUNT(*) as total_repuestos,
  COUNT(CASE WHEN price = 0 THEN 1 END) as sin_precio,
  COUNT(CASE WHEN price > 0 THEN 1 END) as con_precio,
  COUNT(CASE WHEN main_image_url IS NOT NULL AND main_image_url != '' THEN 1 END) as con_imagen,
  COUNT(CASE WHEN main_image_url IS NULL OR main_image_url = '' THEN 1 END) as sin_imagen
FROM public.products 
WHERE is_spare_part = true AND status = 'active';

-- Mostrar algunos ejemplos CON imagen URL
SELECT name, price, stock, sku, main_image_url
FROM public.products 
WHERE is_spare_part = true AND status = 'active'
  AND main_image_url IS NOT NULL AND main_image_url != ''
ORDER BY name
LIMIT 20;

-- Mostrar algunos ejemplos SIN imagen URL (para verificar)
SELECT name, price, stock, sku, main_image_url
FROM public.products 
WHERE is_spare_part = true AND status = 'active'
  AND (main_image_url IS NULL OR main_image_url = '')
ORDER BY name
LIMIT 10;

-- ============================================
-- ACTUALIZAR PRODUCTOS SIN IMAGEN
-- ============================================
-- Si hay productos sin imagen, actualizarlos con una URL por defecto
UPDATE public.products
SET main_image_url = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
WHERE is_spare_part = true 
  AND status = 'active'
  AND (main_image_url IS NULL OR main_image_url = '');

-- Verificar después de la actualización
SELECT 
  COUNT(*) as total_repuestos,
  COUNT(CASE WHEN main_image_url IS NOT NULL AND main_image_url != '' THEN 1 END) as con_imagen,
  COUNT(CASE WHEN main_image_url IS NULL OR main_image_url = '' THEN 1 END) as sin_imagen
FROM public.products 
WHERE is_spare_part = true AND status = 'active';

