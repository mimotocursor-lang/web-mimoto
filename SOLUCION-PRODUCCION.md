# Solución para Problemas en Producción

## Problemas Reportados
1. No se muestran los productos en producción
2. No deja iniciar sesión
3. Error 404 en `/lib/supabase/client:1`

## Cambios Realizados

### 1. Cliente de Supabase Mejorado (`frontend/src/lib/supabase/client.ts`)
- ✅ Agregado soporte para `window.PUBLIC_SUPABASE_URL` y `window.PUBLIC_SUPABASE_ANON_KEY` como fallback
- ✅ Verificación de `import.meta` antes de usarlo
- ✅ Singleton pattern para evitar múltiples instancias del cliente

### 2. Inyección de Variables en BaseLayout (`frontend/src/layouts/BaseLayout.astro`)
- ✅ Variables de Supabase inyectadas en el HTML usando `define:vars`
- ✅ Variables disponibles globalmente en `window.PUBLIC_SUPABASE_URL` y `window.PUBLIC_SUPABASE_ANON_KEY`
- ✅ Esto asegura que las variables estén disponibles incluso si `import.meta.env` falla en producción

### 3. Configuración de Astro (`frontend/astro.config.mjs`)
- ✅ `@supabase/supabase-js` marcado como `noExternal` para SSR
- ✅ Configuración simplificada para mejor compatibilidad

## Verificación en Producción

### Pasos para Verificar:

1. **Variables de Entorno en Vercel/Plataforma de Hosting:**
   - Asegúrate de que estas variables estén configuradas:
     - `PUBLIC_SUPABASE_URL`
     - `PUBLIC_SUPABASE_ANON_KEY`

2. **Reconstruir el Proyecto:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Verificar en el Navegador:**
   - Abre la consola del navegador (F12)
   - Verifica que `window.PUBLIC_SUPABASE_URL` y `window.PUBLIC_SUPABASE_ANON_KEY` estén definidos
   - Verifica que no haya errores 404 para `/lib/supabase/client`

4. **Probar Funcionalidades:**
   - Intentar iniciar sesión
   - Verificar que los productos se carguen en `/tienda`
   - Verificar que el carrito funcione

## Si Aún Hay Problemas

### Debug en Consola del Navegador:
```javascript
// Verificar variables
console.log('Supabase URL:', window.PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', window.PUBLIC_SUPABASE_ANON_KEY ? 'Configurada' : 'Faltante');

// Verificar cliente
import { supabaseClient } from '/lib/supabase/client';
console.log('Cliente:', supabaseClient);
```

### Verificar Variables de Entorno en Vercel:
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Verifica que `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` estén configuradas
4. Si las cambiaste, **reconstruye el proyecto**

### Verificar Build de Astro:
- El build debe incluir las variables `PUBLIC_*` en el bundle
- Si no están, Astro no las incluirá en el build estático

## Notas Importantes

- Las variables `PUBLIC_*` son las únicas que Astro expone al cliente
- Las variables sin `PUBLIC_` solo están disponibles en el servidor
- El fallback a `window.PUBLIC_*` asegura que funcione incluso si `import.meta.env` falla
- Los valores por defecto en el código son solo para desarrollo, no deben usarse en producción


