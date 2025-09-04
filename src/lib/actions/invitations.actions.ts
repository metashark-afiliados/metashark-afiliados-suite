// src/lib/actions/invitations.actions.ts
/**
 * @file invitations.actions.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              del dominio de invitaciones.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 4.0.0
 */
"use server";
import "server-only";

export { sendWorkspaceInvitationAction } from "./invitations/send.action";
export { acceptInvitationAction } from "./invitations/accept.action";
// src/lib/actions/invitations.actions.ts
