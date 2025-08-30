// .docs/007_IMAS_ARCHITECTURE_MANIFEST_V2.md
/**
 * @file .docs/007_IMAS_ARCHITECTURE_MANIFEST_V2.md
 * @description Manifiesto Canónico de la Arquitectura IMAS v2.0.
 *              Esta es la Única Fuente de Verdad (SSoT) definitiva que define la
 *              estrategia de internacionalización, introduciendo el principio de
 *              "Composición de Schemas y Soberanía de Dominio".
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto de Arquitectura IMAS v2.0: Composición y Soberanía

## 1. Filosofía: "Construir Contratos, No Redefinirlos"

La estrategia IMAS (Internationalization Modular Atomic Strategy) evoluciona. Mantenemos la atomicidad de los archivos de mensajes y schemas, pero elevamos el estándar de cómo estos se ensamblan. La nueva filosofía es: **un schema de página o componente NUNCA debe redefinir una clave que pertenezca a otro dominio**. En su lugar, debe **componer** los schemas de los dominios que consume.

## 2. Arquitectura de Schemas de Élite (Refactorización Propuesta)

La estructura de `src/lib/validators/i18n/` se refinará para reflejar una jerarquía clara:

1.  **Schemas de Dominio (Primitivas):** Son la SSoT para las entidades de negocio.
    *   Ejemplos: `errors/SiteErrors.schema.ts`, `errors/WorkspaceErrors.schema.ts`, `landing/Hero.schema.ts`.
    *   **Regla:** Definen las claves de un dominio específico de la forma más atómica posible.

2.  **Schemas de Página/Componente (Ensambladores):** Son los que consumen los componentes de la UI.
    *   Ejemplos: `SitesPage.schema.ts`, `LoginPage.schema.ts`.
    *   **Regla Mandatoria:** Estos schemas **DEBEN** importar y fusionar los schemas de dominio que su página/componente correspondiente utiliza.

*   **Ejemplo de Implementación (Refactorización de `SitesPage.schema.ts`):**

    *   **Estado Anterior (Redundante):**
        ```typescript
        // SitesPage.schema.ts (Antiguo)
        export const SitesPageSchema = z.object({
          header: z.object({ createSiteButton: z.string() }),
          validationErrors: z.object({ name_required: z.string() }) // <-- REDUNDANTE
        });
        ```

    *   **Estado de Élite (Compuesto):**
        ```typescript
        // SitesPage.schema.ts (Nuevo)
        import { SitesHeaderSchema } from "./SitesHeader.schema";
        import { SiteErrorsSchema } from "./errors/SiteErrors.schema";

        export const SitesPageSchema = SitesHeaderSchema.merge(z.object({
            // Claves propias de la página...
            entityName: z.string(),
            // Se puede extender con otros schemas si la página usa más componentes
        }));
        
        // NOTA: Los errores ya no se definen aquí, son parte de un schema global.
        ```

*   **Beneficios:**
    *   **DRY Absoluto:** Una clave de traducción se define en un único schema.
    *   **Mantenibilidad Superior:** Cambiar una clave de un componente (ej. `SitesHeader`) solo requiere modificar `SitesHeader.schema.ts`. Todas las páginas que lo componen se actualizarán automáticamente.
    *   **Cohesión de Dominio:** Refuerza la idea de que cada parte del sistema es un "LEGO brick" con su propio contrato bien definido.

## 3. Estructura de Mensajes (`/src/messages/`)

La estructura de los archivos `.json` se mantiene atómica y alineada con los schemas. La refactorización se centrará en mover las claves duplicadas a sus archivos de dominio SSoT correspondientes. Por ejemplo, los mensajes de error de sitios se moverán de `pages/SitesPage.json` a `shared/errors/SiteErrors.json`.

// .docs/007_IMAS_ARCHITECTURE_MANIFEST_V2.md