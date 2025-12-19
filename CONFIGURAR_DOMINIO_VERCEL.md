# 🌐 Configurar Dominio nic.cl en Vercel

Esta guía te ayudará a conectar tu dominio de nic.cl a Vercel.

## 📋 Paso 1: Obtener los Servidores DNS de Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en tu proyecto
3. Ve a **Settings** > **Domains**
4. Haz clic en **Add** o **Add Domain**
5. Ingresa tu dominio (ejemplo: `tudominio.cl`)
6. Vercel te mostrará dos opciones:
   - **Opción A**: Usar servidores DNS de Vercel (recomendado)
   - **Opción B**: Configurar registros DNS manualmente

## 🔧 Paso 2: Configurar en nic.cl

### Opción A: Usar Servidores DNS de Vercel (Recomendado)

1. **Obtén los servidores DNS de Vercel:**
   - En el dashboard de Vercel, cuando agregues el dominio, verás algo como:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - O pueden ser:
     ```
     dns1.vercel-dns.com
     dns2.vercel-dns.com
     ```

2. **Configura en nic.cl:**
   - Inicia sesión en [nic.cl](https://www.nic.cl)
   - Ve a la sección de administración de tu dominio
   - Busca la opción **"Servidores DNS"** o **"Name Servers"**
   - Reemplaza los servidores actuales con los de Vercel:
     - **Servidor DNS 1**: `ns1.vercel-dns.com` (o `dns1.vercel-dns.com`)
     - **Servidor DNS 2**: `ns2.vercel-dns.com` (o `dns2.vercel-dns.com`)
   - Guarda los cambios

3. **Espera la propagación:**
   - Los cambios pueden tardar entre 24-48 horas en propagarse
   - Vercel detectará automáticamente cuando el dominio esté configurado

### Opción B: Configurar Registros DNS Manualmente (Alternativa)

Si prefieres mantener tus servidores DNS actuales, puedes configurar registros DNS:

1. **En Vercel**, cuando agregues el dominio, selecciona **"Configure DNS Records"**
2. Vercel te dará los registros a configurar, típicamente:
   - **Tipo A**: Apuntar a la IP de Vercel
   - **Tipo CNAME**: Para subdominios (www)
   - **Tipo TXT**: Para verificación

3. **En nic.cl**, agrega estos registros en la sección de DNS

## ✅ Paso 3: Verificar la Configuración

1. **En Vercel:**
   - Ve a **Settings** > **Domains**
   - Verás el estado del dominio:
     - 🟡 **Pending**: Esperando configuración
     - 🟢 **Valid**: Configurado correctamente
     - 🔴 **Invalid**: Error en la configuración

2. **Verificar propagación DNS:**
   - Usa herramientas como:
     - [whatsmydns.net](https://www.whatsmydns.net)
     - [dnschecker.org](https://dnschecker.org)
   - Busca tu dominio y verifica que los servidores DNS sean los de Vercel

## 🔍 Servidores DNS Comunes de Vercel

Los servidores DNS de Vercel suelen ser:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

O en algunos casos:

```
dns1.vercel-dns.com
dns2.vercel-dns.com
```

**Nota**: Los servidores exactos se muestran en el dashboard de Vercel cuando agregas el dominio.

## 📝 Ejemplo de Configuración en nic.cl

1. Inicia sesión en nic.cl
2. Selecciona tu dominio
3. Ve a **"Configuración DNS"** o **"Servidores de Nombres"**
4. Cambia a **"Servidores personalizados"** o **"Custom Nameservers"**
5. Ingresa:
   ```
   Servidor 1: ns1.vercel-dns.com
   Servidor 2: ns2.vercel-dns.com
   ```
6. Guarda los cambios

## ⚠️ Notas Importantes

- **Propagación DNS**: Los cambios pueden tardar hasta 48 horas en propagarse globalmente
- **SSL Automático**: Vercel emitirá automáticamente un certificado SSL cuando el dominio esté configurado
- **Subdominios**: Si quieres usar `www.tudominio.cl`, también debes agregarlo en Vercel
- **Backup**: Guarda los servidores DNS anteriores por si necesitas revertir

## 🆘 Solución de Problemas

### El dominio no se verifica

1. Verifica que los servidores DNS estén correctamente configurados
2. Espera 24-48 horas para la propagación
3. Verifica en [whatsmydns.net](https://www.whatsmydns.net) que los cambios se hayan propagado

### Error "Domain already in use"

- El dominio puede estar configurado en otro proyecto de Vercel
- Verifica en todos tus proyectos de Vercel

### El sitio no carga después de configurar

- Verifica que el dominio esté agregado en Vercel
- Asegúrate de que el proyecto esté desplegado
- Revisa los logs de Vercel para errores

## 📞 Soporte

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Documentación Vercel**: [vercel.com/docs](https://vercel.com/docs)





