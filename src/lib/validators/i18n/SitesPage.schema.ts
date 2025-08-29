// src/lib/validators/i18n/SitesPage.schema.ts
/**
 * @file src/lib/validators/i18n/SitesPage.schema.ts
 * @description Define el contrato de datos para el namespace 'SitesPage'.
 *              Ha sido nivelado a un estándar de élite con una estructura
 *              anidada y la adición de la clave `confirmation_label` para
 *              soportar el diálogo de confirmación genérico.
 *              **Actualizado para incluir `card.emptySiteNamePlaceholder`**.
 * @author Raz Podestá
 * @version 5.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 */
import { z } from "zod";

export const SitesPageSchema = z.object({
  entityName: z.string(),
  breadcrumbs: z.object({
    dashboard: z.string(),
    sites: z.string(),
  }),
  header: z.object({
    createSiteButton: z.string(),
    createDialogTitle: z.string(),
    searchPlaceholder: z.string(),
    clearSearchAria: z.string(),
  }),
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
  grid: z.object({
    emptyStateTitle: z.string(),
    emptyStateDescription: z.string(),
  }),
  card: z.object({
    campaignCount: z.string(),
    manageCampaignsButton: z.string(),
    deleteSiteAriaLabel: z.string(),
    openSiteAriaLabel: z.string(),
    popoverTitle: z.string(),
    popoverDescription: z.string(),
    // --- INICIO DE IMPLEMENTACIÓN HOLÍSTICA: Nueva clave de i18n ---
    emptySiteNamePlaceholder: z.string(),
    // --- FIN DE IMPLEMENTACIÓN HOLÍSTICA ---
  }),
  deleteDialog: z.object({
    title: z.string(),
    description: z.string(),
    confirmButton: z.string(),
    confirmation_label: z.string(), // <-- SINCRONIZADO
  }),
  pagination: z.object({
    previous: z.string(),
    next: z.string(),
    page: z.string(),
  }),
  errorState: z.object({
    title: z.string(),
    description: z.string(),
  }),
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
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 *
 * @subsection Melhorias Adicionadas
 * 1. **Clave de i18n para Placeholder**: ((Implementada)) Se ha añadido la clave `card.emptySiteNamePlaceholder` al esquema `SitesPageSchema`. Esto es esencial para internacionalizar el texto del `EditableText` cuando el nombre del sitio es nulo, garantizando el cumplimiento del protocolo de i18n.
 * 2. **Integridad de Contrato**: ((Implementada)) El esquema ahora refleja con precisión el contrato de i18n de los componentes de la página de sitios.
 * 3. **Versionado Consistente**: ((Implementada)) Se ha incrementado la versión a `5.0.0` para reflejar esta adición.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Placeholders**: ((Vigente)) El esquema podría ser mejorado para validar la presencia de placeholders (`{username}`) si estos fueran necesarios en el futuro, utilizando `.describe("Placeholder: {username}")`.
 *
 * =====================================================================
 */
