// src/lib/actions/invitations/accept.action.ts
/**
 * @file accept.action.ts
 * @description Server Action atómica para la aceptación de invitaciones de workspace.
 *              Refactorizada para alinearse con la SSoT de autenticación, errores,
 *              logging y revalidación de caché.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @see .docs-espejo/lib/actions/invitations/accept.action.ts.md
 */
"use server";
import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { getAuthenticatedUserOrThrow } from "@/lib/actions/_helpers/auth.helper";
import * as invitationsData from "@/lib/data/invitations";
import { logger } from "@/lib/logger";
import { type ActionResult, type ValidationErrorKey } from "@/lib/validators";

/**
 * @public
 * @async
 * @function acceptInvitationAction
 * @description Orquesta el flujo para que un usuario acepte una invitación a un
 *              workspace. Valida la sesión, invoca una RPC transaccional segura
 *              y maneja los efectos secundarios.
 * @param {string} invitationId - El ID de la invitación a aceptar.
 * @returns {Promise<ActionResult<{ messageKey: ValidationErrorKey }>>} El resultado de la operación.
 */
export async function acceptInvitationAction(
  invitationId: string
): Promise<ActionResult<{ messageKey: ValidationErrorKey }>> {
  const context: { [key: string]: any } = { invitationId };
  try {
    const user = await getAuthenticatedUserOrThrow();
    context.userId = user.id;

    logger.trace(context, "[acceptInvitationAction] Iniciando acción.");

    const result = await invitationsData.acceptInvitation(
      invitationId,
      user.id
    );

    if (!result.success) {
      const errorKey = (result.error ||
        "invitations.accept_processing_failed") as ValidationErrorKey;
      logger.warn(
        { ...context, rpcError: result.error },
        "[acceptInvitationAction] RPC falló al aceptar invitación."
      );
      return { success: false, error: errorKey };
    }

    await createAuditLog("workspace_invitation.accepted", {
      userId: user.id,
      targetEntityId: invitationId,
      targetEntityType: "invitation",
      metadata: { workspaceId: result.workspaceId },
    });

    if (user.email) {
      revalidateTag(`invitations:${user.email}`);
    }
    revalidateTag(`workspaces:${user.id}`);
    if (result.workspaceId) {
      revalidateTag(`workspace-members:${result.workspaceId}`);
    }
    revalidatePath("/dashboard", "layout");

    logger.info(
      context,
      "[acceptInvitationAction] Invitación aceptada con éxito."
    );

    return {
      success: true,
      data: {
        messageKey:
          (result.message as ValidationErrorKey) ||
          "invitations.accept_success",
      },
    };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "acceptInvitationAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      `[acceptInvitationAction] Error inesperado.`
    );
    return {
      success: false,
      error: "generic.error_server_generic",
    };
  }
}
// src/lib/actions/invitations/accept.action.ts
