/**
 * @file CampaignsPage.schema.ts
 * @description Define el contrato de datos para el namespace 'CampaignsPage'.
 *              Nivelado para incluir todas las claves de texto de la UI, acciones
 *              del menú contextual, y los nuevos errores de Server Action.
 * @author Raz Podestá
 * @version 3.0.0
 */
import { z } from "zod";

export const CampaignsPageSchema = z.object({
  // ... (claves existentes sin cambios)
  entityName: z.string(),
  pageTitle: z.string(),
  pageDescription: z.string(),
  backToSitesButton: z.string(),
  createCampaignButton: z.string(),
  createDialog: z.object({ title: z.string() }),
  deleteDialog: z.object({
    title: z.string(),
    description: z.string(),
    confirmButton: z.string(),
  }),
  search: z.object({ placeholder: z.string(), clear_aria: z.string() }),
  table: z.object({
    header_name: z.string(),
    header_status: z.string(), // MEJORA
    header_lastUpdated: z.string(),
    header_actions: z.string(),
    action_edit: z.string(),
    action_analytics: z.string(), // MEJORA
    action_duplicate: z.string(), // MEJORA
    action_archive: z.string(), // MEJORA
    action_delete: z.string(), // MEJORA
    action_delete_aria: z.string(),
    empty_state: z.string(),
  }),
  status: z.object({
    // MEJORA
    draft: z.string(),
    published: z.string(),
    archived: z.string(),
  }),
  pagination: z.object({
    previous: z.string(),
    next: z.string(),
    page: z.string(),
  }),
  form_name_label: z.string(),
  form_name_placeholder: z.string(),
  form_creating_button: z.string(),
  form_create_button: z.string(),
  // --- MEJORA: Claves de Error de Server Action ---
  error_unauthenticated: z.string(),
  error_site_not_found: z.string(),
  error_permission_denied: z.string(),
  error_creation_failed: z.string(),
  error_deletion_failed: z.string(),
  error_duplication_failed: z.string(),
  error_archive_failed: z.string(),
  error_campaign_not_found: z.string(),
  error_data_integrity: z.string(),
  error_invalid_data: z.string(),
  error_invalid_id: z.string(),
  error_unexpected: z.string(),
  // --- MEJORA: Claves de Toast de Éxito ---
  delete_success_toast: z.string(),
  duplicate_success_toast: z.string(),
  archive_success_toast: z.string(),
});
