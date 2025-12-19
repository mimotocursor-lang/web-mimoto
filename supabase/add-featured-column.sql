-- Agregar columna 'featured' a la tabla products si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'featured'
  ) THEN
    ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT false NOT NULL;
    
    -- Crear índice para mejorar las consultas de productos destacados
    CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
    
    RAISE NOTICE 'Columna featured agregada exitosamente a la tabla products';
  ELSE
    RAISE NOTICE 'La columna featured ya existe en la tabla products';
  END IF;
END $$;


