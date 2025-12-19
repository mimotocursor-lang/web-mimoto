# Configuración de Autenticación con Google

## Estado Actual

El código para autenticación con Google **ya está implementado** en:
- `frontend/src/pages/login.astro` - Botón "Continuar con Google"
- `frontend/src/pages/registro.astro` - Botón "Continuar con Google"
- `frontend/src/pages/auth/callback.astro` - Manejo del callback de Google

## Lo que falta para que funcione

### 1. Configurar Google OAuth en Google Cloud Console

1. **Ir a Google Cloud Console**
   - Visita: https://console.cloud.google.com/
   - Inicia sesión con tu cuenta de Google

2. **Crear o seleccionar un proyecto**
   - Crea un nuevo proyecto o selecciona uno existente
   - Anota el nombre del proyecto

3. **Habilitar Google+ API**
   - Ve a "APIs & Services" → "Library"
   - Busca "Google+ API" o "Google Identity Services API"
   - Haz clic en "Enable"

4. **Crear credenciales OAuth 2.0**
   - Ve a "APIs & Services" → "Credentials"
   - Haz clic en "Create Credentials" → "OAuth client ID"
   - Si es la primera vez, configura la pantalla de consentimiento OAuth:
     - Tipo de aplicación: "External" (para desarrollo) o "Internal" (para G Suite)
     - Nombre de la app: "Mimoto"
     - Email de soporte: tu email
     - Logo (opcional): sube el logo de Mimoto
     - Dominios autorizados: tu dominio (ej: `mimoto.cl` o `tu-sitio.vercel.app`)
     - Guarda y continúa

5. **Configurar OAuth Client ID**
   - Tipo de aplicación: "Web application"
   - Nombre: "Mimoto Web"
   - **Authorized JavaScript origins:**
     ```
     http://localhost:4321
     https://tu-dominio.vercel.app
     https://tu-dominio.com
     ```
   - **Authorized redirect URIs:**
     ```
     https://TU-PROYECTO-ID.supabase.co/auth/v1/callback
     ```
     ⚠️ **IMPORTANTE**: Reemplaza `TU-PROYECTO-ID` con tu ID de proyecto de Supabase
   
6. **Obtener credenciales**
   - Haz clic en "Create"
   - Se mostrará un modal con:
     - **Client ID**: Copia este valor
     - **Client Secret**: Copia este valor (solo se muestra una vez)

### 2. Configurar Google OAuth en Supabase

1. **Ir al Dashboard de Supabase**
   - Visita: https://app.supabase.com/
   - Selecciona tu proyecto

2. **Ir a Authentication → Providers**
   - En el menú lateral, ve a "Authentication"
   - Haz clic en "Providers"
   - Busca "Google" en la lista

3. **Habilitar Google Provider**
   - Activa el toggle de "Google"
   - Ingresa las credenciales:
     - **Client ID (for OAuth)**: Pega el Client ID de Google Cloud Console
     - **Client Secret (for OAuth)**: Pega el Client Secret de Google Cloud Console
   - Haz clic en "Save"

4. **Verificar configuración**
   - Asegúrate de que el toggle esté activado (verde)
   - Verifica que las credenciales estén guardadas correctamente

### 3. Verificar que el callback esté configurado

El callback ya está configurado en el código:
- URL de callback: `/auth/callback`
- Supabase maneja automáticamente: `https://TU-PROYECTO-ID.supabase.co/auth/v1/callback`

### 4. Probar la autenticación

1. **En desarrollo local:**
   - Asegúrate de que `http://localhost:4321` esté en "Authorized JavaScript origins" en Google Cloud Console
   - Ve a `http://localhost:4321/login`
   - Haz clic en "Continuar con Google"
   - Deberías ser redirigido a Google para autenticarte

2. **En producción:**
   - Asegúrate de que tu dominio esté en "Authorized JavaScript origins"
   - Ve a tu sitio en producción
   - Prueba el login con Google

## Resumen de pasos

✅ **Código implementado** - Ya está listo
⏳ **Falta configurar:**
1. Google Cloud Console (crear proyecto, habilitar API, crear OAuth credentials)
2. Supabase Dashboard (habilitar Google provider, ingresar credenciales)
3. Probar en desarrollo y producción

## Notas importantes

- El **Client Secret** solo se muestra una vez en Google Cloud Console. Si lo pierdes, tendrás que crear nuevas credenciales.
- Asegúrate de que las URLs de redirect en Google Cloud Console coincidan exactamente con las de Supabase.
- Para producción, necesitarás agregar tu dominio real a las URLs autorizadas.
- El callback de Supabase siempre es: `https://TU-PROYECTO-ID.supabase.co/auth/v1/callback`

## Solución de problemas

### Error: "redirect_uri_mismatch"
- Verifica que la URL de redirect en Google Cloud Console coincida exactamente con la de Supabase
- Debe ser: `https://TU-PROYECTO-ID.supabase.co/auth/v1/callback`

### Error: "invalid_client"
- Verifica que el Client ID y Client Secret estén correctos en Supabase
- Asegúrate de que el Google Provider esté habilitado en Supabase

### Error: "access_denied"
- Verifica que la pantalla de consentimiento OAuth esté configurada correctamente
- Asegúrate de que el dominio esté autorizado en Google Cloud Console

## Enlaces útiles

- [Google Cloud Console](https://console.cloud.google.com/)
- [Supabase Dashboard](https://app.supabase.com/)
- [Documentación de Supabase Auth](https://supabase.com/docs/guides/auth)
- [Documentación de Google OAuth](https://developers.google.com/identity/protocols/oauth2)



