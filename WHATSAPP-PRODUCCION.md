# 📱 WhatsApp en Producción - Explicación Completa

## ✅ **RESPUESTA CORTA: SÍ, FUNCIONAN EN PRODUCCIÓN**

Los números de WhatsApp están configurados de dos formas:

### 1. **Valores Hardcodeados (Fallback)**
```typescript
const WHATSAPP_SERVICIOS_MOTOS = import.meta.env.PUBLIC_WHATSAPP_SERVICIOS_MOTOS || '56929024678';
const WHATSAPP_REPUESTOS = import.meta.env.PUBLIC_WHATSAPP_REPUESTOS || '56992405120';
```

**Esto significa:**
- ✅ Si NO hay variables de entorno → Usa los números hardcodeados (`56929024678` y `56992405120`)
- ✅ Si HAY variables de entorno → Usa las variables de entorno (tienen prioridad)

### 2. **Variables de Entorno (Opcional pero Recomendado)**

Si configuras variables de entorno en producción (Vercel/Netlify), esas tendrán prioridad sobre los valores hardcodeados.

---

## 🔍 **CÓMO FUNCIONA EN CADA AMBIENTE**

### **Desarrollo Local:**
- Usa los valores hardcodeados (`56929024678` y `56992405120`)
- ✅ Funciona sin configuración adicional

### **Producción (Vercel/Netlify):**
- **Opción A:** Si NO configuras variables de entorno → Usa valores hardcodeados ✅
- **Opción B:** Si configuras variables de entorno → Usa esas variables ✅

---

## 🚀 **RECOMENDACIÓN: Configurar Variables de Entorno en Producción**

Aunque funcionan sin configuración, es mejor configurarlas en Vercel/Netlify para:
- ✅ Poder cambiar los números sin hacer deploy
- ✅ Tener diferentes números por ambiente (staging/producción)
- ✅ No exponer números en el código

### **Cómo configurar en Vercel:**

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Settings → Environment Variables
3. Agrega estas variables:

```
PUBLIC_WHATSAPP_REPUESTOS=56992405120
PUBLIC_WHATSAPP_SERVICIOS_MOTOS=56929024678
```

4. Selecciona **Production, Preview, Development** (todas)
5. Guarda y redeploy

### **Cómo configurar en Netlify:**

1. Ve a tu proyecto en Netlify Dashboard
2. Site settings → Environment variables
3. Agrega las mismas variables
4. Guarda y redeploy

---

## 📋 **VERIFICACIÓN**

### **Para verificar que funcionan en producción:**

1. Ve a tu sitio en producción
2. Haz clic en cualquier botón de WhatsApp
3. Debería abrir WhatsApp con el número correcto:
   - Repuestos: `+56992405120`
   - Servicios/Motos: `+56929024678`

### **Si quieres verificar qué número se está usando:**

Abre la consola del navegador (F12) y ejecuta:
```javascript
// Verificar qué URLs se generaron
console.log(window.location.href);
// Luego busca los links de WhatsApp en la página
```

---

## 🎯 **RESUMEN**

| Ambiente | ¿Funciona? | ¿Necesita Configuración? |
|----------|------------|--------------------------|
| **Desarrollo** | ✅ SÍ | ❌ NO (usa valores hardcodeados) |
| **Producción (sin env vars)** | ✅ SÍ | ❌ NO (usa valores hardcodeados) |
| **Producción (con env vars)** | ✅ SÍ | ✅ SÍ (recomendado) |

**Conclusión:** Los números funcionan en producción **con o sin** variables de entorno configuradas, porque están hardcodeados como fallback.


