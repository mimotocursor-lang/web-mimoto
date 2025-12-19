# 🔧 Solución: Error "Faltan Credenciales"

## ❌ El Error

Si ves el error "Faltan credenciales", significa que las variables de entorno de Webpay no están configuradas.

## ✅ Solución Rápida

### Opción 1: Crear archivo `.env.local` (Recomendado)

Crea un archivo llamado `.env.local` en la carpeta `frontend/` con este contenido:

```env
PUBLIC_WEBPAY_ENVIRONMENT=integration
PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
PUBLIC_WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
PUBLIC_SITE_URL=http://localhost:4321
```

**Pasos:**
1. Ve a la carpeta `frontend/`
2. Crea un archivo nuevo llamado `.env.local`
3. Copia y pega el contenido de arriba
4. Guarda el archivo
5. **Reinicia el servidor** (detén y vuelve a iniciar `npm run dev`)

### Opción 2: Usar Valores por Defecto

El código ya tiene valores por defecto configurados, pero si el error persiste:

1. **Reinicia el servidor** completamente
2. Las credenciales por defecto deberían funcionar automáticamente

### Opción 3: Pasar Credenciales por URL

Puedes probar pasando las credenciales directamente en la URL:

```
http://localhost:4321/api/webpay/test?commerceCode=597055555532&apiKey=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C&environment=integration
```

## 🔍 Verificar que Funciona

1. Crea el archivo `.env.local` con las credenciales
2. Reinicia el servidor: `npm run dev`
3. Ve a: `http://localhost:4321/test-webpay`
4. Haz clic en "Probar Conexión con Webpay"
5. Deberías ver un mensaje de éxito ✅

## 📝 Estructura del Archivo `.env.local`

El archivo debe estar en: `frontend/.env.local`

```
frontend/
  ├── .env.local          ← Aquí
  ├── src/
  ├── package.json
  └── ...
```

## ⚠️ Importante

- **NO** subas `.env.local` a Git (ya debería estar en `.gitignore`)
- **SÍ** reinicia el servidor después de crear/modificar `.env.local`
- Las variables que empiezan con `PUBLIC_` son accesibles en el cliente
- Las variables sin `PUBLIC_` solo están en el servidor

## 🐛 Si el Error Persiste

1. **Verifica que el archivo existe:**
   ```bash
   cd frontend
   dir .env.local
   ```

2. **Verifica el contenido:**
   - Asegúrate de que no haya espacios extra
   - Asegúrate de que cada variable esté en una línea separada
   - No uses comillas alrededor de los valores

3. **Reinicia completamente:**
   - Detén el servidor (Ctrl+C)
   - Inícialo de nuevo (`npm run dev`)

4. **Verifica en la consola del servidor:**
   - Deberías ver que las variables se cargan correctamente
   - Si no, revisa los logs de Astro

## 📋 Valores de Prueba (Integración)

Estos son los valores públicos de prueba que Transbank proporciona:

```env
PUBLIC_WEBPAY_ENVIRONMENT=integration
PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
PUBLIC_WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
```

**Estos valores son públicos y cualquiera puede usarlos para pruebas.**

## 🚀 Para Producción

Cuando vayas a producción, cambia los valores en `.env.local`:

```env
PUBLIC_WEBPAY_ENVIRONMENT=production
PUBLIC_WEBPAY_COMMERCE_CODE=TU_CODIGO_REAL
PUBLIC_WEBPAY_API_KEY=TU_API_KEY_REAL
```

