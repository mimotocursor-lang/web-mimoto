import { supabaseClient } from './client';

const BUCKET_NAME = 'product-images'; // Bucket único para productos y banners

/**
 * Sube una imagen a Supabase Storage
 * @param file - Archivo de imagen a subir
 * @param folder - Carpeta donde guardar ('products' o 'banners')
 * @returns URL pública de la imagen subida
 */
export async function uploadImage(file: File, folder: string = 'products'): Promise<string> {
  try {
    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}_${sanitizedName}`;

    // Subir archivo a Supabase Storage
    const { data, error } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error de storage:', error);
      throw new Error(`Error al subir imagen: ${error.message}`);
    }

    // Obtener URL pública
    const { data: urlData } = supabaseClient.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Error subiendo imagen:', error);
    throw new Error(error.message || 'Error al subir la imagen');
  }
}

/**
 * Elimina una imagen de Supabase Storage
 * @param imageUrl - URL completa de la imagen a eliminar
 * @param folder - Carpeta donde está la imagen ('products' o 'banners')
 */
export async function deleteImage(imageUrl: string, folder?: string): Promise<void> {
  try {
    if (!imageUrl) return;

    // Extraer el path del URL de Supabase Storage
    // Los URLs de Supabase tienen formato: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    
    // Buscar el índice de 'public' y tomar todo después del bucket
    const publicIndex = pathParts.indexOf('public');
    if (publicIndex === -1) {
      console.warn('No se pudo extraer el path del URL:', imageUrl);
      return;
    }
    
    // El path es todo después de 'public' y el bucket
    // pathParts = ['', 'storage', 'v1', 'object', 'public', 'bucket-name', 'folder', 'file.ext']
    const pathAfterPublic = pathParts.slice(publicIndex + 2); // +2 para saltar 'public' y el bucket
    const fullPath = pathAfterPublic.join('/');

    if (!fullPath) {
      console.warn('Path vacío para eliminar:', imageUrl);
      return;
    }

    const { error } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .remove([fullPath]);

    if (error) {
      console.error('Error eliminando imagen de storage:', error);
      // No lanzar error, solo loguear para no romper el flujo
    } else {
      console.log('Imagen eliminada correctamente:', fullPath);
    }
  } catch (error: any) {
    console.error('Error eliminando imagen:', error);
    // No lanzar error, solo loguear
  }
}

