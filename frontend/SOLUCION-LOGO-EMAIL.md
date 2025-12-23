# 🔧 Solución: Logo en Emails

## Problema
El logo aparece como un icono de imagen rota en los emails.

## Soluciones Aplicadas

### 1. **URL Corregida**
- Cambiado de `logo.jpg` a `logo.png` (el archivo correcto)
- URL ahora usa: `https://mimoto.cl/logo.png`

### 2. **Atributos Mejorados**
- Agregados atributos `width` y `height` para mejor compatibilidad
- Estilos inline para mejor soporte en clientes de email
- Fallback para Outlook (MSO)

### 3. **Configuración desde Variables de Entorno**
Puedes configurar la URL del logo usando variables de entorno:

```bash
# En Vercel o .env
PUBLIC_SITE_URL=https://mimoto.cl
PUBLIC_EMAIL_LOGO_URL=https://mimoto.cl/logo.png  # Opcional, usa PUBLIC_SITE_URL/logo.png por defecto
```

## Verificaciones Necesarias

### ✅ 1. Verificar que el archivo existe
Asegúrate de que el archivo `logo.png` esté en:
```
frontend/public/logo.png
```

### ✅ 2. Verificar que es accesible públicamente
Abre en tu navegador:
```
https://mimoto.cl/logo.png
```

Si no carga, verifica:
- El archivo está en la carpeta `public/`
- El sitio está desplegado correctamente
- No hay restricciones de CORS o acceso

### ✅ 3. Verificar el formato de la imagen
- Formato: PNG o JPG
- Tamaño recomendado: 150-200px de ancho
- Peso: Menos de 100KB para mejor rendimiento

## Solución Alternativa: Logo Embebido (Base64)

Si el logo sigue sin aparecer, puedes embebirlo directamente en el email usando Base64:

1. Convierte tu logo a Base64:
```bash
# En Node.js
const fs = require('fs');
const logoBase64 = fs.readFileSync('frontend/public/logo.png', 'base64');
console.log(`data:image/png;base64,${logoBase64}`);
```

2. O usa una herramienta online: https://www.base64-image.de/

3. Luego actualiza la variable de entorno:
```bash
PUBLIC_EMAIL_LOGO_URL=data:image/png;base64,iVBORw0KGgoAAAANS...
```

**Nota:** Los emails con imágenes embebidas son más pesados, pero garantizan que el logo siempre aparezca.

## Prueba el Email

Puedes probar el envío de emails usando:
```
https://mimoto.cl/api/test-email?email=tu@email.com
```

Esto enviará un email de prueba con el logo para verificar que funciona correctamente.

## Clientes de Email que Bloquean Imágenes

Algunos clientes de email bloquean imágenes externas por defecto:
- Gmail (puede bloquear)
- Outlook (puede bloquear)
- Apple Mail (generalmente permite)

**Solución:** El usuario debe hacer clic en "Mostrar imágenes" o configurar su cliente para permitir imágenes de remitentes confiables.

## Troubleshooting

### El logo no aparece en ningún cliente
1. Verifica que la URL sea accesible: `https://mimoto.cl/logo.png`
2. Verifica que el archivo exista en `frontend/public/logo.png`
3. Verifica que el sitio esté desplegado correctamente

### El logo aparece en algunos clientes pero no en otros
- Esto es normal, algunos clientes bloquean imágenes externas
- El fallback de texto "MIMOTO" aparecerá en Outlook
- Considera usar Base64 para garantizar que siempre aparezca

### El logo aparece muy pequeño o muy grande
- Ajusta el `width` en el código HTML del email
- Actualmente está configurado a 150px de ancho

