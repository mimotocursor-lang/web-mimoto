# 🔧 Solución: Logo y Nombre del Comercio en Webpay

## 📋 Problema

Después de pasar a producción, en lugar de mostrar el logo y nombre de tu comercio, Webpay muestra:
- **"WEBPAY REST SIMULTANEA"** como nombre
- **Sin logo** o logo genérico

## ✅ Solución

El logo y nombre del comercio **NO se configuran con las API keys**. Se configuran en el **Panel de Administración de Transbank**.

## 🔍 Pasos para Verificar y Solucionar

### 1. Acceder al Panel de Transbank

1. Ve al [Portal de Transbank](https://www.transbank.cl)
2. Inicia sesión con tus credenciales de comercio
3. Accede al **Panel de Administración** o **Portal del Comercio**

### 2. Verificar Estado del Comercio

En el panel, verifica:
- ✅ **Estado del comercio**: Debe estar "Activo" o "Habilitado"
- ✅ **Configuración de marca**: Debe estar completa
- ✅ **Logo**: Debe estar cargado y aprobado
- ✅ **Nombre del comercio**: Debe estar configurado

### 3. Verificar Configuración de Marca/Logo

Busca en el panel secciones como:
- **"Configuración de Marca"**
- **"Datos del Comercio"**
- **"Personalización"**
- **"Logo del Comercio"**

Verifica que:
- El logo esté cargado
- El logo esté en formato correcto (generalmente PNG, JPG, SVG)
- El logo tenga las dimensiones correctas
- El logo esté **aprobado** (puede tomar tiempo)

### 4. Verificar Nombre del Comercio

Busca secciones como:
- **"Datos del Comercio"**
- **"Información del Comercio"**
- **"Razón Social"**

Verifica que:
- El nombre esté correctamente escrito
- El nombre esté **guardado** y **activado**

### 5. Si No Encuentras la Opción

Si no encuentras estas opciones en el panel:

1. **Contacta a Transbank**:
   - Teléfono: [Busca el número en su sitio]
   - Email: [Busca el email de soporte]
   - Portal de soporte: [Portal de Transbank]

2. **Indica específicamente**:
   - "Mi comercio muestra 'WEBPAY REST SIMULTANEA' en lugar del nombre"
   - "El logo no aparece en las transacciones"
   - "Ya envié el logo y el nombre, pero no aparecen"
   - Tu código de comercio (Tbk-Api-Key-Id)

### 6. Tiempo de Activación

Una vez que Transbank configure el logo y nombre:
- Puede tomar **24-48 horas** en aparecer
- Puede requerir **aprobación manual** del logo
- Puede requerir **activación** del comercio

## 🚨 Posibles Causas

### Causa 1: Comercio Pendiente de Activación
- El comercio puede estar en estado "Pendiente" o "En revisión"
- **Solución**: Contactar a Transbank para activación

### Causa 2: Logo No Aprobado
- El logo puede estar cargado pero no aprobado
- **Solución**: Esperar aprobación o contactar a Transbank

### Causa 3: Configuración Incompleta
- Puede faltar completar algún paso en el panel
- **Solución**: Revisar todos los pasos del proceso de registro

### Causa 4: Cache del Navegador
- Puede ser un problema de cache
- **Solución**: Limpiar cache o probar en modo incógnito

## 📞 Información para Contactar a Transbank

Cuando contactes a Transbank, proporciona:

1. **Código de Comercio**: Tu `Tbk-Api-Key-Id`
2. **Problema**: "El logo y nombre del comercio no aparecen en Webpay"
3. **Lo que aparece**: "WEBPAY REST SIMULTANEA"
4. **Lo que debería aparecer**: Tu nombre de comercio y logo
5. **Estado**: "Ya envié el logo y el nombre, pero no aparecen en las transacciones"

## 🔍 Verificación Técnica (Opcional)

Si quieres verificar que las transacciones se están creando correctamente, revisa los logs de Vercel. Deberías ver:

```
📋 Datos de transacción: {
  buyOrder: 'ORD-xxx-xxx',
  sessionId: 'SESSION-xxx-xxx',
  amount: xxx,
  returnUrl: 'https://tu-sitio.com/pago/confirmar?orderId=xxx'
}
```

Si ves estos logs, significa que la integración técnica está funcionando correctamente y el problema es solo de configuración en el panel de Transbank.

## ✅ Checklist

- [ ] Accedí al panel de administración de Transbank
- [ ] Verifiqué el estado del comercio (debe estar "Activo")
- [ ] Verifiqué que el logo esté cargado
- [ ] Verifiqué que el logo esté aprobado
- [ ] Verifiqué que el nombre del comercio esté configurado
- [ ] Contacté a Transbank si no encuentro las opciones
- [ ] Esperé 24-48 horas después de la configuración
- [ ] Probé en modo incógnito para descartar cache

## 📝 Nota Importante

**El código de tu integración NO necesita cambios**. Este es un problema de configuración en el panel de Transbank, no del código. Las API keys solo permiten la comunicación técnica, pero el logo y nombre se configuran en el panel administrativo.

---

**Si después de seguir estos pasos el problema persiste, contacta directamente a Transbank con la información proporcionada arriba.**

