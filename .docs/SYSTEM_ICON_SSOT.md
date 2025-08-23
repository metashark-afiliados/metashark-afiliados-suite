// .docs/SYSTEM_ICON_SSOT.md
/\*\*

- @file .docs/SYSTEM_ICON_SSOT.md
- @description Manifiesto del Sistema de Iconos de ConvertiKit.
-              Esta es la Única Fuente de Verdad (SSoT) que documenta la
-              filosofía, arquitectura y uso del sistema de validación de
-              iconos de la aplicación.
- @author L.I.A. Legacy & RaZ Podestá
- @version 1.0.0
  \*/

# Manifiesto del Sistema de Iconos: La SSoT Definitiva

## 1. Filosofía: "Blindaje de Contrato y Cero Errores en Runtime"

La misión de este sistema es erradicar por completo la posibilidad de que un nombre de icono inválido sea introducido en nuestros archivos de configuración de i18n. Movemos la detección de errores del entorno de producción (un icono faltante en la UI) al entorno de desarrollo (un fallo explícito en el build), garantizando una robustez de nivel de producción y una experiencia de desarrollador (DX) de élite.

## 2. Origen de los Datos

La lista de nombres de iconos canónicos se extrae directamente de la librería `lucide-react` instalada en el proyecto.

- **Archivo Fuente:** `node_modules/lucide-react/dynamicIconImports.js`
- **Formato Original:** Las claves en este archivo están en `kebab-case` (ej. `arrow-right-left`).
- **Transformación:** Nuestro script de generación (`pnpm gen:icons`) lee este archivo y transforma cada clave a `PascalCase` (ej. `ArrowRightLeft`), que es el formato esperado por el componente `DynamicIcon` y la exportación `icons` de la librería.

## 3. Arquitectura del Sistema (El "Cómo")

El sistema se compone de tres aparatos atómicos que trabajan en conjunto:

1.  **El Generador (`scripts/generation/generate-lucide-icon-enum.ts`):**
    - Un script Node.js que se ejecuta con `pnpm gen:icons`.
    - Lee la SSoT (`dynamicIconImports.js`), transforma los nombres y genera el archivo de validación.

2.  **La SSoT de Nombres (`src/config/lucide-icon-names.ts`):**
    - Un archivo generado automáticamente que contiene un `z.enum([...])` con los 1300+ nombres de iconos válidos en `PascalCase`.
    - Este es el **validador canónico** que será consumido por el resto del sistema.

3.  **Los Consumidores (Schemas de i18n):**
    - Todos los archivos en `src/lib/validators/i18n/` que definen un contrato para un icono (ej. `FeaturesSection.schema.ts`) deben importar y utilizar `LucideIconNameSchema` en lugar de un `z.string()` genérico.

## 4. Manual de Uso para Desarrolladores

Para añadir o utilizar un icono en un componente que consume datos de i18n, siga este flujo de trabajo:

1.  **Identificar el Icono:** Encuentre el icono deseado en la [web de Lucide](https://lucide.dev/icons/). Anote su nombre en `PascalCase`.
2.  **Añadir al Archivo de Mensajes:** Abra el archivo `.json` correspondiente en `src/messages/`. Añada la propiedad `icon` o `iconName` con el nombre `PascalCase` del icono.
3.  **Actualizar el Schema Zod:** Abra el archivo `*.schema.ts` correspondiente en `src/lib/validators/i_18n/`. Asegúrese de que la propiedad del icono esté validada con `LucideIconNameSchema`.

## 5. Guía de Troubleshooting (Fuente de Verdad para Errores)

Si encuentra un error relacionado con los iconos, consulte esta guía.

- **Error:** `ZodError: Invalid enum value. Expected '...', received '...'` al ejecutar `pnpm dev` o `pnpm build`.
  - **Causa:** Ha introducido un nombre de icono incorrecto o con un error de tipeo en un archivo `.json`.
  - **Solución:** Abra `src/config/lucide-icon-names.ts`, busque (`Ctrl+F`) el nombre correcto del icono que desea usar y corríjalo en el archivo `.json`.

- **Error:** El icono no aparece en la UI, pero el build no falla. En la consola del navegador ve un warning de `[DynamicIcon] Ícono no encontrado...`.
  - **Causa:** El nombre del icono es válido en el archivo `.json`, pero el **mapa semántico** (`src/config/icon-map.ts`) tiene un error de tipeo.
  - **Solución:** Revise la entrada correspondiente en `src/config/icon-map.ts` y asegúrese de que el valor coincide exactamente con un nombre de `lucide-icon-names.ts`.

- **Error:** El build falla con un error de módulo no encontrado o similar después de añadir un nuevo schema de i18n.
  - **Causa:** Ha creado un nuevo schema pero no ha regenerado el ensamblador principal.
  - **Solución:** Ejecute `pnpm gen:i18n:schema` o, preferiblemente, `pnpm gen:all` para regenerar todos los manifiestos.
