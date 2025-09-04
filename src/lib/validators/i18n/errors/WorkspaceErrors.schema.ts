// src/lib/validators/i18n/errors/WorkspaceErrors.schema.ts
/**
 * @file WorkspaceErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de feedback de acciones de workspaces (crear, actualizar nombre,
 *              eliminar) y validación de campos, sin un prefijo de dominio.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/validators/i18n/errors/WorkspaceErrors.schema.ts.md
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
// src/lib/validators/i18n/errors/WorkspaceErrors.schema.ts
