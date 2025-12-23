-- Agregar campos de información del cliente a la tabla orders
-- Ejecutar en Supabase SQL Editor

ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS rut TEXT,
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS address_street TEXT,
  ADD COLUMN IF NOT EXISTS address_number TEXT,
  ADD COLUMN IF NOT EXISTS address_apartment TEXT,
  ADD COLUMN IF NOT EXISTS address_city TEXT,
  ADD COLUMN IF NOT EXISTS address_commune TEXT;

-- Comentarios para documentación
COMMENT ON COLUMN public.orders.phone IS 'Número de contacto del cliente';
COMMENT ON COLUMN public.orders.rut IS 'RUT del cliente';
COMMENT ON COLUMN public.orders.first_name IS 'Nombre del cliente (para invitados)';
COMMENT ON COLUMN public.orders.last_name IS 'Apellido del cliente (para invitados)';
COMMENT ON COLUMN public.orders.address_street IS 'Calle o avenida de la dirección';
COMMENT ON COLUMN public.orders.address_number IS 'Número de domicilio';
COMMENT ON COLUMN public.orders.address_apartment IS 'Departamento y piso (opcional)';
COMMENT ON COLUMN public.orders.address_city IS 'Ciudad de la dirección';
COMMENT ON COLUMN public.orders.address_commune IS 'Comuna de la dirección';

