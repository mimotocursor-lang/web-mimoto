# 📸 Configurar Avatar/Foto de Perfil para Emails

## 🎯 Problema
El correo llega de `noreply@mimoto.cl` pero no tiene foto/avatar visible en la bandeja de entrada antes de abrir el email.

## ✅ Solución Recomendada: Gravatar (MÁS FÁCIL Y UNIVERSAL) ⭐

**Gravatar** funciona automáticamente en Gmail, Outlook, Apple Mail y muchos otros clientes de email. Es la solución más simple y efectiva.

### Pasos Rápidos (5 minutos):

1. **Ve a Gravatar:**
   - [https://gravatar.com](https://gravatar.com)
   - Crea una cuenta (puedes usar tu email personal)

2. **Agrega el email de envío:**
   - Ve a "My Gravatars" o "Manage Gravatars"
   - Haz clic en "Add a new email"
   - Agrega: `noreply@mimoto.cl`
   - Verifica el email (te llegará un correo de confirmación a ese email)

3. **Sube tu logo:**
   - Haz clic en "Add a new image"
   - Sube el logo de MIMOTO (recomendado: 200x200px o más, cuadrado)
   - Selecciona la calificación "G" (General - para emails comerciales)
   - **IMPORTANTE:** Asocia esta imagen al email `noreply@mimoto.cl`

4. **Verifica que funciona:**
   - Visita: [https://en.gravatar.com/site/check/noreply@mimoto.cl](https://en.gravatar.com/site/check/noreply@mimoto.cl)
   - Deberías ver tu logo

**✅ Ventaja:** Funciona automáticamente en la mayoría de clientes de email sin configuración adicional en tu código.

## 🔄 Otras Opciones

### Opción 2: Crear Cuenta de Google para Gmail

Para que Gmail muestre el avatar específicamente (solo funciona en Gmail):

1. **Crea una cuenta de Google:**
   - Ve a [accounts.google.com/signup](https://accounts.google.com/signup)
   - Selecciona "Usar mi dirección de correo electrónico actual"
   - Ingresa: `noreply@mimoto.cl`
   - Completa la verificación

2. **Agrega foto de perfil:**
   - Inicia sesión en la cuenta de Google
   - Ve a [myaccount.google.com](https://myaccount.google.com)
   - Haz clic en tu foto de perfil → "Cambiar foto"
   - Sube el logo de MIMOTO

**⚠️ Nota:** Esto solo funciona para Gmail. Para otros clientes, usa Gravatar.

### Opción 3: Resend (No tiene función de avatar)

**⚠️ IMPORTANTE:** Resend **NO tiene** una función de branding o avatar para remitentes. Resend se enfoca en el envío de emails, no en la visualización de avatares.

**Solución:** Debes usar **Gravatar** (Opción 1) para que el avatar aparezca en la bandeja de entrada. Resend y Gravatar funcionan juntos:
- **Resend** envía el email
- **Gravatar** proporciona el avatar que los clientes de email muestran

No hay conflicto entre ambos servicios, trabajan de forma complementaria.

## 📋 Checklist Rápido

**Para la solución más rápida y efectiva:**

1. [ ] **Crear cuenta en Gravatar** (5 minutos)
   - [https://gravatar.com](https://gravatar.com)
   - Agregar email: `noreply@mimoto.cl`
   - Subir logo de MIMOTO (200x200px, cuadrado)
   - Asociar imagen al email

2. [ ] **Verificar que funciona:**
   - [https://en.gravatar.com/site/check/noreply@mimoto.cl](https://en.gravatar.com/site/check/noreply@mimoto.cl)
   - Debe mostrar tu logo

3. [ ] **Enviar email de prueba:**
   - Usa: `https://mimoto.cl/api/test-email?email=tu@email.com`
   - Verifica que el avatar aparece en la bandeja de entrada

4. [ ] **Opcional - Para Gmail específicamente:**
   - Crear cuenta de Google con `noreply@mimoto.cl`
   - Agregar foto de perfil

## 🎨 Recomendaciones para el Avatar

- **Tamaño:** 200x200px o más (cuadrado)
- **Formato:** PNG con transparencia o JPG
- **Peso:** Menos de 50KB para mejor rendimiento
- **Contenido:** Logo de MIMOTO o icono representativo
- **Fondo:** Transparente o color sólido que contraste

## ⚠️ Notas Importantes

1. **Cacheo:** Los clientes de email cachean avatares, los cambios pueden tardar 24-48 horas en aparecer
2. **Privacidad:** Algunos clientes bloquean imágenes/avatares por defecto (el usuario debe permitirlas)
3. **Gravatar es universal:** Funciona en la mayoría de clientes de email automáticamente
4. **No requiere código:** El avatar se configura fuera de tu aplicación, en Gravatar

## 🔍 Verificar que Funciona

### Gmail
1. Envía un email de prueba usando `/api/test-email`
2. Revisa la bandeja de entrada
3. El avatar debería aparecer junto al remitente `noreply@mimoto.cl`

### Outlook
1. Outlook puede tardar más en actualizar (hasta 48 horas)
2. Puede requerir que el usuario marque el remitente como "confiable"
3. Gravatar funciona automáticamente una vez configurado

### Apple Mail
1. Generalmente usa Gravatar automáticamente
2. Si no aparece, verifica la configuración de privacidad del usuario

## 🆘 Problemas Comunes

### "El avatar no aparece"
- **Espera 24-48 horas** para que se propague (los clientes de email cachean avatares)
- Verifica que Gravatar esté configurado correctamente: [https://en.gravatar.com/site/check/noreply@mimoto.cl](https://en.gravatar.com/site/check/noreply@mimoto.cl)
- Algunos clientes requieren que el remitente sea "confiable" o que el usuario permita mostrar imágenes

### "Aparece en Gmail pero no en Outlook"
- Outlook puede requerir más tiempo para actualizar
- Considera usar Gravatar que es más universal
- El usuario puede necesitar marcar el remitente como confiable

### "El avatar es muy pequeño"
- Asegúrate de subir una imagen de al menos 200x200px
- Algunos clientes escalan automáticamente, pero una imagen más grande ayuda

### "No puedo verificar el email en Gravatar"
- Asegúrate de que `noreply@mimoto.cl` pueda recibir emails (aunque sea temporalmente)
- O usa tu email personal para crear la cuenta y luego agrega `noreply@mimoto.cl` como email adicional

## 📚 Recursos

- [Gravatar - Crear cuenta](https://gravatar.com)
- [Gravatar - Verificar email](https://en.gravatar.com/site/check/noreply@mimoto.cl)
- [Resend Domains](https://resend.com/domains)
- [Google Account Setup](https://accounts.google.com/signup)
