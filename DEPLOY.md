# 🚀 Guía de Despliegue - MIMOTO

Esta guía te ayudará a subir el proyecto a GitHub y desplegarlo en Vercel.

## 📋 Paso 1: Preparar el Repositorio Git

### 1.1 Inicializar Git (si no está inicializado)

```bash
git init
```

### 1.2 Agregar todos los archivos

```bash
git add .
```

### 1.3 Hacer el primer commit

```bash
git commit -m "Initial commit: MIMOTO website"
```

## 📤 Paso 2: Subir a GitHub

### 2.1 Crear un repositorio en GitHub

1. Ve a [GitHub](https://github.com)
2. Haz clic en "New repository"
3. Nombre: `web-mimoto` (o el que prefieras)
4. **NO** inicialices con README, .gitignore o licencia (ya los tenemos)
5. Haz clic en "Create repository"

### 2.2 Conectar y subir

GitHub te mostrará comandos similares a estos. Ejecuta:

```bash
git remote add origin https://github.com/TU-USUARIO/web-mimoto.git
git branch -M main
git push -u origin main
```

**Nota**: Reemplaza `TU-USUARIO` con tu nombre de usuario de GitHub.

## 🌐 Paso 3: Desplegar en Vercel

### 3.1 Crear cuenta en Vercel

1. Ve a [Vercel](https://vercel.com)
2. Regístrate o inicia sesión con GitHub

### 3.2 Importar proyecto

1. Haz clic en "Add New..." > "Project"
2. Selecciona tu repositorio `web-mimoto`
3. Haz clic en "Import"

### 3.3 Configurar el proyecto

En la configuración del proyecto:

**Framework Preset**: 
- Selecciona "Astro" o déjalo en "Other"

**Root Directory**: 
- Haz clic en "Edit" y cambia a: `frontend` ⚠️ **ESTO ES CRÍTICO**

**Build and Output Settings**:
- **Build Command**: (puedes dejarlo vacío, Vercel detectará Astro automáticamente)
- **Output Directory**: (puedes dejarlo vacío, Vercel detectará `dist` automáticamente)
- **Install Command**: (puedes dejarlo vacío, Vercel usará `npm install` automáticamente)

**Nota**: Al configurar el Root Directory como `frontend`, Vercel buscará el `vercel.json` en ese directorio y usará la configuración de Astro automáticamente.

### 3.4 Configurar Variables de Entorno

Haz clic en "Environment Variables" y agrega:

#### Variables Públicas (PUBLIC_*)

```
PUBLIC_SUPABASE_URL=tu_url_de_supabase
PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
PUBLIC_WHATSAPP_URL=https://wa.me/56962614851
PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
PUBLIC_WEBPAY_API_KEY=tu_api_key_webpay
PUBLIC_WEBPAY_ENVIRONMENT=integration
PUBLIC_SITE_URL=https://tu-proyecto.vercel.app
```

**Nota**: Después del primer deploy, Vercel te dará una URL. Actualiza `PUBLIC_SITE_URL` con esa URL.

#### Variables Privadas (Solo servidor)

```
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

**Importante**: Marca esta variable como "Sensitive" para que solo se use en el servidor.

### 3.5 Desplegar

1. Haz clic en "Deploy"
2. Espera a que termine el build (2-3 minutos)
3. ¡Listo! Tu sitio estará en `https://tu-proyecto.vercel.app`

## 🔄 Actualizar el Sitio

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

Vercel detectará automáticamente los cambios y hará un nuevo deploy.

## ⚙️ Configuración Adicional

### Dominio Personalizado

1. Ve a **Settings > Domains** en Vercel
2. Agrega tu dominio
3. Sigue las instrucciones para configurar DNS
4. Actualiza `PUBLIC_SITE_URL` con tu dominio personalizado

### Variables de Entorno por Ambiente

Puedes configurar variables diferentes para:
- **Production**: Producción
- **Preview**: Pull requests y branches
- **Development**: Desarrollo local

## 🐛 Solución de Problemas

### Error: "Build failed"

- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de build en Vercel
- Asegúrate de que `Root Directory` esté en `frontend`

### Error: "Module not found"

- Verifica que `package.json` tenga todas las dependencias
- Asegúrate de que el `installCommand` esté correcto

### Variables de entorno no funcionan

- Las variables `PUBLIC_*` deben estar en el dashboard de Vercel
- Reinicia el deploy después de agregar variables
- Verifica que no haya espacios extra en los valores

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel
2. Verifica la documentación de [Astro](https://docs.astro.build)
3. Consulta la documentación de [Vercel](https://vercel.com/docs)

