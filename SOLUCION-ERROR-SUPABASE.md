# 🔧 Solución: Error de Conexión a Supabase

## ❌ Error Actual

```
Error: getaddrinfo ENOTFOUND prizpqahcluomioxnmex.supabase.co (ENOTFOUND)
```

Este error indica que **el DNS no puede resolver el host de Supabase**.

## 🔍 Diagnóstico Rápido

### Paso 1: Verificar Variables de Entorno

El archivo `.env` existe, pero necesitas verificar que tenga los valores correctos:

1. Abre `frontend/.env`
2. Verifica que tenga estas líneas:
   ```env
   PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_aqui
   ```

### Paso 2: Verificar Proyecto de Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Verifica que el proyecto existe
3. Si el proyecto `prizpqahcluomioxnmex` no existe:
   - **Crea un nuevo proyecto** o
   - **Usa un proyecto existente**
4. Ve a **Settings** → **API**
5. Copia:
   - **Project URL** (ejemplo: `https://xxxxx.supabase.co`)
   - **anon public** key

### Paso 3: Actualizar Archivo .env

Actualiza `frontend/.env` con los valores correctos:

```env
# Reemplaza con la URL correcta de tu proyecto
PUBLIC_SUPABASE_URL=https://tu-proyecto-nuevo.supabase.co

# Reemplaza con tu clave anon pública
PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_correcta

# Opcional
PUBLIC_SITE_URL=http://localhost:4321
```

### Paso 4: Verificar Conectividad (Opcional)

Ejecuta el script de verificación:

```bash
cd frontend
node verificar-supabase.js
```

Este script te dirá si:
- ✅ La conexión funciona
- ❌ Hay problemas de DNS
- ❌ La URL es incorrecta
- ❌ La clave API es incorrecta

### Paso 5: Reiniciar Servidor

**IMPORTANTE**: Después de cambiar `.env`, debes reiniciar el servidor:

1. Detén el servidor (Ctrl+C)
2. Reinicia:
   ```bash
   cd frontend
   npm run dev
   ```

## 🧪 Verificación

1. Abre la consola del navegador (F12)
2. Busca mensajes de error relacionados con Supabase
3. Deberías ver:
   - ✅ `Supabase configurado:` con la URL correcta
   - ❌ NO deberías ver `ENOTFOUND` o `getaddrinfo`

## ⚠️ Si el Proyecto de Supabase Fue Eliminado

Si el proyecto `prizpqahcluomioxnmex` ya no existe:

### Opción 1: Crear Nuevo Proyecto

1. Crea un nuevo proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Configura las tablas necesarias (products, banners, orders, etc.)
3. Actualiza `frontend/.env` con la nueva URL
4. Reinicia el servidor

### Opción 2: Restaurar Proyecto

1. Si tienes un backup, restaura el proyecto
2. O contacta a Supabase support para restaurar

## 📝 Cambios Realizados

Se mejoró el manejo de errores para mostrar mensajes más claros:

1. **`frontend/src/lib/supabase/client.ts`**:
   - Mejor diagnóstico de errores
   - Mensajes más claros sobre problemas de DNS
   - Función `testSupabaseConnection()` para verificar conectividad

2. **`frontend/src/pages/index.astro`**:
   - Mejor manejo de errores al cargar banners
   - Mensajes de diagnóstico más claros

3. **`frontend/src/pages/tienda.astro`**:
   - Mejor manejo de errores al cargar accesorios y repuestos
   - Mensajes de diagnóstico más claros

## 🚀 Próximos Pasos

1. ✅ Verifica tu archivo `.env`
2. ✅ Verifica que el proyecto de Supabase exista
3. ✅ Actualiza la URL si es necesario
4. ✅ Reinicia el servidor
5. ✅ Verifica que los errores desaparezcan

## 💡 Notas

- **NUNCA** subas el archivo `.env` a Git
- El archivo `.env` debe estar en `.gitignore`
- En producción (Vercel), configura las variables en el dashboard de Vercel

