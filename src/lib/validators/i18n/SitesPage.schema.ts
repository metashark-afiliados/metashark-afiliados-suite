// src/lib/validators/i18n/SitesPage.schema.ts
/**
 * @file SitesPage.schema.ts
 * @description Define el contrato de datos para el namespace 'SitesPage'.
 *              Nivelado para incluir un contrato completo de feedback de UI
 *              (toasts) para todas las acciones CRUD.
 * @author L.I.A Legacy
 * @version 6.0.0
 */
import { z } from "zod";

export const SitesPageSchema = z.object({
  entityName: z.string(),
  // ... (otras claves sin cambios)
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
    emptySiteNamePlaceholder: z.string(),
  }),
  deleteDialog: z.object({
    title: z.string(),
    description: z.string(),
    confirmButton: z.string(),
    confirmation_label: z.string(),
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
  // --- INICIO DE REFACTORIZACIÓN: Contrato de Feedback de UI ---
  toasts: z.object({
    create_success: z.string(),
    update_name_success: z.string(),
    delete_success: z.string(),
  }),
  // --- FIN DE REFACTORIZACIÓN ---
  validationErrors: z.object({
    name_required: z.string(),
    name_too_short: z.string(),
    subdomain_too_short: z.string(),
    subdomain_invalid_chars: z.string(),
  }),
});
// src/lib/validators/i18n/SitesPage.schema.ts
