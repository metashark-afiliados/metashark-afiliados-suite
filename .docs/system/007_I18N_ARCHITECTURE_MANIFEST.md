// .docs/system/007_I18N_ARCHITECTURE_MANIFEST.md
/**
 * @file .docs/system/007_I18N_ARCHITECTURE_MANIFEST.md
 * @description Manifiesto Canónico de Arquitectura de Internacionalización (IMAS) v1.0.
 *              Esta es la SSoT que define la estrategia para una i18n tipo-segura,
 *              modular y mantenible. Expande el Pilar 7 de la Constitución
 *              Arquitectónica y reemplaza a `.docs/007_IMAS_ARCHITECTURE_MANIFEST_V2.md`.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto de Arquitectura de Internacionalización (IMAS) v1.0

## 1. Filosofía: "Construir Contratos, No Redefinirlos"
*   **Referencia a la Constitución:** AD-004, AD-005.
*   La estrategia IMAS (Internationalization Modular Atomic Strategy) se basa en la atomicidad y la composición. Un componente consume los mensajes de su dominio, pero no redefine los de otros. En su lugar, compone los contratos (schemas Zod) de los dominios que consume.

## 2. Las Tres Capas de la Arquitectura IMAS

### 2.1. Capa de Contenido Atómico (`src/messages/`)
*   **Implementación:** Archivos `.json` atómicos, agrupados por dominio o componente (ej. `SitesHeader.json`, `ValidationErrors.json`).
*   **Propósito:** Aislar el contenido textual en pequeños módulos manejables, facilitando la traducción y el mantenimiento.

### 2.2. Capa de Contratos Atómicos (`src/lib/validators/i18n/`)
*   **Implementación:** Schemas de Zod que validan la estructura de cada archivo `.json` correspondiente.
*   **Propósito:** Crear una SSoT tipo-segura para cada namespace de i18n. Esto garantiza que si se añade, elimina o renombra una clave en el `.json`, el build fallará si el contrato en Zod no se actualiza, previniendo errores en tiempo de ejecución.

### 2.3. Capa de Ensamblaje por Composición
*   **Implementación:** Schemas de nivel de página o componente complejo (ej. `SitesPage.schema.ts`) **DEBEN** importar y fusionar (`.merge()`) los schemas de los componentes atómicos que utilizan.
*   **Propósito:** Adherirse estrictamente al principio DRY. Una clave de traducción y su contrato se definen una sola vez en su SSoT atómica. Los componentes de nivel superior construyen su contrato de i18n completo componiendo estos átomos.

*   **Ejemplo de Composición de Élite:**
    ```typescript
    // En: src/lib/validators/i18n/SitesPage.schema.ts
    import { SitesHeaderSchema } from "./SitesHeader.schema";
    import { SiteErrorsSchema } from "./errors/SiteErrors.schema";

    export const SitesPageSchema = SitesHeaderSchema.merge(z.object({
        // Claves propias de la página...
    }));
    ```
// .docs/system/007_I18N_ARCHITECTURE_MANIFEST.md