# 🖼️ Configurar Logo y Nombre del Comercio en Webpay

## 📋 Resumen

El logo y nombre del comercio que aparecen en la página de pago de Webpay **NO se configuran en el código**, sino directamente en el **Portal de Clientes de Transbank**.

## 🔧 Configuración del Logo

### Requisitos del Logo

Transbank requiere que el logo cumpla con estas especificaciones:

- **Formato**: GIF
- **Dimensiones**: 130px x 59px (ancho x alto)
- **Fondo**: Transparente (recomendado)
- **Nombre del archivo**: Debe ser tu código de comercio seguido de `.gif`
  - Ejemplo: Si tu código es `597020000000`, el archivo debe llamarse `597020000000.gif`

### Pasos para Enviar el Logo

1. **Prepara tu logo**:
   - Redimensiona tu logo a 130px x 59px
   - Convierte a formato GIF
   - Asegúrate de que el fondo sea transparente
   - Nombra el archivo con tu código de comercio: `[TU_CODIGO_COMERCIO].gif`

2. **Envía el logo a Transbank**:
   - **Email**: [soporte@transbank.cl](mailto:soporte@transbank.cl)
   - **Asunto**: "Solicitud de configuración de logo Webpay Plus"
   - **Contenido del correo**:
     ```
     Estimados,
     
     Solicito configurar el logo de mi comercio en Webpay Plus.
     
     Datos del comercio:
     - Código de comercio: [TU_CODIGO_COMERCIO]
     - RUT: [TU_RUT]
     - Nombre del comercio: [NOMBRE_DE_TU_COMERCIO]
     
     Adjunto el logo en formato GIF (130x59px).
     
     Saludos cordiales.
     ```
   - **Adjunta**: El archivo GIF del logo

3. **Espera la confirmación**:
   - Transbank procesará tu solicitud
   - Te confirmarán cuando el logo esté configurado
   - El proceso puede tardar algunos días hábiles

## 📝 Configuración del Nombre del Comercio

El nombre del comercio se configura en el **Portal de Clientes de Transbank**:

### Pasos

1. **Accede al Portal de Clientes**:
   - Ve a: https://www.transbank.cl/portal-de-clientes
   - Inicia sesión con tus credenciales

2. **Ve a la sección de configuración**:
   - Busca la sección "Datos de activación y contacto" o "Configuración del comercio"
   - O contacta a soporte si no encuentras esta opción

3. **Verifica/Actualiza el nombre**:
   - El nombre que aparezca aquí es el que se mostrará en:
     - La página de pago de Webpay
     - El comprobante de venta online
     - Los correos de confirmación

4. **Si necesitas cambiarlo**:
   - Contacta a soporte de Transbank
   - Solicita el cambio del nombre del comercio
   - Proporciona el nuevo nombre que deseas mostrar

## 🔍 Verificación

Una vez configurado:

1. **Realiza una transacción de prueba**:
   - Agrega un producto al carrito
   - Inicia el proceso de pago
   - Serás redirigido a Webpay

2. **Verifica en la página de Webpay**:
   - Debe aparecer tu logo en la parte superior
   - Debe aparecer el nombre de tu comercio
   - El comprobante debe mostrar el nombre correcto

## ⚠️ Notas Importantes

- **El logo NO se configura mediante código**: No hay variables de entorno ni código que puedas cambiar para mostrar el logo
- **Proceso manual**: Debes enviar el logo a Transbank y esperar su aprobación
- **Tiempo de procesamiento**: Puede tardar varios días hábiles
- **Formato estricto**: El logo debe cumplir exactamente las especificaciones (GIF, 130x59px)
- **Nombre del archivo**: Debe coincidir exactamente con tu código de comercio

## 🛠️ Herramientas para Preparar el Logo

### Opción 1: Online (Recomendado)

1. Ve a: https://www.iloveimg.com/es/redimensionar-imagen
2. Sube tu logo
3. Redimensiona a 130px x 59px
4. Descarga y convierte a GIF

### Opción 2: Photoshop/GIMP

1. Abre tu logo en Photoshop o GIMP
2. Ve a: Imagen → Tamaño de imagen
3. Cambia a: 130px x 59px
4. Exporta como GIF con fondo transparente

### Opción 3: Conversión de formato

Si ya tienes el logo en PNG/JPG:
1. Ve a: https://convertio.co/es/png-gif/
2. Sube tu imagen
3. Convierte a GIF
4. Descarga

## 📞 Contacto con Transbank

Si tienes dudas o problemas:

- **Email**: soporte@transbank.cl
- **Teléfono**: 600 600 60 60
- **Portal**: https://www.transbank.cl/portal-de-clientes
- **Documentación**: https://www.transbankdevelopers.cl/

## ✅ Checklist

- [ ] Logo preparado en formato GIF (130x59px)
- [ ] Logo nombrado con código de comercio: `[CODIGO].gif`
- [ ] Logo enviado a soporte@transbank.cl
- [ ] Nombre del comercio verificado en Portal de Clientes
- [ ] Confirmación recibida de Transbank
- [ ] Transacción de prueba realizada
- [ ] Logo y nombre aparecen correctamente en Webpay

## 🎯 Resumen Rápido

1. **Logo**: Envíalo por email a Transbank (GIF, 130x59px, nombre = código de comercio)
2. **Nombre**: Verifica/actualiza en Portal de Clientes de Transbank
3. **Espera**: Transbank procesará tu solicitud
4. **Verifica**: Realiza una transacción de prueba para confirmar

---

**Nota**: Este proceso es independiente de la configuración técnica (variables de entorno, código, etc.). El logo y nombre se gestionan directamente con Transbank.

