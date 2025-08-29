// src/lib/validators/i18n/errors/WorkspaceErrors.schema.ts
/**
 * @file WorkspaceErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de feedback de acciones de workspaces (crear, actualizar nombre,
 *              eliminar) y validación de campos, sin un prefijo de dominio.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 */
import { z } from "zod";

export const WorkspaceErrorsSchema = z.object({
  // Action Feedback
  unauthenticated: z.string(),
  create_invalid_data: z.string(),
  create_failed: z.string(),
  create_success: z.string(),
  update_name_permission_denied: z.string(),
  update_name_failed: z.string(),
  update_name_success: z.string(),
  delete_permission_denied: z.string(),
  delete_last_owner_cannot_delete: z.string(),
  delete_failed: z.string(),
  delete_success: z.string(),

  // Field Validation
  workspace_name_required: z.string(),
  workspace_name_too_short: z.string(),
  workspace_name_too_long: z.string(),
  workspace_name_invalid_chars: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Errores de Transferencia de Propiedad**: Añadir claves para el flujo de transferencia de propiedad de un workspace (ej. `transfer_ownership_failed`, `transfer_to_non_member_forbidden`).
 * 2. **Errores de Límite de Plan**: Incorporar claves para manejar errores relacionados con los límites del plan del usuario (ej. `max_workspaces_reached_for_plan`).
 * 3. **Validación de Placeholders**: Si alguna clave necesitara placeholders (ej. `delete_success_with_name: "Workspace {name} deleted."`), se podría añadir `.describe("Placeholder: {name}")` para documentar la expectativa.
 * =====================================================================
 */
// src/lib/validators/i18n/errors/WorkspaceErrors.schema.ts
