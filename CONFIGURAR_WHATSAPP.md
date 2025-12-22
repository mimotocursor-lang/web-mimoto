# Configuración de WhatsApp

## ¿Qué falta para que redirija al WhatsApp de la empresa?

Necesitas configurar la variable de entorno `PUBLIC_WHATSAPP_URL` con la URL de WhatsApp de tu empresa.

## Formato de la URL de WhatsApp

La URL de WhatsApp debe tener este formato:

```
https://wa.me/569XXXXXXXX
```

Donde:
- `569XXXXXXXX` es el número de teléfono con código de país (Chile: +56)
- Sin espacios, sin guiones, sin paréntesis
- Incluye el código de país (56 para Chile)
- Incluye el 9 después del código de país

### Ejemplos:

**Para Chile:**
- Número: +56 9 1234 5678
- URL: `https://wa.me/56912345678`

- Número: +56 9 8765 4321
- URL: `https://wa.me/56987654321`

**Con mensaje predefinido (opcional):**
```
https://wa.me/56912345678?text=Hola,%20quiero%20consultar%20sobre%20sus%20productos
```

## Cómo configurarlo

### 1. Crear archivo `.env` en la carpeta `frontend/`

Crea un archivo llamado `.env` en la carpeta `frontend/` con el siguiente contenido:

```env
PUBLIC_WHATSAPP_URL=https://wa.me/569XXXXXXXX
```

**Reemplaza `569XXXXXXXX` con el número real de WhatsApp de tu empresa.**

### 2. Para desarrollo local

1. Abre el archivo `frontend/.env` (o créalo si no existe)
2. Agrega la línea:
   ```env
   PUBLIC_WHATSAPP_URL=https://wa.me/569XXXXXXXX
   ```
3. Reinicia el servidor de desarrollo (`npm run dev`)

### 3. Para producción (Vercel)

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega una nueva variable:
   - **Name**: `PUBLIC_WHATSAPP_URL`
   - **Value**: `https://wa.me/569XXXXXXXX`
   - **Environment**: Production, Preview, Development (marca todas)
5. Haz clic en **Save**
6. Haz un nuevo deploy para que los cambios surtan efecto

## Verificación

Una vez configurado:

1. **En desarrollo local:**
   - Reinicia el servidor (`npm run dev`)
   - Haz clic en cualquier botón de WhatsApp
   - Debería abrir WhatsApp con el número correcto

2. **En producción:**
   - Después del deploy, prueba los botones de WhatsApp
   - Verifica que redirija al número correcto

## Dónde se usa el WhatsApp

El WhatsApp se usa en los siguientes lugares:

- ✅ Botón flotante de WhatsApp (esquina inferior derecha)
- ✅ Botones "Consultar disponibilidad" en productos
- ✅ Botones "Preguntar disponibilidad" en accesorios y repuestos
- ✅ Botones "Contactar por WhatsApp" en servicios
- ✅ Botones "Consultar Disponibilidad" en motos usadas
- ✅ Botones "Agendar por WhatsApp" en servicios
- ✅ Sección de contacto en varias páginas

## Nota importante

- La variable debe empezar con `PUBLIC_` para que Astro la exponga al cliente
- El número debe incluir el código de país (56 para Chile)
- No uses espacios, guiones o paréntesis en el número
- El formato correcto es: `https://wa.me/569XXXXXXXX`

## Ejemplo completo

Si el número de WhatsApp de tu empresa es: **+56 9 1234 5678**

Tu archivo `.env` debería tener:

```env
PUBLIC_WHATSAPP_URL=https://wa.me/56912345678
```

Y en Vercel, la variable de entorno sería:
- **Name**: `PUBLIC_WHATSAPP_URL`
- **Value**: `https://wa.me/56912345678`

¡Listo! Todos los botones de WhatsApp redirigirán a este número.






