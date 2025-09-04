// src/lib/validators/i18n/errors/InvitationErrors.schema.ts
/**
 * @file InvitationErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de feedback de acciones de invitaciones (enviar, aceptar)
 *              sin un prefijo de dominio. Incluye claves de éxito para un
 *              contrato de feedback completo.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 2.0.0
 * @see .docs-espejo/lib/validators/i18n/errors/InvitationErrors.schema.ts.md
 */
import { z } from "zod";

export const InvitationErrorsSchema = z.object({
  send_unauthenticated: z.string(),
  send_self_invite_forbidden: z.string(),
  send_already_invited_or_member: z.string(),
  send_failed: z.string(),
  send_invalid_data: z.string(),
  accept_unauthenticated: z.string(),
  accept_processing_failed: z.string(),
  accept_failed: z.string(),
  send_success: z
    .string()
    .describe(
      "Mensaje de éxito al enviar una invitación. Placeholder: {email}"
    ),
  accept_success: z
    .string()
    .describe("Mensaje de éxito al aceptar una invitación."),
});
// src/lib/validators/i18n/errors/InvitationErrors.schema.ts
