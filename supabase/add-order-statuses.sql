-- Agregar nuevos estados de pedido al enum existente
-- Ejecutar este script en Supabase SQL Editor

-- Verificar valores actuales
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (
  SELECT oid FROM pg_type WHERE typname = 'order_status'
);

-- Agregar nuevos estados si no existen
DO $$ 
BEGIN
  -- 'order_received' - Pedido recibido
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'order_received' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
  ) THEN
    ALTER TYPE public.order_status ADD VALUE 'order_received';
  END IF;

  -- 'order_confirmed' - Pedido confirmado
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'order_confirmed' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
  ) THEN
    ALTER TYPE public.order_status ADD VALUE 'order_confirmed';
  END IF;

  -- 'order_delivered' - Pedido entregado
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'order_delivered' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
  ) THEN
    ALTER TYPE public.order_status ADD VALUE 'order_delivered';
  END IF;
END $$;

-- Verificar valores finales
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (
  SELECT oid FROM pg_type WHERE typname = 'order_status'
)
ORDER BY enumsortorder;

