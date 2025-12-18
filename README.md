# MIMOTO - Sitio Web

Sitio web para negocio de motos (servicio técnico, reparación, accesorios y repuestos) construido con Astro.

## 🚀 Tecnologías

- **Astro** - Framework web
- **Tailwind CSS** - Estilos
- **Supabase** - Base de datos y autenticación
- **Transbank Webpay Plus** - Pasarela de pagos

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase
- Cuenta de Transbank (para pagos)

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/web-mimoto.git
cd web-mimoto
```

2. Instalar dependencias:
```bash
cd frontend
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales:
- `PUBLIC_SUPABASE_URL`: URL de tu proyecto Supabase
- `PUBLIC_SUPABASE_ANON_KEY`: Clave anónima de Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Clave de servicio de Supabase (solo para API)
- `PUBLIC_WHATSAPP_URL`: URL de WhatsApp
- `PUBLIC_WEBPAY_COMMERCE_CODE`: Código de comercio de Transbank
- `PUBLIC_WEBPAY_API_KEY`: API Key de Transbank
- `PUBLIC_WEBPAY_ENVIRONMENT`: `integration` o `production`
- `PUBLIC_SITE_URL`: URL del sitio (para producción usar tu dominio)

## 🏃 Desarrollo

```bash
cd frontend
npm run dev
```

El sitio estará disponible en `http://localhost:4321`

## 📦 Build

```bash
cd frontend
npm run build
```

## 🚢 Despliegue en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. Sube tu código a GitHub
2. Ve a [Vercel](https://vercel.com)
3. Importa tu repositorio de GitHub
4. Configura el proyecto:
   - **Framework Preset**: Astro
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Agrega las variables de entorno en la configuración del proyecto en Vercel
6. Haz clic en "Deploy"

### Opción 2: Desde CLI

```bash
npm i -g vercel
vercel
```

Sigue las instrucciones y asegúrate de configurar:
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

### Variables de Entorno en Vercel

En el dashboard de Vercel, ve a **Settings > Environment Variables** y agrega:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (marcar como "Sensitive")
- `PUBLIC_WHATSAPP_URL`
- `PUBLIC_WEBPAY_COMMERCE_CODE`
- `PUBLIC_WEBPAY_API_KEY`
- `PUBLIC_WEBPAY_ENVIRONMENT`
- `PUBLIC_SITE_URL` (tu dominio de Vercel, ej: `https://tu-proyecto.vercel.app`)

## 📁 Estructura del Proyecto

```
web-mimoto/
├── frontend/          # Aplicación Astro
│   ├── src/
│   │   ├── layouts/  # Layouts base
│   │   ├── pages/    # Páginas
│   │   └── lib/      # Utilidades
│   └── public/       # Archivos estáticos
├── supabase/         # Scripts SQL
└── vercel.json       # Configuración de Vercel
```

## 🔐 Seguridad

- **NUNCA** subas el archivo `.env` a GitHub
- La clave `SUPABASE_SERVICE_ROLE_KEY` solo debe usarse en el servidor (API routes)
- Las variables `PUBLIC_*` son accesibles en el cliente

## 📝 Notas

- El proyecto usa `darkMode: 'class'` en Tailwind
- Las imágenes están en `frontend/public/`
- Los scripts SQL están en `supabase/`

## 📞 Soporte

Para más información sobre la configuración de Webpay, consulta:
- `WEBPAY_CONFIG.md`
- `OBTENER_CREDENCIALES_WEBPAY.md`
- `VERIFICAR_WEBPAY.md`

