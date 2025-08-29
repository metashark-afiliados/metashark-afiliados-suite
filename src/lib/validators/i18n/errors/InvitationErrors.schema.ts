// src/lib/validators/i18n/errors/InvitationErrors.schema.ts
/**
 * @file InvitationErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de feedback de acciones de invitaciones (enviar, aceptar)
 *              sin un prefijo de dominio. **Actualizado para incluir claves de éxito.**
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
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
  // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Claves de éxito ---
  send_success: z
    .string()
    .describe(
      "Mensaje de éxito al enviar una invitación. Placeholder: {email}"
    ),
  accept_success: z
    .string()
    .describe("Mensaje de éxito al aceptar una invitación."),
  // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Novas
 * 1. **Contratos de Feedback Completos**: ((Vigente)) El schema podría ser extendido para incluir claves de feedback para acciones futuras como `revoke_success` o `resend_success`.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/errors/InvitationErrors.schema.ts
