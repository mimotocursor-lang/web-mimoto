-- Agregar columna email a la tabla orders
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'email'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN email TEXT;
        COMMENT ON COLUMN public.orders.email IS 'Email del cliente para esta orden (puede ser diferente al email de la cuenta)';
    END IF;
END
$$;

-- Actualizar órdenes existentes con el email del usuario si no tienen email
UPDATE public.orders o
SET email = u.email
FROM public.users u
WHERE o.user_id = u.id 
  AND o.email IS NULL
  AND u.email IS NOT NULL;

