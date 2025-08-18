// src/lib/validators/i18n/WorkspaceSwitcher.schema.ts
/**
 * @file WorkspaceSwitcher.schema.ts
 * @description Define el contrato de datos para el namespace 'WorkspaceSwitcher'.
 *              Ha sido nivelado para incluir el ciclo de vida de eliminación.
 * @author Raz Podestá
 * @version 2.1.0
 */
import { z } from "zod";

export const WorkspaceSwitcherSchema = z.object({
  selectWorkspace_label: z.string(),
  search_placeholder: z.string(),
  empty_results: z.string(),
  changing_status: z.string(),

  createWorkspace_button: z.string(),
  inviteMember_button: z.string(),
  inviteMember_description: z.string(),
  workspaceSettings_button: z.string(),
  deleteWorkspace_button: z.string(), // <-- NUEVO

  onboarding_welcome_title: z.string(),
  onboarding_welcome_description: z.string(),

  create_form: z.object({
    name_label: z.string(),
    name_placeholder: z.string(),
    creating_button: z.string(),
    create_button: z.string(),
    success_toast: z.string(),
  }),

  edit_form: z.object({
    // <-- NUEVO
    name_aria_label: z.string(),
    success_toast: z.string(),
  }),

  invite_form: z.object({
    email_label: z.string(),
    email_placeholder: z.string(),
    role_label: z.string(),
    role_placeholder: z.string(),
    role_member: z.string(),
    role_admin: z.string(),
    sending_button: z.string(),
    send_button: z.string(),
  }),

  delete_dialog: z.object({
    // <-- NUEVO
    title: z.string(),
    description: z.string(),
    confirmation_label: z.string(),
    confirm_button: z.string(),
    success_toast: z.string(),
  }),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Completitud de Ciclo de Vida**: ((Implementada)) Se han añadido las claves para la funcionalidad de edición y eliminación.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/WorkspaceSwitcher.schema.ts
