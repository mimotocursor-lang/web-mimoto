-- Script para configurar Supabase Storage para imágenes
-- 
-- INSTRUCCIONES:
-- 1. Ejecuta este script completo en Supabase SQL Editor
-- 2. El script creará el bucket y configurará las políticas automáticamente
--
-- NOTA: Este bucket almacena tanto imágenes de productos como de banners
-- Las imágenes se organizan en carpetas: 'products/' y 'banners/'

-- =====================================================
-- 1. CREAR EL BUCKET (si no existe)
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images', 
  true, -- Público para que las URLs sean accesibles
  10485760, -- 10MB en bytes (límite de tamaño de archivo)
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'] -- Tipos MIME permitidos
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Eliminar políticas existentes si existen (para poder ejecutar el script múltiples veces)
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- Política para permitir lectura pública
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Política para permitir subida de archivos a usuarios autenticados
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Política para permitir actualización a usuarios autenticados
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Política para permitir eliminación a usuarios autenticados
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- =====================================================
-- 3. VERIFICACIÓN
-- =====================================================
-- Verificar que el bucket se creó correctamente
SELECT 
  id, 
  name, 
  public, 
  file_size_limit, 
  allowed_mime_types 
FROM storage.buckets 
WHERE id = 'product-images';

-- Verificar que las políticas se crearon
SELECT 
  policyname, 
  cmd 
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects' 
  AND policyname IN (
    'Public read access',
    'Authenticated users can upload',
    'Authenticated users can update',
    'Authenticated users can delete'
  );

