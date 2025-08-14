/**
 * @file src/lib/validators/i18n/SitesPage.schema.ts
 * @description Define el contrato de datos para el namespace 'SitesPage'.
 *              Ha sido nivelado a un estándar de élite con una estructura
 *              anidada que refleja directamente los contratos de props de los
 *              componentes de presentación (`SitesHeader`, `SiteCard`, etc.).
 *              Esta es la SSoT para toda la UI de la página "Mis Sitios".
 * @author Raz Podestá
 * @version 3.0.0
 */
import { z } from "zod";

/**
 * @public
 * @constant SitesPageSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones relacionadas con la página de gestión de sitios.
 */
export const SitesPageSchema = z.object({
  /** Nombre singular de la entidad, ej. 'Sitio'. */
  entityName: z.string(),
  /** Textos para el componente `SitesHeader`. */
  header: z.object({
    title: z.string().describe("Título principal, ej. 'Mis Sitios'."),
    description: z.string().describe("Subtítulo de la página."),
    searchPlaceholder: z.string().describe("Placeholder para la búsqueda."),
    clearSearchAria: z.string().describe("Aria-label para limpiar búsqueda."),
    createSiteButton: z.string().describe("Texto del botón para crear sitio."),
    createDialogTitle: z.string().describe("Título del diálogo de creación."),
  }),
  /** Textos para el componente `CreateSiteForm`. */
  form: z.object({
    nameLabel: z.string(),
    namePlaceholder: z.string(),
    subdomainLabel: z.string(),
    subdomainInUseError: z.string(),
    descriptionLabel: z.string(),
    descriptionPlaceholder: z.string(),
    creatingButton: z.string(),
    createButton: z.string(),
  }),
  /** Textos para el componente `SitesGrid`. */
  grid: z.object({
    emptyStateTitle: z.string(),
    emptyStateDescription: z.string(),
  }),
  /** Textos para el componente `SiteCard`. */
  card: z.object({
    campaignCount: z
      .string()
      .describe("Texto para el contador de campañas (ej. '{count} Campañas')."),
    manageCampaignsButton: z.string(),
    deleteSiteAriaLabel: z.string(),
    openSiteAriaLabel: z.string(),
    popoverTitle: z.string(),
    popoverDescription: z.string(),
  }),
  /** Textos para el componente `DeleteSiteDialog`. */
  deleteDialog: z.object({
    title: z.string(),
    description: z
      .string()
      .describe("Descripción que soporta texto enriquecido (HTML)."),
    confirmButton: z.string(),
  }),
  /** Textos para el estado de error de carga de datos. */
  errorState: z.object({
    title: z.string(),
    description: z.string(),
  }),
  /** Textos para el componente `PaginationControls`. */
  pagination: z.object({
    previous: z.string(),
    next: z.string(),
    page: z.string(),
  }),
  /** Claves de error de validación de Zod para el formulario. */
  validationErrors: z.object({
    name_required: z.string(),
    name_too_short: z.string(),
    subdomain_too_short: z.string(),
    subdomain_invalid_chars: z.string(),
  }),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación Arquitectónica**: ((Implementada)) La estructura del schema ahora refleja 1:1 los contratos de props de los componentes de presentación. Esta es la corrección estructural que habilita el siguiente paso de refactorización.
 * 2. **Documentación Embebida**: ((Implementada)) Se ha añadido `.describe()` a claves importantes para mejorar la claridad del contrato.
 *
 * @subsection Melhorias Futuras
 * 1. **Contrato de Toast**: ((Vigente)) Se podría añadir una sección anidada `toasts` para centralizar los mensajes de éxito/error de las Server Actions de este flujo.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/SitesPage.schema.ts
