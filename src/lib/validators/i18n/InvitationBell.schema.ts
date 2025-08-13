// src/lib/validators/i18n/InvitationBell.schema.ts
/**
 * @file InvitationBell.schema.ts
 * @description Define el contrato de datos para el namespace 'InvitationBell'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const InvitationBellSchema = z.object({
  view_invitations_sr: z.string(),
  pending_invitations_label: z.string(),
  invitation_text: z.string(),
  no_pending_invitations: z.string(),
  accept_invitation_success: z.string(),
  accept_invitation_error: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/InvitationBell.schema.ts
