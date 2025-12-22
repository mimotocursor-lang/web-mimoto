-- Script para verificar y corregir el enum order_status
-- Ejecuta esto en el SQL Editor de Supabase si el enum no tiene los valores correctos

-- 1. Verificar valores actuales del enum
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (
  SELECT oid 
  FROM pg_type 
  WHERE typname = 'order_status'
);

-- 2. Si el enum no tiene 'pending_payment', agregarlo
-- (Solo si no existe)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'pending_payment' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
  ) THEN
    ALTER TYPE public.order_status ADD VALUE 'pending_payment';
  END IF;
END $$;

-- 3. Si el enum no tiene 'waiting_confirmation', agregarlo
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'waiting_confirmation' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
  ) THEN
    ALTER TYPE public.order_status ADD VALUE 'waiting_confirmation';
  END IF;
END $$;

-- 4. Verificar valores después de agregar
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (
  SELECT oid 
  FROM pg_type 
  WHERE typname = 'order_status'
)
ORDER BY enumsortorder;

