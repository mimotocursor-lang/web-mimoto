# 🔑 Cómo Obtener tu API Key de Producción

## 📍 Dónde Encontrar la API Key

La API Key de producción **SÍ te la da Transbank**, pero debes buscarla en el **Portal de Clientes de Transbank**.

## 🎯 Pasos para Obtener tu API Key

### Paso 1: Acceder al Portal de Clientes

1. Ve a: **https://www.transbank.cl/**
2. Haz clic en **"Portal de Clientes"** o **"Iniciar Sesión"**
3. Inicia sesión con tu cuenta de Transbank

### Paso 2: Ir a la Sección de Webpay Plus

1. Una vez dentro del portal, busca:
   - **"Mis Productos"** o
   - **"Webpay Plus"** o
   - **"Configuración"** o
   - **"Credenciales"**

2. Selecciona **Webpay Plus** de tu lista de productos

### Paso 3: Buscar las Credenciales

En la página de Webpay Plus, busca una sección que diga:

- **"Credenciales"**
- **"API Keys"**
- **"Llaves de Integración"**
- **"Configuración Técnica"**
- **"Datos de Integración"**

### Paso 4: Encontrar la API Key de Producción

Deberías ver algo como:

```
Ambiente de Producción:
- Código de Comercio: 1234567890
- API Key: ABCDEF1234567890ABCDEF1234567890...
```

**La API Key es una cadena larga de letras y números** (generalmente 64 caracteres o más).

## 🔍 Ubicaciones Comunes en el Portal

### Opción 1: Menú Principal
```
Portal de Clientes
  └── Mis Productos
      └── Webpay Plus
          └── Credenciales / Configuración
```

### Opción 2: Configuración Técnica
```
Portal de Clientes
  └── Configuración
      └── Webpay Plus
          └── Credenciales de Producción
```

### Opción 3: Documentación/Integración
```
Portal de Clientes
  └── Documentación
      └── Webpay Plus
          └── Credenciales
```

## ⚠️ Si No Ves la API Key

### Posibles Razones:

1. **No tienes Webpay Plus contratado**
   - Solución: Contrata Webpay Plus primero
   - Contacta a Transbank para contratar

2. **Estás viendo solo integración**
   - Asegúrate de estar en la sección de **"Producción"** o **"Ambiente de Producción"**
   - No confundas con las credenciales de integración

3. **Necesitas permisos**
   - Verifica que tu usuario tenga permisos para ver credenciales
   - Contacta al administrador de tu cuenta

4. **Aún no está disponible**
   - Si acabas de contratar, puede tardar unas horas en aparecer
   - Contacta a soporte de Transbank

## 📞 Si No la Encuentras

### Contacta a Transbank:

1. **Teléfono**: Busca el número de soporte en su sitio web
2. **Email**: Envía un correo a soporte
3. **Chat**: Si tienen chat en línea, úsalo
4. **Portal**: Abre un ticket de soporte desde el portal

**Diles**: "Necesito mi API Key de producción para Webpay Plus"

## 🔐 Diferencia entre Integración y Producción

### Credenciales de INTEGRACIÓN (Pruebas):
- Código: `597055555532` (público, cualquiera puede usarlo)
- API Key: `579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C` (público)
- **No necesitas cuenta en Transbank para usarlas**

### Credenciales de PRODUCCIÓN (Real):
- Código: **Tu código único** (te lo da Transbank)
- API Key: **Tu key única** (te la da Transbank)
- **Solo las obtienes si tienes Webpay Plus contratado**

## 💡 Mientras Tanto

Si aún no tienes tus credenciales de producción:

1. **Sigue usando integración** para probar
2. **Configuración actual** (para pruebas):
   ```env
   PUBLIC_WEBPAY_ENVIRONMENT=integration
   PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
   PUBLIC_WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
   PUBLIC_SITE_URL=http://localhost:4321
   ```

3. **Cuando tengas tus credenciales**, cambia a producción

## 📋 Checklist

Antes de ir a producción, asegúrate de tener:

- [ ] Webpay Plus contratado con Transbank
- [ ] Acceso al Portal de Clientes de Transbank
- [ ] Código de Comercio de Producción
- [ ] API Key de Producción
- [ ] Probado todo en integración primero

## 🎯 Resumen

**La API Key SÍ te la da Transbank**, pero debes:

1. Tener Webpay Plus contratado
2. Iniciar sesión en el Portal de Clientes
3. Ir a la sección de Webpay Plus
4. Buscar "Credenciales" o "API Keys"
5. Copiar tu API Key de Producción

**Si no la encuentras**, contacta a soporte de Transbank y pídeles específicamente tu API Key de producción para Webpay Plus.

