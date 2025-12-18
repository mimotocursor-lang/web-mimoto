-- Script para crear un usuario admin manualmente
-- 
-- INSTRUCCIONES:
-- 1. Primero crea el usuario en Supabase Auth (Authentication > Users > Add user)
--    - Email: tu-email-admin@ejemplo.com
--    - Password: (genera una segura)
--    - Copia el UUID del usuario creado (lo verás en la lista de usuarios)
--
-- 2. Ejecuta este script en Supabase SQL Editor reemplazando:
--    - 'TU_UUID_AQUI' con el UUID del usuario de auth.users
--    - 'tu-email-admin@ejemplo.com' con el email del admin
--    - 'Nombre Admin' con el nombre completo del admin

-- Opción 1: Si ya tienes el UUID del usuario en auth.users
INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
VALUES (
  'TU_UUID_AQUI'::uuid,  -- Reemplaza con el UUID del usuario de auth.users
  'tu-email-admin@ejemplo.com',  -- Reemplaza con el email del admin
  'Nombre Admin',  -- Reemplaza con el nombre del admin
  'admin',  -- Rol admin
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin', updated_at = NOW();

-- Opción 2: Si quieres actualizar un usuario existente a admin
-- (Reemplaza 'email-del-usuario@ejemplo.com' con el email del usuario que quieres hacer admin)
-- UPDATE public.users
-- SET role = 'admin', updated_at = NOW()
-- WHERE email = 'email-del-usuario@ejemplo.com';

-- Verificar que el usuario fue creado/actualizado correctamente
SELECT id, email, full_name, role, created_at
FROM public.users
WHERE role = 'admin';
