# ✅ Solución: Error "No Adapter Installed" en Vercel

## ❌ **Problema:**
```
Error: No adapter installed.
Error reference: https://docs.astro.build/en/reference/errors/no-adapter-installed/
```

## 🔍 **Causa:**
Cuando cambias `output: 'server'` en Astro, necesitas instalar y configurar un adaptador para el hosting que uses (Vercel, Netlify, etc.).

## ✅ **Solución Aplicada:**

### 1. **Instalado el adaptador de Vercel:**
```bash
npm install @astrojs/vercel@^4.0.0 --legacy-peer-deps
```

### 2. **Configurado en `astro.config.mjs`:**
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  srcDir: './src',
  output: 'server',
  adapter: vercel(), // ✅ Adaptador agregado
  integrations: [tailwind()],
  // ... resto de configuración
});
```

## 📋 **Verificación:**

1. ✅ Adaptador instalado: `@astrojs/vercel@^4.0.0`
2. ✅ Configuración actualizada en `astro.config.mjs`
3. ✅ `adapter: vercel()` agregado

## 🚀 **Próximos Pasos:**

1. **Commit y push:**
   ```bash
   git add frontend/package.json frontend/package-lock.json frontend/astro.config.mjs
   git commit -m "fix: agregar adaptador de Vercel para output server"
   git push
   ```

2. **Vercel redeployará automáticamente** y el build debería funcionar.

## 📝 **Notas:**

- El adaptador `@astrojs/vercel/serverless` es para funciones serverless de Vercel
- Compatible con Astro 4.x
- Las rutas API ahora funcionarán correctamente en producción

