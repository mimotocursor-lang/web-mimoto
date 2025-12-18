-- Agregar soporte para banners de sección en la tabla banners
-- Ejecutar en Supabase SQL Editor

-- Agregar columna banner_type para diferenciar entre hero y secciones
ALTER TABLE public.banners 
ADD COLUMN IF NOT EXISTS banner_type TEXT DEFAULT 'hero' CHECK (banner_type IN ('hero', 'accessories', 'spare_parts'));

-- Actualizar banners existentes para que tengan tipo 'hero' por defecto
UPDATE public.banners 
SET banner_type = 'hero' 
WHERE banner_type IS NULL;

-- Crear índice para búsquedas por tipo
CREATE INDEX IF NOT EXISTS banners_type_idx ON public.banners (banner_type);

-- Comentario en la columna
COMMENT ON COLUMN public.banners.banner_type IS 'Tipo de banner: hero (para el slider principal), accessories (para sección de accesorios), spare_parts (para sección de repuestos)';

