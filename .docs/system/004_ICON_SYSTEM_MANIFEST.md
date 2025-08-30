// .docs/system/004_ICON_SYSTEM_MANIFEST.md
/**
 * @file .docs/system/004_ICON_SYSTEM_MANIFEST.md
 * @description Manifiesto Canónico del Sistema de Iconos v1.0.
 *              Esta es la SSoT que define la arquitectura completa para la gestión,
 *              renderizado, intercambiabilidad y validación de iconos en ConvertiKit.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Canónico del Sistema de Iconos v1.0

## 1. Filosofía: "Agnóstico por Diseño, Seguro por Contrato"

Nuestro sistema de iconos se basa en dos principios:
1.  **Agnosticismo (Intercambiabilidad):** La UI no debe estar acoplada a una librería de iconos específica. Debemos poder cambiar de `Lucide` a `Tabler` (o cualquier otra) con un cambio de configuración mínimo.
2.  **Seguridad de Contrato (Cero Errores en Runtime):** Es inaceptable que un error de tipeo en un nombre de icono cause un fallo visual en producción. La validación debe ocurrir en tiempo de desarrollo.

## 2. Arquitectura de Renderizado e Intercambiabilidad

*   **SSoT de Configuración:** `src/config/icon-libraries.config.ts`
*   **Mecanismo:**
    1.  El **manifiesto de librerías** define las librerías soportadas y una `importFn` para su carga dinámica.
    2.  El `IconLibraryProvider` lee la preferencia del usuario, ejecuta la `importFn` y provee el mapa de iconos a través de `React.Context`.
    3.  El componente `DynamicIcon.tsx` consume el contexto y renderiza el icono solicitado de la librería activa.
*   **Consecuencia:** Esta arquitectura permite la personalización de la UI por parte del usuario y facilita futuras migraciones de librerías de iconos.

## 3. Arquitectura de Blindaje de Contrato (Validación)

*   **SSoT de Datos:** `node_modules/lucide-react/dynamicIconImports.js` (para Lucide).
*   **Mecanismo:**
    1.  **Generador (`pnpm gen:icons`):** Un script (`generate-lucide-icon-enum.ts`) lee el manifiesto de la librería, transforma los nombres a `PascalCase` y genera un schema de Zod.
    2.  **SSoT de Nombres Válidos (`src/config/lucide-icon-names.ts`):** Un archivo generado automáticamente que contiene `LucideIconNameSchema` (un `z.enum([...])` con todos los nombres de iconos válidos).
    3.  **Consumidores (Schemas de i18n):** Cualquier schema de i18n que defina una propiedad de icono **DEBE** usar `LucideIconNameSchema` en lugar de `z.string()`.
*   **Consecuencia:** Si un desarrollador introduce un nombre de icono inválido en un archivo `.json`, el proceso de `build` (que valida los mensajes contra los schemas) fallará explícitamente, previniendo el error en producción.

## 4. Manual de Uso para Desarrolladores

1.  **Identificar Icono:** Encontrar el icono en la web de la librería activa (ej. Lucide) y obtener su nombre `PascalCase`.
2.  **Añadir a i18n:** Añadir la propiedad `iconName` al archivo `.json` correspondiente.
3.  **Actualizar Schema Zod:** Asegurar que la propiedad en el `*.schema.ts` correspondiente esté validada con `LucideIconNameSchema`.

// .docs/system/004_ICON_SYSTEM_MANIFEST.md