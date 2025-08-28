// src/lib/validators/i18n/errors/InvitationErrors.schema.ts
/**
 * @file InvitationErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de acciones de invitaciones (enviar, aceptar)
 *              sin un prefijo de dominio.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
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
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato encapsula los errores de invitaciones, mejorando la modularidad.
 * 2. **Consistencia con Prefijos**: ((Implementada)) Las claves se definen sin prefijo, lo que permite que el ensamblador `ValidationErrors.schema.ts` aplique el prefijo `invitations_` de forma consistente.
 *
 * @subsection Melhorias Futuras
 * 1. **Errores Específicos de Revocación/Reenvío**: ((Vigente)) Si se añaden acciones para revocar o reenviar invitaciones, se añadirán aquí los errores asociados.
 *
 * =====================================================================
 */
