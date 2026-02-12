# 🔍 Diagnóstico: Error de Conexión a Supabase

## ❌ Error Actual

```
Error: getaddrinfo ENOTFOUND prizpqahcluomioxnmex.supabase.co (ENOTFOUND)
```

Este error indica que el sistema **no puede resolver el DNS** del host de Supabase.

## 🔍 Posibles Causas

### 1. **Variables de Entorno No Configuradas**
- No existe archivo `.env` en `frontend/`
- Las variables `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` no están definidas
- El código está usando el fallback hardcodeado que puede estar incorrecto

### 2. **Proyecto de Supabase Eliminado o URL Cambiada**
- El proyecto `prizpqahcluomioxnmex` puede haber sido eliminado
- La URL puede haber cambiado
- Necesitas verificar en tu [Supabase Dashboard](https://supabase.com/dashboard)

### 3. **Problemas de Conexión/DNS**
- Problemas de conexión a internet
- Problemas con el DNS local
- Firewall bloqueando conexiones a Supabase

## ✅ Soluciones

### Paso 1: Verificar Proyecto de Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Verifica que el proyecto `prizpqahcluomioxnmex` existe
3. Si no existe, crea uno nuevo o usa otro proyecto existente
4. Ve a **Settings** → **API** y copia:
   - **Project URL** (ejemplo: `https://xxxxx.supabase.co`)
   - **anon public** key

### Paso 2: Crear Archivo `.env` en `frontend/`

Crea un archivo `.env` en la carpeta `frontend/` con:

```env
# URL de tu proyecto de Supabase (reemplaza con la URL correcta)
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co

# Clave anon pública de Supabase
PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_aqui

# URL del sitio (opcional)
PUBLIC_SITE_URL=http://localhost:4321
```

### Paso 3: Verificar Conectividad

Ejecuta en PowerShell para verificar si puedes acceder a Supabase:

```powershell
# Probar resolución DNS
nslookup prizpqahcluomioxnmex.supabase.co

# Probar conexión HTTP
curl https://prizpqahcluomioxnmex.supabase.co
```

### Paso 4: Reiniciar Servidor de Desarrollo

Después de crear el archivo `.env`:

```bash
cd frontend
# Detén el servidor (Ctrl+C)
# Reinicia el servidor
npm run dev
```

## 🧪 Verificación

1. Abre la consola del navegador (F12)
2. Busca mensajes de error relacionados con Supabase
3. Verifica que las variables se carguen correctamente:
   - Deberías ver logs de Supabase funcionando
   - No deberías ver el error `ENOTFOUND`

## ⚠️ Si el Proyecto de Supabase Fue Eliminado

Si el proyecto `prizpqahcluomioxnmex` ya no existe:

1. **Crea un nuevo proyecto en Supabase**
2. **Actualiza todas las referencias** en el código:
   - `frontend/src/lib/supabase/client.ts`
   - `frontend/src/layouts/BaseLayout.astro`
   - Cualquier otro archivo que tenga la URL hardcodeada
3. **Crea el archivo `.env`** con la nueva URL
4. **Reinicia el servidor**

## 📝 Notas Importantes

- **NUNCA** subas el archivo `.env` a Git (debe estar en `.gitignore`)
- Usa `.env.example` como plantilla para documentar las variables necesarias
- En producción (Vercel), configura las variables en el dashboard de Vercel

