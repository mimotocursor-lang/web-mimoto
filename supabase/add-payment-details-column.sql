-- Agregar columna payment_details a la tabla orders si no existe
-- Ejecutar este script en Supabase SQL Editor

-- Verificar si la columna existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'payment_details'
  ) THEN
    ALTER TABLE public.orders 
    ADD COLUMN payment_details JSONB;
    
    RAISE NOTICE 'Columna payment_details agregada exitosamente';
  ELSE
    RAISE NOTICE 'La columna payment_details ya existe';
  END IF;
END $$;

-- Verificar que la columna fue creada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'orders' 
AND column_name = 'payment_details';

