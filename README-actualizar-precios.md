# Actualización de Precios desde Archivos HTML

Este script procesa los archivos HTML de la carpeta `listapreciomimoto` y actualiza los precios de los productos en la base de datos.

## Requisitos

1. Node.js instalado
2. Variables de entorno de Supabase configuradas en `frontend/.env.local`:
   - `PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (o `VITE_SUPABASE_ANON_KEY`)

## Instalación de dependencias

```bash
npm install @supabase/supabase-js dotenv
```

## Ejecución

```bash
node update-prices-from-html.js
```

## Qué hace el script

1. **Lee todos los archivos HTML** de la carpeta `listapreciomimoto`
2. **Extrae productos** con la siguiente información:
   - Código (SKU)
   - Descripción (nombre)
   - Stock
   - Precio Neto (precio de venta)
3. **Filtra productos** con stock > 0 (descarta productos sin stock)
4. **Elimina duplicados** (mismo código)
5. **Hace match** con productos en la base de datos por:
   - SKU exacto
   - Código en el nombre
   - Nombre exacto
   - Nombre parcial (palabras comunes)
6. **Actualiza precios** en la base de datos (solo si el precio es diferente)

## Formato de los archivos HTML

Los archivos HTML tienen un formato específico con divs posicionados:
- **Código**: posición left 6-104px
- **Descripción**: posición left 103-376px
- **Stock**: posición left 434-484px
- **Precio Neto**: posición left 621-684px

## Notas importantes

- Solo se procesan productos con **stock > 0**
- Solo se actualizan precios si son **diferentes** (con tolerancia de 0.01)
- El script muestra un resumen de:
  - Productos encontrados
  - Productos actualizados
  - Productos no encontrados
  - Productos sin cambios




