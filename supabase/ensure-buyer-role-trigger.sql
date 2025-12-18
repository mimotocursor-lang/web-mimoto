-- Trigger para asegurar que todos los usuarios nuevos sean 'buyer' por defecto
-- Este trigger se ejecuta automáticamente cuando se inserta un nuevo usuario

CREATE OR REPLACE FUNCTION public.ensure_buyer_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el rol no está especificado o es NULL, forzar a 'buyer'
  IF NEW.role IS NULL THEN
    NEW.role := 'buyer';
  END IF;
  
  -- Asegurar que solo usuarios con rol 'buyer' pueden ser creados desde el frontend
  -- (Los admins solo se pueden crear manualmente desde SQL)
  IF NEW.role = 'admin' AND NOT (current_setting('request.jwt.claims', true)::json->>'role' = 'admin') THEN
    -- Si alguien intenta crear un admin desde el frontend, forzar a 'buyer'
    NEW.role := 'buyer';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el trigger
DROP TRIGGER IF EXISTS ensure_buyer_role_trigger ON public.users;
CREATE TRIGGER ensure_buyer_role_trigger
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_buyer_role();




