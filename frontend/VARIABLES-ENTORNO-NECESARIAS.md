# 🔧 Variables de Entorno Necesarias

## ⚠️ IMPORTANTE: Variable Faltante

El error "Variables de entorno de Supabase no configuradas" indica que falta la variable **`SUPABASE_SERVICE_ROLE_KEY`**.

## 📋 Variables Requeridas

### Variables Públicas (disponibles en cliente y servidor)

Estas variables tienen el prefijo `PUBLIC_` y están disponibles tanto en el navegador como en el servidor:

```env
PUBLIC_SUPABASE_URL=https://prizpqahcluomioxnmex.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_aqui
```

### Variables Privadas (solo servidor)

**⚠️ IMPORTANTE**: Esta variable NO tiene el prefijo `PUBLIC_` y solo está disponible en rutas API del servidor:

```env
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role_aqui
```

## 🔍 Cómo Obtener SUPABASE_SERVICE_ROLE_KEY

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **Settings** → **API**
3. Busca la sección **Project API keys**
4. Copia la clave **`service_role`** (⚠️ NO uses la clave `anon`, usa la `service_role`)
5. Esta clave tiene permisos de administrador y solo debe usarse en el servidor

## 🚀 Configurar en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega la variable:
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: Tu clave service_role de Supabase
   - **Environment**: Production, Preview, Development (marca todas)
5. Guarda los cambios
6. **Re-deploy** tu proyecto para que los cambios surtan efecto

## 🧪 Configurar en Desarrollo Local

Crea un archivo `.env` en la carpeta `frontend/` con:

```env
# Variables Públicas
PUBLIC_SUPABASE_URL=https://prizpqahcluomioxnmex.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_aqui

# Variable Privada (solo servidor)
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role_aqui

# Transbank (opcional)
PUBLIC_WEBPAY_ENVIRONMENT=integration
PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
PUBLIC_WEBPAY_API_KEY=tu_api_key_aqui
```

## ⚠️ Seguridad

- **NUNCA** expongas `SUPABASE_SERVICE_ROLE_KEY` en el cliente
- **NUNCA** la incluyas en código que se envíe al navegador
- Solo úsala en rutas API del servidor (`/api/*`)
- No la agregues a repositorios públicos

## ✅ Verificación

Después de configurar las variables:

1. En **Vercel**: Re-deploy el proyecto
2. En **desarrollo**: Reinicia el servidor (`npm run dev`)
3. Prueba crear una orden desde el checkout
4. Si aún falla, verifica los logs en Vercel o en la consola del servidor

