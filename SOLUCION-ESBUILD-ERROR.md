# 🔧 Solución: Error de esbuild en Vercel

## ❌ **Problema:**
```
at Socket.readFromStdout (/vercel/path0/node_modules/esbuild/lib/main.js:600:7)
Error: Command "npm run build" exited with 1
```

## 🔍 **Causa:**
El error de esbuild puede ser causado por:
1. **Alias de path incorrecto**: Usar strings simples en lugar de `path.resolve()`
2. **Problemas con dependencias SSR**: Algunas dependencias necesitan configuración especial
3. **Memoria insuficiente**: El build puede estar usando demasiada memoria

## ✅ **Solución Aplicada:**

### 1. **Actualizado `astro.config.mjs`:**

**Antes:**
```javascript
alias: {
  '@': '/src',
}
```

**Después:**
```javascript
import path from 'node:path';

alias: {
  '@': path.resolve('./src'),
}
```

### 2. **Agregado `optimizeDeps`:**

```javascript
optimizeDeps: {
  exclude: ['@supabase/supabase-js'],
}
```

Esto evita que Vite intente optimizar Supabase durante el build, lo cual puede causar problemas.

## 📋 **Cambios Realizados:**

1. ✅ Importado `path` de `node:path`
2. ✅ Cambiado alias de `'@': '/src'` a `'@': path.resolve('./src')`
3. ✅ Agregado `optimizeDeps.exclude` para Supabase

## 🚀 **Próximos Pasos:**

1. **Commit y push:**
   ```bash
   git add frontend/astro.config.mjs
   git commit -m "fix: corregir configuración de alias y optimizeDeps para esbuild"
   git push
   ```

2. **Vercel redeployará automáticamente**

## 🔍 **Si el error persiste:**

### Opción 1: Aumentar memoria en Vercel
- Ve a Vercel Dashboard → Settings → Functions
- Aumenta el "Max Memory" a 3008 MB

### Opción 2: Verificar logs completos
- Ve a Vercel Dashboard → Deployments
- Haz clic en el deployment fallido
- Revisa los logs completos para ver el error específico

### Opción 3: Build local para debug
```bash
cd frontend
npm run build
```
Si falla localmente, verás el error completo.

## 📝 **Notas:**

- `path.resolve()` es más robusto que strings simples
- `optimizeDeps.exclude` evita problemas con dependencias SSR
- El adaptador de Vercel ya está configurado correctamente

