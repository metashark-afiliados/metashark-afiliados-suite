// src/lib/actions/invitations/send.action.ts
/**
 * @file send.action.ts
 * @description Server Action atómica para el envío de invitaciones de workspace.
 *              Refactorizada a un estándar de élite para operar con `role_id`
 *              canónicos, alineándose con la arquitectura "Lean Database" y
 *              la Constitución de Observabilidad y Errores.
 * @author L.I.A. Legacy
 * @version 3.0.0
 * @see .docs-espejo/lib/actions/invitations/send.action.ts.md
 */
"use server";
import "server-only";

import { ZodError } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { getAuthUser } from "@/lib/auth/get-auth-user";
import { requireWorkspacePermission } from "@/lib/auth/user-permissions";
import { invitations as invitationsData } from "@/lib/data";
import { logger } from "@/lib/logger";
import {
  type ActionResult,
  InvitationServerSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

export async function sendWorkspaceInvitationAction(
  formData: FormData
): Promise<
  ActionResult<{ messageKey: ValidationErrorKey; messageArgs?: any }>
> {
  const user = await getAuthUser();
  if (!user) {
    return { success: false, error: "generic.error_unauthenticated" };
  }

  const rawData = Object.fromEntries(formData.entries());
  const context = { inviterId: user.id, payload: rawData };
  logger.trace(context, "[sendInvitationAction] Iniciando acción.");

  try {
    const { invitee_email, role_id, workspace_id } =
      InvitationServerSchema.parse(rawData);

    const permissionCheck = await requireWorkspacePermission(workspace_id, [
      "owner",
      "admin",
    ]);
    if (!permissionCheck.success) {
      return { success: false, error: "generic.error_permission_denied" };
    }

    if (user.email === invitee_email) {
      return {
        success: false,
        error: "invitations.send_self_invite_forbidden",
      };
    }

    const existing = await invitationsData.getInvitationByWorkspaceAndEmail(
      workspace_id,
      invitee_email
    );
    if (existing) {
      return {
        success: false,
        error: "invitations.send_already_invited_or_member",
      };
    }

    const result = await invitationsData.createInvitation({
      workspace_id,
      invitee_email,
      role_id,
      invited_by: user.id,
    });

    if (!result.success) {
      throw new Error(result.error?.message || "DB insert failed");
    }

    await createAuditLog("workspace_invitation.sent", {
      userId: user.id,
      targetEntityId: workspace_id,
      metadata: { inviteeEmail: invitee_email, roleId: role_id },
    });

    return {
      success: true,
      data: {
        messageKey: "invitations.send_success",
        messageArgs: { email: invitee_email },
      },
    };
  } catch (error) {
    let errorKey: ValidationErrorKey = "invitations.send_failed";
    if (error instanceof ZodError) {
      errorKey = "invitations.send_invalid_data";
    }

    const errorId = await createPersistentErrorLog(
      "sendInvitationAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      "[sendInvitationAction] Fallo en la acción."
    );

    return {
      success: false,
      error: errorKey,
    };
  }
}
// src/lib/actions/invitations/send.action.ts
