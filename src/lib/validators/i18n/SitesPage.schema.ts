// src/lib/validators/i18n/SitesPage.schema.ts
/**
 * @file src/lib/validators/i18n/SitesPage.schema.ts
 * @description Define el contrato de datos para el namespace 'SitesPage'.
 *              Ha sido nivelado a un estándar de élite con una estructura
 *              anidada y la adición de la clave `confirmation_label` para
 *              soportar el diálogo de confirmación genérico.
 * @author Raz Podestá
 * @version 4.0.0
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
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato**: ((Implementada)) Se ha añadido la clave `deleteDialog.confirmation_label` al schema. Esto asegura que el contrato de datos de i18n esté completo y alineado con los requerimientos de los componentes de UI.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/SitesPage.schema.ts
