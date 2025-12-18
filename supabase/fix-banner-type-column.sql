-- Script para agregar la columna banner_type a la tabla banners
-- Ejecutar en Supabase SQL Editor

-- Verificar si la columna existe y agregarla si no existe
DO $$
BEGIN
  -- Agregar columna banner_type si no existe
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'banners' 
    AND column_name = 'banner_type'
  ) THEN
    ALTER TABLE public.banners 
    ADD COLUMN banner_type TEXT DEFAULT 'hero' 
    CHECK (banner_type IN ('hero', 'accessories', 'spare_parts'));
    
    -- Actualizar banners existentes para que tengan tipo 'hero' por defecto
    UPDATE public.banners 
    SET banner_type = 'hero' 
    WHERE banner_type IS NULL;
    
    RAISE NOTICE 'Columna banner_type agregada exitosamente';
  ELSE
    RAISE NOTICE 'La columna banner_type ya existe';
  END IF;
END $$;

-- Crear índice para búsquedas por tipo (si no existe)
CREATE INDEX IF NOT EXISTS banners_type_idx ON public.banners (banner_type);

-- Agregar comentario en la columna
COMMENT ON COLUMN public.banners.banner_type IS 'Tipo de banner: hero (para el slider principal), accessories (para sección de accesorios), spare_parts (para sección de repuestos)';

-- Verificar que la columna fue creada correctamente
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'banners' 
AND column_name = 'banner_type';

