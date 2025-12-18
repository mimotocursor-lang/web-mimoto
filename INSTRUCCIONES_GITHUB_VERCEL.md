# 🚀 Instrucciones Rápidas: GitHub + Vercel

## ✅ Paso 1: Subir a GitHub

### 1. Crear repositorio en GitHub
1. Ve a https://github.com
2. Haz clic en "New repository"
3. Nombre: `web-mimoto`
4. **NO** marques ninguna opción (README, .gitignore, licencia)
5. Haz clic en "Create repository"

### 2. Conectar y subir

Ejecuta estos comandos en la terminal (en la carpeta del proyecto):

```bash
git remote add origin https://github.com/TU-USUARIO/web-mimoto.git
git branch -M main
git commit -m "Initial commit: MIMOTO website"
git push -u origin main
```

**Reemplaza `TU-USUARIO` con tu nombre de usuario de GitHub.**

Si te pide autenticación, usa un Personal Access Token en lugar de contraseña.

## ✅ Paso 2: Desplegar en Vercel

### 1. Crear cuenta
1. Ve a https://vercel.com
2. Regístrate con tu cuenta de GitHub

### 2. Importar proyecto
1. Haz clic en "Add New..." > "Project"
2. Selecciona el repositorio `web-mimoto`
3. Haz clic en "Import"

### 3. Configurar proyecto

**IMPORTANTE**: Configura estos valores:

- **Framework Preset**: Astro (o "Other")
- **Root Directory**: `frontend` ⚠️ **MUY IMPORTANTE - DEBE ESTAR CONFIGURADO**
- **Build Command**: (dejar vacío o `npm run build`)
- **Output Directory**: (dejar vacío o `dist`)
- **Install Command**: (dejar vacío o `npm install`)

**Nota**: Si configuras el Root Directory como `frontend`, Vercel automáticamente usará el `vercel.json` que está en ese directorio.

### 4. Variables de Entorno

Haz clic en "Environment Variables" y agrega:

```
PUBLIC_SUPABASE_URL=tu_url
PUBLIC_SUPABASE_ANON_KEY=tu_clave
SUPABASE_SERVICE_ROLE_KEY=tu_service_key (marcar como Sensitive)
PUBLIC_WHATSAPP_URL=https://wa.me/56962614851
PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
PUBLIC_WEBPAY_API_KEY=tu_api_key
PUBLIC_WEBPAY_ENVIRONMENT=integration
PUBLIC_SITE_URL=https://tu-proyecto.vercel.app
```

**Nota**: Después del primer deploy, Vercel te dará una URL. Actualiza `PUBLIC_SITE_URL` con esa URL.

### 5. Desplegar
1. Haz clic en "Deploy"
2. Espera 2-3 minutos
3. ¡Listo! Tu sitio estará en línea

## 🔄 Actualizar el sitio

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

Vercel detectará los cambios automáticamente y hará un nuevo deploy.

## ⚠️ Problemas Comunes

### Error: "Build failed"
- Verifica que `Root Directory` esté en `frontend`
- Revisa que todas las variables de entorno estén configuradas
- Mira los logs en Vercel para más detalles

### Variables no funcionan
- Asegúrate de que las variables `PUBLIC_*` estén en Vercel
- Reinicia el deploy después de agregar variables
- Verifica que no haya espacios extra en los valores

## 📚 Más información

Consulta `DEPLOY.md` para una guía más detallada.

