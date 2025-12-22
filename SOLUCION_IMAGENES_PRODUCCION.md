# Solución: Imágenes no cargan en Producción

## Problema Identificado

El archivo `vercel.json` tenía un `rewrite` que redirigía todas las rutas a `/index.html`, lo cual interfería con las rutas de archivos estáticos (imágenes, CSS, JS, etc.).

## Solución Aplicada

Se eliminó el `rewrite` del archivo `vercel.json` porque:

1. **Astro es un framework estático**: Genera archivos HTML reales, no necesita un SPA router
2. **Los archivos de `public/` se copian automáticamente**: Astro copia todos los archivos de `frontend/public/` a la raíz del directorio `dist/` durante el build
3. **Las rutas absolutas funcionan correctamente**: Las imágenes referenciadas con `/` (ej: `/bannerMotosUsadas.png`) apuntan directamente a los archivos estáticos

## Archivos Afectados

- `frontend/vercel.json`: Eliminado el `rewrites` que causaba el problema

## Verificación

Después de hacer deploy, verifica que:

1. ✅ Las imágenes locales de `public/` cargan correctamente (ej: `/bannerMotosUsadas.png`, `/backgrund.jpg`)
2. ✅ Las imágenes de Supabase Storage cargan (URLs externas)
3. ✅ Los banners del hero slider cargan desde la base de datos
4. ✅ Las imágenes de productos cargan correctamente

## Estructura de Imágenes

Las imágenes están organizadas en `frontend/public/`:

```
public/
├── accesorios-repuestos/     # Imágenes de categorías
├── imagenes-repuestos-accesorios/  # Imágenes de productos
├── MOTOS/                    # Imágenes de motos usadas
├── servicios/                # Imágenes de servicios
├── SOBRE-NOSOTROS/          # Imágenes de la página sobre nosotros
├── backgrund.jpg            # Background dark mode
├── banner.jpg               # Banner genérico
├── bannerMotosUsadas.png    # Banner motos usadas
├── bannerRepuestos.png      # Banner repuestos
├── bannerServicios.jpg      # Banner servicios
├── logo.png                 # Logo light mode
└── logo-dark.png            # Logo dark mode
```

## Notas Importantes

- **Rutas absolutas**: Todas las imágenes deben usar rutas que empiecen con `/` (ej: `/bannerMotosUsadas.png`)
- **Astro copia automáticamente**: No necesitas configuración adicional para copiar archivos de `public/`
- **Vercel detecta Astro**: Vercel detecta automáticamente Astro y configura el servidor correctamente

## Si el problema persiste

1. Verifica que el build se complete correctamente
2. Revisa la consola del navegador para ver errores 404
3. Verifica que las rutas de las imágenes sean correctas (sin espacios, caracteres especiales, etc.)
4. Asegúrate de que las imágenes existan en `frontend/public/`






