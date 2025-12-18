# 🔍 Guía Rápida: Verificar si Tienes Webpay Plus

## Si Transbank te dio un Código de Comercio

### Método 1: Probar con el Endpoint de Prueba (Más Rápido)

1. **Inicia el servidor de desarrollo:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Abre tu navegador y ve a:**
   ```
   http://localhost:4321/api/webpay/test?commerceCode=TU_CODIGO&apiKey=TU_API_KEY&environment=integration
   ```

   Reemplaza:
   - `TU_CODIGO` con tu código de comercio
   - `TU_API_KEY` con tu API Key
   - `environment` puede ser `integration` (pruebas) o `production` (producción)

3. **Interpreta el resultado:**
   - ✅ Si ves `"success": true` → **¡Tienes Webpay Plus activo!**
   - ❌ Si ves un error → Revisa el mensaje para saber qué falta

### Método 2: Verificar en el Portal de Transbank

1. Ve a [www.transbank.cl](https://www.transbank.cl)
2. Inicia sesión con tu RUT y contraseña
3. Busca **"Mis Productos"** o **"Productos Contratados"**
4. Busca **"Webpay Plus"** en la lista
5. Verifica que esté **"Activo"**

### Método 3: Probar con Credenciales de Integración

Si no estás seguro de tus credenciales, primero prueba con las de integración:

```
http://localhost:4321/api/webpay/test?commerceCode=597055555532&apiKey=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C&environment=integration
```

Si esto funciona, significa que el endpoint está bien configurado. Luego prueba con tus credenciales reales.

## Errores Comunes y Soluciones

### Error: "Las credenciales son incorrectas"
- ✅ Verifica que copiaste bien el Commerce Code y API Key
- ✅ Asegúrate de no tener espacios extra al inicio o final
- ✅ Verifica en el Portal de Transbank que las credenciales sean correctas

### Error: "No tienes permisos para usar Webpay Plus"
- ⚠️ **No tienes Webpay Plus contratado**
- 📞 Contacta a Transbank para contratarlo
- 🔗 Ve a [Portal de Clientes](https://www.transbank.cl) → "Solicitar Productos" → "Webpay Plus"

### Error: "El Commerce Code no existe"
- ⚠️ El código de comercio no está asociado a Webpay Plus
- 📞 Verifica con Transbank que el código sea correcto
- 🔍 Confirma que Webpay Plus esté activo para ese código

### Error: "Timeout" o "Network Error"
- ✅ Verifica tu conexión a internet
- ✅ Intenta nuevamente después de unos minutos
- ✅ Si persiste, puede ser un problema temporal de Transbank

## ¿Qué Hacer si NO Tienes Webpay Plus?

### Contratar Webpay Plus

1. **Ingresa al Portal de Clientes:**
   - Ve a [www.transbank.cl](https://www.transbank.cl)
   - Inicia sesión con tu RUT y contraseña

2. **Solicitar el Producto:**
   - En el menú lateral, selecciona **"Solicitar Productos"**
   - Elige **"Venta por internet"**
   - Selecciona **"Webpay Plus"**
   - Completa el formulario de solicitud

3. **Esperar Aprobación:**
   - Transbank revisará tu solicitud
   - Te enviarán las credenciales por email
   - El proceso puede tardar algunos días

4. **Obtener Credenciales:**
   - Una vez aprobado, recibirás:
     - **Commerce Code**: Tu código de comercio único
     - **API Key**: Tu clave secreta para autenticación

5. **Configurar:**
   - Agrega las credenciales a tu archivo `.env`
   - Prueba con el endpoint de prueba
   - Una vez verificado, puedes usar en producción

## Contacto con Transbank

Si necesitas ayuda:

- **Teléfono**: 600 600 60 60
- **Email**: soporte@transbank.cl
- **Portal de Ayuda**: [ayuda.transbank.cl](https://ayuda.transbank.cl)
- **Portal de Clientes**: [www.transbank.cl](https://www.transbank.cl)

## Próximos Pasos

Una vez que verifiques que tienes Webpay Plus:

1. ✅ Configura las credenciales en `.env`
2. ✅ Prueba el flujo completo de pago
3. ✅ Si estás en producción, completa la certificación
4. ✅ ¡Listo para recibir pagos!

