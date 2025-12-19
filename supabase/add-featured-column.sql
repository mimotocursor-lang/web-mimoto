-- Script para agregar la columna 'featured' a la tabla products

-- Agregar columna featured si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'featured'
    ) THEN
        ALTER TABLE public.products 
        ADD COLUMN featured BOOLEAN NOT NULL DEFAULT FALSE;
        
        -- Crear índice para mejorar las consultas de productos destacados
        CREATE INDEX IF NOT EXISTS products_featured_idx ON public.products (featured);
        
        RAISE NOTICE 'Columna featured agregada a products';
    ELSE
        RAISE NOTICE 'Columna featured ya existe en products';
    END IF;
END $$;
