// src/lib/validators/i18n/DevConsole.schema.ts
/**
 * @file DevConsole.schema.ts
 * @description Define el contrato de datos para el namespace 'DevConsole'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const DevConsoleSchema = z.object({
  UserManagementTable: z.object({
    table_header: z.object({
      email: z.string(),
      full_name: z.string(),
      role: z.string(),
      actions: z.string(),
    }),
    search_placeholder: z.string(),
    clear_search_aria: z.string(),
    table_empty_state: z.string(),
    pagination: z.object({
      previousPageLabel: z.string(),
      nextPageLabel: z.string(),
      pageLabelTemplate: z.string(),
    }),
    role_update_success_toast: z.string(),
    role_update_error_toast: z.string(),
    impersonate_dialog: z.object({
      aria_label: z.string(),
      title: z.string(),
      description: z.string(),
      cancel_button: z.string(),
      confirm_button: z.string(),
      success_toast: z.string(),
      default_error_toast: z.string(),
    }),
  }),
  CampaignsTable: z.object({
    title: z.string(),
    description: z.string(),
    error_title: z.string(),
    error_description: z.string(),
    header_name: z.string(),
    header_site: z.string(),
    header_created: z.string(),
    header_updated: z.string(),
    header_actions: z.string(),
    action_view_json: z.string(),
    dialog_title: z.string(),
  }),
  TelemetryTable: z.object({
    title: z.string(),
    description: z.string(),
    error_title: z.string(),
    error_description: z.string(),
    header_timestamp: z.string(),
    header_user_session: z.string(),
    header_ip_country: z.string(),
    header_fingerprint: z.string(),
    header_actions: z.string(),
    action_view_geo: z.string(),
    action_view_utms: z.string(),
    empty_state: z.string(),
    dialog_title_geo: z.string(),
    dialog_title_utms: z.string(),
  }),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/DevConsole.schema.ts
