-- MÉTODO SIMPLE: Crear usuario admin directamente
-- 
-- PASO 1: Crea un usuario normal desde tu web
--   - Ve a /registro en tu web
--   - Regístrate con el email que quieres usar como admin
--   - Completa el registro normalmente
--
-- PASO 2: Ejecuta este script en Supabase SQL Editor
--   - Reemplaza 'TU_EMAIL_AQUI' con el email del usuario que acabas de crear
--   - Ejecuta el script

-- Actualizar el rol del usuario a 'admin' usando su email
UPDATE public.users
SET role = 'admin', updated_at = NOW()
WHERE email = 'TU_EMAIL_AQUI';  -- ⬅️ CAMBIA ESTO por el email del usuario

-- Verificar que funcionó
SELECT id, email, full_name, role, created_at
FROM public.users
WHERE email = 'TU_EMAIL_AQUI';  -- ⬅️ CAMBIA ESTO también




