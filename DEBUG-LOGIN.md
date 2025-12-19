# 🐛 Debug: Login No Funciona

## Pasos para Diagnosticar

### 1. Abrir la Consola del Navegador

1. Presiona **F12** o **Ctrl+Shift+I** (Windows/Linux) o **Cmd+Option+I** (Mac)
2. Ve a la pestaña **Console**

### 2. Recargar la Página de Login

1. Ve a `/login`
2. Recarga la página (F5)
3. Busca estos mensajes en la consola:

```
🔧 Inicializando cliente de Supabase...
✅ Cliente de Supabase inicializado
📋 DOM cargado, configurando listeners...
✅ Formulario encontrado, agregando listener...
```

**Si NO ves estos mensajes:**
- El script no se está ejecutando
- Hay un error de JavaScript que está bloqueando la ejecución
- Busca errores en rojo en la consola

### 3. Intentar Iniciar Sesión

1. Ingresa email y contraseña
2. Haz clic en "Iniciar sesión"
3. Busca estos mensajes en la consola:

```
📝 Formulario enviado
🔐 Intentando iniciar sesión con: [tu-email]
🔧 Cliente de Supabase: Disponible
```

**Si NO ves "📝 Formulario enviado":**
- El listener del formulario no se está ejecutando
- El formulario no se está encontrando
- Hay un error antes de que se ejecute el listener

**Si ves "❌ Error en login":**
- Las credenciales son incorrectas
- Hay un problema con Supabase
- Revisa el mensaje de error completo

### 4. Verificar Variables de Entorno

En la consola, ejecuta:

```javascript
console.log('URL:', window.PUBLIC_SUPABASE_URL);
console.log('Key:', window.PUBLIC_SUPABASE_ANON_KEY ? 'Configurada' : 'Faltante');
```

**Deberías ver:**
- URL: `https://prizpqahcluomioxnmex.supabase.co`
- Key: `Configurada`

**Si ves `undefined` o `Faltante`:**
- Las variables no se están inyectando correctamente
- Revisa `BaseLayout.astro`

### 5. Verificar localStorage

En la consola, ejecuta:

```javascript
// Ver todas las claves de localStorage
Object.keys(localStorage).filter(k => k.includes('supabase') || k.includes('sb-'))
```

**Después de intentar login, deberías ver claves como:**
- `sb-[proyecto]-auth-token`
- Otras claves relacionadas con Supabase

**Si NO ves ninguna clave:**
- La sesión no se está guardando
- Hay un problema con localStorage

### 6. Verificar Red (Network)

1. Ve a la pestaña **Network** en la consola
2. Intenta iniciar sesión
3. Busca una petición a `auth/v1/token`
4. Haz clic en ella y revisa:
   - **Status**: Debería ser `200 OK`
   - **Response**: Debería contener `access_token` y `refresh_token`

**Si ves un error 400 o 401:**
- Las credenciales son incorrectas
- El usuario no existe

**Si ves un error 500:**
- Hay un problema con Supabase
- Revisa el dashboard de Supabase

## Errores Comunes y Soluciones

### Error: "Cannot read property 'addEventListener' of null"

**Causa:** El formulario no se encuentra cuando se ejecuta el script.

**Solución:** Ya está corregido con `DOMContentLoaded`, pero si persiste:
- Verifica que el formulario tenga `id="login-form"`
- Verifica que no haya errores de JavaScript antes

### Error: "PUBLIC_SUPABASE_URL is not defined"

**Causa:** Las variables de entorno no están disponibles.

**Solución:**
- Verifica que `BaseLayout.astro` esté inyectando las variables
- Verifica que las variables estén en `window.PUBLIC_SUPABASE_URL`

### Error: "Invalid login credentials"

**Causa:** Email o contraseña incorrectos.

**Solución:**
- Verifica las credenciales en Supabase Dashboard
- Intenta crear un nuevo usuario desde `/registro`

### Error: "Network request failed"

**Causa:** No hay conexión a Supabase.

**Solución:**
- Verifica tu conexión a internet
- Verifica que la URL de Supabase sea correcta
- Verifica que Supabase esté funcionando

## Compartir Información para Debug

Si el problema persiste, comparte:

1. **Todos los mensajes de la consola** (desde que cargas la página hasta que intentas login)
2. **Errores en rojo** (si hay alguno)
3. **Peticiones de red** (especialmente la de `auth/v1/token`)
4. **Screenshot de la consola** (si es posible)

## Prueba Rápida

Ejecuta esto en la consola del navegador en la página de login:

```javascript
// Verificar que todo esté configurado
console.log('URL:', window.PUBLIC_SUPABASE_URL);
console.log('Key:', window.PUBLIC_SUPABASE_ANON_KEY ? 'Configurada' : 'Faltante');
console.log('Form:', document.getElementById('login-form') ? 'Encontrado' : 'No encontrado');
console.log('Email input:', document.getElementById('email') ? 'Encontrado' : 'No encontrado');
console.log('Password input:', document.getElementById('password') ? 'Encontrado' : 'No encontrado');
```

Todos deberían mostrar valores válidos.

