// src/lib/validators/i18n/WorkspaceSwitcher.schema.ts
/**
 * @file WorkspaceSwitcher.schema.ts
 * @description Define el contrato de datos para el namespace 'WorkspaceSwitcher'.
 *              Sincronizado para incluir el ciclo de vida de renombrar.
 * @author Raz Podestá
 * @version 2.2.0
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
  renameWorkspace_button: z.string(),
  workspaceSettings_button: z.string(),
  deleteWorkspace_button: z.string(),

  onboarding_title: z.string(),
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

  // --- INICIO DE SINCRONIZACIÓN ---
  rename_dialog: z.object({
    title: z.string(),
    description: z.string(),
    save_button: z.string(),
    saving_button: z.string(),
  }),
  // --- FIN DE SINCRONIZACIÓN ---

  delete_dialog: z.object({
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
 * 1. **Sincronización de Contrato Completo**: ((Implementada)) Se han añadido `renameWorkspace_button` y el objeto `rename_dialog`, completando el contrato de i18n y resolviendo el error `TS2345`.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/WorkspaceSwitcher.schema.ts
